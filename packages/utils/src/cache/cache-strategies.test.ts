import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createCacheAside, memoizeWithCache } from './cache-strategies';

describe('createCacheAside', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });
  it('fetches and caches value', async () => {
    const fetcher = vi.fn(async (key: string) => `value-${key}`);
    const cache = createCacheAside({ fetcher, ttl: 10000 });
    const result = await cache.get('test');
    expect(result).toBe('value-test');
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it('returns cached value without refetching', async () => {
    const fetcher = vi.fn(async (key: string) => `value-${key}`);
    const cache = createCacheAside({ fetcher, ttl: 10000 });
    await cache.get('test');
    await cache.get('test');
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it('refetches after invalidation', async () => {
    const fetcher = vi.fn(async (key: string) => `value-${key}`);
    const cache = createCacheAside({ fetcher, ttl: 10000 });
    await cache.get('test');
    cache.invalidate('test');
    await cache.get('test');
    expect(fetcher).toHaveBeenCalledTimes(2);
  });
  it('clears all cached values', async () => {
    const fetcher = vi.fn(async (key: string) => `value-${key}`);
    const cache = createCacheAside({ fetcher, ttl: 10000 });
    await cache.get('a');
    await cache.get('b');
    cache.invalidateAll();
    await cache.get('a');
    await cache.get('b');
    expect(fetcher).toHaveBeenCalledTimes(4);
  });
});

describe('memoizeWithCache', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });
  it('caches function results', () => {
    const fn = vi.fn((a: number, b: number) => a + b);
    const memoized = memoizeWithCache(fn, { ttl: 10000 });
    expect(memoized(1, 2)).toBe(3);
    expect(memoized(1, 2)).toBe(3);
    expect(fn).toHaveBeenCalledTimes(1);
  });
  it('uses custom key function', () => {
    const fn = vi.fn((x: { id: number }) => x.id * 2);
    const memoized = memoizeWithCache(fn, {
      keyFn: (x) => String(x.id),
      ttl: 10000,
    });
    expect(memoized({ id: 5 })).toBe(10);
    expect(memoized({ id: 5 })).toBe(10);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
