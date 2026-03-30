export function buildUrl(
  base: string,
  path: string,
  params?: Record<string, string | number | boolean | null | undefined>
): string {
  if (!base?.trim()) {
    throw new Error('Base URL is required');
  }
  if (!path?.trim()) {
    throw new Error('Path is required');
  }
  
  try {
    const url = new URL(path, base);
    if (params && typeof params === 'object') {
      for (const [key, value] of Object.entries(params)) {
        if (value !== null && value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      }
    }
    return url.toString();
  } catch (error) {
    throw new Error(`Invalid URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function joinPaths(...paths: string[]): string {
  return paths
    .filter((p) => p?.trim())
    .map((p, i) => {
      if (i === 0) return p.replace(/\/+$/, '');
      return p.replace(/^\/+|\/+$/g, '');
    })
    .filter(Boolean)
    .join('/');
}
