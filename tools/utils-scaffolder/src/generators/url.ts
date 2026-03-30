// ============================================================================
// URL MODULE GENERATOR
// ============================================================================

export function generateUrlModule(): Record<string, string> {
  return {
    'index.ts': `// ============================================================================
// URL MODULE - URL parsing, building, and query manipulation
// ============================================================================

export interface ParsedURL {
  protocol: string;
  host: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  origin: string;
}

/**
 * Parses a URL string into its components
 * @param url - URL string to parse
 * @returns Parsed URL object
 * @example parseURL('https://example.com/path?q=1#hash')
 */
export function parseURL(url: string): ParsedURL | null {
  try {
    const parsed = new URL(url);
    return {
      protocol: parsed.protocol,
      host: parsed.host,
      hostname: parsed.hostname,
      port: parsed.port,
      pathname: parsed.pathname,
      search: parsed.search,
      hash: parsed.hash,
      origin: parsed.origin,
    };
  } catch {
    return null;
  }
}

/**
 * Builds a URL from components
 * @param base - Base URL or origin
 * @param path - Path to append
 * @param params - Query parameters
 * @returns Built URL string
 * @example buildURL('https://api.com', '/users', { page: 1 })
 */
export function buildURL(base: string, path?: string, params?: Record<string, string | number | boolean>): string {
  const url = new URL(path || '', base);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, String(value));
    });
  }
  return url.toString();
}

/**
 * Gets query parameters from a URL string
 * @param url - URL string
 * @returns Object of query parameters
 * @example getQueryParams('https://example.com?q=1&page=2') // { q: '1', page: '2' }
 */
export function getQueryParams(url: string): Record<string, string> {
  try {
    const parsed = new URL(url);
    const params: Record<string, string> = {};
    parsed.searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  } catch {
    return {};
  }
}

/**
 * Updates query parameters in a URL
 * @param url - URL string
 * @param params - Parameters to update/add/remove (null to remove)
 * @returns Updated URL string
 * @example updateQueryParams('https://example.com?q=1', { page: 2, q: null })
 */
export function updateQueryParams(url: string, params: Record<string, string | number | boolean | null>): string {
  try {
    const parsed = new URL(url);
    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        parsed.searchParams.delete(key);
      } else {
        parsed.searchParams.set(key, String(value));
      }
    });
    return parsed.toString();
  } catch {
    return url;
  }
}

/**
 * Joins URL path segments
 * @param segments - Path segments to join
 * @returns Joined path string
 * @example joinPaths('/api', 'users', '123') // '/api/users/123'
 */
export function joinPaths(...segments: string[]): string {
  return segments
    .map((s) => s.replace(/^\\/|\\/$/g, ''))
    .filter(Boolean)
    .join('/');
}

/**
 * Gets the domain from a URL
 * @param url - URL string
 * @returns Domain name
 * @example getDomain('https://www.example.com/path') // 'example.com'
 */
export function getDomain(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\\./, '');
  } catch {
    return '';
  }
}

/**
 * Checks if a URL is absolute
 * @param url - URL string
 * @returns True if absolute URL
 * @example isAbsoluteURL('https://example.com') // true
 * @example isAbsoluteURL('/path') // false
 */
export function isAbsoluteURL(url: string): boolean {
  return /^https?:\\/\\//.test(url);
}

/**
 * Converts a relative URL to absolute
 * @param relative - Relative URL
 * @param base - Base URL
 * @returns Absolute URL
 * @example toAbsoluteURL('/path', 'https://example.com') // 'https://example.com/path'
 */
export function toAbsoluteURL(relative: string, base: string): string {
  try {
    return new URL(relative, base).toString();
  } catch {
    return relative;
  }
}

/**
 * Strips query parameters and hash from a URL
 * @param url - URL string
 * @returns Clean URL without query/hash
 * @example stripQuery('https://example.com/path?q=1#hash') // 'https://example.com/path'
 */
export function stripQuery(url: string): string {
  try {
    const parsed = new URL(url);
    parsed.search = '';
    parsed.hash = '';
    return parsed.toString();
  } catch {
    return url.split('?')[0].split('#')[0];
  }
}

/**
 * Encodes a string for use in a URL
 * @param str - String to encode
 * @returns URL-encoded string
 */
export function encodeQueryParam(str: string): string {
  return encodeURIComponent(str);
}

/**
 * Decodes a URL-encoded string
 * @param str - URL-encoded string
 * @returns Decoded string
 */
export function decodeQueryParam(str: string): string {
  try {
    return decodeURIComponent(str);
  } catch {
    return str;
  }
}
`,
    'url.test.ts': `import { describe, it, expect } from 'vitest'
import {
  parseURL, buildURL, getQueryParams, updateQueryParams,
  joinPaths, getDomain, isAbsoluteURL, toAbsoluteURL, stripQuery,
} from './index'

describe('URL Module', () => {
  describe('parseURL', () => {
    it('parses valid URL', () => {
      const result = parseURL('https://example.com/path?q=1')
      expect(result?.hostname).toBe('example.com')
      expect(result?.pathname).toBe('/path')
    })
    it('returns null for invalid URL', () => {
      expect(parseURL('not-a-url')).toBeNull()
    })
  })

  describe('buildURL', () => {
    it('builds URL with path and params', () => {
      const url = buildURL('https://api.com', '/users', { page: 1 })
      expect(url).toContain('/users')
      expect(url).toContain('page=1')
    })
  })

  describe('getQueryParams', () => {
    it('extracts query parameters', () => {
      const params = getQueryParams('https://example.com?q=1&page=2')
      expect(params).toEqual({ q: '1', page: '2' })
    })
  })

  describe('updateQueryParams', () => {
    it('adds and removes params', () => {
      const url = updateQueryParams('https://example.com?q=1', { page: 2, q: null })
      expect(url).toContain('page=2')
      expect(url).not.toContain('q=')
    })
  })

  describe('joinPaths', () => {
    it('joins path segments', () => {
      expect(joinPaths('/api', 'users', '123')).toBe('/api/users/123')
      expect(joinPaths('/api/', '/users/')).toBe('/api/users')
    })
  })

  describe('getDomain', () => {
    it('extracts domain', () => {
      expect(getDomain('https://www.example.com/path')).toBe('example.com')
    })
  })

  describe('isAbsoluteURL', () => {
    it('detects absolute URLs', () => {
      expect(isAbsoluteURL('https://example.com')).toBe(true)
      expect(isAbsoluteURL('/path')).toBe(false)
    })
  })

  describe('stripQuery', () => {
    it('removes query and hash', () => {
      expect(stripQuery('https://example.com/path?q=1#hash')).toBe('https://example.com/path')
    })
  })
})
`,
  };
}