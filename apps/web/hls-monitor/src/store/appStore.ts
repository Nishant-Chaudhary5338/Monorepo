import { create } from 'zustand'

type Panel = 'grid' | 'variants' | 'analytics' | 'log'

type AppStore = {
  activePanel: Panel
  sidebarOpen: boolean
  selectedStreamId: string | null
  addStreamOpen: boolean

  setActivePanel: (panel: Panel) => void
  toggleSidebar: () => void
  selectStream: (id: string | null) => void
  setAddStreamOpen: (open: boolean) => void
}

export const useAppStore = create<AppStore>((set) => ({
  activePanel: 'grid',
  sidebarOpen: true,
  selectedStreamId: null,
  addStreamOpen: false,

  setActivePanel: (panel) => set({ activePanel: panel }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  selectStream: (id) => set({ selectedStreamId: id }),
  setAddStreamOpen: (open) => set({ addStreamOpen: open }),
}))
