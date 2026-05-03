import { HlsPlayer } from './HlsPlayer.js'
import { useHlsStore } from '../store/hlsStore.js'

type GridLayout = '1x1' | '1x2' | '2x2' | '2x3' | '3x3' | '3x4' | '4x4'

function resolveLayout(count: number): GridLayout {
  if (count <= 1) return '1x1'
  if (count <= 2) return '1x2'
  if (count <= 4) return '2x2'
  if (count <= 6) return '2x3'
  if (count <= 9) return '3x3'
  if (count <= 12) return '3x4'
  return '4x4'
}

const GRID_CLASSES: Record<GridLayout, string> = {
  '1x1': 'grid-cols-1 grid-rows-1',
  '1x2': 'grid-cols-2 grid-rows-1',
  '2x2': 'grid-cols-2 grid-rows-2',
  '2x3': 'grid-cols-3 grid-rows-2',
  '3x3': 'grid-cols-3 grid-rows-3',
  '3x4': 'grid-cols-4 grid-rows-3',
  '4x4': 'grid-cols-4 grid-rows-4',
}

// Streams beyond this count drop to low-power canvas thumbnail mode
const LOW_POWER_THRESHOLD = 5

type Props = {
  onStreamClick?: (streamId: string) => void
  className?: string
}

export function MultiStreamGrid({ onStreamClick, className = '' }: Props) {
  const { streams, activeStreamId, setActiveStream, toggleMute } = useHlsStore()

  if (streams.length === 0) {
    return (
      <div className={`flex items-center justify-center text-zinc-600 text-sm ${className}`}>
        No streams added yet
      </div>
    )
  }

  const layout = resolveLayout(streams.length)
  const gridClass = GRID_CLASSES[layout]

  return (
    <div className={`grid gap-1 h-full ${gridClass} ${className}`}>
      {streams.map((stream, idx) => {
        const isActive = stream.id === activeStreamId
        const isLowPower = idx >= LOW_POWER_THRESHOLD

        return (
          <div
            key={stream.id}
            className={`relative rounded-lg overflow-hidden transition-all duration-200 ${
              isActive ? 'ring-2 ring-blue-500 ring-offset-1 ring-offset-zinc-950' : ''
            }`}
          >
            <HlsPlayer
              streamId={stream.id}
              url={stream.url}
              title={stream.title}
              muted={stream.muted}
              lowPower={isLowPower}
              className="w-full h-full"
              onClick={() => {
                setActiveStream(isActive ? null : stream.id)
                onStreamClick?.(stream.id)
              }}
            />

            {/* Per-stream issue badges */}
            {stream.issues.length > 0 && (
              <div className="absolute top-2 right-2 flex gap-1 pointer-events-none">
                {stream.issues.slice(0, 3).map((issue) => (
                  <span
                    key={issue}
                    className="text-[9px] font-bold uppercase tracking-wide bg-red-600/90 text-white px-1 py-0.5 rounded"
                  >
                    {issue.replace('_', ' ')}
                  </span>
                ))}
              </div>
            )}

            {/* Mute toggle */}
            <button
              className="absolute bottom-8 right-2 z-10 w-6 h-6 flex items-center justify-center rounded bg-black/50 text-white/70 hover:text-white transition-colors"
              onClick={(e) => { e.stopPropagation(); toggleMute(stream.id) }}
              title={stream.muted ? 'Unmute' : 'Mute'}
            >
              {stream.muted ? '🔇' : '🔊'}
            </button>
          </div>
        )
      })}
    </div>
  )
}
