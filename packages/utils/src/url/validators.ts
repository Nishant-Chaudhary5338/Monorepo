export function isValidUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export function isAbsoluteUrl(value: string): boolean {
  return /^https?:\/\//.test(value);
}

export function isSecureUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:';
  } catch {
    return false;
  }
}
