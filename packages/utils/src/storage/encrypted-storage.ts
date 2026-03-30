import type { EncryptedStorageConfig, TypedStorage } from './types';

function simpleEncrypt(text: string, secret: string): string {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(
      text.charCodeAt(i) ^ secret.charCodeAt(i % secret.length)
    );
  }
  return btoa(result);
}

function simpleDecrypt(encoded: string, secret: string): string {
  const text = atob(encoded);
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(
      text.charCodeAt(i) ^ secret.charCodeAt(i % secret.length)
    );
  }
  return result;
}

export function createEncryptedStorage(config: EncryptedStorageConfig): TypedStorage<string> {
  const { key, secret } = config;

  return {
    get(): string | undefined {
      try {
        if (typeof window === 'undefined') return undefined;
        const raw = window.localStorage.getItem(key);
        if (raw === null) return undefined;
        return simpleDecrypt(raw, secret);
      } catch {
        return undefined;
      }
    },

    set(value: string): void {
      try {
        if (typeof window === 'undefined') return;
        window.localStorage.setItem(key, simpleEncrypt(value, secret));
      } catch {
        // Storage full or unavailable
      }
    },

    remove(): void {
      if (typeof window === 'undefined') return;
      window.localStorage.removeItem(key);
    },

    clear(): void {
      if (typeof window === 'undefined') return;
      window.localStorage.removeItem(key);
    },
  };
}
