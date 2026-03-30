export interface RtkSearchFilterInput {
  search?: string;
  filters?: Record<string, string | number | boolean | string[] | number[] | null | undefined>;
  sort?: { field: string; order: 'asc' | 'desc' };
}

export function createRtkSearchFilter(input: RtkSearchFilterInput): Record<string, unknown> {
  if (!input) return {};
  const result: Record<string, unknown> = {};
  if (input.search?.trim()) result.search = input.search;
  if (input.filters) {
    for (const [key, value] of Object.entries(input.filters)) {
      if (value !== null && value !== undefined && value !== '') {
        result[key] = Array.isArray(value) ? value.join(',') : value;
      }
    }
  }
  if (input.sort?.field) {
    result.sortBy = input.sort.field;
    result.sortOrder = input.sort.order ?? 'asc';
  }
  return result;
}

export type FilterPredicate<T> = (item: T) => boolean;

export function createFilterPredicate<T extends Record<string, unknown>>(
  filters: Record<string, string | number | boolean | null | undefined>
): FilterPredicate<T> {
  if (!filters || Object.keys(filters).length === 0) return () => true;
  return (item: T) => {
    if (!item) return false;
    for (const [key, value] of Object.entries(filters)) {
      if (value === null || value === undefined || value === '') continue;
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
      if (query === lastQuery && searchFn) searchFn(query);
    }, Math.max(0, delay));
  };
}
