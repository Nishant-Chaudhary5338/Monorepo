import { createMemoryCache, type MemoryCacheOptions } from './memory-cache';

export interface CacheAsideConfig extends MemoryCacheOptions {
  fetcher: <T>(key: string) => Promise<T>;
}

export function createCacheAside<T = unknown>(config: CacheAsideConfig) {
  const { fetcher, ...cacheOptions } = config;
  const cache = createMemoryCache<T>(cacheOptions);

  async function get(key: string): Promise<T> {
    const cached = cache.get(key);
    if (cached !== undefined) return cached;
    const value = await fetcher<T>(key);
    cache.set(key, value);
    return value;
  }

  function invalidate(key: string): void {
    cache.delete(key);
  }

  function invalidateAll(): void {
    cache.clear();
  }

  return { get, invalidate, invalidateAll, cache };
}

export interface MemoizeOptions extends MemoryCacheOptions {
  keyFn?: (...args: any[]) => string;
}

export function memoizeWithCache<TArgs extends any[], TResult>(
  fn: (...args: TArgs) => TResult,
  options: MemoizeOptions = {}
): (...args: TArgs) => TResult {
  const { keyFn = (...args) => JSON.stringify(args), ...cacheOptions } = options;
  const cache = createMemoryCache<TResult>(cacheOptions);

  return (...args: TArgs): TResult => {
    const key = keyFn(...args);
    const cached = cache.get(key);
    if (cached !== undefined) return cached;
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}
