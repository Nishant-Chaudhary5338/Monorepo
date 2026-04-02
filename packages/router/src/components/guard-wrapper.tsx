import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router'
import { useAuthContext } from '../context/auth-context'
import { useConfig } from '../context/config-context'
import type { RouteConfig } from '../types'

type GuardState = 'checking' | 'allowed' | 'redirect'

interface GuardWrapperProps {
  route: RouteConfig
  children: ReactNode
}

/**
 * Wraps a route and enforces:
 * 1. Auth loading gate
 * 2. Guest-only redirect (type: 'guest')
 * 3. Protected redirect (type: 'protected')
 * 4. Role check
 * 5. Permission check
 * 6. Custom guard() fn (async-safe)
 */
export function GuardWrapper({ route, children }: GuardWrapperProps) {
  const auth = useAuthContext()
  const config = useConfig()
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams() as Record<string, string>

  const [guardState, setGuardState] = useState<GuardState>('checking')
  const [redirectTarget, setRedirectTarget] = useState<string | null>(null)

  // Track location to re-run guard on navigation
  const locationKey = location.pathname + location.search

  const ranForKey = useRef<string | null>(null)

  useEffect(() => {
    // Don't re-run for the same location + auth state combo
    const runKey = `${locationKey}::${auth.isLoading}::${JSON.stringify(auth.user)}`
    if (ranForKey.current === runKey) return
    ranForKey.current = runKey

    if (auth.isLoading) {
      setGuardState('checking')
      return
    }

    async function evaluate() {
      // 1. Guest route — redirect authenticated users away
      if (route.type === 'guest' && auth.isAuthenticated) {
        setRedirectTarget(route.redirectIfAuth ?? '/')
        setGuardState('redirect')
        return
      }

      // 2. Protected route — redirect unauthenticated users
      if (route.type === 'protected' && !auth.isAuthenticated) {
        setRedirectTarget(config.auth?.redirectTo ?? '/login')
        setGuardState('redirect')
        return
      }

      // 3. Role check (ANY of the listed roles)
      if (route.roles && route.roles.length > 0 && auth.isAuthenticated) {
        const userRoles: string[] = auth.user?.roles
          ?? (auth.user?.role ? [auth.user.role] : [])
        const hasRole = route.roles.some(r => userRoles.includes(r))
        if (!hasRole) {
          setRedirectTarget(config.auth?.unauthorizedRedirect ?? '/403')
          setGuardState('redirect')
          return
        }
      }

      // 4. Permission check (ALL permissions must be present)
      if (route.permissions && route.permissions.length > 0 && auth.isAuthenticated) {
        const userPermissions: string[] = auth.user?.permissions ?? []
        const hasAll = route.permissions.every(p => userPermissions.includes(p))
        if (!hasAll) {
          setRedirectTarget(config.auth?.unauthorizedRedirect ?? '/403')
          setGuardState('redirect')
          return
        }
      }

      // 5. Custom async guard
      if (route.guard) {
        const result = await route.guard({
          params,
          user: auth.user,
          location: {
            pathname: location.pathname,
            search: location.search,
            hash: location.hash,
          },
        })
        if (result === false) {
          // Navigate back — can't fully cancel in RR7 without useBlocker
          navigate(-1)
          setGuardState('checking')
          return
        }
        if (typeof result === 'string') {
          setRedirectTarget(result)
          setGuardState('redirect')
          return
        }
      }

      setGuardState('allowed')
    }

    evaluate()
  }, [locationKey, auth.isLoading, auth.isAuthenticated, auth.user])

  // Auth still initializing
  if (auth.isLoading || guardState === 'checking') {
    return <>{route.loading ?? config.fallback?.loading ?? null}</>
  }

  // Redirect
  if (guardState === 'redirect' && redirectTarget) {
    // Role/permission failures → show unauthorized component instead of redirecting
    const isUnauthorizedFailure =
      (route.roles && route.roles.length > 0) ||
      (route.permissions && route.permissions.length > 0)

    if (isUnauthorizedFailure && (route.unauthorized ?? config.fallback?.unauthorized)) {
      return <>{route.unauthorized ?? config.fallback?.unauthorized}</>
    }

    return (
      <Navigate
        to={redirectTarget}
        replace
        state={{ from: location }}
      />
    )
  }

  return <>{children}</>
}
