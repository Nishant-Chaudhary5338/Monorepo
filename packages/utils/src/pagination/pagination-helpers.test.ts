import { describe, it, expect } from 'vitest';
import { createPaginationState, createRtkPaginationArg, calculatePageRange, parsePaginationParams, createPaginationMeta } from './pagination-helpers';

describe('createPaginationState', () => {
  it('creates state with defaults', () => {
    const state = createPaginationState();
    expect(state.page).toBe(1);
    expect(state.pageSize).toBe(20);
    expect(state.totalCount).toBe(0);
    expect(state.hasNextPage).toBe(false);
    expect(state.hasPreviousPage).toBe(false);
  });

  it('calculates totalPages from config', () => {
    const state = createPaginationState({ totalCount: 100, pageSize: 20 });
    expect(state.totalPages).toBe(5);
  });

  it('sets correct page flags', () => {
    const state = createPaginationState({ initialPage: 3, totalCount: 100, pageSize: 20 });
    expect(state.hasNextPage).toBe(true);
    expect(state.hasPreviousPage).toBe(true);
  });
});

describe('createRtkPaginationArg', () => {
  it('creates correct offset/limit', () => {
    const arg = createRtkPaginationArg(1, 20);
    expect(arg.offset).toBe(0);
    expect(arg.limit).toBe(20);
    expect(arg.page).toBe(1);
  });

  it('calculates offset for page 3', () => {
    const arg = createRtkPaginationArg(3, 10);
    expect(arg.offset).toBe(20);
  });
});

describe('calculatePageRange', () => {
  it('returns all pages when total is small', () => {
    const range = calculatePageRange(2, 5);
    expect(range.pages).toEqual([1, 2, 3, 4, 5]);
  });

  it('includes ellipsis for large ranges', () => {
    const range = calculatePageRange(5, 20);
    expect(range.pages).toContain('ellipsis');
    expect(range.pages).toContain(1);
    expect(range.pages).toContain(20);
  });

  it('respects siblings parameter', () => {
    const range = calculatePageRange(10, 20, 2);
    expect(range.pages).toContain(8);
    expect(range.pages).toContain(9);
    expect(range.pages).toContain(10);
    expect(range.pages).toContain(11);
    expect(range.pages).toContain(12);
  });
});

describe('parsePaginationParams', () => {
  it('parses from URLSearchParams', () => {
    const params = new URLSearchParams('page=3&pageSize=50');
    const result = parsePaginationParams(params);
    expect(result.page).toBe(3);
    expect(result.pageSize).toBe(50);
  });

  it('uses defaults for missing params', () => {
    const result = parsePaginationParams(new URLSearchParams());
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(20);
  });

  it('clamps page to minimum 1', () => {
    const result = parsePaginationParams(new URLSearchParams('page=-5'));
    expect(result.page).toBe(1);
  });

  it('clamps pageSize to max 100', () => {
    const result = parsePaginationParams(new URLSearchParams('pageSize=500'));
    expect(result.pageSize).toBe(100);
  });

  it('handles object input', () => {
    const result = parsePaginationParams({ page: '2', pageSize: '15' });
    expect(result.page).toBe(2);
    expect(result.pageSize).toBe(15);
  });
});

describe('createPaginationMeta', () => {
  it('creates correct meta', () => {
    const meta = createPaginationMeta(2, 10, 50);
    expect(meta.currentPage).toBe(2);
    expect(meta.pageSize).toBe(10);
    expect(meta.totalCount).toBe(50);
    expect(meta.totalPages).toBe(5);
    expect(meta.hasNextPage).toBe(true);
    expect(meta.hasPreviousPage).toBe(true);
  });

  it('handles last page', () => {
    const meta = createPaginationMeta(5, 10, 50);
    expect(meta.hasNextPage).toBe(false);
    expect(meta.hasPreviousPage).toBe(true);
  });

  it('handles first page', () => {
    const meta = createPaginationMeta(1, 10, 50);
    expect(meta.hasNextPage).toBe(true);
    expect(meta.hasPreviousPage).toBe(false);
  });
});
