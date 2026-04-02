import { createContext, useContext, type ReactNode } from 'react'
import type { RouterConfig } from '../types'

const ConfigContext = createContext<RouterConfig | null>(null)

export function ConfigProvider({
  config,
  children,
}: {
  config: RouterConfig
  children: ReactNode
}) {
  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
}

export function useConfig(): RouterConfig {
  const ctx = useContext(ConfigContext)
  if (!ctx) throw new Error('[router] useConfig must be used inside <RouterProvider>')
  return ctx
}
