import type { SortOrder } from '../types/common';

interface SortConfig {
  field: string;
  order: SortOrder;
}

export function multiSort<T extends Record<string, unknown>>(arr: T[], configs: SortConfig[]): T[] {
  return [...arr].sort((a, b) => {
    for (const { field, order } of configs) {
      const aVal = a[field];
      const bVal = b[field];
      if (aVal === bVal) continue;
      const result = aVal < bVal ? -1 : 1;
      return order === 'desc' ? -result : result;
    }
    return 0;
  });
}

export function naturalSort(arr: string[]): string[] {
  return [...arr].sort((a, b) => {
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
  });
}

export function caseInsensitiveSort(arr: string[]): string[] {
  return [...arr].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
}

export function sortBy<T>(arr: T[], key: keyof T | ((item: T) => unknown), order: SortOrder = 'asc'): T[] {
  const getKey = typeof key === 'function' ? key : (item: T) => item[key];
  return [...arr].sort((a, b) => {
    const aVal = getKey(a);
    const bVal = getKey(b);
    if (aVal === bVal) return 0;
    const result = aVal < bVal ? -1 : 1;
    return order === 'desc' ? -result : result;
  });
}
