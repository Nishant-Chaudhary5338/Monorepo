// ============================================================================
// ARRAY MODULE GENERATOR
// ============================================================================
export function generateArrayModule() {
    return {
        'index.ts': `// ============================================================================
// ARRAY MODULE - Array utilities for data manipulation
// ============================================================================

/**
 * Splits an array into chunks of specified size
 * @param arr - Input array
 * @param size - Chunk size
 * @returns Array of chunks
 * @example chunk([1,2,3,4,5], 2) // [[1,2],[3,4],[5]]
 */
export function chunk<T>(arr: T[], size: number): T[][] {
  if (!arr || arr.length === 0) return [];
  if (size <= 0) return [arr];
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

/** Returns unique values from an array */
export function unique<T>(arr: T[]): T[] {
  if (!arr) return [];
  return [...new Set(arr)];
}

/** Returns unique values by a key or function */
export function uniqueBy<T>(arr: T[], key: keyof T | ((item: T) => unknown)): T[] {
  if (!arr) return [];
  const seen = new Set<unknown>();
  return arr.filter((item) => {
    const val = typeof key === 'function' ? key(item) : item[key];
    if (seen.has(val)) return false;
    seen.add(val);
    return true;
  });
}

/** Flattens an array one level deep */
export function flatten<T>(arr: (T | T[])[]): T[] {
  if (!arr) return [];
  return arr.flat() as T[];
}

/** Recursively flattens an array */
export function flattenDeep<T>(arr: unknown[]): T[] {
  if (!arr) return [];
  return arr.flat(Infinity) as T[];
}

/** Removes falsy values from an array */
export function compact<T>(arr: (T | null | undefined | false | 0 | '')[]): T[] {
  if (!arr) return [];
  return arr.filter(Boolean) as T[];
}

/** Returns intersection of arrays */
export function intersection<T>(...arrays: T[][]): T[] {
  if (arrays.length === 0) return [];
  return arrays.reduce((acc, arr) => acc.filter((item) => arr.includes(item)));
}

/** Returns elements in first array not in second */
export function difference<T>(a: T[], b: T[]): T[] {
  if (!a) return [];
  if (!b) return [...a];
  const setB = new Set(b);
  return a.filter((item) => !setB.has(item));
}

/** Returns union of arrays (unique values from all) */
export function union<T>(...arrays: T[][]): T[] {
  return unique(arrays.flat());
}

/** Groups array items by a key */
export function groupBy<T>(arr: T[], key: keyof T | ((item: T) => string)): Record<string, T[]> {
  if (!arr) return {};
  return arr.reduce<Record<string, T[]>>((acc, item) => {
    const groupKey = String(typeof key === 'function' ? key(item) : item[key]);
    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(item);
    return acc;
  }, {});
}

/** Sorts array by a key or function */
export function sortBy<T>(arr: T[], key: keyof T | ((item: T) => unknown), order: 'asc' | 'desc' = 'asc'): T[] {
  if (!arr) return [];
  const sorted = [...arr].sort((a, b) => {
    const valA = typeof key === 'function' ? key(a) : a[key];
    const valB = typeof key === 'function' ? key(b) : b[key];
    if (valA < valB) return -1;
    if (valA > valB) return 1;
    return 0;
  });
  return order === 'desc' ? sorted.reverse() : sorted;
}

/** Shuffles an array (Fisher-Yates) */
export function shuffle<T>(arr: T[]): T[] {
  if (!arr) return [];
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Returns a random element from an array */
export function sample<T>(arr: T[]): T | undefined {
  if (!arr || arr.length === 0) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Returns n random elements from an array */
export function sampleSize<T>(arr: T[], n: number): T[] {
  if (!arr) return [];
  return shuffle(arr).slice(0, Math.min(n, arr.length));
}

/** Zips arrays together */
export function zip<T, U>(a: T[], b: U[]): [T | undefined, U | undefined][] {
  const length = Math.max(a?.length || 0, b?.length || 0);
  const result: [T | undefined, U | undefined][] = [];
  for (let i = 0; i < length; i++) {
    result.push([a?.[i], b?.[i]]);
  }
  return result;
}

/** Partitions array into two based on predicate */
export function partition<T>(arr: T[], predicate: (item: T) => boolean): [T[], T[]] {
  if (!arr) return [[], []];
  const pass: T[] = [];
  const fail: T[] = [];
  arr.forEach((item) => (predicate(item) ? pass.push(item) : fail.push(item)));
  return [pass, fail];
}

/** Takes first n elements */
export function take<T>(arr: T[], n: number): T[] {
  if (!arr) return [];
  return arr.slice(0, Math.max(0, n));
}

/** Drops first n elements */
export function drop<T>(arr: T[], n: number): T[] {
  if (!arr) return [];
  return arr.slice(Math.max(0, n));
}

/** Takes last n elements */
export function takeRight<T>(arr: T[], n: number): T[] {
  if (!arr) return [];
  return arr.slice(-Math.max(0, n));
}

/** Returns last element */
export function last<T>(arr: T[]): T | undefined {
  if (!arr || arr.length === 0) return undefined;
  return arr[arr.length - 1];
}

/** Returns nth element (supports negative indices) */
export function nth<T>(arr: T[], index: number): T | undefined {
  if (!arr) return undefined;
  const i = index < 0 ? arr.length + index : index;
  return arr[i];
}

/** Multi-sort by multiple criteria */
export function multiSort<T>(arr: T[], criteria: { field: keyof T; order?: 'asc' | 'desc' }[]): T[] {
  if (!arr) return [];
  return [...arr].sort((a, b) => {
    for (const { field, order = 'asc' } of criteria) {
      if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
      if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
    }
    return 0;
  });
}

/** Natural sort for strings with numbers */
export function naturalSort(arr: string[]): string[] {
  if (!arr) return [];
  return [...arr].sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
}

/** Binary search in sorted array */
export function binarySearch<T>(arr: T[], target: T): number {
  if (!arr) return -1;
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}
`,
        'array.test.ts': `import { describe, it, expect } from 'vitest'
import {
  chunk, unique, uniqueBy, flatten, compact, intersection, difference,
  union, groupBy, sortBy, shuffle, sample, sampleSize, partition,
  take, drop, last, nth, multiSort, naturalSort, binarySearch,
} from './index'

describe('Array Module', () => {
  describe('chunk', () => {
    it('splits array into chunks', () => {
      expect(chunk([1,2,3,4,5], 2)).toEqual([[1,2],[3,4],[5]])
    })
    it('handles empty array', () => {
      expect(chunk([], 2)).toEqual([])
    })
  })

  describe('unique', () => {
    it('removes duplicates', () => {
      expect(unique([1,1,2,3,3])).toEqual([1,2,3])
    })
  })

  describe('uniqueBy', () => {
    it('removes duplicates by key', () => {
      const items = [{id:1,name:'a'},{id:1,name:'b'},{id:2,name:'c'}]
      expect(uniqueBy(items, 'id')).toHaveLength(2)
    })
  })

  describe('flatten', () => {
    it('flattens one level', () => {
      expect(flatten([[1,2],[3,4]])).toEqual([1,2,3,4])
    })
  })

  describe('compact', () => {
    it('removes falsy values', () => {
      expect(compact([1, null, 2, undefined, 0, 3, ''])).toEqual([1,2,3])
    })
  })

  describe('intersection', () => {
    it('finds common elements', () => {
      expect(intersection([1,2,3], [2,3,4])).toEqual([2,3])
    })
  })

  describe('difference', () => {
    it('finds elements only in first array', () => {
      expect(difference([1,2,3], [2,3,4])).toEqual([1])
    })
  })

  describe('union', () => {
    it('combines arrays with unique values', () => {
      expect(union([1,2], [2,3])).toEqual([1,2,3])
    })
  })

  describe('groupBy', () => {
    it('groups by key', () => {
      const items = [{type:'a',v:1},{type:'b',v:2},{type:'a',v:3}]
      const result = groupBy(items, 'type')
      expect(Object.keys(result)).toEqual(['a','b'])
      expect(result.a).toHaveLength(2)
    })
  })

  describe('sortBy', () => {
    it('sorts ascending', () => {
      expect(sortBy([{v:3},{v:1},{v:2}], 'v')).toEqual([{v:1},{v:2},{v:3}])
    })
    it('sorts descending', () => {
      expect(sortBy([{v:3},{v:1},{v:2}], 'v', 'desc')).toEqual([{v:3},{v:2},{v:1}])
    })
  })

  describe('shuffle', () => {
    it('returns same length', () => {
      const arr = [1,2,3,4,5]
      expect(shuffle(arr)).toHaveLength(5)
    })
  })

  describe('partition', () => {
    it('splits by predicate', () => {
      const [evens, odds] = partition([1,2,3,4], n => n % 2 === 0)
      expect(evens).toEqual([2,4])
      expect(odds).toEqual([1,3])
    })
  })

  describe('take', () => {
    it('takes first n elements', () => {
      expect(take([1,2,3,4], 2)).toEqual([1,2])
    })
  })

  describe('drop', () => {
    it('drops first n elements', () => {
      expect(drop([1,2,3,4], 2)).toEqual([3,4])
    })
  })

  describe('last', () => {
    it('returns last element', () => {
      expect(last([1,2,3])).toBe(3)
    })
  })

  describe('binarySearch', () => {
    it('finds element in sorted array', () => {
      expect(binarySearch([1,2,3,4,5], 3)).toBe(2)
    })
    it('returns -1 for missing element', () => {
      expect(binarySearch([1,2,3], 5)).toBe(-1)
    })
  })
})
`,
    };
}
//# sourceMappingURL=array.js.map