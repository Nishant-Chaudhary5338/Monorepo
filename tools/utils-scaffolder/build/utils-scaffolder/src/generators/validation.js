// ============================================================================
// VALIDATION MODULE GENERATOR
// ============================================================================
export function generateValidationModule() {
    return {
        'index.ts': `// ============================================================================
// VALIDATION MODULE - Input validation and sanitization
// ============================================================================

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export type Validator<T = unknown> = (value: T) => ValidationResult;

/**
 * Validates an email address
 * @param email - Email string to validate
 * @returns True if valid email
 * @example isValidEmail('test@example.com') // true
 */
export function isValidEmail(email: string): boolean {
  if (!email) return false;
  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
}

/**
 * Validates a phone number (supports international formats)
 * @param phone - Phone number string
 * @returns True if valid phone
 */
export function isValidPhone(phone: string): boolean {
  if (!phone) return false;
  const cleaned = phone.replace(/[\\s\\-()]/g, '');
  return /^\\+?[1-9]\\d{6,14}$/.test(cleaned);
}

/**
 * Validates a URL
 * @param url - URL string to validate
 * @returns True if valid URL
 */
export function isValidUrl(url: string): boolean {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates a URL slug (lowercase, alphanumeric, hyphens)
 * @param slug - Slug string to validate
 * @returns True if valid slug
 */
export function isValidSlug(slug: string): boolean {
  if (!slug) return false;
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

/**
 * Validates a UUID v4
 * @param uuid - UUID string to validate
 * @returns True if valid UUID
 */
export function isValidUUID(uuid: string): boolean {
  if (!uuid) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);
}

/**
 * Validates a credit card number (Luhn algorithm)
 * @param cardNumber - Card number string
 * @returns True if valid card number
 */
export function isValidCreditCard(cardNumber: string): boolean {
  if (!cardNumber) return false;
  const cleaned = cardNumber.replace(/\\D/g, '');
  if (cleaned.length < 13 || cleaned.length > 19) return false;

  let sum = 0;
  let isEven = false;
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    isEven = !isEven;
  }
  return sum % 10 === 0;
}

/**
 * Validates password strength
 * @param password - Password string
 * @returns Validation result with strength level
 */
export function validatePassword(password: string): ValidationResult & { strength: 'weak' | 'medium' | 'strong' } {
  const errors: string[] = [];
  let score = 0;

  if (!password) {
    return { valid: false, errors: ['Password is required'], strength: 'weak' };
  }

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  } else {
    score++;
  }

  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score < 3) {
    errors.push('Password should include uppercase, lowercase, numbers, and special characters');
  }

  const strength = score >= 4 ? 'strong' : score >= 3 ? 'medium' : 'weak';

  return {
    valid: errors.length === 0,
    errors,
    strength,
  };
}

/**
 * Validates a value is not empty
 * @param value - Value to check
 * @param fieldName - Field name for error message
 * @returns Validation result
 */
export function isRequired(value: unknown, fieldName = 'Field'): ValidationResult {
  if (value === null || value === undefined || value === '') {
    return { valid: false, errors: [\`\${fieldName} is required\"] };
  }
  if (Array.isArray(value) && value.length === 0) {
    return { valid: false, errors: [\`\${fieldName} must not be empty\"] };
  }
  return { valid: true, errors: [] };
}

/**
 * Validates a string has minimum length
 * @param value - String to validate
 * @param min - Minimum length
 * @returns Validation result
 */
export function minLength(value: string, min: number): ValidationResult {
  if (!value || value.length < min) {
    return { valid: false, errors: [\`Must be at least \${min} characters\"] };
  }
  return { valid: true, errors: [] };
}

/**
 * Validates a string does not exceed maximum length
 * @param value - String to validate
 * @param max - Maximum length
 * @returns Validation result
 */
export function maxLength(value: string, max: number): ValidationResult {
  if (value && value.length > max) {
    return { valid: false, errors: [\`Must not exceed \${max} characters\"] };
  }
  return { valid: true, errors: [] };
}

/**
 * Validates a number is within range
 * @param value - Number to validate
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Validation result
 */
export function inRange(value: number, min: number, max: number): ValidationResult {
  if (value < min || value > max) {
    return { valid: false, errors: [\`Must be between \${min} and \${max}\"] };
  }
  return { valid: true, errors: [] };
}

/**
 * Validates a string matches a pattern
 * @param value - String to validate
 * @param pattern - Regex pattern
 * @param message - Error message
 * @returns Validation result
 */
export function matchesPattern(value: string, pattern: RegExp, message = 'Invalid format'): ValidationResult {
  if (!value || !pattern.test(value)) {
    return { valid: false, errors: [message] };
  }
  return { valid: true, errors: [] };
}

/**
 * Sanitizes HTML by stripping tags
 * @param html - HTML string
 * @returns Sanitized string
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * Sanitizes a string for safe SQL (basic escaping)
 * @param value - String to sanitize
 * @returns Sanitized string
 */
export function sanitizeSql(value: string): string {
  if (!value) return '';
  return value.replace(/['"\\\\]/g, '\\$&');
}

/**
 * Creates a composed validator from multiple validators
 * @param validators - Array of validators
 * @returns Combined validator
 */
export function composeValidators<T = unknown>(...validators: Validator<T>[]): Validator<T> {
  return (value: T): ValidationResult => {
    const allErrors: string[] = [];
    for (const validator of validators) {
      const result = validator(value);
      allErrors.push(...result.errors);
    }
    return { valid: allErrors.length === 0, errors: allErrors };
  };
}

/**
 * Creates a schema validator from field validators
 * @param schema - Object mapping field names to validators
 * @returns Schema validator function
 */
export function createSchema<T extends Record<string, unknown>>(
  schema: { [K in keyof T]: Validator<T[K]> }
): (data: T) => ValidationResult & { fieldErrors: Partial<Record<keyof T, string[]>> } {
  return (data: T) => {
    const fieldErrors: Partial<Record<keyof T, string[]>> = {};
    const allErrors: string[] = [];

    for (const [key, validator] of Object.entries(schema) as [keyof T, Validator<T[keyof T]>][]) {
      const result = validator(data[key]);
      if (!result.valid) {
        fieldErrors[key] = result.errors;
        allErrors.push(...result.errors.map((e) => \`\${String(key)}: \${e}\`));
      }
    }

    return { valid: allErrors.length === 0, errors: allErrors, fieldErrors };
  };
}
`,
        'validation.test.ts': `import { describe, it, expect } from 'vitest'
import {
  isValidEmail, isValidPhone, isValidUrl, isValidSlug, isValidUUID,
  isValidCreditCard, validatePassword, isRequired, minLength, maxLength,
  inRange, sanitizeHtml, composeValidators,
} from './index'

describe('Validation Module', () => {
  describe('isValidEmail', () => {
    it('validates correct emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user+tag@domain.co')).toBe(true)
    })
    it('rejects invalid emails', () => {
      expect(isValidEmail('invalid')).toBe(false)
      expect(isValidEmail('')).toBe(false)
      expect(isValidEmail('@domain.com')).toBe(false)
    })
  })

  describe('isValidPhone', () => {
    it('validates correct phone numbers', () => {
      expect(isValidPhone('+1234567890')).toBe(true)
      expect(isValidPhone('1234567890')).toBe(true)
    })
    it('rejects invalid phone numbers', () => {
      expect(isValidPhone('123')).toBe(false)
      expect(isValidPhone('')).toBe(false)
    })
  })

  describe('isValidUrl', () => {
    it('validates correct URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true)
    })
    it('rejects invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false)
    })
  })

  describe('isValidSlug', () => {
    it('validates correct slugs', () => {
      expect(isValidSlug('hello-world')).toBe(true)
      expect(isValidSlug('my-post-123')).toBe(true)
    })
    it('rejects invalid slugs', () => {
      expect(isValidSlug('Hello World')).toBe(false)
      expect(isValidSlug('')).toBe(false)
    })
  })

  describe('isValidCreditCard', () => {
    it('validates Luhn-valid card numbers', () => {
      expect(isValidCreditCard('4111111111111111')).toBe(true)
    })
    it('rejects invalid card numbers', () => {
      expect(isValidCreditCard('1234567890123456')).toBe(false)
    })
  })

  describe('validatePassword', () => {
    it('validates strong passwords', () => {
      const result = validatePassword('MyP@ssw0rd!')
      expect(result.valid).toBe(true)
      expect(result.strength).toBe('strong')
    })
    it('rejects weak passwords', () => {
      const result = validatePassword('abc')
      expect(result.valid).toBe(false)
    })
  })

  describe('isRequired', () => {
    it('rejects empty values', () => {
      expect(isRequired(null).valid).toBe(false)
      expect(isRequired('').valid).toBe(false)
      expect(isRequired(undefined).valid).toBe(false)
    })
    it('accepts non-empty values', () => {
      expect(isRequired('hello').valid).toBe(true)
      expect(isRequired(0).valid).toBe(true)
    })
  })

  describe('minLength', () => {
    it('validates minimum length', () => {
      expect(minLength('hello', 3).valid).toBe(true)
      expect(minLength('hi', 3).valid).toBe(false)
    })
  })

  describe('maxLength', () => {
    it('validates maximum length', () => {
      expect(maxLength('hi', 5).valid).toBe(true)
      expect(maxLength('toolong', 3).valid).toBe(false)
    })
  })

  describe('inRange', () => {
    it('validates number range', () => {
      expect(inRange(5, 1, 10).valid).toBe(true)
      expect(inRange(0, 1, 10).valid).toBe(false)
    })
  })

  describe('sanitizeHtml', () => {
    it('strips HTML tags', () => {
      expect(sanitizeHtml('<p>Hello <b>World</b></p>')).toBe('Hello World')
    })
  })

  describe('composeValidators', () => {
    it('combines multiple validators', () => {
      const validator = composeValidators(
        (v: string) => isRequired(v, 'Name'),
        (v: string) => minLength(v, 2),
      )
      expect(validator('John').valid).toBe(true)
      expect(validator('').valid).toBe(false)
      expect(validator('J').valid).toBe(false)
    })
  })
})
`,
    };
}
//# sourceMappingURL=validation.js.map