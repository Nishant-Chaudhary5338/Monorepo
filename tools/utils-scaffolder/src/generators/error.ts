// ============================================================================
// ERROR MODULE GENERATOR
// ============================================================================

export function generateErrorModule(): Record<string, string> {
  return {
    'index.ts': `// ============================================================================
// ERROR MODULE - Structured error handling
// ============================================================================

export enum ErrorCode {
  UNKNOWN = 'UNKNOWN_ERROR',
  VALIDATION = 'VALIDATION_ERROR',
  AUTHENTICATION = 'AUTHENTICATION_ERROR',
  AUTHORIZATION = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  RATE_LIMIT = 'RATE_LIMIT_ERROR',
  NETWORK = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT_ERROR',
  SERVER = 'SERVER_ERROR',
}

export interface ErrorDetails {
  code: ErrorCode;
  message: string;
  field?: string;
  details?: unknown;
  statusCode?: number;
}

/**
 * Custom application error class
 * @example throw new AppError(ErrorCode.NOT_FOUND, 'User not found')
 */
export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly field?: string;
  public readonly details?: unknown;
  public readonly statusCode: number;
  public readonly timestamp: string;

  constructor(code: ErrorCode, message: string, options: { field?: string; details?: unknown; statusCode?: number } = {}) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.field = options.field;
    this.details = options.details;
    this.statusCode = options.statusCode || 500;
    this.timestamp = new Date().toISOString();
  }

  toJSON(): ErrorDetails {
    return {
      code: this.code,
      message: this.message,
      field: this.field,
      details: this.details,
      statusCode: this.statusCode,
    };
  }
}

/**
 * Creates an AppError with a specific code
 * @param code - Error code
 * @param message - Error message
 * @param options - Additional options
 * @returns AppError instance
 * @example createError(ErrorCode.VALIDATION, 'Invalid email', { field: 'email' })
 */
export function createError(
  code: ErrorCode,
  message: string,
  options: { field?: string; details?: unknown; statusCode?: number } = {}
): AppError {
  return new AppError(code, message, options);
}

/**
 * Checks if an error is an operational (expected) error
 * @param error - Error to check
 * @returns True if operational error
 * @example isOperationalError(new AppError(ErrorCode.NOT_FOUND, 'Not found')) // true
 */
export function isOperationalError(error: unknown): boolean {
  if (error instanceof AppError) return true;
  if (error instanceof Error) {
    return error.name === 'AppError';
  }
  return false;
}

/**
 * Formats an error for display or logging
 * @param error - Error to format
 * @returns Formatted error object
 * @example formatError(new AppError(ErrorCode.VALIDATION, 'Invalid'))
 */
export function formatError(error: unknown): { code: string; message: string; stack?: string; timestamp: string } {
  if (error instanceof AppError) {
    return {
      code: error.code,
      message: error.message,
      stack: error.stack,
      timestamp: error.timestamp,
    };
  }

  if (error instanceof Error) {
    return {
      code: error.constructor.name || 'Error',
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: String(error),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Wraps an async function with error handling
 * @param fn - Async function to wrap
 * @param errorHandler - Error handler function
 * @returns Wrapped function
 * @example const safe = withErrorHandling(fetchData, (err) => log.error(err))
 */
export function withErrorHandling<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  errorHandler: (error: unknown) => void
): (...args: TArgs) => Promise<TResult | null> {
  return async (...args: TArgs) => {
    try {
      return await fn(...args);
    } catch (error) {
      errorHandler(error);
      return null;
    }
  };
}

/**
 * Creates a retry wrapper for async functions
 * @param fn - Async function to retry
 * @param options - Retry options
 * @returns Function with retry capability
 * @example const fetchWithRetry = withRetry(fetchData, { maxRetries: 3 })
 */
export function withRetry<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  options: { maxRetries?: number; delay?: number; shouldRetry?: (error: unknown) => boolean } = {}
): (...args: TArgs) => Promise<TResult> {
  const { maxRetries = 3, delay = 1000, shouldRetry = () => true } = options;

  return async (...args: TArgs): Promise<TResult> => {
    let lastError: unknown;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn(...args);
      } catch (error) {
        lastError = error;
        if (attempt < maxRetries && shouldRetry(error)) {
          await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, attempt)));
        }
      }
    }

    throw lastError;
  };
}

/**
 * Gets a user-friendly error message
 * @param error - Error to get message from
 * @returns User-friendly message
 * @example getUserMessage(new AppError(ErrorCode.NOT_FOUND, 'User 123 not found')) // 'The requested resource was not found'
 */
export function getUserMessage(error: unknown): string {
  if (error instanceof AppError) {
    const messages: Record<ErrorCode, string> = {
      [ErrorCode.VALIDATION]: 'Please check your input and try again.',
      [ErrorCode.AUTHENTICATION]: 'Please log in to continue.',
      [ErrorCode.AUTHORIZATION]: 'You do not have permission to perform this action.',
      [ErrorCode.NOT_FOUND]: 'The requested resource was not found.',
      [ErrorCode.CONFLICT]: 'This action conflicts with existing data.',
      [ErrorCode.RATE_LIMIT]: 'Too many requests. Please wait and try again.',
      [ErrorCode.NETWORK]: 'Network error. Please check your connection.',
      [ErrorCode.TIMEOUT]: 'The request timed out. Please try again.',
      [ErrorCode.SERVER]: 'An unexpected error occurred. Please try again later.',
      [ErrorCode.UNKNOWN]: 'An unexpected error occurred.',
    };
    return messages[error.code] || messages[ErrorCode.UNKNOWN];
  }
  return 'An unexpected error occurred.';
}
`,
    'error.test.ts': `import { describe, it, expect } from 'vitest'
import { AppError, ErrorCode, createError, isOperationalError, formatError, getUserMessage } from './index'

describe('Error Module', () => {
  describe('AppError', () => {
    it('creates error with code and message', () => {
      const error = new AppError(ErrorCode.NOT_FOUND, 'User not found')
      expect(error.code).toBe(ErrorCode.NOT_FOUND)
      expect(error.message).toBe('User not found')
      expect(error.statusCode).toBe(500)
    })

    it('serializes to JSON', () => {
      const error = new AppError(ErrorCode.VALIDATION, 'Invalid', { field: 'email' })
      const json = error.toJSON()
      expect(json.code).toBe(ErrorCode.VALIDATION)
      expect(json.field).toBe('email')
    })
  })

  describe('createError', () => {
    it('creates AppError instance', () => {
      const error = createError(ErrorCode.VALIDATION, 'Invalid email', { field: 'email' })
      expect(error).toBeInstanceOf(AppError)
      expect(error.field).toBe('email')
    })
  })

  describe('isOperationalError', () => {
    it('returns true for AppError', () => {
      expect(isOperationalError(new AppError(ErrorCode.NOT_FOUND, 'Not found'))).toBe(true)
    })
    it('returns false for regular Error', () => {
      expect(isOperationalError(new Error('fail'))).toBe(false)
    })
  })

  describe('formatError', () => {
    it('formats AppError', () => {
      const error = new AppError(ErrorCode.VALIDATION, 'Invalid')
      const formatted = formatError(error)
      expect(formatted.code).toBe(ErrorCode.VALIDATION)
    })
    it('formats regular Error', () => {
      const formatted = formatError(new Error('fail'))
      expect(formatted.code).toBe('Error')
      expect(formatted.message).toBe('fail')
    })
  })

  describe('getUserMessage', () => {
    it('returns user-friendly message', () => {
      const msg = getUserMessage(new AppError(ErrorCode.NOT_FOUND, 'Not found'))
      expect(msg).toBe('The requested resource was not found.')
    })
  })
})
`,
  };
}