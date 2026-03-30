// ============================================================================
// OBJECT MODULE GENERATOR
// ============================================================================

export function generateObjectModule(): Record<string, string> {
  return {
    'index.ts': `// ============================================================================
// OBJECT MODULE - Deep object manipulation utilities
// ============================================================================

/**
 * Deep merges multiple objects
 * @param target - Target object
 * @param sources - Source objects to merge
 * @returns Merged object
 * @example deepMerge({ a: 1 }, { b: 2, nested: { c: 3 } }) // { a: 1, b: 2, nested: { c: 3 } }
 */
export function deepMerge<T extends Record<string, unknown>>(target: T, ...sources: Partial<T>[]): T {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key of Object.keys(source)) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key] as Record<string, unknown>, source[key] as Record<string, unknown>);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepMerge(target, ...sources);
}

function isObject(item: unknown): item is Record<string, unknown> {
  return item !== null && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Picks specific keys from an object
 * @param obj - Source object
 * @param keys - Keys to pick
 * @returns New object with only picked keys
 * @example pick({ a: 1, b: 2, c: 3 }, ['a', 'c']) // { a: 1, c: 3 }
 */
export function pick<T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * Omits specific keys from an object
 * @param obj - Source object
 * @param keys - Keys to omit
 * @returns New object without omitted keys
 * @example omit({ a: 1, b: 2, c: 3 }, ['b']) // { a: 1, c: 3 }
 */
export function omit<T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result as Omit<T, K>;
}

/**
 * Gets a nested value from an object using dot notation
 * @param obj - Source object
 * @param path - Dot-notation path (e.g., 'user.address.city')
 * @param defaultValue - Default value if path not found
 * @returns Value at path or default
 * @example getNestedValue({ user: { name: 'John' } }, 'user.name') // 'John'
 */
export function getNestedValue<T = unknown>(obj: Record<string, unknown>, path: string, defaultValue?: T): T {
  const keys = path.split('.');
  let result: unknown = obj;

  for (const key of keys) {
    if (result === null || result === undefined) return defaultValue as T;
    result = (result as Record<string, unknown>)[key];
  }

  return (result === undefined ? defaultValue : result) as T;
}

/**
 * Sets a nested value in an object using dot notation
 * @param obj - Target object
 * @param path - Dot-notation path
 * @param value - Value to set
 * @returns Modified object
 * @example setNestedValue({}, 'user.name', 'John') // { user: { name: 'John' } }
 */
export function setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): Record<string, unknown> {
  const keys = path.split('.');
  let current = obj;

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

/**
 * Flattens a nested object to dot-notation keys
 * @param obj - Object to flatten
 * @param prefix - Key prefix
 * @returns Flattened object
 * @example flattenObject({ a: { b: 1 } }) // { 'a.b': 1 }
 */
export function flattenObject(obj: Record<string, unknown>, prefix = ''): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? \`\${prefix}.\${key}\` : key;

    if (isObject(value) && Object.keys(value).length > 0) {
      Object.assign(result, flattenObject(value, newKey));
    } else {
      result[newKey] = value;
    }
  }

  return result;
}

/**
 * Deep clones an object
 * @param obj - Object to clone
 * @returns Deep cloned object
 * @example deepClone({ a: { b: 1 } }) // { a: { b: 1 } } (new reference)
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(deepClone) as unknown as T;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (obj instanceof RegExp) return new RegExp(obj) as unknown as T;

  const cloned = {} as T;
  for (const key of Object.keys(obj)) {
    (cloned as Record<string, unknown>)[key] = deepClone((obj as Record<string, unknown>)[key]);
  }
  return cloned;
}

/**
 * Deep equality check for objects
 * @param a - First value
 * @param b - Second value
 * @returns True if deeply equal
 * @example deepEqual({ a: 1 }, { a: 1 }) // true
 */
export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a === null || b === null) return false;
  if (typeof a !== typeof b) return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, i) => deepEqual(item, b[i]));
  }

  if (isObject(a) && isObject(b)) {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    return keysA.every((key) => deepEqual(a[key], b[key]));
  }

  return false;
}

/**
 * Gets all keys from a nested object
 * @param obj - Object to traverse
 * @param prefix - Key prefix
 * @returns Array of dot-notation paths
 * @example getAllKeys({ a: { b: 1 }, c: 2 }) // ['a.b', 'c']
 */
export function getAllKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  const keys: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? \`\${prefix}.\${key}\` : key;
    keys.push(path);

    if (isObject(value)) {
      keys.push(...getAllKeys(value, path));
    }
  }

  return keys;
}
`,
    'object.test.ts': `import { describe, it, expect } from 'vitest'
import { pick, omit, deepMerge, getNestedValue, setNestedValue, flattenObject, deepClone, deepEqual } from './index'

describe('Object Module', () => {
  describe('pick', () => {
    it('picks specified keys', () => {
      expect(pick({ a: 1, b: 2, c: 3 }, ['a', 'c'])).toEqual({ a: 1, c: 3 })
    })
  })

  describe('omit', () => {
    it('omits specified keys', () => {
      expect(omit({ a: 1, b: 2, c: 3 }, ['b'])).toEqual({ a: 1, c: 3 })
    })
  })

  describe('deepMerge', () => {
    it('deep merges objects', () => {
      const result = deepMerge({ a: 1 }, { b: 2, nested: { c: 3 } })
      expect(result).toEqual({ a: 1, b: 2, nested: { c: 3 } })
    })
  })

  describe('getNestedValue', () => {
    it('gets nested value by path', () => {
      expect(getNestedValue({ user: { name: 'John' } }, 'user.name')).toBe('John')
    })
    it('returns default for missing path', () => {
      expect(getNestedValue({}, 'missing', 'default')).toBe('default')
    })
  })

  describe('setNestedValue', () => {
    it('sets nested value by path', () => {
      const obj = setNestedValue({}, 'user.name', 'John')
      expect(obj).toEqual({ user: { name: 'John' } })
    })
  })

  describe('flattenObject', () => {
    it('flattens nested object', () => {
      expect(flattenObject({ a: { b: 1 }, c: 2 })).toEqual({ 'a.b': 1, c: 2 })
    })
  })

  describe('deepClone', () => {
    it('creates deep clone', () => {
      const original = { a: { b: 1 } }
      const clone = deepClone(original)
      expect(clone).toEqual(original)
      expect(clone.a).not.toBe(original.a)
    })
  })

  describe('deepEqual', () => {
    it('returns true for equal objects', () => {
      expect(deepEqual({ a: 1 }, { a: 1 })).toBe(true)
    })
    it('returns false for different objects', () => {
      expect(deepEqual({ a: 1 }, { a: 2 })).toBe(false)
    })
  })
})
`,
  };
}