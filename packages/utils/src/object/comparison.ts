export function shallowEqual<T>(a: T, b: T): boolean {
  if (a === b) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((key) => (a as Record<string, unknown>)[key] === (b as Record<string, unknown>)[key]);
}

export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a === null || b === null) return false;
  if (typeof a !== typeof b) return false;
  if (typeof a !== 'object') return false;

  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, i) => deepEqual(item, b[i]));
  }

  const objA = a as Record<string, unknown>;
  const objB = b as Record<string, unknown>;
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((key) => deepEqual(objA[key], objB[key]));
}

export function diff(
  a: Record<string, unknown>,
  b: Record<string, unknown>
): { added: string[]; removed: string[]; changed: string[] } {
  const keysA = new Set(Object.keys(a));
  const keysB = new Set(Object.keys(b));
  const added = [...keysB].filter((k) => !keysA.has(k));
  const removed = [...keysA].filter((k) => !keysB.has(k));
  const changed = [...keysA]
    .filter((k) => keysB.has(k) && !deepEqual(a[k], b[k]));
  return { added, removed, changed };
}
