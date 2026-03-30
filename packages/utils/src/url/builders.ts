export function buildUrl(
  base: string,
  path: string,
  params?: Record<string, string | number | boolean | null | undefined>
): string {
  const url = new URL(path, base);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== null && value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    }
  }
  return url.toString();
}

export function joinPaths(...paths: string[]): string {
  return paths
    .map((p, i) => {
      if (i === 0) return p.replace(/\/+$/, '');
      return p.replace(/^\/+|\/+$/g, '');
    })
    .filter(Boolean)
    .join('/');
}
