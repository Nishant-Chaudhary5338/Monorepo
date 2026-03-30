import { describe, it, expect } from 'vitest';
import { HTTP_STATUS, HTTP_METHODS, SORT_ORDER, DATE_FORMATS, FILE_SIZE_UNITS, REGEX_PATTERNS, STORAGE_KEYS, ERROR_CODES, KEYS, BREAKPOINTS } from './common';

describe('HTTP_STATUS', () => {
  it('has correct status codes', () => {
    expect(HTTP_STATUS.OK).toBe(200);
    expect(HTTP_STATUS.CREATED).toBe(201);
    expect(HTTP_STATUS.NOT_FOUND).toBe(404);
    expect(HTTP_STATUS.INTERNAL_SERVER_ERROR).toBe(500);
  });
});

describe('HTTP_METHODS', () => {
  it('has all standard methods', () => {
    expect(HTTP_METHODS.GET).toBe('GET');
    expect(HTTP_METHODS.POST).toBe('POST');
    expect(HTTP_METHODS.PUT).toBe('PUT');
    expect(HTTP_METHODS.PATCH).toBe('PATCH');
    expect(HTTP_METHODS.DELETE).toBe('DELETE');
  });
});

describe('SORT_ORDER', () => {
  it('has asc and desc', () => {
    expect(SORT_ORDER.ASC).toBe('asc');
    expect(SORT_ORDER.DESC).toBe('desc');
  });
});

describe('DATE_FORMATS', () => {
  it('has format strings', () => {
    expect(DATE_FORMATS.ISO).toBe('yyyy-MM-dd');
    expect(DATE_FORMATS.US).toBe('MM/dd/yyyy');
  });
});

describe('FILE_SIZE_UNITS', () => {
  it('has correct byte values', () => {
    expect(FILE_SIZE_UNITS.BYTE).toBe(1);
    expect(FILE_SIZE_UNITS.KB).toBe(1024);
    expect(FILE_SIZE_UNITS.MB).toBe(1024 * 1024);
  });
});

describe('REGEX_PATTERNS', () => {
  it('has email pattern', () => {
    expect(REGEX_PATTERNS.EMAIL.test('user@example.com')).toBe(true);
    expect(REGEX_PATTERNS.EMAIL.test('invalid')).toBe(false);
  });
  it('has UUID pattern', () => {
    expect(REGEX_PATTERNS.UUID.test('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
    expect(REGEX_PATTERNS.UUID.test('not-a-uuid')).toBe(false);
  });
  it('has slug pattern', () => {
    expect(REGEX_PATTERNS.SLUG.test('hello-world')).toBe(true);
    expect(REGEX_PATTERNS.SLUG.test('Hello World')).toBe(false);
  });
});

describe('STORAGE_KEYS', () => {
  it('has all storage keys', () => {
    expect(STORAGE_KEYS.AUTH_TOKENS).toBeDefined();
    expect(STORAGE_KEYS.THEME).toBeDefined();
  });
});

describe('ERROR_CODES', () => {
  it('has all error codes', () => {
    expect(ERROR_CODES.NETWORK).toBe('NETWORK_ERROR');
    expect(ERROR_CODES.AUTH_EXPIRED).toBe('AUTH_EXPIRED');
  });
});

describe('KEYS', () => {
  it('has keyboard keys', () => {
    expect(KEYS.ENTER).toBe('Enter');
    expect(KEYS.ESCAPE).toBe('Escape');
  });
});

describe('BREAKPOINTS', () => {
  it('has breakpoint values', () => {
    expect(BREAKPOINTS.SM).toBe(640);
    expect(BREAKPOINTS.MD).toBe(768);
    expect(BREAKPOINTS.LG).toBe(1024);
  });
});
