import { createStorage } from '../storage/local-storage';
import type { TokenManagerConfig, TokenPair } from './types';

export function createTokenManager(config: TokenManagerConfig = {}) {
  const { storageKey = 'auth_tokens', refreshEndpoint, onTokenExpired } = config;

  const storage = createStorage<TokenPair | null>({ key: storageKey, defaultValue: null });
  let refreshTimer: ReturnType<typeof setTimeout> | null = null;

  function getTokens(): TokenPair | null {
    return storage.get() ?? null;
  }

  async function setTokens(tokens: TokenPair): Promise<void> {
    storage.set(tokens);
    scheduleRefresh(tokens);
  }

  function getAccessToken(): string | null {
    return getTokens()?.accessToken ?? null;
  }

  function getRefreshToken(): string | null {
    return getTokens()?.refreshToken ?? null;
  }

  async function refreshTokens(): Promise<TokenPair | null> {
    if (!refreshEndpoint) return null;
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      onTokenExpired?.();
      return null;
    }
    try {
      const response = await fetch(refreshEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      if (!response.ok) {
        onTokenExpired?.();
        return null;
      }
      const tokens: TokenPair = await response.json();
      await setTokens(tokens);
      return tokens;
    } catch {
      onTokenExpired?.();
      return null;
    }
  }

  function scheduleRefresh(tokens: TokenPair): void {
    if (refreshTimer) clearTimeout(refreshTimer);
    if (tokens.expiresIn && refreshEndpoint) {
      const refreshAt = (tokens.expiresIn - 60) * 1000; // 1 min before expiry
      if (refreshAt > 0) {
        refreshTimer = setTimeout(() => refreshTokens(), refreshAt);
      }
    }
  }

  function clearTokens(): void {
    storage.remove();
    if (refreshTimer) clearTimeout(refreshTimer);
  }

  return { getTokens, setTokens, getAccessToken, getRefreshToken, refreshTokens, clearTokens };
}

export function createPasswordPolicy(config: import('./types').PasswordPolicyConfig = {}) {
  const {
    minLength = 8,
    maxLength = 128,
    requireUppercase = true,
    requireLowercase = true,
    requireNumber = true,
    requireSpecial = true,
  } = config;

  function validate(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (password.length < minLength) errors.push(`Minimum ${minLength} characters`);
    if (password.length > maxLength) errors.push(`Maximum ${maxLength} characters`);
    if (requireUppercase && !/[A-Z]/.test(password)) errors.push('Requires uppercase letter');
    if (requireLowercase && !/[a-z]/.test(password)) errors.push('Requires lowercase letter');
    if (requireNumber && !/\d/.test(password)) errors.push('Requires number');
    if (requireSpecial && !/[!@#$%^&*(),.?\":{}|<>]/.test(password)) errors.push('Requires special character');
    return { valid: errors.length === 0, errors };
  }

  function strength(password: string): number {
    let score = 0;
    if (password.length >= minLength) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*(),.?\":{}|<>]/.test(password)) score++;
    return Math.min(score, 5);
  }

  return { validate, strength };
}
