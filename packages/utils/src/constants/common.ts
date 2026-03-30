// ============================================
// HTTP Constants
// ============================================

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  NOT_MODIFIED: 304,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  HEAD: 'HEAD',
  OPTIONS: 'OPTIONS',
} as const;

// ============================================
// Sort Constants
// ============================================

export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

// ============================================
// Date Format Constants
// ============================================

export const DATE_FORMATS = {
  ISO: 'yyyy-MM-dd',
  ISO_DATETIME: "yyyy-MM-dd'T'HH:mm:ss",
  US: 'MM/dd/yyyy',
  EU: 'dd/MM/yyyy',
  LONG: 'MMMM d, yyyy',
  SHORT: 'MMM d, yyyy',
  TIME_24: 'HH:mm:ss',
  TIME_12: 'h:mm:ss a',
  DATETIME_LONG: 'MMMM d, yyyy h:mm a',
  DATETIME_SHORT: 'MMM d, yyyy h:mm a',
} as const;

// ============================================
// File Size Constants
// ============================================

export const FILE_SIZE_UNITS = {
  BYTE: 1,
  KB: 1024,
  MB: 1024 * 1024,
  GB: 1024 * 1024 * 1024,
  TB: 1024 * 1024 * 1024 * 1024,
} as const;

export const FILE_SIZE_LABELS = ['B', 'KB', 'MB', 'GB', 'TB'] as const;

// ============================================
// Regex Patterns
// ============================================

export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b[-a-zA-Z0-9()@:%_+.~#?&/=]*$/,
  PHONE_US: /^\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/,
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  HEX_COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  IPV4: /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
  IPV6: /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]+|::(ffff(:0{1,4})?:)?(?:(?:25[0-5]|(?:2[0-4]|1?\d)?\d)\.){3}(?:25[0-5]|(?:2[0-4]|1?\d)?\d)|([0-9a-fA-F]{1,4}:){1,4}:(?:(?:25[0-5]|(?:2[0-4]|1?\d)?\d)\.){3}(?:25[0-5]|(?:2[0-4]|1?\d)?\d))$/,
  CREDIT_CARD: /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/,
  HTML_TAGS: /<[^>]*>/g,
  WHITESPACE: /\s+/g,
  SPECIAL_CHARS: /[^a-zA-Z0-9\s]/g,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  NUMERIC: /^-?\d+(\.\d+)?$/,
  INTEGER: /^-?\d+$/,
  USERNAME: /^[a-zA-Z0-9_-]{3,20}$/,
  PASSWORD_STRONG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
} as const;

// ============================================
// Storage Keys
// ============================================

export const STORAGE_KEYS = {
  AUTH_TOKENS: 'auth_tokens',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  LANGUAGE: 'language',
  SIDEBAR_STATE: 'sidebar_state',
  RECENT_SEARCHES: 'recent_searches',
} as const;

// ============================================
// Error Codes
// ============================================

export const ERROR_CODES = {
  UNKNOWN: 'UNKNOWN_ERROR',
  NETWORK: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT_ERROR',
  AUTH_EXPIRED: 'AUTH_EXPIRED',
  AUTH_INVALID: 'AUTH_INVALID',
  AUTH_REQUIRED: 'AUTH_REQUIRED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION: 'VALIDATION_ERROR',
  CONFLICT: 'CONFLICT',
  RATE_LIMITED: 'RATE_LIMITED',
  SERVER_ERROR: 'SERVER_ERROR',
  PARSE_ERROR: 'PARSE_ERROR',
} as const;

// ============================================
// Keyboard Keys
// ============================================

export const KEYS = {
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  SPACE: ' ',
  BACKSPACE: 'Backspace',
  DELETE: 'Delete',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
  PAGE_UP: 'PageUp',
  PAGE_DOWN: 'PageDown',
} as const;

// ============================================
// Breakpoints
// ============================================

export const BREAKPOINTS = {
  XS: 0,
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536,
} as const;
