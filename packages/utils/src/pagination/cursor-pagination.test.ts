import { describe, it, expect } from 'vitest';
import { createCursorPagination } from './cursor-pagination';

describe('createCursorPagination', () => {
  it('creates with default page size', () => {
    const pagination = createCursorPagination();
    expect(pagination.state.cursor).toBeNull();
    expect(pagination.state.hasMore).toBe(true);
    expect(pagination.state.pageSize).toBe(20);
  });

  it('creates with custom page size', () => {
    const pagination = createCursorPagination(50);
    expect(pagination.state.pageSize).toBe(50);
  });

  it('advances to next page', () => {
    const pagination = createCursorPagination();
    pagination.advance('cursor-abc');
    expect(pagination.state.cursor).toBe('cursor-abc');
    expect(pagination.state.hasMore).toBe(true);
  });

  it('sets hasMore false when cursor is null', () => {
    const pagination = createCursorPagination();
    pagination.advance(null);
    expect(pagination.state.hasMore).toBe(false);
  });

  it('resets state', () => {
    const pagination = createCursorPagination();
    pagination.advance('cursor-123');
    pagination.reset();
    expect(pagination.state.cursor).toBeNull();
    expect(pagination.state.hasMore).toBe(true);
  });

  it('returns correct arg', () => {
    const pagination = createCursorPagination(10);
    expect(pagination.getArg()).toEqual({ cursor: null, limit: 10 });
    pagination.advance('abc');
    expect(pagination.getArg()).toEqual({ cursor: 'abc', limit: 10 });
  });
});
