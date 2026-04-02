import type { ReactNode } from 'react'
import { useAuthContext } from '../context/auth-context'

export interface GuardProps {
  /** Required: user must be authenticated */
  authenticated?: boolean
  /** Require ANY of these roles */
  roles?: string[]
  /** Require ALL of these permissions */
  permissions?: string[]
  /** Rendered when the guard condition is not met. Default: null */
  fallback?: ReactNode
  children: ReactNode
}

/**
 * Conditionally renders children based on auth state, roles, or permissions.
 * Does NOT redirect — use route-level `type`, `roles`, `permissions` for that.
 *
 * @example
 * ```tsx
 * // Only admins see this
 * <Guard roles={['admin']} fallback={<UpgradePrompt />}>
 *   <DeleteButton />
 * </Guard>
 *
 * // Requires a specific permission
 * <Guard permissions={['billing.write']}>
 *   <BillingForm />
 * </Guard>
 *
 * // Must be authenticated
 * <Guard authenticated fallback={<LoginButton />}>
 *   <UserMenu />
 * </Guard>
 * ```
 */
export function Guard({
  authenticated,
  roles,
  permissions,
  fallback = null,
  children,
}: GuardProps) {
  const auth = useAuthContext()

  // Still initializing — render nothing to prevent flicker
  if (auth.isLoading) return null

  // Authenticated check
  if (authenticated && !auth.isAuthenticated) {
    return <>{fallback}</>
  }

  // Role check — ANY matching role passes
  if (roles && roles.length > 0) {
    const userRoles: string[] = auth.user?.roles
      ?? (auth.user?.role ? [auth.user.role] : [])
    const hasRole = roles.some(r => userRoles.includes(r))
    if (!hasRole) return <>{fallback}</>
  }

  // Permission check — ALL permissions must be present
  if (permissions && permissions.length > 0) {
    const userPermissions: string[] = auth.user?.permissions ?? []
    const hasAll = permissions.every(p => userPermissions.includes(p))
    if (!hasAll) return <>{fallback}</>
  }

  return <>{children}</>
}
