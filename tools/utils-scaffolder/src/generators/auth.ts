// ============================================================================
// AUTH MODULE GENERATOR
// ============================================================================

export function generateAuthModule(): Record<string, string> {
  return {
    'index.ts': `// ============================================================================
// AUTH MODULE - Authentication and authorization utilities
// ============================================================================

export interface Permission {
  resource: string;
  actions: ('read' | 'write' | 'delete' | 'create')[];
}

export interface Role {
  name: string;
  permissions: Permission[];
}

export interface AuthContext {
  userId: string;
  roles: string[];
  permissions: Permission[];
}

export interface TokenPayload {
  sub: string;
  roles: string[];
  exp: number;
  iat: number;
}

/**
 * Checks if a user has a specific permission
 * @param context - Auth context
 * @param resource - Resource name
 * @param action - Action to check
 * @returns True if user has permission
 * @example hasPermission(ctx, 'posts', 'write') // true/false
 */
export function hasPermission(
  context: AuthContext,
  resource: string,
  action: 'read' | 'write' | 'delete' | 'create'
): boolean {
  return context.permissions.some(
    (p) => p.resource === resource && p.actions.includes(action)
  );
}

/**
 * Checks if a user has any of the specified roles
 * @param context - Auth context
 * @param roles - Roles to check
 * @returns True if user has at least one role
 */
export function hasRole(context: AuthContext, ...roles: string[]): boolean {
  return roles.some((role) => context.roles.includes(role));
}

/**
 * Checks if a user has all of the specified roles
 * @param context - Auth context
 * @param roles - Roles to check
 * @returns True if user has all roles
 */
export function hasAllRoles(context: AuthContext, ...roles: string[]): boolean {
  return roles.every((role) => context.roles.includes(role));
}

/**
 * Parses a JWT token payload (without verification)
 * @param token - JWT token string
 * @returns Parsed token payload
 * @example parseTokenPayload('eyJ...') // { sub: '123', roles: ['admin'], ... }
 */
export function parseTokenPayload(token: string): TokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload as TokenPayload;
  } catch {
    return null;
  }
}

/**
 * Checks if a token is expired
 * @param token - JWT token string
 * @param bufferSeconds - Buffer time in seconds (default: 60)
 * @returns True if token is expired or about to expire
 */
export function isTokenExpired(token: string, bufferSeconds = 60): boolean {
  const payload = parseTokenPayload(token);
  if (!payload) return true;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now + bufferSeconds;
}

/**
 * Gets the remaining time until token expires
 * @param token - JWT token string
 * @returns Seconds until expiration, or 0 if expired
 */
export function getTokenExpiry(token: string): number {
  const payload = parseTokenPayload(token);
  if (!payload) return 0;
  const now = Math.floor(Date.now() / 1000);
  return Math.max(0, payload.exp - now);
}

/**
 * Creates a role-based access control checker
 * @param roles - Available roles configuration
 * @returns RBAC checker function
 */
export function createRBAC(roles: Record<string, Role>) {
  return {
    canAccess: (userRoles: string[], resource: string, action: 'read' | 'write' | 'delete' | 'create'): boolean => {
      for (const roleName of userRoles) {
        const role = roles[roleName];
        if (role) {
          const perm = role.permissions.find((p) => p.resource === resource);
          if (perm && perm.actions.includes(action)) return true;
        }
      }
      return false;
    },
    getPermissions: (userRoles: string[]): Permission[] => {
      const perms = new Map<string, Set<string>>();
      for (const roleName of userRoles) {
        const role = roles[roleName];
        if (role) {
          for (const p of role.permissions) {
            if (!perms.has(p.resource)) perms.set(p.resource, new Set());
            for (const action of p.actions) {
              perms.get(p.resource)!.add(action);
            }
          }
        }
      }
      return Array.from(perms.entries()).map(([resource, actions]) => ({
        resource,
        actions: Array.from(actions) as Permission['actions'],
      }));
    },
  };
}

/**
 * Generates a secure random token
 * @param length - Token length in bytes (default: 32)
 * @returns Hex-encoded token string
 */
export function generateToken(length = 32): string {
  const bytes = new Uint8Array(length);
  if (typeof crypto !== 'undefined') {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
`,
    'auth.test.ts': `import { describe, it, expect } from 'vitest'
import {
  hasPermission, hasRole, hasAllRoles, parseTokenPayload,
  isTokenExpired, createRBAC, generateToken,
} from './index'

describe('Auth Module', () => {
  const context = {
    userId: '123',
    roles: ['admin', 'editor'],
    permissions: [
      { resource: 'posts', actions: ['read', 'write', 'delete'] as const },
      { resource: 'users', actions: ['read'] as const },
    ],
  }

  describe('hasPermission', () => {
    it('returns true for valid permission', () => {
      expect(hasPermission(context, 'posts', 'write')).toBe(true)
    })
    it('returns false for invalid permission', () => {
      expect(hasPermission(context, 'users', 'write')).toBe(false)
    })
  })

  describe('hasRole', () => {
    it('returns true if user has role', () => {
      expect(hasRole(context, 'admin')).toBe(true)
    })
    it('returns false if user lacks role', () => {
      expect(hasRole(context, 'superadmin')).toBe(false)
    })
  })

  describe('hasAllRoles', () => {
    it('returns true if user has all roles', () => {
      expect(hasAllRoles(context, 'admin', 'editor')).toBe(true)
    })
    it('returns false if user lacks any role', () => {
      expect(hasAllRoles(context, 'admin', 'superadmin')).toBe(false)
    })
  })

  describe('parseTokenPayload', () => {
    it('parses valid JWT payload', () => {
      const payload = btoa(JSON.stringify({ sub: '123', roles: ['admin'], exp: 9999999999, iat: 0 }))
      const token = \`header.\${payload}.signature\`
      const result = parseTokenPayload(token)
      expect(result?.sub).toBe('123')
    })
    it('returns null for invalid token', () => {
      expect(parseTokenPayload('invalid')).toBeNull()
    })
  })

  describe('createRBAC', () => {
    it('checks role-based access', () => {
      const rbac = createRBAC({
        admin: { name: 'admin', permissions: [{ resource: 'posts', actions: ['read', 'write', 'delete'] }] },
      })
      expect(rbac.canAccess(['admin'], 'posts', 'write')).toBe(true)
      expect(rbac.canAccess(['admin'], 'users', 'write')).toBe(false)
    })
  })

  describe('generateToken', () => {
    it('generates hex token of correct length', () => {
      const token = generateToken(16)
      expect(token).toHaveLength(32)
    })
  })
})
`,
  };
}