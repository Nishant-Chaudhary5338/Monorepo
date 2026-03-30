export function memoize<TArgs extends any[], TResult>(
  fn: (...args: TArgs) => TResult,
  options: { maxSize?: number; keyFn?: (...args: TArgs) => string } = {}
): (...args: TArgs) => TResult {
  if (typeof fn !== 'function') {
    throw new Error('First argument must be a function');
  }
  
  const { maxSize = 100, keyFn = (...args) => JSON.stringify(args) } = options;
  const safeMaxSize = Math.max(1, Math.floor(maxSize) || 100);
  const cache = new Map<string, { value: TResult; timestamp: number }>();
  const keys: string[] = [];

  return (...args: TArgs): TResult => {
    const key = keyFn(...args);
    const cached = cache.get(key);
    if (cached) return cached.value;

    // Evict oldest
    if (keys.length >= safeMaxSize) {
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
  if (typeof fn !== 'function') {
    throw new Error('First argument must be a function');
  }
  
  const { maxSize = 100, ttl = 60000, keyFn = (...args) => JSON.stringify(args) } = options;
  const safeMaxSize = Math.max(1, Math.floor(maxSize) || 100);
  const safeTtl = Math.max(0, Math.floor(ttl) || 0);
  const cache = new Map<string, { value: TResult; timestamp: number }>();
  const pending = new Map<string, Promise<TResult>>();
  const keys: string[] = [];

  return async (...args: TArgs): Promise<TResult> => {
    const key = keyFn(...args);
    
    // Check if there's a pending request for this key
    const pendingPromise = pending.get(key);
    if (pendingPromise) return pendingPromise;

    const cached = cache.get(key);
    if (cached && (safeTtl <= 0 || Date.now() - cached.timestamp < safeTtl)) {
      return cached.value;
    }

    if (keys.length >= safeMaxSize) {
      const oldest = keys.shift()!;
      cache.delete(oldest);
    }

    // Create promise and add to pending map
    const promise = fn(...args)
      .then((result) => {
        cache.set(key, { value: result, timestamp: Date.now() });
        keys.push(key);
        pending.delete(key);
        return result;
      })
      .catch((error) => {
        pending.delete(key);
        throw error;
      });

    pending.set(key, promise);
    return promise;
  };
}
