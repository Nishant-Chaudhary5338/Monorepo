import type { EncryptedStorageConfig, AsyncTypedStorage } from './types';

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12;
const SALT_LENGTH = 16;
const ITERATIONS = 100000;

async function deriveKey(secret: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
}

async function encrypt(text: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const key = await deriveKey(secret, salt);

  const encrypted = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    encoder.encode(text)
  );

  const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(encrypted), salt.length + iv.length);

  return btoa(Array.from(combined, (byte) => String.fromCharCode(byte)).join(''));
}

async function decrypt(encoded: string, secret: string): Promise<string> {
  const decoder = new TextDecoder();
  const combined = new Uint8Array(
    Array.from(atob(encoded), (c) => c.charCodeAt(0))
  );

  const salt = combined.slice(0, SALT_LENGTH);
  const iv = combined.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const data = combined.slice(SALT_LENGTH + IV_LENGTH);

  const key = await deriveKey(secret, salt);

  const decrypted = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv },
    key,
    data
  );

  return decoder.decode(decrypted);
}

export function createEncryptedStorage(config: EncryptedStorageConfig): AsyncTypedStorage<string> {
  const { key, secret } = config;

  return {
    async get(): Promise<string | undefined> {
      try {
        if (typeof window === 'undefined' || typeof crypto === 'undefined') return undefined;
        const raw = window.localStorage.getItem(key);
        if (raw === null) return undefined;
        return await decrypt(raw, secret);
      } catch {
        return undefined;
      }
    },

    async set(value: string): Promise<void> {
      try {
        if (typeof window === 'undefined' || typeof crypto === 'undefined') return;
        const encrypted = await encrypt(value, secret);
        window.localStorage.setItem(key, encrypted);
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
