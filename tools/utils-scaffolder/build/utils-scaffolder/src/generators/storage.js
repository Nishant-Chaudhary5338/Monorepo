// ============================================================================
// STORAGE MODULE GENERATOR
// ============================================================================
export function generateStorageModule() {
    return {
        'index.ts': `// ============================================================================
// STORAGE MODULE - Local/session storage with types and expiry
// ============================================================================

export interface StorageOptions {
  expiry?: number; // TTL in milliseconds
  prefix?: string;
}

export interface StorageItem<T = unknown> {
  value: T;
  expires: number | null;
}

/**
 * Creates a typed storage wrapper
 * @param storage - localStorage or sessionStorage
 * @param options - Default options
 * @returns Typed storage interface
 * @example const storage = createStorage(localStorage, { prefix: 'app_' })
 */
export function createStorage<T = unknown>(storage: Storage, options: StorageOptions = {}) {
  const { prefix = '' } = options;

  function getKey(key: string): string {
    return \`\${prefix}\${key}\`;
  }

  return {
    get: (key: string): T | null => {
      try {
        const item = storage.getItem(getKey(key));
        if (!item) return null;
        const parsed: StorageItem<T> = JSON.parse(item);
        if (parsed.expires && Date.now() > parsed.expires) {
          storage.removeItem(getKey(key));
          return null;
        }
        return parsed.value;
      } catch {
        return null;
      }
    },

    set: (key: string, value: T, ttl?: number): void => {
      try {
        const item: StorageItem<T> = {
          value,
          expires: ttl ? Date.now() + ttl : null,
        };
        storage.setItem(getKey(key), JSON.stringify(item));
      } catch {}
    },

    remove: (key: string): void => {
      storage.removeItem(getKey(key));
    },

    clear: (): void => {
      if (prefix) {
        const keys = Object.keys(storage).filter((k) => k.startsWith(prefix));
        keys.forEach((k) => storage.removeItem(k));
      } else {
        storage.clear();
      }
    },

    has: (key: string): boolean => {
      const item = storage.getItem(getKey(key));
      if (!item) return false;
      try {
        const parsed: StorageItem<T> = JSON.parse(item);
        if (parsed.expires && Date.now() > parsed.expires) {
          storage.removeItem(getKey(key));
          return false;
        }
        return true;
      } catch {
        return false;
      }
    },

    keys: (): string[] => {
      const result: string[] = [];
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key && key.startsWith(prefix)) {
          result.push(key.slice(prefix.length));
        }
      }
      return result;
    },
  };
}

/**
 * Creates a namespaced storage that isolates keys
 * @param storage - Base storage interface
 * @param namespace - Namespace string
 * @returns Namespaced storage
 * @example const userStorage = namespaceStorage(storage, 'user')
 */
export function namespaceStorage<T = unknown>(
  storage: ReturnType<typeof createStorage<T>>,
  namespace: string
) {
  const prefix = \`\${namespace}:\`;

  return {
    get: (key: string) => storage.get(\`\${prefix}\${key}\`),
    set: (key: string, value: T, ttl?: number) => storage.set(\`\${prefix}\${key}\`, value, ttl),
    remove: (key: string) => storage.remove(\`\${prefix}\${key}\`),
    clear: () => {
      const allKeys = storage.keys();
      allKeys.filter((k) => k.startsWith(prefix)).forEach((k) => storage.remove(k));
    },
    has: (key: string) => storage.has(\`\${prefix}\${key}\`),
  };
}

/**
 * Serializes a value to JSON string
 * @param value - Value to serialize
 * @returns JSON string
 */
export function serialize<T>(value: T): string {
  return JSON.stringify(value);
}

/**
 * Deserializes a JSON string to a value
 * @param json - JSON string
 * @param defaultValue - Default value if parsing fails
 * @returns Parsed value or default
 */
export function deserialize<T>(json: string | null, defaultValue: T): T {
  if (!json) return defaultValue;
  try {
    return JSON.parse(json) as T;
  } catch {
    return defaultValue;
  }
}

/**
 * Checks if storage is available
 * @param type - Storage type
 * @returns True if storage is available
 * @example isStorageAvailable('localStorage') // true
 */
export function isStorageAvailable(type: 'localStorage' | 'sessionStorage'): boolean {
  try {
    const storage = window[type];
    const testKey = '__storage_test__';
    storage.setItem(testKey, testKey);
    storage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Gets storage usage in bytes
 * @param storage - Storage object
 * @returns Approximate size in bytes
 */
export function getStorageSize(storage: Storage): number {
  let total = 0;
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (key) {
      const value = storage.getItem(key) || '';
      total += key.length + value.length;
    }
  }
  return total * 2; // UTF-16 encoding
}
`,
        'storage.test.ts': `import { describe, it, expect, beforeEach } from 'vitest'
import { serialize, deserialize, getStorageSize, isStorageAvailable } from './index'

describe('Storage Module', () => {
  describe('serialize', () => {
    it('serializes objects to JSON', () => {
      expect(serialize({ a: 1 })).toBe('{"a":1}')
    })
    it('serializes arrays', () => {
      expect(serialize([1, 2, 3])).toBe('[1,2,3]')
    })
  })

  describe('deserialize', () => {
    it('deserializes JSON to objects', () => {
      expect(deserialize('{"a":1}', {})).toEqual({ a: 1 })
    })
    it('returns default for invalid JSON', () => {
      expect(deserialize('invalid', { default: true })).toEqual({ default: true })
    })
    it('returns default for null', () => {
      expect(deserialize(null, 'default')).toBe('default')
    })
  })

  describe('isStorageAvailable', () => {
    it('returns boolean', () => {
      const result = isStorageAvailable('localStorage')
      expect(typeof result).toBe('boolean')
    })
  })
})
`,
    };
}
//# sourceMappingURL=storage.js.map