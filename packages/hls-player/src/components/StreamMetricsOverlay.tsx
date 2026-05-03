import type { StreamMetrics, StreamStatus } from '../types/index.js'

type Props = {
  metrics: StreamMetrics
  status: StreamStatus
  title: string
}

const STATUS_COLOR: Record<StreamStatus, string> = {
  idle: 'bg-zinc-500',
  loading: 'bg-yellow-500 animate-pulse',
  playing: 'bg-emerald-500',
  paused: 'bg-blue-500',
  error: 'bg-red-500',
  stalled: 'bg-orange-500 animate-pulse',
}

const CODEC_BADGE: Record<string, string> = {
  'hvc1': 'HEVC',
  'hev1': 'HEVC',
  'avc1': 'H.264',
  'avc3': 'H.264',
  'unknown': '—',
}

function codecLabel(raw: string): string {
  const key = Object.keys(CODEC_BADGE).find((k) => raw.toLowerCase().includes(k))
  return key ? CODEC_BADGE[key]! : raw.split('.')[0]?.toUpperCase() ?? '—'
}

function formatBitrate(bps: number): string {
  if (bps >= 1_000_000) return `${(bps / 1_000_000).toFixed(1)} Mbps`
  if (bps >= 1_000) return `${Math.round(bps / 1_000)} kbps`
  return `${Math.round(bps)} bps`
}

export function StreamMetricsOverlay({ metrics, status, title }: Props) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-3 py-2 bg-gradient-to-b from-black/70 to-transparent">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${STATUS_COLOR[status]}`} />
          <span className="text-white text-xs font-medium truncate max-w-[140px]">{title}</span>
        </div>
        <span className="text-xs font-mono text-emerald-400 bg-black/40 px-1.5 py-0.5 rounded">
          {codecLabel(metrics.codecString)}
        </span>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 py-2 bg-gradient-to-t from-black/70 to-transparent">
        <span className="text-xs font-mono text-white/80">{formatBitrate(metrics.bitrate)}</span>
        <span className="text-xs font-mono text-white/60">
          buf {metrics.bufferLength.toFixed(1)}s
        </span>
        {metrics.droppedFrames > 0 && (
          <span className="text-xs font-mono text-red-400">{metrics.droppedFrames} dropped</span>
        )}
      </div>
    </div>
  )
}
