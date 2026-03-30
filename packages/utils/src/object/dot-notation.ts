export function get<T>(obj: unknown, path: string, defaultValue?: T): T | undefined {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current === null || current === undefined) return defaultValue;
    current = (current as Record<string, unknown>)[key];
  }
  return (current as T | undefined) ?? defaultValue;
}

export function set<T>(obj: Record<string, unknown>, path: string, value: T): Record<string, unknown> {
  const keys = path.split('.');
  let current: Record<string, unknown> = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }
  current[keys[keys.length - 1]] = value;
  return obj;
}

export function has(obj: unknown, path: string): boolean {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') return false;
    if (!(key in current)) return false;
    current = (current as Record<string, unknown>)[key];
  }
  return true;
}

export function unset(obj: Record<string, unknown>, path: string): boolean {
  const keys = path.split('.');
  let current: Record<string, unknown> = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || typeof current[key] !== 'object') return false;
    current = current[key] as Record<string, unknown>;
  }
  const lastKey = keys[keys.length - 1];
  if (!(lastKey in current)) return false;
  delete current[lastKey];
  return true;
}
