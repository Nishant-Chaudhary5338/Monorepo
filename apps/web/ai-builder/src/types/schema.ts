// ─── Widget Types ────────────────────────────────────────────────────────────
// Closed set — WidgetRenderer has a case for every entry

export type WidgetType =
  // dashcraft built-in chart widgets
  | 'bar'
  | 'line'
  | 'area'
  | 'pie'
  | 'scatter'
  | 'radar'
  | 'kpi'
  | 'heatmap'
  | 'treemap'
  // @repo/ui components rendered as standalone widgets
  | 'card'
  | 'table'
  | 'stat'
  | 'alert'
  | 'badge-group'
  | 'progress-group'
  | 'list'
  // layout containers (have children[])
  | 'section'
  | 'row'
  // fallback for unknown types from LLM
  | 'placeholder'

// ─── Core Widget Schema ───────────────────────────────────────────────────────

export interface AIWidgetSchema {
  id: string
  type: WidgetType
  title?: string
  colSpan?: number
  rowSpan?: number
  draggable?: boolean
  deletable?: boolean
  defaultSize?: { width: number; height: number }
  // props passed directly to the rendered component
  props?: Record<string, unknown>
  // dashcraft DashboardCard settings
  settings?: {
    theme?: 'light' | 'dark'
    highlight?: boolean
    highlightColor?: string
    opacity?: number
    [key: string]: unknown
  }
  // for container types: section, row
  children?: AIWidgetSchema[]
}

// ─── Dashboard Schema ─────────────────────────────────────────────────────────
// This is exactly what the LLM generates

export interface AIDashboardSchema {
  id?: string
  title?: string
  layout?: 'grid' | 'flex'
  columns?: number  // grid columns, default 3
  gap?: number      // gap in px, default 16
  widgets: AIWidgetSchema[]
}

// ─── Diff Types ───────────────────────────────────────────────────────────────

export type DiffOp = 'update' | 'add' | 'remove' | 'move'

export interface DiffPatch {
  nodeId: string
  op: DiffOp
  payload?: Partial<AIWidgetSchema>
  parentId?: string  // for 'add' / 'move' — use "root" for top-level
  index?: number     // for 'add' / 'move' — position in children[]
}

export type DiffPatchList = DiffPatch[]

// ─── Version ─────────────────────────────────────────────────────────────────

export interface Version {
  id: string          // 'v1', 'v2', 'v3', ...
  label?: string      // user-editable name
  schema: AIDashboardSchema
  prompt: string
  timestamp: number
  diff?: DiffPatchList  // undefined for v1 (full gen), present for v2+
  isBase?: boolean      // true for v1
}

// ─── Sync Adapter ─────────────────────────────────────────────────────────────
// Swap localStorage for a server adapter in Phase 9

export interface SyncAdapter {
  save(versions: Version[]): Promise<void>
  load(): Promise<Version[]>
}

export const localStorageAdapter: SyncAdapter = {
  async save(versions) {
    localStorage.setItem('ai-builder-versions', JSON.stringify(versions))
  },
  async load() {
    try {
      const raw = localStorage.getItem('ai-builder-versions')
      return raw ? (JSON.parse(raw) as Version[]) : []
    } catch {
      return []
    }
  },
}
