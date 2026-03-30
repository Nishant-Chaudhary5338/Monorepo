import { describe, it, expect } from 'vitest';
import { zodEmail, zodPassword, zodPhone, zodUrl, zodUuid, zodDateString, zodIpAddress, zodCreditCard, zodSlug, zodUsername } from './schemas';

describe('zodEmail', () => {
  it('accepts valid email', () => {
    expect(zodEmail().parse('user@example.com')).toBe('user@example.com');
  });
  it('rejects invalid email', () => {
    expect(() => zodEmail().parse('notemail')).toThrow();
  });
});

describe('zodPassword', () => {
  it('accepts strong password', () => {
    expect(zodPassword().parse('Str0ng!Pass')).toBe('Str0ng!Pass');
  });
  it('rejects weak password', () => {
    expect(() => zodPassword().parse('weak')).toThrow();
  });
  it('respects custom options', () => {
    const schema = zodPassword({ minLength: 4, requireUppercase: false, requireLowercase: false, requireNumber: false, requireSpecial: false });
    expect(schema.parse('abcd')).toBe('abcd');
  });
});

describe('zodPhone', () => {
  it('accepts valid phone', () => {
    expect(zodPhone().parse('+12345678901')).toBe('+12345678901');
  });
  it('rejects invalid phone', () => {
    expect(() => zodPhone().parse('abc')).toThrow();
  });
});

describe('zodUrl', () => {
  it('accepts valid URL', () => {
    expect(zodUrl().parse('https://example.com')).toBe('https://example.com');
  });
  it('rejects invalid URL', () => {
    expect(() => zodUrl().parse('not a url')).toThrow();
  });
});

describe('zodUuid', () => {
  it('accepts valid UUID', () => {
    const uuid = '550e8400-e29b-41d4-a716-446655440000';
    expect(zodUuid().parse(uuid)).toBe(uuid);
  });
  it('rejects invalid UUID', () => {
    expect(() => zodUuid().parse('not-a-uuid')).toThrow();
  });
});

describe('zodDateString', () => {
  it('accepts valid date string', () => {
    expect(zodDateString().parse('2024-01-15')).toBe('2024-01-15');
  });
  it('rejects invalid date string', () => {
    expect(() => zodDateString().parse('not-a-date')).toThrow();
  });
});

describe('zodIpAddress', () => {
  it('accepts valid IP', () => {
    expect(zodIpAddress().parse('192.168.1.1')).toBe('192.168.1.1');
  });
  it('rejects invalid IP', () => {
    expect(() => zodIpAddress().parse('not an ip')).toThrow();
  });
});

describe('zodCreditCard', () => {
  it('accepts valid card number', () => {
    expect(zodCreditCard().parse('4532015112830366')).toBe('4532015112830366');
  });
  it('rejects invalid card number', () => {
    expect(() => zodCreditCard().parse('1234')).toThrow();
  });
});

describe('zodSlug', () => {
  it('accepts valid slug', () => {
    expect(zodSlug().parse('hello-world')).toBe('hello-world');
  });
  it('rejects invalid slug', () => {
    expect(() => zodSlug().parse('Hello World')).toThrow();
  });
});

describe('zodUsername', () => {
  it('accepts valid username', () => {
    expect(zodUsername().parse('john_doe')).toBe('john_doe');
  });
  it('rejects invalid username', () => {
    expect(() => zodUsername().parse('a')).toThrow();
  });
});
