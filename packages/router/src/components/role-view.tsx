import { lazy, Suspense } from 'react'
import { useAuthContext } from '../context/auth-context'
import { useConfig } from '../context/config-context'
import type { RouteConfig } from '../types'

interface RoleViewProps {
  route: RouteConfig
}

/**
 * Renders a different component based on the authenticated user's role.
 * Uses `route.roleViews` map and falls back to `route.fallbackView`.
 *
 * @example
 * ```tsx
 * roleViews: {
 *   admin:   () => import('./pages/Home/AdminHome'),
 *   manager: () => import('./pages/Home/ManagerHome'),
 *   user:    () => import('./pages/Home/UserHome'),
 * },
 * fallbackView: () => import('./pages/Home/DefaultHome'),
 * ```
 */
export function RoleView({ route }: RoleViewProps) {
  const auth = useAuthContext()
  const config = useConfig()

  const { roleViews, fallbackView } = route

  if (!roleViews) return null

  const userRoles: string[] = auth.user?.roles
    ?? (auth.user?.role ? [auth.user.role] : [])

  // Find first matching role in the map (order of roleViews keys matters)
  const matchedFactory = Object.entries(roleViews).find(([role]) =>
    userRoles.includes(role)
  )?.[1]

  const factory = matchedFactory ?? fallbackView

  if (!factory) {
    // No match and no fallback — show unauthorized state
    return <>{route.unauthorized ?? config.fallback?.unauthorized ?? null}</>
  }

  const LazyComponent = lazy(factory)

  return (
    <Suspense fallback={route.loading ?? config.fallback?.loading ?? null}>
      <LazyComponent />
    </Suspense>
  )
}
