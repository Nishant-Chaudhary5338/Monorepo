import Hls, {
  Events,
  ErrorTypes,
  type HlsConfig,
  type Level,
  type ErrorData,
} from 'hls.js'
import type { CodecTier, StreamVariant } from '../types/index.js'

export type EngineMetrics = {
  bitrate: number
  bufferLength: number
  currentLevel: number
  latency: number
  droppedFrames: number
  loadTime: number
  codecString: string
  resolution: string
}

export type EngineError = {
  type: string
  details: string
  fatal: boolean
}

export type HlsEngineOptions = {
  onMetrics?: (metrics: EngineMetrics) => void
  onError?: (err: EngineError) => void
  onVariants?: (variants: StreamVariant[]) => void
  onCodecTier?: (tier: CodecTier) => void
  onStall?: () => void
  onRecovered?: () => void
}

const HEVC_PREFIXES = ['hvc1', 'hev1', 'dvhe', 'dvh1']
const MAX_ERROR_RETRIES = 3
const METRICS_POLL_MS = 1000

function detectCodecTier(): CodecTier {
  // Tier 1: hardware-accelerated HEVC via native MSE (Chrome 105+, Safari, Edge/Win)
  if (
    typeof MediaSource !== 'undefined' &&
    (MediaSource.isTypeSupported('video/mp4; codecs="hev1.1.6.L93.B0"') ||
      MediaSource.isTypeSupported('video/mp4; codecs="hvc1.1.6.L93.B0"'))
  ) {
    return 'native-hevc'
  }
  // Tier 2: WebCodecs available — hevc.js WASM pipeline can operate
  if (typeof VideoDecoder !== 'undefined' && typeof VideoEncoder !== 'undefined') {
    return 'wasm-hevc'
  }
  return 'h264'
}

function isHevcLevel(level: Level): boolean {
  const codec = level.videoCodec ?? level.codecs ?? ''
  return HEVC_PREFIXES.some((p) => codec.toLowerCase().startsWith(p))
}

function levelToVariant(level: Level, index: number): StreamVariant {
  return {
    bandwidth: level.bitrate,
    resolution: level.width && level.height ? `${level.width}×${level.height}` : undefined,
    codecs: level.codecs ?? undefined,
    uri: level.url?.[0] ?? '',
    level: index,
  }
}

function getVideoCodecString(hls: Hls): string {
  const idx = hls.currentLevel >= 0 ? hls.currentLevel : hls.startLevel
  const level = hls.levels?.[idx]
  return level?.videoCodec ?? level?.codecs ?? 'unknown'
}

function getResolution(hls: Hls): string {
  const idx = hls.currentLevel >= 0 ? hls.currentLevel : hls.startLevel
  const level = hls.levels?.[idx]
  if (level?.width && level?.height) return `${level.width}×${level.height}`
  return '—'
}

export class HlsEngine {
  private hls: Hls | null = null
  private videoEl: HTMLVideoElement | null = null
  private codecTier: CodecTier = 'h264'
  private opts: HlsEngineOptions
  private errorRetries = 0
  private metricsTimer: ReturnType<typeof setInterval> | null = null
  private lastLoadTime = 0

  constructor(opts: HlsEngineOptions = {}) {
    this.opts = opts
  }

  attach(videoEl: HTMLVideoElement, url: string): void {
    this.destroy()
    this.videoEl = videoEl
    this.errorRetries = 0
    this.codecTier = detectCodecTier()
    this.opts.onCodecTier?.(this.codecTier)

    // Safari / native HLS
    if (!Hls.isSupported()) {
      if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
        videoEl.src = url
        videoEl.play().catch(() => {/**/})
      }
      return
    }

    const config: Partial<HlsConfig> = {
      enableWorker: true,
      lowLatencyMode: false,
      backBufferLength: 60,
      maxBufferLength: 30,
      maxMaxBufferLength: 60,
      // Don't restrict level selection — let the HEVC preference logic handle it
      capLevelToPlayerSize: this.codecTier !== 'native-hevc',
      startLevel: -1, // auto
      fragLoadingMaxRetry: 4,
      manifestLoadingMaxRetry: 4,
      levelLoadingMaxRetry: 4,
    }

    const hls = new Hls(config)
    this.hls = hls

    hls.loadSource(url)
    hls.attachMedia(videoEl)

    hls.on(Events.MANIFEST_PARSED, (_, data) => {
      const variants = data.levels.map(levelToVariant)
      this.opts.onVariants?.(variants)

      // Prefer highest-bitrate HEVC level when native codec support is available
      if (this.codecTier === 'native-hevc') {
        const hevcLevels = data.levels
          .map((l, i) => ({ l, i }))
          .filter(({ l }) => isHevcLevel(l))

        if (hevcLevels.length > 0) {
          // Pick highest bitrate HEVC level
          const best = hevcLevels.reduce((a, b) => (b.l.bitrate > a.l.bitrate ? b : a))
          hls.startLevel = best.i
        }
      }

      videoEl.play().catch(() => {/**/})
      this.startMetricsPolling()
    })

    hls.on(Events.FRAG_LOADED, (_, data) => {
      this.lastLoadTime = data.frag.stats.loading.end - data.frag.stats.loading.start
    })

    hls.on(Events.ERROR, (_, data: ErrorData) => {
      this.opts.onError?.({ type: data.type, details: data.details, fatal: data.fatal })

      if (!data.fatal) return

      if (data.type === ErrorTypes.MEDIA_ERROR && this.errorRetries < MAX_ERROR_RETRIES) {
        this.errorRetries++
        hls.recoverMediaError()
        this.opts.onRecovered?.()
      } else if (data.type === ErrorTypes.NETWORK_ERROR && this.errorRetries < MAX_ERROR_RETRIES) {
        this.errorRetries++
        hls.startLoad()
      } else {
        hls.destroy()
      }
    })

    // Stall detection via video element 'waiting' event (hls.js has no BUFFER_STALLED event)
    videoEl.addEventListener('waiting', () => this.opts.onStall?.())

    // Reset error counter on successful fragment load
    hls.on(Events.FRAG_BUFFERED, () => {
      this.errorRetries = 0
    })
  }

  private startMetricsPolling(): void {
    this.metricsTimer = setInterval(() => {
      const hls = this.hls
      const video = this.videoEl
      if (!hls || !video) return

      const metrics: EngineMetrics = {
        bitrate: hls.bandwidthEstimate,
        bufferLength: hls.mainForwardBufferInfo?.len ?? 0,
        currentLevel: hls.currentLevel,
        latency: hls.latency ?? 0,
        droppedFrames:
          (video as HTMLVideoElement & { webkitDroppedFrameCount?: number })
            .webkitDroppedFrameCount ??
          (video.getVideoPlaybackQuality?.()?.droppedVideoFrames ?? 0),
        loadTime: this.lastLoadTime,
        codecString: getVideoCodecString(hls),
        resolution: getResolution(hls),
      }

      this.opts.onMetrics?.(metrics)
    }, METRICS_POLL_MS)
  }

  getHls(): Hls | null {
    return this.hls
  }

  getCodecTier(): CodecTier {
    return this.codecTier
  }

  setLevel(level: number): void {
    if (this.hls) this.hls.currentLevel = level
  }

  destroy(): void {
    if (this.metricsTimer) clearInterval(this.metricsTimer)
    this.metricsTimer = null
    this.hls?.destroy()
    this.hls = null
    this.videoEl = null
  }
}
