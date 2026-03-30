// ============================================================================
// CONSTANTS MODULE GENERATOR
// ============================================================================

export function generateConstantsModule(): Record<string, string> {
  return {
    'index.ts': `// ============================================================================
// CONSTANTS - Common constants for enterprise applications
// ============================================================================

/**
 * HTTP status codes
 * @example
 * HTTP_STATUS.OK // 200
 * HTTP_STATUS.NOT_FOUND // 404
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

export type HttpStatusCode = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];

/**
 * HTTP methods
 */
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  HEAD: 'HEAD',
  OPTIONS: 'OPTIONS',
} as const;

export type HttpMethod = (typeof HTTP_METHODS)[keyof typeof HTTP_METHODS];

/**
 * Sort order constants
 */
export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export type SortOrder = (typeof SORT_ORDER)[keyof typeof SORT_ORDER];

/**
 * Date format strings compatible with date-fns
 */
export const DATE_FORMATS = {
  ISO: 'yyyy-MM-dd',
  ISO_FULL: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
  US: 'MM/dd/yyyy',
  EU: 'dd/MM/yyyy',
  LONG: 'MMMM d, yyyy',
  SHORT: 'MMM d, yyyy',
  TIME: 'HH:mm:ss',
  TIME_SHORT: 'HH:mm',
  DATETIME: 'yyyy-MM-dd HH:mm:ss',
  RELATIVE: 'relative',
} as const;

/**
 * File size units in bytes
 */
export const FILE_SIZE_UNITS = {
  BYTE: 1,
  KB: 1024,
  MB: 1024 * 1024,
  GB: 1024 * 1024 * 1024,
  TB: 1024 * 1024 * 1024 * 1024,
} as const;

/**
 * Common regex patterns
 */
export const REGEX_PATTERNS = {
  EMAIL: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/,
  URL: /^https?:\\/\\/[^\\s/$.?#].[^\\s]*$/,
  PHONE_US: /^\\+?1?\\s?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}$/,
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  HEX_COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  PASSWORD_STRONG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$/,
  IPV4: /^(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$/,
  IPV6: /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/,
  CREDIT_CARD: /^\\d{4}[- ]?\\d{4}[- ]?\\d{4}[- ]?\\d{4}$/,
  HTML_TAG: /<[^>]*>/g,
  MARKDOWN_BOLD: /\\*\\*(.*?)\\*\\*/g,
  MARKDOWN_ITALIC: /\\*(.*?)\\*/g,
} as const;

/**
 * Local storage key prefixes
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'app_theme',
  LANGUAGE: 'app_language',
  SIDEBAR_STATE: 'sidebar_state',
  RECENT_SEARCHES: 'recent_searches',
} as const;

/**
 * Common event names for analytics/tracking
 */
export const EVENT_NAMES = {
  PAGE_VIEW: 'page_view',
  CLICK: 'click',
  FORM_SUBMIT: 'form_submit',
  SEARCH: 'search',
  LOGIN: 'login',
  LOGOUT: 'logout',
  SIGN_UP: 'sign_up',
  ERROR: 'error',
  API_CALL: 'api_call',
} as const;

/**
 * Error codes for standardized error handling
 */
export const ERROR_CODES = {
  UNKNOWN: 'UNKNOWN_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  AUTHENTICATION: 'AUTHENTICATION_ERROR',
  AUTHORIZATION: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  RATE_LIMIT: 'RATE_LIMIT_ERROR',
  NETWORK: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT_ERROR',
  SERVER: 'SERVER_ERROR',
} as const;

/**
 * Default configuration values
 */
export const DEFAULTS = {
  PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  DEBOUNCE_MS: 300,
  THROTTLE_MS: 100,
  CACHE_TTL_MS: 5 * 60 * 1000, // 5 minutes
  RETRY_COUNT: 3,
  RETRY_DELAY_MS: 1000,
  MAX_FILE_SIZE_MB: 10,
  TOAST_DURATION_MS: 5000,
  ANIMATION_DURATION_MS: 300,
} as const;

/**
 * Breakpoints for responsive design
 */
export const BREAKPOINTS = {
  XS: 0,
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536,
} as const;

/**
 * Z-index layers
 */
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  TOAST: 1080,
} as const;
`,
    'constants.test.ts': `import { describe, it, expect } from 'vitest'
import {
  HTTP_STATUS,
  HTTP_METHODS,
  SORT_ORDER,
  DATE_FORMATS,
  FILE_SIZE_UNITS,
  REGEX_PATTERNS,
  STORAGE_KEYS,
  ERROR_CODES,
  DEFAULTS,
  BREAKPOINTS,
  Z_INDEX,
} from './index'

describe('Constants Module', () => {
  describe('HTTP_STATUS', () => {
    it('contains standard status codes', () => {
      expect(HTTP_STATUS.OK).toBe(200)
      expect(HTTP_STATUS.NOT_FOUND).toBe(404)
      expect(HTTP_STATUS.INTERNAL_SERVER_ERROR).toBe(500)
    })
  })

  describe('HTTP_METHODS', () => {
    it('contains all standard methods', () => {
      expect(HTTP_METHODS.GET).toBe('GET')
      expect(HTTP_METHODS.POST).toBe('POST')
      expect(HTTP_METHODS.DELETE).toBe('DELETE')
    })
  })

  describe('SORT_ORDER', () => {
    it('has asc and desc values', () => {
      expect(SORT_ORDER.ASC).toBe('asc')
      expect(SORT_ORDER.DESC).toBe('desc')
    })
  })

  describe('REGEX_PATTERNS', () => {
    it('EMAIL matches valid emails', () => {
      expect(REGEX_PATTERNS.EMAIL.test('test@example.com')).toBe(true)
      expect(REGEX_PATTERNS.EMAIL.test('invalid')).toBe(false)
    })

    it('URL matches valid URLs', () => {
      expect(REGEX_PATTERNS.URL.test('https://example.com')).toBe(true)
      expect(REGEX_PATTERNS.URL.test('not-a-url')).toBe(false)
    })

    it('UUID matches valid UUIDs', () => {
      expect(REGEX_PATTERNS.UUID.test('550e8400-e29b-41d4-a716-446655440000')).toBe(true)
      expect(REGEX_PATTERNS.UUID.test('not-a-uuid')).toBe(false)
    })

    it('HEX_COLOR matches valid hex colors', () => {
      expect(REGEX_PATTERNS.HEX_COLOR.test('#FF5733')).toBe(true)
      expect(REGEX_PATTERNS.HEX_COLOR.test('#fff')).toBe(true)
      expect(REGEX_PATTERNS.HEX_COLOR.test('not-a-color')).toBe(false)
    })
  })

  describe('FILE_SIZE_UNITS', () => {
    it('has correct byte values', () => {
      expect(FILE_SIZE_UNITS.KB).toBe(1024)
      expect(FILE_SIZE_UNITS.MB).toBe(1024 * 1024)
    })
  })

  describe('DEFAULTS', () => {
    it('has reasonable default values', () => {
      expect(DEFAULTS.PAGE_SIZE).toBe(20)
      expect(DEFAULTS.DEBOUNCE_MS).toBe(300)
      expect(DEFAULTS.CACHE_TTL_MS).toBe(5 * 60 * 1000)
    })
  })

  describe('BREAKPOINTS', () => {
    it('has ascending breakpoint values', () => {
      expect(BREAKPOINTS.SM).toBeLessThan(BREAKPOINTS.MD)
      expect(BREAKPOINTS.MD).toBeLessThan(BREAKPOINTS.LG)
      expect(BREAKPOINTS.LG).toBeLessThan(BREAKPOINTS.XL)
    })
  })

  describe('Z_INDEX', () => {
    it('has ascending z-index values', () => {
      expect(Z_INDEX.DROPDOWN).toBeLessThan(Z_INDEX.MODAL)
      expect(Z_INDEX.MODAL).toBeLessThan(Z_INDEX.TOOLTIP)
    })
  })
})
`,
  };
}