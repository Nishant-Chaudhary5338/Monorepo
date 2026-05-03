import { useEffect, useRef, useCallback } from 'react'
import { HlsEngine } from '../core/HlsEngine.js'
import { SegmentParser } from '../core/SegmentParser.js'
import { useHlsStore } from '../store/hlsStore.js'
import type { CodecTier } from '../types/index.js'

type UseHlsPlayerOptions = {
  streamId: string
  url: string
}

export function useHlsPlayer({ streamId, url }: UseHlsPlayerOptions) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const engineRef = useRef<HlsEngine | null>(null)
  const parserRef = useRef<SegmentParser | null>(null)

  const { updateStatus, updateMetrics, updateVariants, appendLog } = useHlsStore()

  const init = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    engineRef.current?.destroy()

    const engine = new HlsEngine({
      onMetrics: (m) => {
        updateMetrics(streamId, {
          bitrate: m.bitrate,
          bufferLength: m.bufferLength,
          currentLevel: m.currentLevel,
          latency: m.latency,
          droppedFrames: m.droppedFrames,
          loadTime: m.loadTime,
          codecString: m.codecString,
        })
      },
      onError: (err) => {
        if (err.fatal) updateStatus(streamId, 'error')
      },
      onVariants: (variants) => updateVariants(streamId, variants),
      onCodecTier: (tier: CodecTier) => updateMetrics(streamId, { codecTier: tier }),
    })

    const parser = new SegmentParser({
      streamId,
      onSegment: (evt) => appendLog(evt),
    })

    engine.attach(video, url)

    const hls = engine.getHls()
    if (hls) parser.attach(hls)

    engineRef.current = engine
    parserRef.current = parser

    updateStatus(streamId, 'loading')

    video.addEventListener('playing', () => updateStatus(streamId, 'playing'))
    video.addEventListener('pause', () => updateStatus(streamId, 'paused'))
    video.addEventListener('waiting', () => updateStatus(streamId, 'stalled'))
    video.addEventListener('error', () => updateStatus(streamId, 'error'))
  }, [streamId, url, updateStatus, updateMetrics, updateVariants, appendLog])

  useEffect(() => {
    init()
    return () => {
      engineRef.current?.destroy()
    }
  }, [init])

  return { videoRef, engine: engineRef }
}
