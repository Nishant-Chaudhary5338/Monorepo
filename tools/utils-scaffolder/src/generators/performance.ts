// ============================================================================
// PERFORMANCE MODULE GENERATOR
// ============================================================================

export function generatePerformanceModule(): Record<string, string> {
  return {
    'index.ts': `// ============================================================================
// PERFORMANCE MODULE - Performance utilities (debounce, throttle, memoize)
// ============================================================================

/**
 * Creates a debounced function that delays execution until after wait ms
 * @param fn - Function to debounce
 * @param wait - Delay in milliseconds
 * @returns Debounced function
 * @example const debouncedSearch = debounce(search, 300)
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (this: unknown, ...args: Parameters<T>) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, wait);
  };
}

/**
 * Creates a throttled function that executes at most once per wait ms
 * @param fn - Function to throttle
 * @param wait - Throttle interval in milliseconds
 * @returns Throttled function
 * @example const throttledScroll = throttle(handleScroll, 100)
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  wait: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (this: unknown, ...args: Parameters<T>) {
    const now = Date.now();
    const remaining = wait - (now - lastCall);

    if (remaining <= 0) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      lastCall = now;
      fn.apply(this, args);
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        timeoutId = null;
        fn.apply(this, args);
      }, remaining);
    }
  };
}

/**
 * Creates a memoized version of a function
 * @param fn - Function to memoize
 * @param keyFn - Optional custom key generator
 * @returns Memoized function
 * @example const memoizedAdd = memoize((a, b) => a + b)
 */
export function memoize<T extends (...args: unknown[]) => unknown>(
  fn: T,
  keyFn?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, unknown>();

  return function (this: unknown, ...args: Parameters<T>) {
    const key = keyFn ? keyFn(...args) : JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  } as T;
}

/**
 * Measures execution time of a function
 * @param fn - Function to measure
 * @param label - Label for the measurement
 * @returns Function result and execution time
 * @example const { result, duration } = await measureExecution(() => heavyCalc())
 */
export async function measureExecution<T>(
  fn: () => T | Promise<T>,
  label = 'Execution'
): Promise<{ result: T; duration: number }> {
  const start = performance.now();
  const result = await fn();
  const duration = performance.now() - start;
  return { result, duration };
}

/**
 * Creates a requestAnimationFrame-based scheduler
 * @param fn - Function to schedule
 * @returns Cancel function
 * @example const cancel = createRAF(() => updatePosition(x, y))
 */
export function createRAF(fn: () => void): () => void {
  let rafId: number | null = null;

  const schedule = () => {
    if (rafId !== null) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      fn();
      rafId = null;
    });
  };

  schedule();

  return () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };
}

/**
 * Batch processes an array in chunks to avoid blocking the main thread
 * @param items - Items to process
 * @param processFn - Processing function for each item
 * @param batchSize - Items per batch (default: 100)
 * @returns Promise that resolves when all items are processed
 */
export async function batchProcess<T>(
  items: T[],
  processFn: (item: T, index: number) => void,
  batchSize = 100
): Promise<void> {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    batch.forEach((item, idx) => processFn(item, i + idx));
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
}

/**
 * Creates a lazy initializer that only runs once
 * @param initializer - Initialization function
 * @returns Lazy getter function
 * @example const getConfig = lazy(() => loadConfig())
 */
export function lazy<T>(initializer: () => T): () => T {
  let value: T | undefined;
  let initialized = false;

  return () => {
    if (!initialized) {
      value = initializer();
      initialized = true;
    }
    return value as T;
  };
}

/**
 * Creates a function cache with TTL expiration
 * @param ttl - Time to live in milliseconds
 * @returns Cache object with get/set/clear methods
 */
export function createTimedCache<T>(ttl: number) {
  const cache = new Map<string, { value: T; expires: number }>();

  return {
    get: (key: string): T | undefined => {
      const entry = cache.get(key);
      if (!entry) return undefined;
      if (Date.now() > entry.expires) {
        cache.delete(key);
        return undefined;
      }
      return entry.value;
    },
    set: (key: string, value: T): void => {
      cache.set(key, { value, expires: Date.now() + ttl });
    },
    has: (key: string): boolean => {
      const entry = cache.get(key);
      if (!entry) return false;
      if (Date.now() > entry.expires) {
        cache.delete(key);
        return false;
      }
      return true;
    },
    clear: (): void => {
      cache.clear();
    },
  };
}
`,
    'performance.test.ts': `import { describe, it, expect, vi } from 'vitest'
import { debounce, throttle, memoize, measureExecution, lazy, createTimedCache } from './index'

describe('Performance Module', () => {
  describe('debounce', () => {
    it('delays function execution', async () => {
      const fn = vi.fn()
      const debounced = debounce(fn, 50)
      debounced()
      debounced()
      debounced()
      expect(fn).not.toHaveBeenCalled()
      await new Promise((r) => setTimeout(r, 60))
      expect(fn).toHaveBeenCalledTimes(1)
    })
  })

  describe('throttle', () => {
    it('limits function calls', () => {
      const fn = vi.fn()
      const throttled = throttle(fn, 100)
      throttled()
      throttled()
      throttled()
      expect(fn).toHaveBeenCalledTimes(1)
    })
  })

  describe('memoize', () => {
    it('caches function results', () => {
      const fn = vi.fn((a: number, b: number) => a + b)
      const memoized = memoize(fn)
      expect(memoized(1, 2)).toBe(3)
      expect(memoized(1, 2)).toBe(3)
      expect(fn).toHaveBeenCalledTimes(1)
    })
  })

  describe('measureExecution', () => {
    it('measures execution time', async () => {
      const { result, duration } = await measureExecution(() => 42)
      expect(result).toBe(42)
      expect(duration).toBeGreaterThanOrEqual(0)
    })
  })

  describe('lazy', () => {
    it('initializes only once', () => {
      const init = vi.fn(() => ({ data: 'test' }))
      const getter = lazy(init)
      getter()
      getter()
      expect(init).toHaveBeenCalledTimes(1)
    })
  })

  describe('createTimedCache', () => {
    it('stores and retrieves values', () => {
      const cache = createTimedCache<string>(1000)
      cache.set('key', 'value')
      expect(cache.get('key')).toBe('value')
    })

    it('expires values after TTL', async () => {
      const cache = createTimedCache<string>(10)
      cache.set('key', 'value')
      await new Promise((r) => setTimeout(r, 20))
      expect(cache.get('key')).toBeUndefined()
    })
  })
})
`,
  };
}