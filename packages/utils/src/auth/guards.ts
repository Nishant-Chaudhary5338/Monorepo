import type { AuthGuardConfig } from './types';

export function createAuthGuard(config: AuthGuardConfig = {}) {
  const { redirectTo = '/login', roles, permissions } = config;

  function canAccess(userRoles: string[], userPermissions: string[]): boolean {
    if (!userRoles || !userPermissions) return false;
    if (roles && roles.length > 0) {
      if (!roles.some((r) => userRoles.includes(r))) return false;
    }
    if (permissions && permissions.length > 0) {
      if (!permissions.some((p) => userPermissions.includes(p))) return false;
    }
    return true;
  }

  return { canAccess, redirectTo, requiredRoles: roles, requiredPermissions: permissions };
}
