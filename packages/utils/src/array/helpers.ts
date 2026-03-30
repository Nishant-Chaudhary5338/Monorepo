// ============================================
// Array Helpers
// ============================================

export function chunk<T>(arr: T[], size: number): T[][] {
  if (!arr?.length || size <= 0) return [];
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

export function unique<T>(arr: T[]): T[] {
  if (!arr?.length) return [];
  return Array.from(new Set(arr));
}

export function uniqueBy<T>(arr: T[], key: keyof T | ((item: T) => unknown)): T[] {
  if (!arr?.length) return [];
  const seen = new Set();
  const getKey = typeof key === 'function' ? key : (item: T) => item[key];
  return arr.filter((item) => {
    const k = getKey(item);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

export function flatten<T>(arr: (T | T[])[]): T[] {
  if (!arr?.length) return [];
  return arr.flat() as T[];
}

export function flattenDeep<T>(arr: unknown[]): T[] {
  if (!arr?.length) return [];
  return arr.flat(Infinity) as T[];
}

export function compact<T>(arr: (T | null | undefined | false | 0 | '')[]): T[] {
  if (!arr?.length) return [];
  return arr.filter(Boolean) as T[];
}

export function intersection<T>(arr1: T[], arr2: T[]): T[] {
  if (!arr1?.length || !arr2?.length) return [];
  const set = new Set(arr2);
  return arr1.filter((item) => set.has(item));
}

export function difference<T>(arr1: T[], arr2: T[]): T[] {
  if (!arr1?.length) return [];
  if (!arr2?.length) return [...arr1];
  const set = new Set(arr2);
  return arr1.filter((item) => !set.has(item));
}

export function union<T>(arr1: T[], arr2: T[]): T[] {
  if (!arr1?.length && !arr2?.length) return [];
  if (!arr1?.length) return [...arr2];
  if (!arr2?.length) return [...arr1];
  return Array.from(new Set([...arr1, ...arr2]));
}

export function groupBy<T>(arr: T[], key: keyof T | ((item: T) => string)): Record<string, T[]> {
  if (!arr?.length) return {};
  const getKey = typeof key === 'function' ? key : (item: T) => String(item[key]);
  return arr.reduce<Record<string, T[]>>((acc, item) => {
    const group = getKey(item);
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});
}

export function shuffle<T>(arr: T[]): T[] {
  if (!arr?.length) return [];
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function sample<T>(arr: T[]): T | undefined {
  if (!arr?.length) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
}

export function sampleSize<T>(arr: T[], n: number): T[] {
  if (!arr?.length || n <= 0) return [];
  return shuffle(arr).slice(0, Math.min(n, arr.length));
}

export function zip<T, U>(arr1: T[], arr2: U[]): [T | undefined, U | undefined][] {
  if (!arr1?.length && !arr2?.length) return [];
  const length = Math.max(arr1?.length ?? 0, arr2?.length ?? 0);
  const result: [T | undefined, U | undefined][] = [];
  for (let i = 0; i < length; i++) {
    result.push([arr1?.[i], arr2?.[i]]);
  }
  return result;
}

export function unzip<T, U>(arr: [T, U][]): [T[], U[]] {
  if (!arr?.length) return [[], []];
  const arr1: T[] = [];
  const arr2: U[] = [];
  for (const [a, b] of arr) {
    arr1.push(a);
    arr2.push(b);
  }
  return [arr1, arr2];
}

export function partition<T>(arr: T[], predicate: (item: T) => boolean): [T[], T[]] {
  if (!arr?.length) return [[], []];
  const pass: T[] = [];
  const fail: T[] = [];
  for (const item of arr) {
    (predicate(item) ? pass : fail).push(item);
  }
  return [pass, fail];
}

export function take<T>(arr: T[], n: number): T[] {
  if (!arr?.length || n <= 0) return [];
  return arr.slice(0, n);
}

export function drop<T>(arr: T[], n: number): T[] {
  if (!arr?.length) return [];
  return arr.slice(Math.max(0, n));
}

export function takeRight<T>(arr: T[], n: number): T[] {
  if (!arr?.length || n <= 0) return [];
  return arr.slice(-n);
}

export function dropRight<T>(arr: T[], n: number): T[] {
  if (!arr?.length) return [];
  return arr.slice(0, Math.max(0, arr.length - n));
}

export function last<T>(arr: T[]): T | undefined {
  if (!arr?.length) return undefined;
  return arr[arr.length - 1];
}

export function nth<T>(arr: T[], index: number): T | undefined {
  if (!arr?.length) return undefined;
  const i = index < 0 ? arr.length + index : index;
  return arr[i];
}
