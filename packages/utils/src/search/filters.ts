export interface RtkSearchFilterInput {
  search?: string;
  filters?: Record<string, string | number | boolean | string[] | number[] | null | undefined>;
  sort?: { field: string; order: 'asc' | 'desc' };
}

export function createRtkSearchFilter(input: RtkSearchFilterInput): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  if (input.search) result.search = input.search;
  if (input.filters) {
    for (const [key, value] of Object.entries(input.filters)) {
      if (value !== null && value !== undefined) {
        result[key] = Array.isArray(value) ? value.join(',') : value;
      }
    }
  }
  if (input.sort) {
    result.sortBy = input.sort.field;
    result.sortOrder = input.sort.order;
  }
  return result;
}

export type FilterPredicate<T> = (item: T) => boolean;

export function createFilterPredicate<T extends Record<string, unknown>>(
  filters: Record<string, string | number | boolean | null | undefined>
): FilterPredicate<T> {
  return (item: T) => {
    for (const [key, value] of Object.entries(filters)) {
      if (value === null || value === undefined) continue;
      const itemValue = item[key];
      if (typeof value === 'string' && typeof itemValue === 'string') {
        if (!itemValue.toLowerCase().includes(value.toLowerCase())) return false;
      } else if (itemValue !== value) {
        return false;
      }
    }
    return true;
  };
}

export function debouncedSearch<T>(
  searchFn: (query: string) => T[],
  delay = 300
): (query: string) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastQuery = '';

  return (query: string) => {
    lastQuery = query;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      if (query === lastQuery) searchFn(query);
    }, delay);
  };
}
