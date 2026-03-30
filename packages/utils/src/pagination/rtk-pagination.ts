import type { RtkPaginationArg } from './types';

export interface InfiniteScrollConfig<TData, TArg> {
  getNextPageParam: (lastPage: TData, allPages: TData[]) => TArg | undefined;
  getPreviousPageParam?: (firstPage: TData, allPages: TData[]) => TArg | undefined;
}

export function createInfiniteScrollHelpers() {
  function getNextOffset(currentOffset: number, limit: number, totalCount: number): number | undefined {
    const next = currentOffset + limit;
    return next < totalCount ? next : undefined;
  }

  function mergePages<T>(pages: T[][]): T[] {
    return pages.flat();
  }

  return { getNextOffset, mergePages };
}
