import { describe, it, expect } from 'vitest';
import { createRtkSearchFilter, createFilterPredicate } from './filters';

describe('createRtkSearchFilter', () => {
  it('includes search param', () => {
    expect(createRtkSearchFilter({ search: 'test' })).toEqual({ search: 'test' });
  });
  it('includes filters', () => {
    const result = createRtkSearchFilter({ filters: { status: 'active', count: 5 } });
    expect(result.status).toBe('active');
    expect(result.count).toBe(5);
  });
  it('skips null/undefined filters', () => {
    const result = createRtkSearchFilter({ filters: { a: 'x', b: null, c: undefined } });
    expect(result).toEqual({ a: 'x' });
  });
  it('joins array filters', () => {
    const result = createRtkSearchFilter({ filters: { ids: [1, 2, 3] } });
    expect(result.ids).toBe('1,2,3');
  });
  it('includes sort params', () => {
    const result = createRtkSearchFilter({ sort: { field: 'name', order: 'asc' } });
    expect(result.sortBy).toBe('name');
    expect(result.sortOrder).toBe('asc');
  });
});

describe('createFilterPredicate', () => {
  it('creates matching predicate', () => {
    const predicate = createFilterPredicate({ status: 'active' });
    expect(predicate({ status: 'active', name: 'test' } as any)).toBe(true);
    expect(predicate({ status: 'inactive', name: 'test' } as any)).toBe(false);
  });
  it('handles case insensitive string matching', () => {
    const predicate = createFilterPredicate({ name: 'JOHN' });
    expect(predicate({ name: 'john doe' } as any)).toBe(true);
  });
  it('skips null/undefined filter values', () => {
    const predicate = createFilterPredicate({ a: 'x', b: null, c: undefined });
    expect(predicate({ a: 'x' } as any)).toBe(true);
  });
});
