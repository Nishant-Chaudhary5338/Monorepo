import type { PaginationState, PaginationConfig, RtkPaginationArg, PageRange } from './types';

export function createPaginationState(config: PaginationConfig = {}): PaginationState {
  const { initialPage = 1, pageSize = 20, totalCount = 0 } = config;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  return {
    page: initialPage,
    pageSize,
    totalCount,
    totalPages,
    hasNextPage: initialPage < totalPages,
    hasPreviousPage: initialPage > 1,
  };
}

export function createRtkPaginationArg(page: number, pageSize: number): RtkPaginationArg {
  return {
    offset: (page - 1) * pageSize,
    limit: pageSize,
    page,
  };
}

export function calculatePageRange(
  currentPage: number,
  totalPages: number,
  siblings = 1
): PageRange {
  const totalSlots = siblings * 2 + 5; // first + last + current + 2*siblings + 2 ellipsis

  if (totalPages <= totalSlots) {
    return {
      pages: Array.from({ length: totalPages }, (_, i) => i + 1),
      start: 1,
      end: totalPages,
    };
  }

  const leftSiblingIndex = Math.max(currentPage - siblings, 1);
  const rightSiblingIndex = Math.min(currentPage + siblings, totalPages);

  const showLeftEllipsis = leftSiblingIndex > 2;
  const showRightEllipsis = rightSiblingIndex < totalPages - 1;

  const pages: (number | 'ellipsis')[] = [1];

  if (showLeftEllipsis) {
    pages.push('ellipsis');
  }

  for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
    if (i !== 1 && i !== totalPages) {
      pages.push(i);
    }
  }

  if (showRightEllipsis) {
    pages.push('ellipsis');
  }

  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return { pages, start: leftSiblingIndex, end: rightSiblingIndex };
}

export function parsePaginationParams(searchParams: URLSearchParams | Record<string, string>): {
  page: number;
  pageSize: number;
} {
  const get = (key: string) => {
    if (searchParams instanceof URLSearchParams) return searchParams.get(key);
    return searchParams[key] ?? null;
  };
  const page = Math.max(1, parseInt(get('page') ?? '1', 10) || 1);
  const pageSize = Math.max(1, Math.min(100, parseInt(get('pageSize') ?? '20', 10) || 20));
  return { page, pageSize };
}

export function createPaginationMeta(page: number, pageSize: number, total: number) {
  const totalPages = Math.ceil(total / pageSize);
  return {
    currentPage: page,
    pageSize,
    totalCount: total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}
