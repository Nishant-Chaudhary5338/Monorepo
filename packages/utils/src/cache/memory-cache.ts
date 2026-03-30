interface CacheEntry<T> {
  value: T;
  expiry: number;
  hits: number;
}

export interface MemoryCacheOptions {
  maxSize?: number;
  ttl?: number; // ms
}

export interface MemoryCache<T = unknown> {
  get: (key: string) => T | undefined;
  set: (key: string, value: T, ttl?: number) => void;
  has: (key: string) => boolean;
  delete: (key: string) => boolean;
  clear: () => void;
  size: () => number;
  keys: () => string[];
}

export function createMemoryCache<T = unknown>(options: MemoryCacheOptions = {}): MemoryCache<T> {
  const { maxSize = 100, ttl = 60000 } = options;
  const cache = new Map<string, CacheEntry<T>>();

  function isExpired(entry: CacheEntry<T>): boolean {
    return entry.expiry > 0 && Date.now() > entry.expiry;
  }

  function evict(): void {
    if (cache.size <= maxSize) return;
    // LRU: evict least-hit, oldest entry
    let oldest: string | null = null;
    let oldestHits = Infinity;
    let oldestTime = Infinity;
    for (const [key, entry] of cache) {
      if (entry.hits < oldestHits || (entry.hits === oldestHits && entry.expiry < oldestTime)) {
        oldest = key;
        oldestHits = entry.hits;
        oldestTime = entry.expiry;
      }
    }
    if (oldest) cache.delete(oldest);
  }

  return {
    get(key: string): T | undefined {
      const entry = cache.get(key);
      if (!entry) return undefined;
      if (isExpired(entry)) {
        cache.delete(key);
        return undefined;
      }
      entry.hits++;
      return entry.value;
    },

    set(key: string, value: T, ttlOverride?: number): void {
      if (cache.has(key)) cache.delete(key);
      evict();
      cache.set(key, {
        value,
        expiry: ttlOverride ? Date.now() + ttlOverride : ttl > 0 ? Date.now() + ttl : 0,
        hits: 0,
      });
    },

    has(key: string): boolean {
      const entry = cache.get(key);
      if (!entry) return false;
      if (isExpired(entry)) {
        cache.delete(key);
        return false;
      }
      return true;
    },

    delete(key: string): boolean {
      return cache.delete(key);
    },

    clear(): void {
      cache.clear();
    },

    size(): number {
      return cache.size;
    },

    keys(): string[] {
      return [...cache.keys()];
    },
  };
}
