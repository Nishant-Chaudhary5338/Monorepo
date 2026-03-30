import type { SortOrder } from '../types/common';

interface SortConfig {
  field: string;
  order: SortOrder;
}

export function multiSort<T extends Record<string, unknown>>(arr: T[], configs: SortConfig[]): T[] {
  if (!arr?.length || !configs?.length) return arr ? [...arr] : [];
  return [...arr].sort((a, b) => {
    for (const { field, order } of configs) {
      const aVal = a[field] as string | number;
      const bVal = b[field] as string | number;
      if (aVal === bVal) continue;
      const result = aVal < bVal ? -1 : 1;
      return order === 'desc' ? -result : result;
    }
    return 0;
  });
}

export function naturalSort(arr: string[]): string[] {
  if (!arr?.length) return [];
  return [...arr].sort((a, b) => {
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
  });
}

export function caseInsensitiveSort(arr: string[]): string[] {
  if (!arr?.length) return [];
  return [...arr].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
}

export function sortBy<T>(arr: T[], key: keyof T | ((item: T) => unknown), order: SortOrder = 'asc'): T[] {
  if (!arr?.length) return [];
  const getKey = typeof key === 'function' ? key : (item: T) => item[key];
  return [...arr].sort((a, b) => {
    const aVal = getKey(a) as string | number;
    const bVal = getKey(b) as string | number;
    if (aVal === bVal) return 0;
    const result = aVal < bVal ? -1 : 1;
    return order === 'desc' ? -result : result;
  });
}
