interface CacheEntry<T> {
  value: T;
  expiry: number;
  hits: number;
  createdAt: number;
}

export interface MemoryCacheOptions {
  maxSize?: number;
  ttl?: number; // ms
}

export interface CacheStats {
  size: number;
  maxSize: number;
  hits: number;
  misses: number;
  evictions: number;
}

export interface MemoryCache<T = unknown> {
  get: (key: string) => T | undefined;
  set: (key: string, value: T, ttl?: number) => void;
  has: (key: string) => boolean;
  peek: (key: string) => T | undefined;
  delete: (key: string) => boolean;
  clear: () => void;
  size: () => number;
  keys: () => string[];
  stats: () => CacheStats;
}

export function createMemoryCache<T = unknown>(options: MemoryCacheOptions = {}): MemoryCache<T> {
  const { maxSize = 100, ttl = 60000 } = options;
  const cache = new Map<string, CacheEntry<T>>();
  let hits = 0;
  let misses = 0;
  let evictions = 0;

  function isExpired(entry: CacheEntry<T>): boolean {
    return entry.expiry > 0 && Date.now() > entry.expiry;
  }

  function evict(): void {
    if (cache.size <= maxSize) return;
    // LRU: evict least-hit, oldest entry
    let oldest: string | null = null;
    let oldestHits = Infinity;
    let oldestTime = Infinity;
    Array.from(cache.entries()).forEach(([key, entry]) => {
      if (entry.hits < oldestHits || (entry.hits === oldestHits && entry.createdAt < oldestTime)) {
        oldest = key;
        oldestHits = entry.hits;
        oldestTime = entry.createdAt;
      }
    });
    if (oldest) cache.delete(oldest);
  }

  return {
    get(key: string): T | undefined {
      const entry = cache.get(key);
      if (!entry) {
        misses++;
        return undefined;
      }
      if (isExpired(entry)) {
        cache.delete(key);
        misses++;
        return undefined;
      }
      entry.hits++;
      hits++;
      return entry.value;
    },

    set(key: string, value: T, ttlOverride?: number): void {
      if (cache.has(key)) cache.delete(key);
      evict();
      const now = Date.now();
      cache.set(key, {
        value,
        expiry: ttlOverride ? now + ttlOverride : ttl > 0 ? now + ttl : 0,
        hits: 0,
        createdAt: now,
      });
    },

    peek(key: string): T | undefined {
      const entry = cache.get(key);
      if (!entry) return undefined;
      if (isExpired(entry)) {
        cache.delete(key);
        return undefined;
      }
      return entry.value;
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
      return Array.from(cache.keys());
    },

    stats(): CacheStats {
      return {
        size: cache.size,
        maxSize,
        hits,
        misses,
        evictions,
      };
    },
  };
}
