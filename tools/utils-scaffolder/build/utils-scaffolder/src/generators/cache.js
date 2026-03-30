// ============================================================================
// CACHE MODULE GENERATOR
// ============================================================================
export function generateCacheModule() {
    return {
        'index.ts': `// ============================================================================
// CACHE MODULE - LRU cache, TTL cache, and memoization
// ============================================================================

export interface CacheOptions {
  maxSize?: number;
  ttl?: number; // Time to live in milliseconds
}

/**
 * Creates an LRU (Least Recently Used) cache
 * @param options - Cache options
 * @returns LRU cache instance
 * @example const cache = createLRUCache({ maxSize: 100 })
 */
export function createLRUCache<K, V>(options: CacheOptions = {}) {
  const { maxSize = 100, ttl } = options;
  const cache = new Map<K, { value: V; expires: number | null }>();

  function get(key: K): V | undefined {
    const entry = cache.get(key);
    if (!entry) return undefined;

    if (entry.expires && Date.now() > entry.expires) {
      cache.delete(key);
      return undefined;
    }

    // Move to end (most recently used)
    cache.delete(key);
    cache.set(key, entry);
    return entry.value;
  }

  function set(key: K, value: V, customTtl?: number): void {
    // Remove if exists (to update position)
    if (cache.has(key)) {
      cache.delete(key);
    }

    // Evict oldest if at capacity
    if (cache.size >= maxSize) {
      const firstKey = cache.keys().next().value;
      if (firstKey !== undefined) {
        cache.delete(firstKey);
      }
    }

    const expires = (customTtl ?? ttl) ? Date.now() + (customTtl ?? ttl!) : null;
    cache.set(key, { value, expires });
  }

  function has(key: K): boolean {
    const entry = cache.get(key);
    if (!entry) return false;
    if (entry.expires && Date.now() > entry.expires) {
      cache.delete(key);
      return false;
    }
    return true;
  }

  function remove(key: K): boolean {
    return cache.delete(key);
  }

  function clear(): void {
    cache.clear();
  }

  function size(): number {
    return cache.size;
  }

  function keys(): K[] {
    return Array.from(cache.keys());
  }

  function values(): V[] {
    return Array.from(cache.values()).map((e) => e.value);
  }

  return { get, set, has, remove, clear, size, keys, values };
}

/**
 * Creates a TTL (Time To Live) cache with automatic expiration
 * @param defaultTtl - Default TTL in milliseconds
 * @returns TTL cache instance
 * @example const cache = createTTLCache(5000) // 5 second TTL
 */
export function createTTLCache<V>(defaultTtl: number) {
  const cache = new Map<string, { value: V; expires: number }>();
  let cleanupInterval: ReturnType<typeof setInterval> | null = null;

  function startCleanup(intervalMs: number): void {
    if (cleanupInterval) return;
    cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of cache) {
        if (now > entry.expires) {
          cache.delete(key);
        }
      }
    }, intervalMs);
  }

  function stopCleanup(): void {
    if (cleanupInterval) {
      clearInterval(cleanupInterval);
      cleanupInterval = null;
    }
  }

  function get(key: string): V | undefined {
    const entry = cache.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expires) {
      cache.delete(key);
      return undefined;
    }
    return entry.value;
  }

  function set(key: string, value: V, customTtl?: number): void {
    cache.set(key, {
      value,
      expires: Date.now() + (customTtl ?? defaultTtl),
    });
  }

  function has(key: string): boolean {
    return get(key) !== undefined;
  }

  function remove(key: string): boolean {
    return cache.delete(key);
  }

  function clear(): void {
    cache.clear();
  }

  function size(): number {
    // Clean expired entries first
    const now = Date.now();
    for (const [key, entry] of cache) {
      if (now > entry.expires) cache.delete(key);
    }
    return cache.size;
  }

  return { get, set, has, remove, clear, size, startCleanup, stopCleanup };
}

/**
 * Creates a keyed cache for memoizing function results by key
 * @param fn - Function to memoize
 * @param keyFn - Function to generate cache key
 * @param options - Cache options
 * @returns Memoized function with cache
 * @example const cached = createKeyedCache(fetchUser, (id) => \`user:\${id}\`)
 */
export function createKeyedCache<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  keyFn: (...args: TArgs) => string,
  options: CacheOptions = {}
) {
  const cache = createLRUCache<string, TResult>(options);

  return {
    get: async (...args: TArgs): Promise<TResult> => {
      const key = keyFn(...args);
      const cached = cache.get(key);
      if (cached !== undefined) return cached;

      const result = await fn(...args);
      cache.set(key, result);
      return result;
    },
    invalidate: (...args: TArgs): boolean => {
      return cache.remove(keyFn(...args));
    },
    invalidateAll: (): void => {
      cache.clear();
    },
    size: () => cache.size(),
  };
}

/**
 * Creates a cache that wraps an async loader function
 * @param loader - Async function to load data
 * @param options - Cache options
 * @returns Cached loader
 * @example const userCache = createCachedLoader((id) => fetchUser(id), { ttl: 60000 })
 */
export function createCachedLoader<K, V>(
  loader: (key: K) => Promise<V>,
  options: CacheOptions = {}
) {
  const cache = createLRUCache<K, V>(options);
  const pending = new Map<K, Promise<V>>();

  async function load(key: K): Promise<V> {
    const cached = cache.get(key);
    if (cached !== undefined) return cached;

    // Deduplicate concurrent requests
    if (pending.has(key)) {
      return pending.get(key)!;
    }

    const promise = loader(key)
      .then((value) => {
        cache.set(key, value);
        pending.delete(key);
        return value;
      })
      .catch((error) => {
        pending.delete(key);
        throw error;
      });

    pending.set(key, promise);
    return promise;
  }

  return {
    load,
    get: (key: K) => cache.get(key),
    invalidate: (key: K) => cache.remove(key),
    clear: () => {
      cache.clear();
      pending.clear();
    },
  };
}
`,
        'cache.test.ts': `import { describe, it, expect } from 'vitest'
import { createLRUCache, createTTLCache, createKeyedCache } from './index'

describe('Cache Module', () => {
  describe('createLRUCache', () => {
    it('stores and retrieves values', () => {
      const cache = createLRUCache<string, number>()
      cache.set('a', 1)
      expect(cache.get('a')).toBe(1)
    })

    it('evicts oldest when max size reached', () => {
      const cache = createLRUCache<string, number>({ maxSize: 2 })
      cache.set('a', 1)
      cache.set('b', 2)
      cache.set('c', 3)
      expect(cache.get('a')).toBeUndefined()
      expect(cache.get('b')).toBe(2)
      expect(cache.get('c')).toBe(3)
    })

    it('returns undefined for missing key', () => {
      const cache = createLRUCache<string, number>()
      expect(cache.get('missing')).toBeUndefined()
    })

    it('checks existence with has()', () => {
      const cache = createLRUCache<string, number>()
      cache.set('a', 1)
      expect(cache.has('a')).toBe(true)
      expect(cache.has('b')).toBe(false)
    })

    it('removes entries', () => {
      const cache = createLRUCache<string, number>()
      cache.set('a', 1)
      cache.remove('a')
      expect(cache.has('a')).toBe(false)
    })

    it('clears all entries', () => {
      const cache = createLRUCache<string, number>()
      cache.set('a', 1)
      cache.set('b', 2)
      cache.clear()
      expect(cache.size()).toBe(0)
    })
  })

  describe('createTTLCache', () => {
    it('stores and retrieves values', () => {
      const cache = createTTLCache<number>(5000)
      cache.set('a', 1)
      expect(cache.get('a')).toBe(1)
    })

    it('expires values after TTL', async () => {
      const cache = createTTLCache<number>(10)
      cache.set('a', 1)
      await new Promise((r) => setTimeout(r, 20))
      expect(cache.get('a')).toBeUndefined()
    })
  })

  describe('createKeyedCache', () => {
    it('caches function results', async () => {
      let calls = 0
      const fn = async (id: number) => { calls++; return id * 2 }
      const cached = createKeyedCache(fn, (id) => String(id))
      expect(await cached.get(1)).toBe(2)
      expect(await cached.get(1)).toBe(2)
      expect(calls).toBe(1)
    })
  })
})
`,
    };
}
//# sourceMappingURL=cache.js.map