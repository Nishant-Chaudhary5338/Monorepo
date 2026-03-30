import { describe, it, expect } from 'vitest';
import { get, set, has, unset } from './dot-notation';

describe('get', () => {
  it('gets value by dot path', () => {
    const obj = { a: { b: { c: 42 } } };
    expect(get(obj, 'a.b.c')).toBe(42);
  });
  it('returns default for missing path', () => {
    expect(get({}, 'a.b.c', 'default')).toBe('default');
  });
  it('returns undefined for missing path without default', () => {
    expect(get({}, 'a.b.c')).toBeUndefined();
  });
  it('handles null/undefined in path', () => {
    expect(get({ a: null }, 'a.b')).toBeUndefined();
  });
});

describe('set', () => {
  it('sets value by dot path', () => {
    const obj: Record<string, unknown> = {};
    set(obj, 'a.b.c', 42);
    expect(obj).toEqual({ a: { b: { c: 42 } } });
  });
  it('overwrites existing value', () => {
    const obj = { a: { b: 1 } };
    set(obj, 'a.b', 2);
    expect(obj.a.b).toBe(2);
  });
});

describe('has', () => {
  it('returns true for existing path', () => {
    expect(has({ a: { b: 1 } }, 'a.b')).toBe(true);
  });
  it('returns false for missing path', () => {
    expect(has({}, 'a.b')).toBe(false);
  });
  it('returns false for null in path', () => {
    expect(has({ a: null }, 'a.b')).toBe(false);
  });
});

describe('unset', () => {
  it('removes value by dot path', () => {
    const obj: Record<string, unknown> = { a: { b: { c: 1 } } };
    expect(unset(obj, 'a.b.c')).toBe(true);
    expect(obj).toEqual({ a: { b: {} } });
  });
  it('returns false for missing path', () => {
    expect(unset({}, 'a.b')).toBe(false);
  });
});
