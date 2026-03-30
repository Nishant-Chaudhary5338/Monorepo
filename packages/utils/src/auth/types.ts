export interface TokenManagerConfig {
  storageKey?: string;
  refreshEndpoint?: string;
  onTokenExpired?: () => void;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
}

export interface RBACConfig {
  roles: Record<string, string[]>;
}

export interface AuthGuardConfig {
  redirectTo?: string;
  roles?: string[];
  permissions?: string[];
}

export interface SSOProviderConfig {
  provider: 'google' | 'github' | 'microsoft' | 'custom';
  clientId: string;
  redirectUri: string;
  scopes?: string[];
  authorizationUrl?: string;
  tokenUrl?: string;
}

export interface SessionConfig {
  timeoutMs?: number;
  onTimeout?: () => void;
  onActivity?: () => void;
}

export interface PasswordPolicyConfig {
  minLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumber?: boolean;
  requireSpecial?: boolean;
  maxLength?: number;
}
