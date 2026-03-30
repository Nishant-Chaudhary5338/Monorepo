import type { RBACConfig } from './types';

export function createRBAC(config: RBACConfig) {
  const { roles } = config;

  if (!roles || typeof roles !== 'object') {
    throw new Error('Roles configuration is required');
  }

  function hasPermission(role: string, permission: string): boolean {
    if (!role?.trim() || !permission?.trim()) return false;
    const rolePermissions = roles[role];
    if (!rolePermissions) return false;
    return rolePermissions.includes(permission) || rolePermissions.includes('*');
  }

  function hasRole(userRole: string, allowedRoles: string[]): boolean {
    if (!userRole?.trim() || !Array.isArray(allowedRoles)) return false;
    return allowedRoles.includes(userRole);
  }

  function getPermissions(role: string): string[] {
    if (!role?.trim()) return [];
    return roles[role] ?? [];
  }

  function getRoles(): string[] {
    return Object.keys(roles);
  }

  return { hasPermission, hasRole, getPermissions, getRoles };
}
