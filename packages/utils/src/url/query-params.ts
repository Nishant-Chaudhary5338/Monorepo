export function parseQueryParams(search: string): Record<string, string> {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

export function stringifyQueryParams(params: Record<string, string | number | boolean | null | undefined>): string {
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
  const [, search] = url.split('?');
  if (!search) return null;
  const params = new URLSearchParams(search);
  return params.get(key);
}

export function setQueryParam(url: string, key: string, value: string): string {
  return addQueryParams(url, { [key]: value });
}
