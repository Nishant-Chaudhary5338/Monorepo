import type { AIDashboardSchema, AIWidgetSchema, DiffPatch, DiffPatchList } from '../types/schema'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function findNode(widgets: AIWidgetSchema[], id: string): AIWidgetSchema | null {
  for (const w of widgets) {
    if (w.id === id) return w
    if (w.children) {
      const found = findNode(w.children, id)
      if (found) return found
    }
  }
  return null
}

function removeNode(widgets: AIWidgetSchema[], id: string): boolean {
  for (let i = 0; i < widgets.length; i++) {
    if (widgets[i].id === id) {
      widgets.splice(i, 1)
      return true
    }
    if (widgets[i].children && removeNode(widgets[i].children!, id)) return true
  }
  return false
}

/** Remove and return the node (for move ops) */
function extractNode(widgets: AIWidgetSchema[], id: string): AIWidgetSchema | null {
  for (let i = 0; i < widgets.length; i++) {
    if (widgets[i].id === id) {
      return widgets.splice(i, 1)[0]
    }
    if (widgets[i].children) {
      const found = extractNode(widgets[i].children!, id)
      if (found) return found
    }
  }
  return null
}

function deepMerge<T extends object>(base: T, patch: Partial<T>): T {
  const result = { ...base }
  for (const key in patch) {
    const pVal = patch[key]
    const bVal = base[key]
    if (
      pVal !== null &&
      typeof pVal === 'object' &&
      !Array.isArray(pVal) &&
      bVal !== null &&
      typeof bVal === 'object' &&
      !Array.isArray(bVal)
    ) {
      result[key] = deepMerge(bVal as object, pVal as object) as T[typeof key]
    } else if (pVal !== undefined) {
      result[key] = pVal as T[typeof key]
    }
  }
  return result
}

// ─── applyPatches ─────────────────────────────────────────────────────────────

export function applyPatches(
  schema: AIDashboardSchema,
  patches: DiffPatchList
): AIDashboardSchema {
  const next = structuredClone(schema)

  for (const patch of patches) {
    applyPatch(next, patch)
  }

  return next
}

function applyPatch(schema: AIDashboardSchema, patch: DiffPatch): void {
  switch (patch.op) {
    case 'update': {
      const node = findNode(schema.widgets, patch.nodeId)
      if (node && patch.payload) {
        Object.assign(node, deepMerge(node, patch.payload))
      }
      break
    }

    case 'add': {
      if (!patch.payload) break
      const newWidget = patch.payload as AIWidgetSchema
      if (patch.parentId === 'root' || !patch.parentId) {
        const idx = patch.index ?? schema.widgets.length
        schema.widgets.splice(idx, 0, newWidget)
      } else {
        const parent = findNode(schema.widgets, patch.parentId)
        if (parent) {
          parent.children = parent.children ?? []
          const idx = patch.index ?? parent.children.length
          parent.children.splice(idx, 0, newWidget)
        }
      }
      break
    }

    case 'remove': {
      removeNode(schema.widgets, patch.nodeId)
      break
    }

    case 'move': {
      const node = extractNode(schema.widgets, patch.nodeId)
      if (!node) break
      if (patch.parentId === 'root' || !patch.parentId) {
        const idx = patch.index ?? schema.widgets.length
        schema.widgets.splice(idx, 0, node)
      } else {
        const parent = findNode(schema.widgets, patch.parentId)
        if (parent) {
          parent.children = parent.children ?? []
          const idx = patch.index ?? parent.children.length
          parent.children.splice(idx, 0, node)
        }
      }
      break
    }
  }
}
