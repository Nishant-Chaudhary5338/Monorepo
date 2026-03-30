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

  const engine = getStorageEngine(storageType);

  return {
    get(): T | undefined {
      try {
        const raw = engine.getItem(key);
        if (raw === null) return defaultValue;
        return deserialize(raw);
      } catch {
        return defaultValue;
      }
    },

    set(value: T): void {
      try {
        engine.setItem(key, serialize(value));
      } catch {
        // Storage full or unavailable
      }
    },

    remove(): void {
      engine.removeItem(key);
    },

    clear(): void {
      engine.removeItem(key);
    },
  };
}

export function createSessionStorage<T>(config: Omit<StorageConfig<T>, 'storage'>): TypedStorage<T> {
  return createStorage({ ...config, storage: 'session' });
}
