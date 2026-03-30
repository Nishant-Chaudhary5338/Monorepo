import { REGEX_PATTERNS } from '../constants/common';

export function isValidEmail(value: string): boolean {
  return REGEX_PATTERNS.EMAIL.test(value);
}

export function isValidUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return REGEX_PATTERNS.URL.test(value);
  }
}

export function isValidSlug(value: string): boolean {
  return REGEX_PATTERNS.SLUG.test(value);
}

export function isPalindrome(value: string): boolean {
  const cleaned = value.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function generateRandomString(
  length: number,
  options: { uppercase?: boolean; lowercase?: boolean; numbers?: boolean; symbols?: boolean } = {}
): string {
  const { uppercase = true, lowercase = true, numbers = true, symbols = false } = options;
  let chars = '';
  if (uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (numbers) chars += '0123456789';
  if (symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';

  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateId(prefix = ''): string {
  const timestamp = Date.now().toString(36);
  const random = generateRandomString(8, { lowercase: true, numbers: true });
  return prefix ? `${prefix}_${timestamp}${random}` : `${timestamp}${random}`;
}

export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
