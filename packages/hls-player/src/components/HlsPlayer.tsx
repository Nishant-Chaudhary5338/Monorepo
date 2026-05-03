import { useRef, useEffect, useCallback } from 'react'
import { HlsEngine } from '../core/HlsEngine.js'
import { SegmentParser } from '../core/SegmentParser.js'
import { StreamHealth } from '../core/StreamHealth.js'
import { StreamMetricsOverlay } from './StreamMetricsOverlay.js'
import { useHlsStore } from '../store/hlsStore.js'
import type { StreamMetrics, StreamStatus, CodecTier } from '../types/index.js'

type Props = {
  streamId: string
  url: string
  title?: string
  muted?: boolean
  onClick?: () => void
  className?: string
  lowPower?: boolean
}

const DEFAULT_METRICS: StreamMetrics = {
  bitrate: 0,
  bufferLength: 0,
  currentLevel: -1,
  latency: 0,
  droppedFrames: 0,
  loadTime: 0,
  codecTier: 'h264',
  codecString: 'unknown',
}

export function HlsPlayer({
  streamId,
  url,
  title = url,
  muted = true,
  onClick,
  className = '',
  lowPower = false,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const engineRef = useRef<HlsEngine | null>(null)
  const healthRef = useRef<StreamHealth | null>(null)

  const { updateStatus, updateMetrics, updateVariants, addIssue, appendLog, streams } = useHlsStore()
  const stream = streams.find((s) => s.id === streamId)
  const metrics = stream?.metrics ?? DEFAULT_METRICS
  const status: StreamStatus = stream?.status ?? 'idle'

  const init = useCallback(() => {
    const video = videoRef.current
    if (!video || !url) return

    engineRef.current?.destroy()
    healthRef.current?.destroy()

    const engine = new HlsEngine({
      onMetrics: (m) =>
        updateMetrics(streamId, {
          bitrate: m.bitrate,
          bufferLength: m.bufferLength,
          currentLevel: m.currentLevel,
          latency: m.latency,
          droppedFrames: m.droppedFrames,
          loadTime: m.loadTime,
          codecString: m.codecString,
        }),
      onError: (err) => { if (err.fatal) updateStatus(streamId, 'error') },
      onVariants: (variants) => updateVariants(streamId, variants),
      onCodecTier: (tier: CodecTier) => updateMetrics(streamId, { codecTier: tier }),
      onStall: () => updateStatus(streamId, 'stalled'),
      onRecovered: () => updateStatus(streamId, 'playing'),
    })

    const parser = new SegmentParser({
      streamId,
      onSegment: (evt) => appendLog(evt),
    })

    const health = new StreamHealth({
      streamId,
      onIssue: (evt) => {
        addIssue(evt.streamId, evt.issue)
        appendLog({
          streamId: evt.streamId,
          timestamp: evt.timestamp,
          segmentUri: '',
          sequenceNumber: -1,
          duration: 0,
          pts: 0,
          dts: 0,
          ptsAudioVideoDeltaMs: 0,
          codecString: 'unknown',
          bitrate: 0,
          loadTime: 0,
          issue: evt.issue,
          severity: evt.issue === 'NETWORK_ERROR' ? 'error' : 'warn',
        })
      },
    })

    engine.attach(video, url)
    const hls = engine.getHls()
    if (hls) {
      parser.attach(hls)
      health.attach(hls)
    }

    engineRef.current = engine
    healthRef.current = health

    updateStatus(streamId, 'loading')

    const onPlaying = () => updateStatus(streamId, 'playing')
    const onPause = () => updateStatus(streamId, 'paused')
    const onError = () => updateStatus(streamId, 'error')

    video.addEventListener('playing', onPlaying)
    video.addEventListener('pause', onPause)
    video.addEventListener('error', onError)

    return () => {
      video.removeEventListener('playing', onPlaying)
      video.removeEventListener('pause', onPause)
      video.removeEventListener('error', onError)
    }
  }, [streamId, url, updateStatus, updateMetrics, updateVariants, addIssue, appendLog])

  useEffect(() => {
    const cleanup = init()
    return () => {
      cleanup?.()
      engineRef.current?.destroy()
      healthRef.current?.destroy()
    }
  }, [init])

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted
  }, [muted])

  useEffect(() => {
    if (lowPower) engineRef.current?.setLevel(0)
  }, [lowPower])

  return (
    <div
      className={`relative overflow-hidden rounded-lg bg-zinc-950 cursor-pointer select-none ${className}`}
      onClick={onClick}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        muted={muted}
        playsInline
        autoPlay
      />
      <StreamMetricsOverlay metrics={metrics} status={status} title={title} />
    </div>
  )
}
