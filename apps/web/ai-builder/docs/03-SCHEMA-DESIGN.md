# Schema Design

The schema is the single source of truth. The AI generates it. The canvas renders it. The JSON editor edits it. The export reads it.

---

## Core Types

### DashboardSchema (what AI generates)

Extends dashcraft's built-in `DashboardSchema`. The AI produces this exact shape.

```typescript
// src/types/schema.ts

export interface AIWidgetSchema {
  id: string                          // unique, stable across diffs — e.g. "hero-card", "revenue-kpi"
  type: WidgetType                    // maps to WidgetRenderer switch
  title?: string
  colSpan?: number                    // grid column span (1–12)
  rowSpan?: number                    // grid row span
  draggable?: boolean                 // default: true
  deletable?: boolean                 // default: true
  defaultSize?: { width: number; height: number }

  // props passed directly to the rendered @repo/ui component
  props?: Record<string, unknown>

  // dashcraft settings (highlight color, opacity, polling, etc.)
  settings?: {
    theme?: 'light' | 'dark'
    highlight?: boolean
    highlightColor?: string
    opacity?: number
    [key: string]: unknown
  }

  // children widgets (for container types like Card, Section)
  children?: AIWidgetSchema[]
}

export interface AIDashboardSchema {
  id?: string                         // generated if not provided
  title?: string
  layout?: 'grid' | 'flex' | 'free'
  columns?: number                    // for grid layout (default: 3)
  gap?: number                        // gap in px (default: 16)
  widgets: AIWidgetSchema[]
}
```

### WidgetType

The closed set of types the AI is allowed to use. `WidgetRenderer` has a case for each.

```typescript
export type WidgetType =
  // dashcraft built-in widgets
  | 'bar' | 'line' | 'area' | 'pie' | 'scatter' | 'radar'
  | 'kpi'
  | 'heatmap' | 'treemap'
  // @repo/ui components (as standalone widgets)
  | 'card'
  | 'table'
  | 'form'
  | 'stat'         // simple metric: number + label + trend
  | 'list'         // vertical list of items
  | 'alert'
  | 'badge-group'
  | 'progress-group'
  // layout containers
  | 'section'      // wraps children in a titled section
  | 'row'          // horizontal flex row of children
  // fallback
  | 'placeholder'  // unknown type — renders a "unknown widget" card
```

---

## DiffPatch

Returned by the AI on follow-up prompts. Applied to the current schema without full re-render.

```typescript
export type DiffOp = 'update' | 'add' | 'remove' | 'move'

export interface DiffPatch {
  nodeId: string              // ID of the widget to patch
  op: DiffOp
  payload?: Partial<AIWidgetSchema>   // for 'update' and 'add'
  parentId?: string                   // for 'add' (which widget to add into)
  index?: number                      // for 'add' and 'move' (position in children[])
}

export type DiffPatchList = DiffPatch[]
```

### Diff patch examples

```json
// Update: change a widget's highlight color
{ "nodeId": "revenue-kpi", "op": "update", "payload": { "settings": { "highlightColor": "#3b82f6" } } }

// Add: insert a new widget into root
{ "nodeId": "new-cta-btn", "op": "add", "payload": { "id": "new-cta-btn", "type": "card", "title": "CTA" }, "parentId": "root", "index": 2 }

// Remove: delete a widget
{ "nodeId": "old-chart", "op": "remove" }

// Move: reorder a widget
{ "nodeId": "revenue-kpi", "op": "move", "parentId": "root", "index": 0 }
```

---

## Version

One snapshot in the version history. Versions are created on every AI generation (initial or diff).

```typescript
export interface Version {
  id: string              // 'v1', 'v2', 'v3', ...
  label?: string          // optional user-set name: "Dark theme", "With CTA"
  schema: AIDashboardSchema
  prompt: string          // the prompt that created this version
  timestamp: number       // Date.now()
  diff?: DiffPatchList    // undefined for v1 (initial), present for v2+
  isBase?: boolean        // true for v1 (full generation, no parent)
}
```

---

## SyncAdapter (for future server sync)

The builder store accepts an adapter so localStorage can be swapped for a server call.

```typescript
export interface SyncAdapter {
  save(versions: Version[]): Promise<void>
  load(): Promise<Version[]>
}

// Built-in localStorage adapter
export const localStorageAdapter: SyncAdapter = {
  async save(versions) {
    localStorage.setItem('ai-builder-versions', JSON.stringify(versions))
  },
  async load() {
    const raw = localStorage.getItem('ai-builder-versions')
    return raw ? JSON.parse(raw) : []
  }
}

// Future: implement a serverAdapter that POSTs to your API
```

---

## Schema Validation

The AI output is parsed and validated before being used. Invalid schemas should fall back gracefully.

```typescript
// lib/validateSchema.ts

export function validateSchema(raw: unknown): AIDashboardSchema | null {
  if (!raw || typeof raw !== 'object') return null
  const schema = raw as AIDashboardSchema
  if (!Array.isArray(schema.widgets)) return null
  // sanitize each widget: ensure id, type exist; strip unknown types
  schema.widgets = schema.widgets
    .filter(w => w.id && w.type)
    .map(w => ({ ...w, type: isKnownType(w.type) ? w.type : 'placeholder' }))
  return schema
}

function isKnownType(type: string): type is WidgetType {
  const known: WidgetType[] = ['bar','line','area','pie','kpi','card','table', ...]
  return known.includes(type as WidgetType)
}
```

---

## localStorage Key Strategy

```
ai-builder-versions              → Version[] (builder store)
ai-builder-active-version        → string (active version id)
dashcraft-v1                     → dashcraft layout for version v1
dashcraft-v2                     → dashcraft layout for version v2
...
```

Each version gets its own dashcraft persistence key (`dashcraft-{versionId}`) so switching versions restores that version's drag/resize layout.
