import type { StorageConfig, TypedStorage } from './types';

function getStorageEngine(type: 'local' | 'session'): Storage {
  if (typeof window === 'undefined') {
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      key: () => null,
      length: 0,
    };
  }
  return type === 'session' ? window.sessionStorage : window.localStorage;
}

export function createStorage<T>(config: StorageConfig<T>): TypedStorage<T> {
  const {
    key,
    storage: storageType = 'local',
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    defaultValue,
  } = config;

  if (!key?.trim()) {
    throw new Error('Storage key is required');
  }

  const engine = getStorageEngine(storageType);

  return {
    get(): T | undefined {
      try {
        const raw = engine.getItem(key);
        if (raw === null) return defaultValue;
        return deserialize(raw);
      } catch (error) {
        console.warn(`Failed to get storage key "${key}":`, error);
        return defaultValue;
      }
    },

    set(value: T): void {
      try {
        engine.setItem(key, serialize(value));
      } catch (error) {
        console.warn(`Failed to set storage key "${key}":`, error);
      }
    },

    remove(): void {
      try {
        engine.removeItem(key);
      } catch (error) {
        console.warn(`Failed to remove storage key "${key}":`, error);
      }
    },

    clear(): void {
      try {
        engine.removeItem(key);
      } catch (error) {
        console.warn(`Failed to clear storage key "${key}":`, error);
      }
    },
  };
}

export function createSessionStorage<T>(config: Omit<StorageConfig<T>, 'storage'>): TypedStorage<T> {
  if (!config?.key?.trim()) {
    throw new Error('Storage key is required');
  }
  return createStorage({ ...config, storage: 'session' });
}
