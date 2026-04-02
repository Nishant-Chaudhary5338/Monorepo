import { Zap, Edit3, Check } from 'lucide-react'
import { Button } from '@repo/ui'
import { useDashboard } from '@repo/dashcraft'
import type { Version } from '../../types/schema'

interface Props {
  versions: Version[]
  activeVersionId: string | null
  onVersionSwitch: (id: string) => void
}

// EditToggle must be inside <Dashboard> context — rendered inside CanvasArea
export function EditToggleButton() {
  const { isEditMode, toggleEditMode } = useDashboard()

  return (
    <Button
      variant={isEditMode ? 'default' : 'outline'}
      size="sm"
      onClick={toggleEditMode}
      className="gap-1.5 h-8 text-xs"
    >
      {isEditMode ? (
        <>
          <Check size={13} />
          Done
        </>
      ) : (
        <>
          <Edit3 size={13} />
          Edit Layout
        </>
      )}
    </Button>
  )
}

export function Header({ versions, activeVersionId, onVersionSwitch }: Props) {
  return (
    <header className="flex items-center gap-3 px-4 h-12 border-b border-border bg-card shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 mr-2">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary">
          <Zap size={14} className="text-primary-foreground" />
        </div>
        <span className="text-sm font-semibold text-foreground">AI Builder</span>
      </div>

      {/* Version tabs */}
      <div className="flex items-center gap-1">
        {versions.map((v) => (
          <button
            key={v.id}
            onClick={() => onVersionSwitch(v.id)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              v.id === activeVersionId
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            {v.label ?? v.id}
          </button>
        ))}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right actions — EditToggle injected by Builder since it needs Dashboard context */}
      <div id="header-actions" />
    </header>
  )
}
