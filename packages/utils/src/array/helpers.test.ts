import { describe, it, expect } from 'vitest';
import { chunk, unique, uniqueBy, flatten, flattenDeep, compact, intersection, difference, union, groupBy, shuffle, sample, sampleSize, zip, unzip, partition, take, drop, takeRight, dropRight, last, nth } from './helpers';

describe('chunk', () => {
  it('splits array into chunks', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });
  it('handles size larger than array', () => {
    expect(chunk([1, 2], 5)).toEqual([[1, 2]]);
  });
  it('handles size of 0', () => {
    expect(chunk([1, 2, 3], 0)).toEqual([]);
  });
  it('handles empty array', () => {
    expect(chunk([], 3)).toEqual([]);
  });
});

describe('unique', () => {
  it('removes duplicates', () => {
    expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
  });
  it('preserves order', () => {
    expect(unique([3, 1, 2, 1, 3])).toEqual([3, 1, 2]);
  });
});

describe('uniqueBy', () => {
  it('removes duplicates by key', () => {
    const items = [{ id: 1, name: 'a' }, { id: 2, name: 'b' }, { id: 1, name: 'c' }];
    expect(uniqueBy(items, 'id')).toEqual([{ id: 1, name: 'a' }, { id: 2, name: 'b' }]);
  });
  it('removes duplicates by function', () => {
    const items = [{ id: 1 }, { id: 2 }, { id: 1 }];
    expect(uniqueBy(items, (item) => item.id)).toEqual([{ id: 1 }, { id: 2 }]);
  });
});

describe('flatten', () => {
  it('flattens one level', () => {
    expect(flatten([1, [2, 3], [4]])).toEqual([1, 2, 3, 4]);
  });
});

describe('flattenDeep', () => {
  it('flattens deeply nested arrays', () => {
    expect(flattenDeep([1, [2, [3, [4]]]])).toEqual([1, 2, 3, 4]);
  });
});

describe('compact', () => {
  it('removes falsy values', () => {
    expect(compact([0, 1, false, 2, '', 3, null, undefined])).toEqual([1, 2, 3]);
  });
});

describe('intersection', () => {
  it('returns common elements', () => {
    expect(intersection([1, 2, 3], [2, 3, 4])).toEqual([2, 3]);
  });
});

describe('difference', () => {
  it('returns elements in first but not second', () => {
    expect(difference([1, 2, 3], [2, 3, 4])).toEqual([1]);
  });
});

describe('union', () => {
  it('returns unique elements from both arrays', () => {
    expect(union([1, 2, 3], [2, 3, 4])).toEqual([1, 2, 3, 4]);
  });
});

describe('groupBy', () => {
  it('groups by key', () => {
    const items = [{ type: 'a', val: 1 }, { type: 'b', val: 2 }, { type: 'a', val: 3 }];
    expect(groupBy(items, 'type')).toEqual({ a: [{ type: 'a', val: 1 }, { type: 'a', val: 3 }], b: [{ type: 'b', val: 2 }] });
  });
  it('groups by function', () => {
    const items = [{ val: 1 }, { val: 2 }, { val: 3 }];
    const result = groupBy(items, (item) => item.val % 2 === 0 ? 'even' : 'odd');
    expect(Object.keys(result)).toEqual(['odd', 'even']);
  });
});

describe('shuffle', () => {
  it('returns same elements', () => {
    const arr = [1, 2, 3, 4, 5];
    const shuffled = shuffle(arr);
    expect(shuffled.sort()).toEqual(arr.sort());
  });
  it('does not modify original', () => {
    const arr = [1, 2, 3];
    shuffle(arr);
    expect(arr).toEqual([1, 2, 3]);
  });
});

describe('sample', () => {
  it('returns element from array', () => {
    const arr = [1, 2, 3];
    expect(arr).toContain(sample(arr));
  });
  it('returns undefined for empty array', () => {
    expect(sample([])).toBeUndefined();
  });
});

describe('sampleSize', () => {
  it('returns n elements', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(sampleSize(arr, 3)).toHaveLength(3);
  });
  it('returns all elements if n > length', () => {
    const arr = [1, 2, 3];
    expect(sampleSize(arr, 10)).toHaveLength(3);
  });
});

describe('zip', () => {
  it('zips two arrays', () => {
    expect(zip([1, 2], ['a', 'b'])).toEqual([[1, 'a'], [2, 'b']]);
  });
  it('handles unequal lengths', () => {
    expect(zip([1, 2, 3], ['a'])).toEqual([[1, 'a'], [2, undefined], [3, undefined]]);
  });
});

describe('unzip', () => {
  it('unzips pairs', () => {
    expect(unzip([[1, 'a'], [2, 'b']])).toEqual([[1, 2], ['a', 'b']]);
  });
});

describe('partition', () => {
  it('splits by predicate', () => {
    const [evens, odds] = partition([1, 2, 3, 4], (n) => n % 2 === 0);
    expect(evens).toEqual([2, 4]);
    expect(odds).toEqual([1, 3]);
  });
});

describe('take', () => {
  it('takes first n elements', () => {
    expect(take([1, 2, 3, 4], 2)).toEqual([1, 2]);
  });
});

describe('drop', () => {
  it('drops first n elements', () => {
    expect(drop([1, 2, 3, 4], 2)).toEqual([3, 4]);
  });
});

describe('takeRight', () => {
  it('takes last n elements', () => {
    expect(takeRight([1, 2, 3, 4], 2)).toEqual([3, 4]);
  });
});

describe('dropRight', () => {
  it('drops last n elements', () => {
    expect(dropRight([1, 2, 3, 4], 2)).toEqual([1, 2]);
  });
});

describe('last', () => {
  it('returns last element', () => {
    expect(last([1, 2, 3])).toBe(3);
  });
  it('returns undefined for empty array', () => {
    expect(last([])).toBeUndefined();
  });
});

describe('nth', () => {
  it('returns element at index', () => {
    expect(nth([1, 2, 3], 1)).toBe(2);
  });
  it('handles negative index', () => {
    expect(nth([1, 2, 3], -1)).toBe(3);
  });
});
