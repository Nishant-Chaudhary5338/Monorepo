import { useHlsStore } from '@repo/hls-player'
import type { IssueKind } from '@repo/hls-player'

const ISSUE_LABELS: Record<IssueKind, string> = {
  GAP: 'Segment gap detected',
  STALE_MANIFEST: 'Stale manifest',
  LATE_SEGMENT: 'Late segment',
  NETWORK_ERROR: 'Network error',
  DISCONTINUITY: 'Discontinuity',
  BLACK_SCREEN: 'Black screen',
  FREEZE: 'Stream frozen',
  AUDIO_SILENCE: 'Audio silence',
  SYNC_DRIFT: 'A/V sync drift',
}

const ISSUE_COLOR: Record<IssueKind, string> = {
  GAP: 'border-orange-500/40 bg-orange-950/30 text-orange-300',
  STALE_MANIFEST: 'border-yellow-500/40 bg-yellow-950/30 text-yellow-300',
  LATE_SEGMENT: 'border-yellow-500/40 bg-yellow-950/30 text-yellow-300',
  NETWORK_ERROR: 'border-red-500/40 bg-red-950/30 text-red-300',
  DISCONTINUITY: 'border-purple-500/40 bg-purple-950/30 text-purple-300',
  BLACK_SCREEN: 'border-zinc-500/40 bg-zinc-900/60 text-zinc-300',
  FREEZE: 'border-blue-500/40 bg-blue-950/30 text-blue-300',
  AUDIO_SILENCE: 'border-pink-500/40 bg-pink-950/30 text-pink-300',
  SYNC_DRIFT: 'border-amber-500/40 bg-amber-950/30 text-amber-300',
}

export function AlertBanner() {
  const { streams, clearIssues } = useHlsStore()

  const alerts = streams.flatMap((s) =>
    s.issues.map((issue) => ({ streamId: s.id, title: s.title, issue }))
  )

  if (alerts.length === 0) return null

  return (
    <div className="flex items-center gap-2 px-4 py-2 overflow-x-auto flex-shrink-0 border-b border-zinc-800">
      <span className="text-zinc-500 text-xs font-medium flex-shrink-0">ALERTS</span>
      <div className="flex items-center gap-2">
        {alerts.map(({ streamId, title, issue }) => (
          <div
            key={`${streamId}-${issue}`}
            className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs flex-shrink-0 ${ISSUE_COLOR[issue]}`}
          >
            <span className="font-medium">{ISSUE_LABELS[issue]}</span>
            <span className="opacity-60 truncate max-w-[80px]">{title.slice(0, 20)}</span>
            <button
              className="opacity-50 hover:opacity-100 transition-opacity ml-1"
              onClick={() => clearIssues(streamId)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
