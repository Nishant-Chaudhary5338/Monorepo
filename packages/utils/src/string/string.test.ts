import { describe, it, expect } from 'vitest'
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
