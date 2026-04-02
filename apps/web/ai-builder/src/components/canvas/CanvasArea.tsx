import { Layers } from 'lucide-react'
import { DashboardFromSchema } from './DashboardFromSchema'
import type { AIDashboardSchema } from '../../types/schema'

interface Props {
  schema: AIDashboardSchema | null
  versionId: string
  onWidgetDelete?: (id: string) => void
  onWidgetSettingsChange?: (id: string, settings: unknown) => void
}

const SAMPLE_PROMPTS = [
  'Create a sales dashboard with revenue KPIs and a bar chart',
  'Build an analytics overview with user stats and pie chart',
  'Design a project tracker with progress bars and metrics',
]

export function CanvasArea({ schema, versionId, onWidgetDelete, onWidgetSettingsChange }: Props) {
  if (!schema) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6 p-8 text-center select-none">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-muted">
          <Layers size={28} className="text-muted-foreground" />
        </div>
        <div className="space-y-2 max-w-sm">
          <h2 className="text-xl font-semibold text-foreground">
            Describe your UI
          </h2>
          <p className="text-sm text-muted-foreground">
            Type a prompt below and the AI will generate a fully editable interface for you.
          </p>
        </div>
        <div className="flex flex-col gap-2 w-full max-w-sm">
          {SAMPLE_PROMPTS.map((prompt) => (
            <div
              key={prompt}
              className="px-4 py-2.5 rounded-lg border border-border bg-card text-sm text-muted-foreground text-left cursor-default hover:bg-muted transition-colors"
            >
              "{prompt}"
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full overflow-auto">
      <DashboardFromSchema
        schema={schema}
        versionId={versionId}
        onWidgetDelete={onWidgetDelete}
        onWidgetSettingsChange={onWidgetSettingsChange}
      />
    </div>
  )
}
