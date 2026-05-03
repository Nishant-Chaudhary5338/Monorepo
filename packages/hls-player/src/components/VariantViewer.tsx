import { useRef, useEffect } from 'react'
import Hls from 'hls.js'
import { useHlsStore } from '../store/hlsStore.js'
import type { StreamVariant } from '../types/index.js'

type Props = {
  streamId: string
  onClose?: () => void
}

function resolutionLabel(v: StreamVariant): string {
  if (v.resolution) return v.resolution
  return `${(v.bandwidth / 1_000_000).toFixed(1)} Mbps`
}

export function VariantViewer({ streamId, onClose }: Props) {
  const stream = useHlsStore((s) => s.streams.find((st) => st.id === streamId))

  if (!stream || stream.variants.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-500 text-sm">
        No variants available — stream must be playing to detect renditions.
      </div>
    )
  }

  // Show highest quality first
  const variants = stream.variants.slice().reverse()
  const cols = Math.min(variants.length, 3)

  return (
    <div className="flex flex-col h-full gap-3">
      <div className="flex items-center justify-between px-1 flex-shrink-0">
        <div>
          <h3 className="text-white font-semibold text-sm">{stream.title}</h3>
          <p className="text-zinc-500 text-xs">{variants.length} renditions detected</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-zinc-500 hover:text-white text-xs transition-colors">
            Close
          </button>
        )}
      </div>

      <div
        className="grid gap-2 flex-1 min-h-0"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {variants.map((v) => (
          <VariantCell key={v.level} variant={v} baseUrl={stream.url} />
        ))}
      </div>
    </div>
  )
}

type CellProps = {
  variant: StreamVariant
  baseUrl: string
}

function VariantCell({ variant, baseUrl }: CellProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<Hls | null>(null)
  // Use variant URI if available, otherwise fall back to base URL
  const url = variant.uri || baseUrl
  const label = resolutionLabel(variant)
  const mbps = (variant.bandwidth / 1_000_000).toFixed(2)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (Hls.isSupported()) {
      const hls = new Hls({ startLevel: variant.level, capLevelToPlayerSize: false })
      hls.loadSource(url)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        // Force exact level if variant URI not available
        if (!variant.uri) hls.currentLevel = variant.level
        video.play().catch(() => {/**/})
      })
      hlsRef.current = hls
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url
      video.play().catch(() => {/**/})
    }

    return () => {
      hlsRef.current?.destroy()
      hlsRef.current = null
    }
  }, [url, variant.level, variant.uri])

  return (
    <div className="flex flex-col gap-1 h-full min-h-0">
      <div className="flex items-center justify-between px-0.5 flex-shrink-0">
        <span className="text-white text-xs font-semibold">{label}</span>
        <span className="text-zinc-500 text-xs font-mono">{mbps} Mbps</span>
      </div>
      {variant.codecs && (
        <span className="text-zinc-600 text-[10px] font-mono px-0.5 flex-shrink-0 truncate">{variant.codecs}</span>
      )}
      <div className="flex-1 min-h-0 bg-zinc-950 rounded overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          muted
          playsInline
          autoPlay
        />
      </div>
    </div>
  )
}
