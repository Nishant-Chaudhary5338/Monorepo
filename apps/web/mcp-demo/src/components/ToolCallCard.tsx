import { useState, type ReactNode } from 'react'
import { CheckCircle, XCircle, Loader2, ChevronDown, ChevronUp, Clock } from 'lucide-react'
import type { ToolCall } from '../store/demoStore'

interface Props {
  call: ToolCall
}

export function ToolCallCard({ call }: Props) {
  const [expanded, setExpanded] = useState(false)

  function renderStatusIcon(): ReactNode {
    if (call.status === 'running') return <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
    if (call.status === 'done') return <CheckCircle className="w-4 h-4 text-emerald-400" />
    if (call.status === 'error') return <XCircle className="w-4 h-4 text-red-400" />
    return <div className="w-4 h-4 rounded-full border-2 border-zinc-600" />
  }

  const borderColor = {
    idle: 'border-zinc-700',
    running: 'border-blue-500 tool-running',
    done: 'border-emerald-600',
    error: 'border-red-600',
  }[call.status]

  const formatted = call.result
    ? JSON.stringify(call.result, null, 2)
    : call.error ?? ''

  return (
    <div className={`tool-card-enter rounded-lg border bg-zinc-900 ${borderColor} overflow-hidden`}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        {renderStatusIcon()}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono font-semibold text-white truncate">
              {call.tool}
            </span>
            <span className="text-xs px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono shrink-0">
              {call.server}
            </span>
          </div>
        </div>
        {call.duration !== undefined && (
          <span className="flex items-center gap-1 text-xs text-zinc-500 shrink-0">
            <Clock className="w-3 h-3" />
            {(call.duration / 1000).toFixed(1)}s
          </span>
        )}
        {!!(call.result != null || call.error) && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors shrink-0"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Collapsed summary */}
      {!expanded && call.status === 'done' && call.result != null && (
        <div className="px-4 pb-3">
          <ResultSummary result={call.result} />
        </div>
      )}

      {call.status === 'error' && !expanded && (
        <div className="px-4 pb-3">
          <p className="text-xs text-red-400 font-mono truncate">{call.error}</p>
        </div>
      )}

      {/* Expanded JSON */}
      {expanded && (
        <div className="border-t border-zinc-800">
          <pre className="p-4 text-xs font-mono text-zinc-300 overflow-auto max-h-64 leading-relaxed">
            {formatted}
          </pre>
        </div>
      )}
    </div>
  )
}

function ResultSummary({ result }: { result: unknown }) {
  if (typeof result !== 'object' || result === null) return null
  const r = result as Record<string, unknown>

  // Pull a few interesting fields to show as chips
  const chips: { label: string; value: string; color: string }[] = []

  if (typeof r.filesScanned === 'number')
    chips.push({ label: 'files scanned', value: String(r.filesScanned), color: 'text-blue-400' })
  if (typeof r.violations === 'object' && r.violations !== null) {
    const count = Object.keys(r.violations as object).length
    chips.push({ label: 'files with violations', value: String(count), color: 'text-yellow-400' })
  }
  if (Array.isArray(r.files))
    chips.push({ label: 'files generated', value: String(r.files.length), color: 'text-emerald-400' })
  if (typeof r.totalTools === 'number')
    chips.push({ label: 'tools analyzed', value: String(r.totalTools), color: 'text-purple-400' })
  if (typeof r.averageScore === 'number')
    chips.push({ label: 'avg score', value: String(r.averageScore) + '/10', color: 'text-emerald-400' })
  if (typeof r.summary === 'string')
    chips.push({ label: '', value: r.summary.slice(0, 80), color: 'text-zinc-400' })

  if (chips.length === 0) {
    const firstKey = Object.keys(r)[0]
    if (firstKey) chips.push({ label: firstKey, value: String(r[firstKey]).slice(0, 60), color: 'text-zinc-400' })
  }

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((c, i) => (
        <span key={i} className="text-xs font-mono">
          {c.label && <span className="text-zinc-600">{c.label}: </span>}
          <span className={c.color}>{c.value}</span>
        </span>
      ))}
    </div>
  )
}
