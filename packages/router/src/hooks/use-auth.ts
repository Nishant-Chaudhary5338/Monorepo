import { useAuthContext } from '../context/auth-context'

export interface UseAuthResult {
  /** True if the current user is authenticated. */
  isAuthenticated: boolean
  /** The user object returned by `auth.user()`. Null if not authenticated. */
  user: any
  /** True while the initial auth check is in progress. */
  isLoading: boolean
  /**
   * Returns true if the user has ANY of the given roles.
   * Checks both `user.role` (string) and `user.roles` (string[]).
   */
  hasRole: (role: string | string[]) => boolean
  /**
   * Returns true if the user has ALL of the given permissions.
   * Requires `user.permissions: string[]`.
   */
  hasPermission: (permission: string | string[]) => boolean
  /**
   * Returns true if the user has at least one of the given roles.
   * Alias for hasRole with array input.
   */
  hasAnyRole: (roles: string[]) => boolean
  /** Re-runs `auth.check()` and `auth.user()`. Useful after login/logout. */
  refresh: () => Promise<void>
}

/**
 * Access authentication state and helpers anywhere in the component tree.
 *
 * @example
 * ```tsx
 * const { user, isAuthenticated, hasRole, hasPermission, refresh } = useAuth()
 *
 * // After login
 * await loginUser(credentials)
 * await refresh()  // re-sync auth state
 *
 * // Role / permission checks
 * if (hasRole('admin')) { ... }
 * if (hasPermission('billing.write')) { ... }
 * ```
 */
export function useAuth(): UseAuthResult {
  const auth = useAuthContext()

  const getUserRoles = (): string[] =>
    auth.user?.roles ?? (auth.user?.role ? [auth.user.role] : [])

  const getUserPermissions = (): string[] =>
    auth.user?.permissions ?? []

  return {
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
    isLoading: auth.isLoading,

    hasRole: (role) => {
      const roles = Array.isArray(role) ? role : [role]
      return roles.some(r => getUserRoles().includes(r))
    },

    hasAnyRole: (roles) => {
      return roles.some(r => getUserRoles().includes(r))
    },

    hasPermission: (permission) => {
      const perms = Array.isArray(permission) ? permission : [permission]
      return perms.every(p => getUserPermissions().includes(p))
    },

    refresh: auth.refresh,
  }
}
