export function parseQueryParams(search: string): Record<string, string> {
  if (!search?.trim()) return {};
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

export function stringifyQueryParams(params: Record<string, string | number | boolean | null | undefined>): string {
  if (!params || typeof params !== 'object') return '';
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined) {
      searchParams.append(key, String(value));
    }
  }
  return searchParams.toString();
}

export function addQueryParams(
  url: string,
  params: Record<string, string | number | boolean | null | undefined>
): string {
  if (!url?.trim()) return '';
  if (!params || typeof params !== 'object') return url;
  const [base, existingSearch] = url.split('?');
  const existing = existingSearch ? parseQueryParams(existingSearch) : {};
  const merged = { ...existing };
  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined) {
      merged[key] = String(value);
    }
  }
  const search = stringifyQueryParams(merged);
  return search ? `${base}?${search}` : base;
}

export function removeQueryParams(url: string, keys: string[]): string {
  if (!url?.trim()) return '';
  if (!keys?.length) return url;
  const [base, existingSearch] = url.split('?');
  if (!existingSearch) return url;
  const params = parseQueryParams(existingSearch);
  for (const key of keys) {
    delete params[key];
  }
  const search = stringifyQueryParams(params);
  return search ? `${base}?${search}` : base;
}

export function getQueryParam(url: string, key: string): string | null {
  if (!url?.trim() || !key?.trim()) return null;
  const [, search] = url.split('?');
  if (!search) return null;
  const params = new URLSearchParams(search);
  return params.get(key);
}

export function setQueryParam(url: string, key: string, value: string): string {
  if (!url?.trim()) return '';
  if (!key?.trim()) return url;
  return addQueryParams(url, { [key]: value });
}
