import { useEffect, useRef, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useAuthContext } from '../context/auth-context'
import { useConfig } from '../context/config-context'
import type { RouteMatch } from '../types'

interface NavigationGuardProps {
  children: ReactNode
}

/**
 * Runs global `hooks.beforeEach` and `hooks.afterEach` on every navigation.
 * Rendered once at the top of the route tree.
 *
 * beforeEach:
 *  - return false   → navigate back (note: URL already changed in RR7)
 *  - return string  → redirect to that path
 *  - return void    → allow navigation
 *
 * afterEach:
 *  - Fires after every navigation settle (analytics, document title, etc.)
 */
export function NavigationGuard({ children }: NavigationGuardProps) {
  const config = useConfig()
  const auth = useAuthContext()
  const location = useLocation()
  const navigate = useNavigate()

  const prevLocationRef = useRef<typeof location | null>(null)
  const isFirstRender = useRef(true)

  useEffect(() => {
    const hooks = config.hooks
    if (!hooks?.beforeEach && !hooks?.afterEach) return

    const to: RouteMatch = {
      path: location.pathname,
      params: {},
      meta: undefined,
    }
    const from: RouteMatch | null = prevLocationRef.current
      ? { path: prevLocationRef.current.pathname, params: {} }
      : null

    // Skip beforeEach on the initial mount — only run on actual navigations
    if (!isFirstRender.current && hooks.beforeEach) {
      Promise.resolve(hooks.beforeEach(to, from, auth.user)).then(result => {
        if (result === false) {
          navigate(-1)
        } else if (typeof result === 'string') {
          navigate(result, { replace: true })
        }
      })
    }

    if (hooks.afterEach) {
      hooks.afterEach(to, from)
    }

    // Fire plugins
    config.plugins?.forEach(p => p.onRouteChange?.(to, from))

    prevLocationRef.current = location
    isFirstRender.current = false
  }, [location.pathname, location.search])

  return <>{children}</>
}
