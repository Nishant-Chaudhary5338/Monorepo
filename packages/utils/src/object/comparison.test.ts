import { describe, it, expect } from 'vitest';
import { shallowEqual, deepEqual, diff } from './comparison';

describe('shallowEqual', () => {
  it('returns true for same reference', () => {
    const obj = { a: 1 };
    expect(shallowEqual(obj, obj)).toBe(true);
  });
  it('returns true for shallow equal objects', () => {
    expect(shallowEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
  });
  it('returns false for different values', () => {
    expect(shallowEqual({ a: 1 }, { a: 2 })).toBe(false);
  });
  it('returns false for different keys', () => {
    expect(shallowEqual({ a: 1 }, { b: 1 })).toBe(false);
  });
  it('returns false for nested objects', () => {
    expect(shallowEqual({ a: { b: 1 } }, { a: { b: 1 } })).toBe(false);
  });
  it('handles primitives', () => {
    expect(shallowEqual(1, 1)).toBe(true);
    expect(shallowEqual(1, 2)).toBe(false);
  });
});

describe('deepEqual', () => {
  it('returns true for deeply equal objects', () => {
    expect(deepEqual({ a: { b: 1 } }, { a: { b: 1 } })).toBe(true);
  });
  it('returns true for deeply equal arrays', () => {
    expect(deepEqual([1, [2, 3]], [1, [2, 3]])).toBe(true);
  });
  it('returns false for different values', () => {
    expect(deepEqual({ a: 1 }, { a: 2 })).toBe(false);
  });
  it('returns false for different array lengths', () => {
    expect(deepEqual([1, 2], [1, 2, 3])).toBe(false);
  });
  it('handles null', () => {
    expect(deepEqual(null, null)).toBe(true);
    expect(deepEqual(null, 1)).toBe(false);
  });
  it('handles mixed types', () => {
    expect(deepEqual([], {})).toBe(false);
  });
});

describe('diff', () => {
  it('detects added keys', () => {
    expect(diff({ a: 1 }, { a: 1, b: 2 })).toEqual({ added: ['b'], removed: [], changed: [] });
  });
  it('detects removed keys', () => {
    expect(diff({ a: 1, b: 2 }, { a: 1 })).toEqual({ added: [], removed: ['b'], changed: [] });
  });
  it('detects changed values', () => {
    expect(diff({ a: 1 }, { a: 2 })).toEqual({ added: [], removed: [], changed: ['a'] });
  });
  it('handles complex changes', () => {
    const result = diff({ a: 1, b: 2, c: 3 }, { a: 1, b: 99, d: 4 });
    expect(result.added).toContain('d');
    expect(result.removed).toContain('c');
    expect(result.changed).toContain('b');
  });
});
