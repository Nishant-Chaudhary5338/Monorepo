import { useState, useMemo } from 'react'
import { useHlsStore } from '../store/hlsStore.js'
import type { IssueSeverity, IssueKind } from '../types/index.js'

const SEVERITY_CLASS: Record<IssueSeverity, string> = {
  info: 'text-zinc-400',
  warn: 'text-yellow-400',
  error: 'text-red-400',
}

const SEVERITY_DOT: Record<IssueSeverity, string> = {
  info: 'bg-zinc-500',
  warn: 'bg-yellow-500',
  error: 'bg-red-500',
}

type FilterSeverity = IssueSeverity | 'all'

function formatTs(ms: number): string {
  return new Date(ms).toISOString().replace('T', ' ').slice(0, 23)
}

function formatBps(bps: number): string {
  if (bps >= 1_000_000) return `${(bps / 1_000_000).toFixed(1)}M`
  if (bps >= 1_000) return `${Math.round(bps / 1_000)}k`
  return `${Math.round(bps)}`
}

type Props = {
  streamId?: string
  className?: string
}

export function LogPanel({ streamId, className = '' }: Props) {
  const { logs, clearLogs, exportLogs } = useHlsStore()
  const [severity, setSeverity] = useState<FilterSeverity>('all')
  const [issueOnly, setIssueOnly] = useState(false)

  const filtered = useMemo(() => {
    return logs
      .filter((l) => !streamId || l.streamId === streamId)
      .filter((l) => severity === 'all' || l.severity === severity)
      .filter((l) => !issueOnly || l.issue != null)
  }, [logs, streamId, severity, issueOnly])

  const errorCount = logs.filter((l) => l.severity === 'error').length
  const warnCount = logs.filter((l) => l.severity === 'warn').length

  return (
    <div className={`flex flex-col h-full bg-zinc-950 ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-800 flex-shrink-0">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Segment Log</span>

        <div className="flex items-center gap-1 ml-auto">
          {errorCount > 0 && (
            <span className="text-[10px] bg-red-900/60 text-red-400 px-1.5 py-0.5 rounded font-mono">
              {errorCount} ERR
            </span>
          )}
          {warnCount > 0 && (
            <span className="text-[10px] bg-yellow-900/60 text-yellow-400 px-1.5 py-0.5 rounded font-mono">
              {warnCount} WARN
            </span>
          )}
        </div>

        <FilterBtn active={severity === 'all'} onClick={() => setSeverity('all')}>All</FilterBtn>
        <FilterBtn active={severity === 'error'} onClick={() => setSeverity('error')}>Errors</FilterBtn>
        <FilterBtn active={severity === 'warn'} onClick={() => setSeverity('warn')}>Warnings</FilterBtn>

        <button
          className={`text-[10px] px-2 py-1 rounded border transition-colors ${
            issueOnly
              ? 'border-blue-500 text-blue-400 bg-blue-500/10'
              : 'border-zinc-700 text-zinc-500 hover:border-zinc-500'
          }`}
          onClick={() => setIssueOnly((v) => !v)}
        >
          Issues only
        </button>

        <button
          className="text-[10px] px-2 py-1 rounded border border-zinc-700 text-zinc-500 hover:border-zinc-500 transition-colors"
          onClick={() => exportLogs('json')}
        >
          JSON
        </button>
        <button
          className="text-[10px] px-2 py-1 rounded border border-zinc-700 text-zinc-500 hover:border-zinc-500 transition-colors"
          onClick={() => exportLogs('csv')}
        >
          CSV
        </button>
        <button
          className="text-[10px] px-2 py-1 rounded border border-zinc-700 text-zinc-500 hover:border-red-500 hover:text-red-400 transition-colors"
          onClick={clearLogs}
        >
          Clear
        </button>
      </div>

      {/* Log entries */}
      <div className="flex-1 overflow-y-auto font-mono text-[11px] divide-y divide-zinc-900">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-full text-zinc-600 text-xs">
            No events yet — add a stream to start monitoring
          </div>
        ) : (
          filtered.map((log, i) => (
            <div
              key={i}
              className={`flex items-start gap-2 px-3 py-1.5 hover:bg-zinc-900/50 transition-colors ${SEVERITY_CLASS[log.severity]}`}
            >
              <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${SEVERITY_DOT[log.severity]}`} />
              <span className="text-zinc-600 flex-shrink-0">{formatTs(log.timestamp)}</span>
              <span className="text-zinc-500 flex-shrink-0 w-20 truncate">{log.streamId.slice(0, 8)}</span>
              <span className="flex-shrink-0 w-8 text-right">{log.sequenceNumber}</span>
              <span className="flex-shrink-0 w-16 text-right">{formatBps(log.bitrate)}</span>
              <span className="flex-shrink-0 w-16 text-right">{log.loadTime.toFixed(0)}ms</span>
              {log.issue && (
                <IssuePill issue={log.issue} />
              )}
              {log.scte35 && (
                <span className="text-purple-400 flex-shrink-0">
                  SCTE {log.scte35.type} @{log.scte35.time.toFixed(2)}s
                </span>
              )}
              <span className="text-zinc-700 truncate flex-1">{log.segmentUri.split('/').pop()}</span>
            </div>
          ))
        )}
      </div>

      {/* Footer count */}
      <div className="px-3 py-1 border-t border-zinc-800 text-[10px] text-zinc-600 flex-shrink-0">
        {filtered.length} / {logs.length} events
      </div>
    </div>
  )
}

function FilterBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return (
    <button
      className={`text-[10px] px-2 py-1 rounded border transition-colors ${
        active
          ? 'border-zinc-400 text-zinc-200 bg-zinc-800'
          : 'border-zinc-700 text-zinc-500 hover:border-zinc-500'
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

function IssuePill({ issue }: { issue: IssueKind }) {
  const colorMap: Record<IssueKind, string> = {
    GAP: 'bg-orange-900/60 text-orange-400',
    STALE_MANIFEST: 'bg-yellow-900/60 text-yellow-400',
    LATE_SEGMENT: 'bg-yellow-900/60 text-yellow-400',
    NETWORK_ERROR: 'bg-red-900/60 text-red-400',
    DISCONTINUITY: 'bg-purple-900/60 text-purple-400',
    BLACK_SCREEN: 'bg-zinc-800 text-zinc-400',
    FREEZE: 'bg-blue-900/60 text-blue-400',
    AUDIO_SILENCE: 'bg-pink-900/60 text-pink-400',
    SYNC_DRIFT: 'bg-amber-900/60 text-amber-400',
  }
  return (
    <span className={`px-1 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide flex-shrink-0 ${colorMap[issue]}`}>
      {issue.replace(/_/g, ' ')}
    </span>
  )
}
