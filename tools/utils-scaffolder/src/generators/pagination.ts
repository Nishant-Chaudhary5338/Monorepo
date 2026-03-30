// ============================================================================
// PAGINATION MODULE GENERATOR
// ============================================================================

export function generatePaginationModule(): Record<string, string> {
  return {
    'index.ts': `// ============================================================================
// PAGINATION MODULE - Pagination utilities for lists and data
// ============================================================================

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface CursorPaginationParams {
  cursor?: string;
  limit: number;
}

export interface CursorPaginationResult<T> {
  data: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

/**
 * Paginates an array of items
 * @param items - Array to paginate
 * @param params - Pagination parameters
 * @returns Paginated result
 * @example paginate([1,2,3,4,5], { page: 1, pageSize: 2 }) // { data: [1,2], pagination: {...} }
 */
export function paginate<T>(items: T[], params: PaginationParams): PaginationResult<T> {
  const { page, pageSize } = params;
  const totalCount = items.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const start = (page - 1) * pageSize;
  const data = items.slice(start, start + pageSize);

  return {
    data,
    pagination: {
      page,
      pageSize,
      totalCount,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

/**
 * Calculates pagination offset from page and pageSize
 * @param page - Current page (1-indexed)
 * @param pageSize - Items per page
 * @returns Offset value
 */
export function getOffset(page: number, pageSize: number): number {
  return (Math.max(1, page) - 1) * pageSize;
}

/**
 * Builds pagination parameters from query string values
 * @param pageStr - Page string from query
 * @param pageSizeStr - PageSize string from query
 * @param defaults - Default values
 * @returns Parsed pagination params
 */
export function buildPaginationParams(
  pageStr?: string | null,
  pageSizeStr?: string | null,
  defaults: { page?: number; pageSize?: number } = {}
): PaginationParams {
  const page = Math.max(1, parseInt(pageStr || '', 10) || defaults.page || 1);
  const pageSize = Math.min(
    Math.max(1, parseInt(pageSizeStr || '', 10) || defaults.pageSize || 20),
    100
  );
  return { page, pageSize };
}

/**
 * Generates an array of page numbers for pagination UI
 * @param current - Current page
 * @param total - Total pages
 * @param siblings - Number of siblings to show (default: 1)
 * @returns Array of page numbers with ellipsis markers
 * @example getPageRange(5, 10, 1) // [1, '...', 4, 5, 6, '...', 10]
 */
export function getPageRange(current: number, total: number, siblings = 1): (number | '...')[] {
  const range: (number | '...')[] = [];
  const left = Math.max(2, current - siblings);
  const right = Math.min(total - 1, current + siblings);

  range.push(1);

  if (left > 2) range.push('...');

  for (let i = left; i <= right; i++) {
    range.push(i);
  }

  if (right < total - 1) range.push('...');

  if (total > 1) range.push(total);

  return range;
}

/**
 * Creates cursor-based pagination from an array
 * @param items - Array of items
 * @param params - Cursor pagination params
 * @param getCursor - Function to get cursor from item
 * @returns Cursor-based paginated result
 */
export function cursorPaginate<T>(
  items: T[],
  params: CursorPaginationParams,
  getCursor: (item: T) => string
): CursorPaginationResult<T> {
  const { cursor, limit } = params;
  let startIndex = 0;

  if (cursor) {
    const cursorIndex = items.findIndex((item) => getCursor(item) === cursor);
    startIndex = cursorIndex >= 0 ? cursorIndex + 1 : 0;
  }

  const data = items.slice(startIndex, startIndex + limit);
  const hasMore = startIndex + limit < items.length;
  const nextCursor = hasMore && data.length > 0 ? getCursor(data[data.length - 1]) : null;

  return { data, nextCursor, hasMore };
}

/**
 * Calculates total pages from count and page size
 * @param totalCount - Total number of items
 * @param pageSize - Items per page
 * @returns Total number of pages
 */
export function getTotalPages(totalCount: number, pageSize: number): number {
  return Math.ceil(totalCount / pageSize);
}
`,
    'pagination.test.ts': `import { describe, it, expect } from 'vitest'
import { paginate, getOffset, buildPaginationParams, getPageRange, getTotalPages } from './index'

describe('Pagination Module', () => {
  describe('paginate', () => {
    it('paginates array correctly', () => {
      const items = [1, 2, 3, 4, 5]
      const result = paginate(items, { page: 1, pageSize: 2 })
      expect(result.data).toEqual([1, 2])
      expect(result.pagination.totalCount).toBe(5)
      expect(result.pagination.hasNext).toBe(true)
      expect(result.pagination.hasPrev).toBe(false)
    })

    it('handles last page', () => {
      const items = [1, 2, 3, 4, 5]
      const result = paginate(items, { page: 3, pageSize: 2 })
      expect(result.data).toEqual([5])
      expect(result.pagination.hasNext).toBe(false)
      expect(result.pagination.hasPrev).toBe(true)
    })
  })

  describe('getOffset', () => {
    it('calculates offset correctly', () => {
      expect(getOffset(1, 10)).toBe(0)
      expect(getOffset(2, 10)).toBe(10)
      expect(getOffset(3, 20)).toBe(40)
    })
  })

  describe('getPageRange', () => {
    it('generates page range', () => {
      const range = getPageRange(5, 10, 1)
      expect(range).toContain(1)
      expect(range).toContain(5)
      expect(range).toContain(10)
      expect(range).toContain('...')
    })

    it('handles small total', () => {
      const range = getPageRange(1, 3, 1)
      expect(range).toEqual([1, 2, 3])
    })
  })

  describe('getTotalPages', () => {
    it('calculates total pages', () => {
      expect(getTotalPages(100, 20)).toBe(5)
      expect(getTotalPages(101, 20)).toBe(6)
      expect(getTotalPages(0, 20)).toBe(0)
    })
  })
})
`,
  };
}