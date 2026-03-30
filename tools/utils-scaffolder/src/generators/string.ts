// ============================================================================
// STRING MODULE GENERATOR
// ============================================================================

export function generateStringModule(): Record<string, string> {
  return {
    'index.ts': `// ============================================================================
// STRING MODULE - String manipulation, formatting, and conversion
// ============================================================================

// ============================================================================
// FORMATTERS
// ============================================================================

/**
 * Capitalizes the first letter of a string
 * @param str - Input string
 * @returns String with first letter capitalized
 * @example capitalize('hello') // 'Hello'
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Capitalizes the first letter of each word
 * @param str - Input string
 * @returns String with each word capitalized
 * @example capitalizeWords('hello world') // 'Hello World'
 */
export function capitalizeWords(str: string): string {
  if (!str) return str;
  return str.replace(/\\b\\w/g, (c) => c.toUpperCase());
}

/**
 * Converts a string to title case
 * @param str - Input string (supports kebab-case, snake_case)
 * @returns Title case string
 * @example titleCase('hello-world') // 'Hello World'
 */
export function titleCase(str: string): string {
  if (!str) return str;
  return str
    .replace(/[-_]/g, ' ')
    .replace(/\\b\\w/g, (c) => c.toUpperCase());
}

/**
 * Truncates a string to a specified length
 * @param str - Input string
 * @param maxLength - Maximum length before truncation
 * @param suffix - Suffix to append when truncated (default: '...')
 * @returns Truncated string
 * @example truncate('Long text here', 10) // 'Long te...'
 */
export function truncate(str: string, maxLength: number, suffix = '...'): string {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Truncates a string in the middle
 * @param str - Input string
 * @param maxLength - Maximum length
 * @param separator - Middle separator (default: '...')
 * @returns Middle-truncated string
 * @example truncateMiddle('verylongfilename.txt', 15) // 'verylo...name.txt'
 */
export function truncateMiddle(str: string, maxLength: number, separator = '...'): string {
  if (!str || str.length <= maxLength) return str;
  const charsToShow = maxLength - separator.length;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);
  return str.slice(0, frontChars) + separator + str.slice(-backChars);
}

/**
 * Wraps text at a specified width
 * @param str - Input string
 * @param width - Line width
 * @returns Wrapped text
 */
export function wrapText(str: string, width: number): string {
  if (!str) return str;
  const words = str.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if (currentLine.length + word.length + 1 <= width) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines.join('\\n');
}

/**
 * Formats initials from a full name
 * @param name - Full name string
 * @param maxInitials - Maximum number of initials (default: 2)
 * @returns Formatted initials
 * @example formatInitials('John Doe') // 'JD'
 */
export function formatInitials(name: string, maxInitials = 2): string {
  if (!name) return '';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, maxInitials)
    .map((part) => part[0].toUpperCase())
    .join('');
}

/**
 * Masks a string, showing only specified characters
 * @param str - Input string
 * @param options - Masking options
 * @returns Masked string
 * @example maskString('1234567890', { showLast: 4 }) // '******7890'
 */
export function maskString(
  str: string,
  options: { maskChar?: string; showFirst?: number; showLast?: number } = {}
): string {
  if (!str) return str;
  const { maskChar = '*', showFirst = 0, showLast = 0 } = options;
  const visibleFirst = str.slice(0, showFirst);
  const visibleLast = showLast > 0 ? str.slice(-showLast) : '';
  const maskedLength = str.length - showFirst - showLast;
  const masked = maskChar.repeat(Math.max(0, maskedLength));
  return visibleFirst + masked + visibleLast;
}

// ============================================================================
// CONVERTERS
// ============================================================================

/**
 * Converts a string to camelCase
 * @param str - Input string
 * @returns camelCase string
 * @example toCamelCase('hello-world') // 'helloWorld'
 */
export function toCamelCase(str: string): string {
  if (!str) return str;
  return str
    .replace(/[-_\\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^[A-Z]/, (c) => c.toLowerCase());
}

/**
 * Converts a string to snake_case
 * @param str - Input string
 * @returns snake_case string
 * @example toSnakeCase('helloWorld') // 'hello_world'
 */
export function toSnakeCase(str: string): string {
  if (!str) return str;
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\\s-]+/g, '_')
    .toLowerCase();
}

/**
 * Converts a string to kebab-case
 * @param str - Input string
 * @returns kebab-case string
 * @example toKebabCase('helloWorld') // 'hello-world'
 */
export function toKebabCase(str: string): string {
  if (!str) return str;
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Converts a string to PascalCase
 * @param str - Input string
 * @returns PascalCase string
 * @example toPascalCase('hello-world') // 'HelloWorld'
 */
export function toPascalCase(str: string): string {
  if (!str) return str;
  return str
    .replace(/[-_\\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^[a-z]/, (c) => c.toUpperCase());
}

/**
 * Converts a string to dot.case
 * @param str - Input string
 * @returns dot.case string
 */
export function toDotCase(str: string): string {
  if (!str) return str;
  return str
    .replace(/([a-z])([A-Z])/g, '$1.$2')
    .replace(/[\\s_-]+/g, '.')
    .toLowerCase();
}

/**
 * Converts a string to CONSTANT_CASE
 * @param str - Input string
 * @returns CONSTANT_CASE string
 */
export function toConstantCase(str: string): string {
  if (!str) return str;
  return toSnakeCase(str).toUpperCase();
}

/**
 * Converts a string to Sentence case
 * @param str - Input string
 * @returns Sentence case string
 */
export function toSentenceCase(str: string): string {
  if (!str) return str;
  return str
    .replace(/[-_\\s]+/g, ' ')
    .replace(/^[a-z]/, (c) => c.toUpperCase());
}

// ============================================================================
// TRIMMERS
// ============================================================================

/**
 * Strips HTML tags from a string
 * @param str - Input string with HTML
 * @returns Plain text string
 * @example stripHtml('<p>Hello <b>World</b></p>') // 'Hello World'
 */
export function stripHtml(str: string): string {
  if (!str) return str;
  return str.replace(/<[^>]*>/g, '').trim();
}

/**
 * Strips markdown formatting from a string
 * @param str - Input string with markdown
 * @returns Plain text string
 */
export function stripMarkdown(str: string): string {
  if (!str) return str;
  return str
    .replace(/\\*\\*(.*?)\\*\\*/g, '$1')
    .replace(/\\*(.*?)\\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/~~(.*?)~~/g, '$1')
    .replace(/\\[(.*?)\\]\\(.*?\\)/g, '$1')
    .replace(/#{1,6}\\s/g, '')
    .replace(new RegExp('\`{1,3}(.*?)\`{1,3}', 'gs'), '$1')
    .trim();
}

/**
 * Normalizes whitespace (collapses multiple spaces/tabs/newlines)
 * @param str - Input string
 * @returns Normalized string
 * @example normalizeWhitespace('  hello   world  ') // 'hello world'
 */
export function normalizeWhitespace(str: string): string {
  if (!str) return str;
  return str.replace(/\\s+/g, ' ').trim();
}

/**
 * Removes non-alphanumeric characters
 * @param str - Input string
 * @returns Alphanumeric string
 */
export function removeNonAlphanumeric(str: string): string {
  if (!str) return str;
  return str.replace(/[^a-zA-Z0-9]/g, '');
}

/**
 * Removes emojis from a string
 * @param str - Input string
 * @returns String without emojis
 * @example removeEmojis('Hello 👋 World 🌍') // 'Hello  World '
 */
export function removeEmojis(str: string): string {
  if (!str) return str;
  return str
    .replace(/[\\u{1F600}-\\u{1F64F}]/gu, '')
    .replace(/[\\u{1F300}-\\u{1F5FF}]/gu, '')
    .replace(/[\\u{1F680}-\\u{1F6FF}]/gu, '')
    .replace(/[\\u{1F1E0}-\\u{1F1FF}]/gu, '')
    .replace(/[\\u{2600}-\\u{26FF}]/gu, '')
    .replace(/[\\u{2700}-\\u{27BF}]/gu, '')
    .trim();
}

// ============================================================================
// TEMPLATE
// ============================================================================

/**
 * Interpolates template variables in a string
 * @param template - Template string with {{variable}} placeholders
 * @param data - Data object with replacement values
 * @returns Interpolated string
 * @example interpolate('Hello {{name}}', { name: 'John' }) // 'Hello John'
 */
export function interpolate(template: string, data: Record<string, string | number>): string {
  if (!template) return template;
  return template.replace(/\\{\\{(\\w+)\\}\\}/g, (_, key) => {
    const value = data[key];
    return value !== undefined ? String(value) : '';
  });
}

// ============================================================================
// VALIDATORS
// ============================================================================

/**
 * Validates an email address
 * @param value - Email string to validate
 * @returns True if valid email
 */
export function isValidEmail(value: string): boolean {
  if (!value) return false;
  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value);
}

/**
 * Validates a URL
 * @param value - URL string to validate
 * @returns True if valid URL
 */
export function isValidUrl(value: string): boolean {
  if (!value) return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates a URL slug
 * @param value - Slug string to validate
 * @returns True if valid slug
 */
export function isValidSlug(value: string): boolean {
  if (!value) return false;
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

/**
 * Checks if a string contains profanity (basic check)
 * @param value - String to check
 * @returns True if profanity detected
 */
export function containsProfanity(value: string): boolean {
  if (!value) return false;
  const profanityPatterns = ['damn', 'hell', 'crap', 'ass', 'shit', 'fuck'];
  const lower = value.toLowerCase();
  return profanityPatterns.some((word) => lower.includes(word));
}

/**
 * Checks if a string is a palindrome
 * @param value - String to check
 * @returns True if palindrome
 */
export function isPalindrome(value: string): boolean {
  if (!value) return true;
  const cleaned = value.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}

// ============================================================================
// GENERATORS
// ============================================================================

/**
 * Generates a URL-friendly slug from text
 * @param text - Input text
 * @returns URL slug
 * @example generateSlug('Hello World!') // 'hello-world'
 */
export function generateSlug(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\\s-]/g, '')
    .replace(/[\\s]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Generates a random string
 * @param length - Length of the string
 * @param options - Generation options
 * @returns Random string
 */
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

/**
 * Generates a unique ID with optional prefix
 * @param prefix - Optional prefix for the ID
 * @returns Unique ID string
 * @example generateId('user') // 'user_a1b2c3d4'
 */
export function generateId(prefix?: string): string {
  const id = Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
  return prefix ? prefix + '_' + id : id;
}

/**
 * Generates a UUID v4
 * @returns UUID string
 * @example generateUUID() // '550e8400-e29b-41d4-a716-446655440000'
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
`,
    'string.test.ts': `import { describe, it, expect } from 'vitest'
import {
  capitalize, capitalizeWords, titleCase, truncate, truncateMiddle,
  formatInitials, maskString, toCamelCase, toSnakeCase, toKebabCase,
  toPascalCase, toConstantCase, stripHtml, stripMarkdown, normalizeWhitespace,
  interpolate, isValidEmail, isValidUrl, isValidSlug, isPalindrome,
  generateSlug, generateRandomString, generateId, generateUUID,
} from './index'

describe('String Module', () => {
  describe('capitalize', () => {
    it('capitalizes first letter', () => {
      expect(capitalize('hello')).toBe('Hello')
    })
    it('handles empty string', () => {
      expect(capitalize('')).toBe('')
    })
  })

  describe('titleCase', () => {
    it('converts kebab-case to title case', () => {
      expect(titleCase('hello-world')).toBe('Hello World')
    })
  })

  describe('truncate', () => {
    it('truncates long strings', () => {
      expect(truncate('Hello World', 8)).toBe('Hello...')
    })
    it('does not truncate short strings', () => {
      expect(truncate('Hi', 10)).toBe('Hi')
    })
  })

  describe('toCamelCase', () => {
    it('converts kebab-case to camelCase', () => {
      expect(toCamelCase('hello-world')).toBe('helloWorld')
    })
    it('converts snake_case to camelCase', () => {
      expect(toCamelCase('hello_world')).toBe('helloWorld')
    })
  })

  describe('toSnakeCase', () => {
    it('converts camelCase to snake_case', () => {
      expect(toSnakeCase('helloWorld')).toBe('hello_world')
    })
  })

  describe('toKebabCase', () => {
    it('converts camelCase to kebab-case', () => {
      expect(toKebabCase('helloWorld')).toBe('hello-world')
    })
  })

  describe('toPascalCase', () => {
    it('converts kebab-case to PascalCase', () => {
      expect(toPascalCase('hello-world')).toBe('HelloWorld')
    })
  })

  describe('stripHtml', () => {
    it('removes HTML tags', () => {
      expect(stripHtml('<p>Hello <b>World</b></p>')).toBe('Hello World')
    })
  })

  describe('normalizeWhitespace', () => {
    it('collapses multiple spaces', () => {
      expect(normalizeWhitespace('  hello   world  ')).toBe('hello world')
    })
  })

  describe('interpolate', () => {
    it('replaces template variables', () => {
      expect(interpolate('Hello {{name}}', { name: 'John' })).toBe('Hello John')
    })
  })

  describe('isValidEmail', () => {
    it('validates correct emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
    })
    it('rejects invalid emails', () => {
      expect(isValidEmail('invalid')).toBe(false)
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
    })
    it('rejects invalid slugs', () => {
      expect(isValidSlug('Hello World')).toBe(false)
    })
  })

  describe('isPalindrome', () => {
    it('detects palindromes', () => {
      expect(isPalindrome('racecar')).toBe(true)
      expect(isPalindrome('hello')).toBe(false)
    })
  })

  describe('generateSlug', () => {
    it('generates URL-friendly slugs', () => {
      expect(generateSlug('Hello World!')).toBe('hello-world')
    })
  })

  describe('generateRandomString', () => {
    it('generates string of correct length', () => {
      expect(generateRandomString(10)).toHaveLength(10)
    })
  })

  describe('generateUUID', () => {
    it('generates valid UUID format', () => {
      const uuid = generateUUID()
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
    })
  })

  describe('generateId', () => {
    it('generates ID with prefix', () => {
      const id = generateId('user')
      expect(id.startsWith('user_')).toBe(true)
    })
  })

  describe('formatInitials', () => {
    it('extracts initials from name', () => {
      expect(formatInitials('John Doe')).toBe('JD')
    })
  })

  describe('maskString', () => {
    it('masks middle characters', () => {
      expect(maskString('1234567890', { showLast: 4 })).toBe('******7890')
    })
  })
})
`,
  };
}