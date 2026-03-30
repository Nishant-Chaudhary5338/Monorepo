import { describe, it, expect } from 'vitest';
import { pick, omit, deepMerge, deepClone, deepFreeze, flattenObject, unflattenObject, mapValues, mapKeys, invert, isEmpty } from './helpers';

describe('pick', () => {
  it('picks specified keys', () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(pick(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 });
  });
  it('ignores missing keys', () => {
    expect(pick({ a: 1 }, ['b' as any])).toEqual({});
  });
});

describe('omit', () => {
  it('omits specified keys', () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(omit(obj, ['b'])).toEqual({ a: 1, c: 3 });
  });
});

describe('deepMerge', () => {
  it('merges objects deeply', () => {
    const target = { a: { b: 1, c: 2 } };
    const source = { a: { c: 3, d: 4 } };
    expect(deepMerge(target, source)).toEqual({ a: { b: 1, c: 3, d: 4 } });
  });
  it('does not overwrite with undefined', () => {
    const target = { a: 1 };
    const source = { a: undefined } as any;
    expect(deepMerge(target, source)).toEqual({ a: 1 });
  });
});

describe('deepClone', () => {
  it('clones objects deeply', () => {
    const obj = { a: { b: 1 }, c: [1, 2, 3] };
    const clone = deepClone(obj);
    expect(clone).toEqual(obj);
    expect(clone).not.toBe(obj);
    expect(clone.a).not.toBe(obj.a);
  });
  it('clones dates', () => {
    const date = new Date();
    const clone = deepClone(date);
    expect(clone.getTime()).toBe(date.getTime());
    expect(clone).not.toBe(date);
  });
  it('clones regex', () => {
    const regex = /test/gi;
    const clone = deepClone(regex);
    expect(clone.source).toBe(regex.source);
    expect(clone.flags).toBe(regex.flags);
  });
  it('clones null', () => {
    expect(deepClone(null)).toBeNull();
  });
  it('clones primitives', () => {
    expect(deepClone(42)).toBe(42);
    expect(deepClone('hello')).toBe('hello');
  });
});

describe('deepFreeze', () => {
  it('freezes object deeply', () => {
    const obj = deepFreeze({ a: { b: 1 } });
    expect(() => { (obj as any).a = 2; }).toThrow();
    expect(() => { (obj.a as any).b = 2; }).toThrow();
  });
});

describe('flattenObject', () => {
  it('flattens nested object', () => {
    expect(flattenObject({ a: { b: 1, c: { d: 2 } } })).toEqual({ 'a.b': 1, 'a.c.d': 2 });
  });
});

describe('unflattenObject', () => {
  it('unflattens dot-notation keys', () => {
    expect(unflattenObject({ 'a.b': 1, 'a.c.d': 2 })).toEqual({ a: { b: 1, c: { d: 2 } } });
  });
});

describe('mapValues', () => {
  it('maps values of object', () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(mapValues(obj, (v) => v * 2)).toEqual({ a: 2, b: 4, c: 6 });
  });
});

describe('mapKeys', () => {
  it('maps keys of object', () => {
    const obj = { a: 1, b: 2 };
    expect(mapKeys(obj, (k) => k.toUpperCase())).toEqual({ A: 1, B: 2 });
  });
});

describe('invert', () => {
  it('swaps keys and values', () => {
    expect(invert({ a: '1', b: '2' })).toEqual({ '1': 'a', '2': 'b' });
  });
});

describe('isEmpty', () => {
  it('returns true for empty values', () => {
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(undefined)).toBe(true);
    expect(isEmpty([])).toBe(true);
    expect(isEmpty('')).toBe(true);
    expect(isEmpty({})).toBe(true);
  });
  it('returns false for non-empty values', () => {
    expect(isEmpty([1])).toBe(false);
    expect(isEmpty('a')).toBe(false);
    expect(isEmpty({ a: 1 })).toBe(false);
  });
});
