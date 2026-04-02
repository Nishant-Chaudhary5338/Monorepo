# Dashcraft Integration

How `@repo/dashcraft` is used as the canvas engine — and exactly what we build on top of it.

---

## What Dashcraft Gives Us For Free

| Feature | Dashcraft API |
|---|---|
| Drag widgets | `DashboardCard draggable={true}` + `Dashboard` wraps with `DndContext` |
| Resize widgets | `DashboardCard resizeHandles={["bottomRight", ...]}` |
| Delete widget | `DashboardCard deletable={true}` shows trash button in edit mode |
| Settings panel | `DashboardCard settings={true}` shows gear icon → popover with full settings UI |
| Edit mode toggle | `useDashboard().toggleEditMode()` |
| Persist layout | `<Dashboard persistenceKey="v1">` → auto saves to localStorage |
| Register custom widget | `widgetRegistry.register({ type, component, ... })` |
| Add widget programmatically | `useDashboard().addWidget({ id, type, ... })` |
| Widget state | `useDashboardStore()` — all widget positions, sizes, settings |

---

## What We Build On Top

### 1. `DashboardFromSchema`

The bridge between `AIDashboardSchema` (our type) and dashcraft's `<Dashboard>`.

```tsx
// components/DashboardFromSchema.tsx

import { Dashboard, DashboardCard } from '@repo/dashcraft'
import { WidgetRenderer } from './WidgetRenderer'
import type { AIDashboardSchema } from '../types/schema'

interface Props {
  schema: AIDashboardSchema
  versionId: string             // used as dashcraft persistenceKey
  onWidgetDelete?: (id: string) => void
  onWidgetSettingsChange?: (id: string, settings: unknown) => void
}

export function DashboardFromSchema({ schema, versionId, onWidgetDelete, onWidgetSettingsChange }: Props) {
  const gridCols = schema.columns ?? 3
  const gap = schema.gap ?? 16

  return (
    <Dashboard
      persistenceKey={`dashcraft-${versionId}`}
      autoSave
      autoSaveDelay={500}
      className="w-full h-full"
    >
      <div
        className="grid w-full"
        style={{
          gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
          gap: `${gap}px`,
          padding: `${gap}px`
        }}
      >
        {schema.widgets.map(widget => (
          <DashboardCard
            key={widget.id}
            id={widget.id}
            type={widget.type}
            title={widget.title}
            draggable={widget.draggable ?? true}
            deletable={widget.deletable ?? true}
            settings={true}
            defaultSize={widget.defaultSize}
            style={{ gridColumn: `span ${widget.colSpan ?? 1}` }}
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
```

---

### 2. `WidgetRenderer`

Maps `widget.type` string to the actual `@repo/ui` or dashcraft component.

