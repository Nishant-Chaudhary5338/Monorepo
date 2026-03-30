import { describe, it, expect } from 'vitest';
import { isValidEmail, isValidUrl, isValidSlug, isPalindrome, generateSlug, generateRandomString, generateId, generateUUID } from './validators';

describe('isValidEmail', () => {
  it('validates correct email addresses', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
    expect(isValidEmail('user.name@domain.co')).toBe(true);
    expect(isValidEmail('user+tag@example.org')).toBe(true);
  });
  it('rejects invalid email addresses', () => {
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('notanemail')).toBe(false);
    expect(isValidEmail('@nodomain.com')).toBe(false);
    expect(isValidEmail('user@')).toBe(false);
  });
});

describe('isValidUrl', () => {
  it('validates correct URLs', () => {
    expect(isValidUrl('https://example.com')).toBe(true);
    expect(isValidUrl('http://example.com/path')).toBe(true);
    expect(isValidUrl('https://sub.domain.com:8080/path?query=1')).toBe(true);
  });
  it('rejects invalid URLs', () => {
    expect(isValidUrl('')).toBe(false);
    expect(isValidUrl('not a url')).toBe(false);
  });
  it('accepts various URL schemes', () => {
    expect(isValidUrl('ftp://example.com')).toBe(true);
  });
});

describe('isValidSlug', () => {
  it('validates correct slugs', () => {
    expect(isValidSlug('hello-world')).toBe(true);
    expect(isValidSlug('my-post-123')).toBe(true);
    expect(isValidSlug('simple')).toBe(true);
  });
  it('rejects invalid slugs', () => {
    expect(isValidSlug('Hello World')).toBe(false);
    expect(isValidSlug('UPPERCASE')).toBe(false);
    expect(isValidSlug('has spaces')).toBe(false);
    expect(isValidSlug('-starts-with-dash')).toBe(false);
    expect(isValidSlug('ends-with-dash-')).toBe(false);
  });
});

describe('isPalindrome', () => {
  it('identifies palindromes', () => {
    expect(isPalindrome('racecar')).toBe(true);
    expect(isPalindrome('madam')).toBe(true);
    expect(isPalindrome('A man a plan a canal Panama')).toBe(true);
  });
  it('identifies non-palindromes', () => {
    expect(isPalindrome('hello')).toBe(false);
    expect(isPalindrome('world')).toBe(false);
  });
  it('handles case insensitivity', () => {
    expect(isPalindrome('Racecar')).toBe(true);
    expect(isPalindrome('MADAM')).toBe(true);
  });
});

describe('generateSlug', () => {
  it('converts text to slug', () => {
    expect(generateSlug('Hello World')).toBe('hello-world');
    expect(generateSlug('My Blog Post!')).toBe('my-blog-post');
  });
  it('handles special characters', () => {
    expect(generateSlug('  spaces  ')).toBe('spaces');
  });
  it('handles multiple spaces and dashes', () => {
    expect(generateSlug('too   many   spaces')).toBe('too-many-spaces');
  });
});

describe('generateRandomString', () => {
  it('generates string of correct length', () => {
    expect(generateRandomString(10)).toHaveLength(10);
    expect(generateRandomString(5)).toHaveLength(5);
  });
  it('respects character options', () => {
    const lowerOnly = generateRandomString(100, { uppercase: false, numbers: false });
    expect(lowerOnly).toMatch(/^[a-z]+$/);
  });
  it('defaults to lowercase when no chars selected', () => {
    const result = generateRandomString(10, { uppercase: false, lowercase: false, numbers: false });
    expect(result).toMatch(/^[a-z]+$/);
  });
});

describe('generateId', () => {
  it('generates unique ids', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
  });
  it('includes prefix when provided', () => {
    const id = generateId('user');
    expect(id).toMatch(/^user_/);
  });
  it('works without prefix', () => {
    const id = generateId();
    expect(id).not.toContain('_');
  });
});

describe('generateUUID', () => {
  it('generates valid UUID format', () => {
    const uuid = generateUUID();
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });
  it('generates unique UUIDs', () => {
    const uuid1 = generateUUID();
    const uuid2 = generateUUID();
    expect(uuid1).not.toBe(uuid2);
  });
});
