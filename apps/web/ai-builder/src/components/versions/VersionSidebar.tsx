import { Clock, Trash2 } from 'lucide-react'
import type { Version } from '../../types/schema'

interface Props {
  versions: Version[]
  activeVersionId: string | null
  onSwitch: (id: string) => void
  onDelete: (id: string) => void
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts
  if (diff < 60_000) return 'just now'
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`
  return `${Math.floor(diff / 86_400_000)}d ago`
}

export function VersionSidebar({ versions, activeVersionId, onSwitch, onDelete }: Props) {
  if (versions.length === 0) {
    return (
      <div className="p-4">
        <p className="text-xs text-muted-foreground">
          Versions will appear here after your first generation.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1 p-2">
      {[...versions].reverse().map((v) => (
        <div
          key={v.id}
          onClick={() => onSwitch(v.id)}
          className={`group flex flex-col gap-1 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
            v.id === activeVersionId
              ? 'bg-primary/10 border border-primary/20'
              : 'hover:bg-muted border border-transparent'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-semibold ${
                v.id === activeVersionId ? 'text-primary' : 'text-foreground'
              }`}
            >
              {v.label ?? v.id}
            </span>
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock size={10} />
                {timeAgo(v.timestamp)}
              </span>
              {versions.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(v.id)
                  }}
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-muted-foreground hover:text-destructive transition-all"
                >
                  <Trash2 size={11} />
                </button>
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {v.prompt}
          </p>
          {v.diff && (
            <span className="text-[10px] text-blue-500 font-medium">
              {v.diff.length} patch{v.diff.length !== 1 ? 'es' : ''}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
