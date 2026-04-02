import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { authStore } from '../auth-store'
import type { AuthConfig, AuthState } from '../types'

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({
  config,
  children,
}: {
  config?: AuthConfig
  children: ReactNode
}) {
  const [state, setState] = useState<Omit<AuthState, 'refresh'>>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  })

  // Stable ref so refresh() never triggers infinite loops
  const configRef = useRef(config)
  configRef.current = config

  const refresh = useCallback(async () => {
    const cfg = configRef.current
    if (!cfg) {
      const next = { isAuthenticated: false, user: null, isLoading: false }
      setState(next)
      authStore.set(next)
      return
    }

    setState(prev => ({ ...prev, isLoading: true }))

    try {
      const [isAuthenticated, user] = await Promise.all([
        Promise.resolve(cfg.check()),
        Promise.resolve(cfg.user()),
      ])
      const next = { isAuthenticated, user, isLoading: false }
      setState(next)
      authStore.set(next)
    } catch {
      const next = { isAuthenticated: false, user: null, isLoading: false }
      setState(next)
      authStore.set(next)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const value: AuthState = { ...state, refresh }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('[router] useAuthContext must be used inside <RouterProvider>')
  return ctx
}
