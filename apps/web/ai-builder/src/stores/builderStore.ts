import { create } from 'zustand'
import type { Version, AIDashboardSchema, DiffPatchList } from '../types/schema'
import { localStorageAdapter } from '../types/schema'

interface BuilderState {
  versions: Version[]
  activeVersionId: string | null
  isGenerating: boolean
  streamingStatus: string
  isOllamaOnline: boolean

  // Derived
  activeVersion: () => Version | null
  activeSchema: () => AIDashboardSchema | null

  // Actions
  addVersion: (v: Omit<Version, 'id'> & { diff?: DiffPatchList }) => string
  setActiveVersion: (id: string) => void
  deleteVersion: (id: string) => void
  updateSchema: (schema: AIDashboardSchema) => void
  setGenerating: (v: boolean, status?: string) => void
  setStreamingStatus: (s: string) => void
  setOllamaOnline: (v: boolean) => void
  persist: () => void
  hydrate: () => Promise<void>
}

let versionCounter = 1

export const useBuilderStore = create<BuilderState>((set, get) => ({
  versions: [],
  activeVersionId: null,
  isGenerating: false,
  streamingStatus: '',
  isOllamaOnline: false,

  activeVersion: () => {
    const { versions, activeVersionId } = get()
    return versions.find((v) => v.id === activeVersionId) ?? null
  },

  activeSchema: () => {
    return get().activeVersion()?.schema ?? null
  },

  addVersion: (v) => {
    const id = `v${versionCounter++}`
    const newVersion: Version = {
      ...v,
      id,
      label: id,
      isBase: get().versions.length === 0,
    }
    set((s) => ({
      versions: [...s.versions, newVersion],
      activeVersionId: id,
    }))
    get().persist()
    return id
  },

  setActiveVersion: (id) => {
    set({ activeVersionId: id })
    localStorage.setItem('ai-builder-active-version', id)
  },

  deleteVersion: (id) => {
    const { versions, activeVersionId } = get()
    if (versions.length <= 1) return
    const next = versions.filter((v) => v.id !== id)
    const nextActive =
      activeVersionId === id ? (next[next.length - 1]?.id ?? null) : activeVersionId
    set({ versions: next, activeVersionId: nextActive })
    get().persist()
  },

  updateSchema: (schema) => {
    const { activeVersionId } = get()
    if (!activeVersionId) return
    set((s) => ({
      versions: s.versions.map((v) =>
        v.id === activeVersionId ? { ...v, schema } : v
      ),
    }))
    get().persist()
  },

  setGenerating: (v, status = '') => {
    set({ isGenerating: v, streamingStatus: status })
  },

  setStreamingStatus: (s) => set({ streamingStatus: s }),

  setOllamaOnline: (v) => set({ isOllamaOnline: v }),

  persist: () => {
    void localStorageAdapter.save(get().versions)
  },

  hydrate: async () => {
    const saved = await localStorageAdapter.load()
    if (saved.length > 0) {
      // Restore versionCounter so new versions get correct IDs
      const nums = saved.map((v) => parseInt(v.id.replace('v', ''), 10)).filter(Boolean)
      if (nums.length) versionCounter = Math.max(...nums) + 1
      const lastActiveId = localStorage.getItem('ai-builder-active-version')
      const activeId = saved.find((v) => v.id === lastActiveId)?.id ?? saved[saved.length - 1]?.id ?? null
      set({ versions: saved, activeVersionId: activeId })
    }
  },
}))
