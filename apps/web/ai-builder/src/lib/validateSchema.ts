import type { AIDashboardSchema, AIWidgetSchema, WidgetType } from '../types/schema'

// ─── Valid widget types ───────────────────────────────────────────────────────

const VALID_TYPES = new Set<WidgetType>([
  'bar', 'line', 'area', 'pie', 'scatter', 'radar', 'kpi', 'heatmap', 'treemap',
  'card', 'table', 'stat', 'alert', 'badge-group', 'progress-group', 'list',
  'section', 'row', 'placeholder',
])

// Default sizes by widget type
const DEFAULT_SIZES: Partial<Record<WidgetType, { width: number; height: number }>> = {
  kpi:              { width: 280, height: 160 },
  bar:              { width: 580, height: 300 },
  line:             { width: 580, height: 300 },
  area:             { width: 580, height: 300 },
  pie:              { width: 380, height: 300 },
  scatter:          { width: 580, height: 300 },
  radar:            { width: 380, height: 300 },
  heatmap:          { width: 580, height: 300 },
  treemap:          { width: 580, height: 300 },
  table:            { width: 580, height: 320 },
  card:             { width: 280, height: 200 },
  stat:             { width: 580, height: 140 },
  alert:            { width: 580, height: 120 },
  'progress-group': { width: 280, height: 280 },
  'badge-group':    { width: 280, height: 140 },
  list:             { width: 280, height: 240 },
  section:          { width: 880, height: 400 },
  row:              { width: 880, height: 200 },
  placeholder:      { width: 280, height: 160 },
}

// ─── Widget validator ─────────────────────────────────────────────────────────

function sanitizeWidget(raw: unknown): AIWidgetSchema | null {
  if (!raw || typeof raw !== 'object') return null
  const w = raw as Record<string, unknown>

  if (typeof w.id !== 'string' || !w.id) return null

  // Normalise type — fall back to placeholder for unknown types
  const rawType = typeof w.type === 'string' ? w.type : 'placeholder'
  const type: WidgetType = VALID_TYPES.has(rawType as WidgetType)
    ? (rawType as WidgetType)
    : 'placeholder'

  const defaultSize = DEFAULT_SIZES[type] ?? { width: 280, height: 160 }

  const widget: AIWidgetSchema = {
    id: w.id as string,
    type,
    draggable: true,
    deletable: true,
    defaultSize:
      w.defaultSize &&
      typeof (w.defaultSize as Record<string, unknown>).width === 'number'
        ? (w.defaultSize as { width: number; height: number })
        : defaultSize,
    props: typeof w.props === 'object' && w.props !== null
      ? (w.props as Record<string, unknown>)
      : {},
  }

  if (typeof w.title === 'string') widget.title = w.title
  if (typeof w.colSpan === 'number') widget.colSpan = w.colSpan
  if (typeof w.rowSpan === 'number') widget.rowSpan = w.rowSpan
  if (w.settings && typeof w.settings === 'object') {
    widget.settings = w.settings as AIWidgetSchema['settings']
  }
  if (Array.isArray(w.children)) {
    widget.children = w.children
      .map(sanitizeWidget)
      .filter(Boolean) as AIWidgetSchema[]
  }

  return widget
}

// ─── Schema validator ─────────────────────────────────────────────────────────

export function validateSchema(raw: unknown): AIDashboardSchema | null {
  if (!raw || typeof raw !== 'object') return null
  const obj = raw as Record<string, unknown>

  if (!Array.isArray(obj.widgets)) return null

  const widgets = obj.widgets
    .map(sanitizeWidget)
    .filter(Boolean) as AIWidgetSchema[]

  if (widgets.length === 0) return null

  // Deduplicate IDs
  const seen = new Set<string>()
  const deduped = widgets.map((w) => {
    if (seen.has(w.id)) {
      const newId = `${w.id}-${Math.random().toString(36).slice(2, 6)}`
      seen.add(newId)
      return { ...w, id: newId }
    }
    seen.add(w.id)
    return w
  })

  return {
    id: typeof obj.id === 'string' ? obj.id : `schema-${Date.now()}`,
    title: typeof obj.title === 'string' ? obj.title : 'Dashboard',
    layout: obj.layout === 'flex' ? 'flex' : 'grid',
    columns: typeof obj.columns === 'number' ? Math.min(4, Math.max(1, obj.columns)) : 3,
    gap: typeof obj.gap === 'number' ? Math.min(24, Math.max(8, obj.gap)) : 16,
    widgets: deduped,
  }
}
