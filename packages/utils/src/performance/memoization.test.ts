import { describe, it, expect, vi } from 'vitest';
import { memoize, memoizeAsync } from './memoization';

describe('memoize', () => {
  it('returns cached result for same args', () => {
    const fn = vi.fn((a: number, b: number) => a + b);
    const memoized = memoize(fn);
    expect(memoized(1, 2)).toBe(3);
    expect(memoized(1, 2)).toBe(3);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('caches different args separately', () => {
    const fn = vi.fn((x: number) => x * 2);
    const memoized = memoize(fn);
    expect(memoized(1)).toBe(2);
    expect(memoized(2)).toBe(4);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('evicts oldest when exceeding maxSize', () => {
    const fn = vi.fn((x: number) => x);
    const memoized = memoize(fn, { maxSize: 2 });
    memoized(1);
    memoized(2);
    memoized(3);
    memoized(1); // Should re-execute since evicted
    expect(fn).toHaveBeenCalledTimes(4);
  });

  it('supports custom key function', () => {
    const fn = vi.fn((obj: { id: number }) => obj.id * 2);
    const memoized = memoize(fn, { keyFn: (obj) => String(obj.id) });
    expect(memoized({ id: 5 })).toBe(10);
    expect(memoized({ id: 5 })).toBe(10);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe('memoizeAsync', () => {
  it('returns cached result for same args', async () => {
    const fn = vi.fn(async (x: number) => x * 2);
    const memoized = memoizeAsync(fn, { ttl: 60000 });
    expect(await memoized(5)).toBe(10);
    expect(await memoized(5)).toBe(10);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('refetches after TTL expires', async () => {
    const fn = vi.fn(async (x: number) => x);
    const memoized = memoizeAsync(fn, { ttl: 0 });
    await memoized(1);
    await memoized(1);
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
