import { Dashboard, DashboardCard } from '@repo/dashcraft'
import '@repo/dashcraft/styles.css'
import { WidgetRenderer } from './WidgetRenderer'
import type { AIDashboardSchema } from '../../types/schema'

interface Props {
  schema: AIDashboardSchema
  versionId: string
  onWidgetDelete?: (id: string) => void
  onWidgetSettingsChange?: (id: string, settings: unknown) => void
}

export function DashboardFromSchema({
  schema,
  versionId,
  onWidgetDelete,
  onWidgetSettingsChange,
}: Props) {
  const gridCols = schema.columns ?? 3
  const gap = schema.gap ?? 16

  return (
    <Dashboard
      persistenceKey={`dashcraft-${versionId}`}
      autoSave
      autoSaveDelay={500}
      className="w-full h-full relative"
    >
      <div
        className="grid w-full"
        style={{
          gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
          gap: `${gap}px`,
          padding: `${gap}px`,
        }}
      >
        {schema.widgets.map((widget) => (
          <DashboardCard
            key={widget.id}
            id={widget.id}
            type={widget.type}
            title={widget.title}
            draggable={widget.draggable ?? true}
            deletable={widget.deletable ?? true}
            settings
            defaultSize={widget.defaultSize}
            style={
              widget.colSpan && widget.colSpan > 1
                ? { gridColumn: `span ${widget.colSpan}` }
                : undefined
            }
            onDelete={() => onWidgetDelete?.(widget.id)}
            onSettingsChange={(s) => onWidgetSettingsChange?.(widget.id, s)}
          >
            <WidgetRenderer widget={widget} />
          </DashboardCard>
        ))}
      </div>
    </Dashboard>
  )
}