```tsx
// components/WidgetRenderer.tsx

import { RechartsWidget, KPIWidget } from '@repo/dashcraft/widgets'
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui'
import { DataTable } from '@repo/ui'
import { Alert, AlertTitle, AlertDescription } from '@repo/ui'
import { Progress } from '@repo/ui'
import { Badge } from '@repo/ui'
import type { AIWidgetSchema } from '../types/schema'

interface Props {
  widget: AIWidgetSchema
}

export function WidgetRenderer({ widget }: Props) {
  const { type, props = {}, children = [] } = widget

  switch (type) {
    // --- dashcraft built-in chart widgets ---
    case 'bar':
      return <RechartsWidget id={widget.id} chartType="bar" {...props} />
    case 'line':
      return <RechartsWidget id={widget.id} chartType="line" {...props} />
    case 'area':
      return <RechartsWidget id={widget.id} chartType="area" {...props} />
    case 'pie':
      return <RechartsWidget id={widget.id} chartType="pie" {...props} />
    case 'kpi':
      return <KPIWidget id={widget.id} {...props} />

    // --- @repo/ui components ---
    case 'card':
      return (
        <Card className="h-full">
          {props.title && <CardHeader><CardTitle>{props.title as string}</CardTitle></CardHeader>}
          <CardContent>{props.content as string ?? ''}</CardContent>
        </Card>
      )
    case 'alert':
      return (
        <Alert variant={(props.variant as 'default' | 'destructive') ?? 'default'}>
          <AlertTitle>{props.title as string}</AlertTitle>
          <AlertDescription>{props.description as string}</AlertDescription>
        </Alert>
      )
    case 'progress-group':
      return (
        <div className="space-y-3 p-4">
          {(props.items as Array<{label: string; value: number; max: number}>)?.map(item => (
            <div key={item.label}>
              <div className="flex justify-between text-sm mb-1">
                <span>{item.label}</span>
                <span>{item.value}/{item.max}</span>
              </div>
              <Progress value={(item.value / item.max) * 100} />
            </div>
          ))}
        </div>
      )
    case 'stat':
      return (
        <div className="grid grid-cols-3 gap-4 p-4">
          {(props.items as Array<{label: string; value: string|number; trend?: string}>)?.map(item => (
            <div key={item.label} className="text-center">
              <div className="text-2xl font-bold">{item.value}</div>
              <div className="text-sm text-muted-foreground">{item.label}</div>
            </div>
          ))}
        </div>
      )

    // --- layout containers ---
    case 'section':
      return (
        <div className="p-4">
          {widget.title && <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">{widget.title}</h3>}
          <div className="space-y-2">
            {children.map(child => <WidgetRenderer key={child.id} widget={child} />)}
          </div>
        </div>
      )
    case 'row':
      return (
        <div className="flex gap-4 p-4">
          {children.map(child => <WidgetRenderer key={child.id} widget={child} />)}
        </div>
      )

    // --- fallback ---
    case 'placeholder':
    default:
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground text-sm border-2 border-dashed rounded-lg p-4">
          Unknown widget type: <code className="ml-1">{type}</code>
        </div>
      )
  }
}
```

---

## Edit Mode Toggle

The `useDashboard()` hook exposes `toggleEditMode`. Wire it to the header button.

```tsx
import { useDashboard } from '@repo/dashcraft'

function EditModeButton() {
  const { isEditMode, toggleEditMode } = useDashboard()
  return (
    <button onClick={toggleEditMode}>
      {isEditMode ? 'Done Editing' : 'Edit Layout'}
    </button>
  )
}
```

**Note:** `useDashboard()` only works inside a `<Dashboard>` provider. The `EditModeButton` must be rendered as a child of `<DashboardFromSchema>` or the `<Dashboard>` wrapper.

---

## Reading Current Schema From Dashcraft Store

When the user manually drags/resizes, the dashcraft store updates widget positions/sizes.
For the JSON panel to stay in sync, we need to merge those changes back into our schema.

```typescript
// lib/syncSchemaFromStore.ts
import { useDashboardStore } from '@repo/dashcraft/store'

export function syncSchemaWithStore(schema: AIDashboardSchema): AIDashboardSchema {
  const storeWidgets = useDashboardStore.getState().widgets

  return {
    ...schema,
    widgets: schema.widgets.map(w => {
      const storeWidget = storeWidgets[w.id]
      if (!storeWidget) return w
      return {
        ...w,
        defaultSize: storeWidget.size ?? w.defaultSize,
        settings: { ...w.settings, ...storeWidget.settings }
      }
    })
  }
}
```

---

## Version Switching Strategy

When the user switches from v1 to v2:

1. `builderStore.setActiveVersion('v2')`
2. Canvas re-renders `<DashboardFromSchema schema={v2.schema} versionId="v2">`
3. `<Dashboard persistenceKey="dashcraft-v2">` loads v2's layout from localStorage
4. The drag/resize positions from the user's v2 session are restored

This works because each version has its own `persistenceKey`.

---

## Adding New Widget from Sidebar (future phase)

```typescript
// User drags a widget from the palette onto the canvas
import { useDashboard } from '@repo/dashcraft'

const { addWidget } = useDashboard()

addWidget({
  id: `widget-${Date.now()}`,
  type: 'kpi',
  title: 'New KPI',
  draggable: true,
  deletable: true,
  defaultSize: { width: 300, height: 150 },
  defaultPosition: { x: 100, y: 100 }
})
```

The builder store also needs to update its schema copy — use the `onLayoutChange` callback from `<Dashboard>`.
