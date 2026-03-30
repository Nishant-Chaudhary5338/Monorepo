import { describe, it, expect } from 'vitest';
import { clamp, random, randomInt, range, roundTo, average, sum, median, percentile } from './helpers';

describe('clamp', () => {
  it('clamps value within range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });
});

describe('random', () => {
  it('returns value within range', () => {
    for (let i = 0; i < 100; i++) {
      const val = random(5, 10);
      expect(val).toBeGreaterThanOrEqual(5);
      expect(val).toBeLessThan(11);
    }
  });
});

describe('randomInt', () => {
  it('returns integer within range', () => {
    for (let i = 0; i < 100; i++) {
      const val = randomInt(1, 5);
      expect(Number.isInteger(val)).toBe(true);
      expect(val).toBeGreaterThanOrEqual(1);
      expect(val).toBeLessThanOrEqual(5);
    }
  });
});

describe('range', () => {
  it('generates ascending range', () => {
    expect(range(0, 5)).toEqual([0, 1, 2, 3, 4]);
  });
  it('generates range with step', () => {
    expect(range(0, 10, 2)).toEqual([0, 2, 4, 6, 8]);
  });
  it('generates descending range', () => {
    expect(range(5, 0, -1)).toEqual([5, 4, 3, 2, 1]);
  });
  it('returns empty for zero step', () => {
    expect(range(0, 5, 0)).toEqual([]);
  });
});

describe('roundTo', () => {
  it('rounds to specified decimals', () => {
    expect(roundTo(3.14159, 2)).toBe(3.14);
    expect(roundTo(3.14159, 0)).toBe(3);
    expect(roundTo(3.5, 0)).toBe(4);
  });
});

describe('average', () => {
  it('calculates average', () => {
    expect(average([1, 2, 3, 4, 5])).toBe(3);
  });
  it('returns 0 for empty array', () => {
    expect(average([])).toBe(0);
  });
});

describe('sum', () => {
  it('calculates sum', () => {
    expect(sum([1, 2, 3, 4, 5])).toBe(15);
  });
  it('returns 0 for empty array', () => {
    expect(sum([])).toBe(0);
  });
});

describe('median', () => {
  it('calculates median for odd count', () => {
    expect(median([1, 3, 5])).toBe(3);
  });
  it('calculates median for even count', () => {
    expect(median([1, 2, 3, 4])).toBe(2.5);
  });
  it('returns 0 for empty array', () => {
    expect(median([])).toBe(0);
  });
});

describe('percentile', () => {
  it('calculates percentile', () => {
    const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    expect(percentile(values, 50)).toBe(5.5);
    expect(percentile(values, 0)).toBe(1);
    expect(percentile(values, 100)).toBe(10);
  });
  it('returns 0 for empty array', () => {
    expect(percentile([], 50)).toBe(0);
  });
});
