import { create } from 'zustand'

export type ToolCallStatus = 'idle' | 'running' | 'done' | 'error'

export interface ToolCall {
  id: string
  server: string
  tool: string
  args: Record<string, unknown>
  status: ToolCallStatus
  result?: unknown
  error?: string
  duration?: number
  startedAt?: number
}

interface DemoStore {
  toolCalls: ToolCall[]
  activeTab: 'demo' | 'gallery'

  setActiveTab: (tab: 'demo' | 'gallery') => void
  addToolCall: (call: Omit<ToolCall, 'status'>) => void
  updateToolCall: (id: string, patch: Partial<ToolCall>) => void
  clearToolCalls: () => void
}

export const useDemoStore = create<DemoStore>((set) => ({
  toolCalls: [],
  activeTab: 'demo',

  setActiveTab: (tab) => set({ activeTab: tab }),

  addToolCall: (call) =>
    set((s) => ({
      toolCalls: [...s.toolCalls, { ...call, status: 'idle' }],
    })),

  updateToolCall: (id, patch) =>
    set((s) => ({
      toolCalls: s.toolCalls.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    })),

  clearToolCalls: () => set({ toolCalls: [] }),
}))
