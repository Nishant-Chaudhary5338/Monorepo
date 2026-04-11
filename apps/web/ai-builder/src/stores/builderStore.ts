import { create } from 'zustand'
import type { Version, AIDashboardSchema, DiffPatchList } from '../types/schema'
import { localStorageAdapter } from '../types/schema'
import { DEFAULT_PROVIDER, PROVIDERS } from '../ai/providers'
import type { ProviderId } from '../ai/providers'

interface BuilderState {
  versions: Version[]
  activeVersionId: string | null
  isGenerating: boolean
  streamingStatus: string

  // AI provider / model selection
  provider: ProviderId
  model: string

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
  setProvider: (provider: ProviderId) => void
  setModel: (model: string) => void
  persist: () => void
  hydrate: () => Promise<void>
}

let versionCounter = 1

export const useBuilderStore = create<BuilderState>((set, get) => ({
  versions: [],
  activeVersionId: null,
  isGenerating: false,
  streamingStatus: '',
  provider: DEFAULT_PROVIDER,
  model: PROVIDERS[DEFAULT_PROVIDER].defaultModel,

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

  setProvider: (provider) => {
    set({ provider, model: PROVIDERS[provider].defaultModel })
    localStorage.setItem('ai-builder-provider', provider)
    localStorage.setItem('ai-builder-model', PROVIDERS[provider].defaultModel)
  },

  setModel: (model) => {
    set({ model })
    localStorage.setItem('ai-builder-model', model)
  },

  persist: () => {
    void localStorageAdapter.save(get().versions)
  },

  hydrate: async () => {
    const saved = await localStorageAdapter.load()
    if (saved.length > 0) {
      const nums = saved.map((v) => parseInt(v.id.replace('v', ''), 10)).filter(Boolean)
      if (nums.length) versionCounter = Math.max(...nums) + 1
      const lastActiveId = localStorage.getItem('ai-builder-active-version')
      const activeId = saved.find((v) => v.id === lastActiveId)?.id ?? saved[saved.length - 1]?.id ?? null
      set({ versions: saved, activeVersionId: activeId })
    }

    // Restore provider/model selection
    const savedProvider = localStorage.getItem('ai-builder-provider') as ProviderId | null
    const savedModel = localStorage.getItem('ai-builder-model')
    if (savedProvider && PROVIDERS[savedProvider]) {
      const model = savedModel ?? PROVIDERS[savedProvider].defaultModel
      set({ provider: savedProvider, model })
    }
  },
}))
