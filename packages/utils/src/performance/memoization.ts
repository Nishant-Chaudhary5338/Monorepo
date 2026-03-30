export function memoize<TArgs extends any[], TResult>(
  fn: (...args: TArgs) => TResult,
  options: { maxSize?: number; keyFn?: (...args: TArgs) => string } = {}
): (...args: TArgs) => TResult {
  const { maxSize = 100, keyFn = (...args) => JSON.stringify(args) } = options;
  const cache = new Map<string, { value: TResult; timestamp: number }>();
  let keys: string[] = [];

  return (...args: TArgs): TResult => {
    const key = keyFn(...args);
    const cached = cache.get(key);
    if (cached) return cached.value;

    // Evict oldest
    if (keys.length >= maxSize) {
      const oldest = keys.shift()!;
      cache.delete(oldest);
    }

    const result = fn(...args);
    cache.set(key, { value: result, timestamp: Date.now() });
    keys.push(key);
    return result;
  };
}

export function memoizeAsync<TArgs extends any[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  options: { maxSize?: number; ttl?: number; keyFn?: (...args: TArgs) => string } = {}
): (...args: TArgs) => Promise<TResult> {
  const { maxSize = 100, ttl = 60000, keyFn = (...args) => JSON.stringify(args) } = options;
  const cache = new Map<string, { value: TResult; timestamp: number }>();
  let keys: string[] = [];

  return async (...args: TArgs): Promise<TResult> => {
    const key = keyFn(...args);
    const cached = cache.get(key);
    if (cached && (ttl <= 0 || Date.now() - cached.timestamp < ttl)) {
      return cached.value;
    }

    if (keys.length >= maxSize) {
      const oldest = keys.shift()!;
      cache.delete(oldest);
    }

    const result = await fn(...args);
    cache.set(key, { value: result, timestamp: Date.now() });
    keys.push(key);
    return result;
  };
}
