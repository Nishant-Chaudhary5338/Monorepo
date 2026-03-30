import { describe, it, expect } from 'vitest';
import { multiSort, naturalSort, caseInsensitiveSort, sortBy } from './sorting';

describe('multiSort', () => {
  it('sorts by multiple fields', () => {
    const items = [{ name: 'b', age: 2 }, { name: 'a', age: 1 }, { name: 'a', age: 3 }];
    const result = multiSort(items, [{ field: 'name', order: 'asc' }, { field: 'age', order: 'asc' }]);
    expect(result.map(i => i.name)).toEqual(['a', 'a', 'b']);
    expect(result[0].age).toBe(1);
    expect(result[1].age).toBe(3);
  });
  it('supports descending order', () => {
    const items = [{ val: 1 }, { val: 3 }, { val: 2 }];
    const result = multiSort(items, [{ field: 'val', order: 'desc' }]);
    expect(result.map(i => i.val)).toEqual([3, 2, 1]);
  });
});

describe('naturalSort', () => {
  it('sorts strings naturally', () => {
    const result = naturalSort(['item10', 'item2', 'item1']);
    expect(result).toEqual(['item1', 'item2', 'item10']);
  });
});

describe('caseInsensitiveSort', () => {
  it('sorts ignoring case', () => {
    const result = caseInsensitiveSort(['Banana', 'apple', 'Cherry']);
    expect(result).toEqual(['apple', 'Banana', 'Cherry']);
  });
});

describe('sortBy', () => {
  it('sorts by key', () => {
    const items = [{ val: 3 }, { val: 1 }, { val: 2 }];
    expect(sortBy(items, 'val').map(i => i.val)).toEqual([1, 2, 3]);
  });
  it('sorts by function', () => {
    const items = [{ val: 3 }, { val: 1 }, { val: 2 }];
    expect(sortBy(items, (i) => i.val, 'desc').map(i => i.val)).toEqual([3, 2, 1]);
  });
});
