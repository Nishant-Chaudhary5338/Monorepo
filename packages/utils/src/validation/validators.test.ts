import { describe, it, expect } from 'vitest';
import { isValidEmail, isValidUrl, isValidPhone, isValidPassword, isValidCreditCard, isValidIpAddress, isValidJson, isValidHexColor, isValidDateString } from './validators';

describe('isValidEmail', () => {
  it('validates correct emails', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
  });
  it('rejects invalid emails', () => {
    expect(isValidEmail('notanemail')).toBe(false);
  });
});

describe('isValidUrl', () => {
  it('validates correct URLs', () => {
    expect(isValidUrl('https://example.com')).toBe(true);
  });
  it('rejects invalid URLs', () => {
    expect(isValidUrl('not a url')).toBe(false);
  });
});

describe('isValidPhone', () => {
  it('validates correct phone numbers', () => {
    expect(isValidPhone('+12345678901')).toBe(true);
    expect(isValidPhone('1234567890')).toBe(true);
  });
  it('rejects invalid phone numbers', () => {
    expect(isValidPhone('abc')).toBe(false);
  });
});

describe('isValidPassword', () => {
  it('validates strong password', () => {
    expect(isValidPassword('Str0ng!Pass')).toBe(true);
  });
  it('rejects weak password', () => {
    expect(isValidPassword('weak')).toBe(false);
  });
  it('respects custom rules', () => {
    expect(isValidPassword('simple', { requireUppercase: false, requireNumber: false, requireSpecial: false, minLength: 5 })).toBe(true);
  });
});

describe('isValidCreditCard', () => {
  it('validates correct card numbers', () => {
    expect(isValidCreditCard('4532015112830366')).toBe(true);
  });
  it('rejects invalid card numbers', () => {
    expect(isValidCreditCard('1234567890123456')).toBe(false);
  });
});

describe('isValidIpAddress', () => {
  it('validates IPv4', () => {
    expect(isValidIpAddress('192.168.1.1', 4)).toBe(true);
  });
  it('validates IPv6', () => {
    expect(isValidIpAddress('2001:db8::1', 6)).toBe(true);
  });
  it('validates without version', () => {
    expect(isValidIpAddress('192.168.1.1')).toBe(true);
  });
  it('rejects invalid IPs', () => {
    expect(isValidIpAddress('not an ip')).toBe(false);
  });
});

describe('isValidJson', () => {
  it('validates correct JSON', () => {
    expect(isValidJson('{"a":1}')).toBe(true);
  });
  it('rejects invalid JSON', () => {
    expect(isValidJson('not json')).toBe(false);
  });
});

describe('isValidHexColor', () => {
  it('validates hex colors', () => {
    expect(isValidHexColor('#ff0000')).toBe(true);
    expect(isValidHexColor('#f00')).toBe(true);
  });
  it('rejects invalid colors', () => {
    expect(isValidHexColor('red')).toBe(false);
  });
});

describe('isValidDateString', () => {
  it('validates date strings', () => {
    expect(isValidDateString('2024-01-15')).toBe(true);
  });
  it('rejects invalid date strings', () => {
    expect(isValidDateString('not a date')).toBe(false);
  });
});
