import { describe, it, expect } from 'vitest';
import { binarySearch, findIndex, findLastIndex } from './search';

describe('binarySearch', () => {
  it('finds element in sorted array', () => {
    expect(binarySearch([1, 2, 3, 4, 5], 3)).toBe(2);
  });
  it('returns -1 for missing element', () => {
    expect(binarySearch([1, 2, 3, 4, 5], 6)).toBe(-1);
  });
  it('finds first element', () => {
    expect(binarySearch([1, 2, 3], 1)).toBe(0);
  });
  it('finds last element', () => {
    expect(binarySearch([1, 2, 3], 3)).toBe(2);
  });
});

describe('findIndex', () => {
  it('finds index by predicate', () => {
    expect(findIndex([1, 2, 3], (item) => item === 2)).toBe(1);
  });
  it('returns -1 if not found', () => {
    expect(findIndex([1, 2, 3], (item) => item === 5)).toBe(-1);
  });
});

describe('findLastIndex', () => {
  it('finds last index by predicate', () => {
    expect(findLastIndex([1, 2, 3, 2], (item) => item === 2)).toBe(3);
  });
  it('returns -1 if not found', () => {
    expect(findLastIndex([1, 2, 3], (item) => item === 5)).toBe(-1);
  });
});
