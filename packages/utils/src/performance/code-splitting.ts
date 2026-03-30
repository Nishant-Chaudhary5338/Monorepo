export function dynamicImport<T>(importFn: () => Promise<T>): () => Promise<T> {
  return importFn;
}

export function createPrefetch<T>(importFn: () => Promise<T>): { load: () => Promise<T>; prefetch: () => void } {
  let cached: Promise<T> | null = null;
  return {
    load: () => {
      if (!cached) cached = importFn();
      return cached;
    },
    prefetch: () => {
      if (!cached) cached = importFn();
    },
  };
}
