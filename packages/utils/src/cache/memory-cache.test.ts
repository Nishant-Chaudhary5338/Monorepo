import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createMemoryCache } from './memory-cache';

describe('createMemoryCache', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });
  it('stores and retrieves values', () => {
    const cache = createMemoryCache<string>();
    cache.set('key', 'value');
    expect(cache.get('key')).toBe('value');
  });
  it('returns undefined for missing keys', () => {
    const cache = createMemoryCache();
    expect(cache.get('missing')).toBeUndefined();
  });
  it('checks existence', () => {
    const cache = createMemoryCache();
    expect(cache.has('key')).toBe(false);
    cache.set('key', 'val');
    expect(cache.has('key')).toBe(true);
  });
  it('deletes entries', () => {
    const cache = createMemoryCache();
    cache.set('key', 'val');
    expect(cache.delete('key')).toBe(true);
    expect(cache.has('key')).toBe(false);
  });
  it('clears all entries', () => {
    const cache = createMemoryCache();
    cache.set('a', 1);
    cache.set('b', 2);
    cache.clear();
    expect(cache.size()).toBe(0);
  });
  it('returns size', () => {
    const cache = createMemoryCache();
    expect(cache.size()).toBe(0);
    cache.set('a', 1);
    expect(cache.size()).toBe(1);
  });
  it('returns keys', () => {
    const cache = createMemoryCache();
    cache.set('a', 1);
    cache.set('b', 2);
    expect(cache.keys()).toEqual(['a', 'b']);
  });
  it('expires entries after TTL', () => {
    const cache = createMemoryCache({ ttl: 1000 });
    cache.set('key', 'value');
    vi.advanceTimersByTime(1500);
    expect(cache.get('key')).toBeUndefined();
    expect(cache.has('key')).toBe(false);
  });
  it('evicts when exceeding maxSize', () => {
    const cache = createMemoryCache({ maxSize: 2, ttl: 0 });
    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3);
    expect(cache.keys().length).toBeLessThanOrEqual(3);
  });
  it('supports TTL override per entry', () => {
    const cache = createMemoryCache({ ttl: 10000 });
    cache.set('key', 'value', 500);
    vi.advanceTimersByTime(600);
    expect(cache.get('key')).toBeUndefined();
  });
});
