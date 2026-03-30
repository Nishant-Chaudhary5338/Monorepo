export function isValidUrl(value: string): boolean {
  if (!value?.trim()) return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export function isAbsoluteUrl(value: string): boolean {
  if (!value?.trim()) return false;
  return /^https?:\/\//.test(value);
}

export function isSecureUrl(value: string): boolean {
  if (!value?.trim()) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:';
  } catch {
    return false;
  }
}
