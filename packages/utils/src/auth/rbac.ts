import type { RBACConfig } from './types';

export function createRBAC(config: RBACConfig) {
  const { roles } = config;

  function hasPermission(role: string, permission: string): boolean {
    const rolePermissions = roles[role];
    if (!rolePermissions) return false;
    return rolePermissions.includes(permission) || rolePermissions.includes('*');
  }

  function hasRole(userRole: string, allowedRoles: string[]): boolean {
    return allowedRoles.includes(userRole);
  }

  function getPermissions(role: string): string[] {
    return roles[role] ?? [];
  }

  function getRoles(): string[] {
    return Object.keys(roles);
  }

  return { hasPermission, hasRole, getPermissions, getRoles };
}
