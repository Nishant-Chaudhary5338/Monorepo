import { describe, it, expect } from 'vitest';
import { isValidUrl, isAbsoluteUrl, isSecureUrl } from './validators';

describe('isValidUrl', () => {
  it('validates correct URLs', () => {
    expect(isValidUrl('https://example.com')).toBe(true);
    expect(isValidUrl('http://localhost:3000')).toBe(true);
  });
  it('rejects invalid URLs', () => {
    expect(isValidUrl('not a url')).toBe(false);
    expect(isValidUrl('')).toBe(false);
  });
});

describe('isAbsoluteUrl', () => {
  it('returns true for http/https URLs', () => {
    expect(isAbsoluteUrl('https://example.com')).toBe(true);
    expect(isAbsoluteUrl('http://example.com')).toBe(true);
  });
  it('returns false for relative URLs', () => {
    expect(isAbsoluteUrl('/path/to/page')).toBe(false);
    expect(isAbsoluteUrl('ftp://example.com')).toBe(false);
  });
});

describe('isSecureUrl', () => {
  it('returns true for https URLs', () => {
    expect(isSecureUrl('https://example.com')).toBe(true);
  });
  it('returns false for http URLs', () => {
    expect(isSecureUrl('http://example.com')).toBe(false);
  });
  it('returns false for invalid URLs', () => {
    expect(isSecureUrl('not a url')).toBe(false);
  });
});
