import { describe, it, expect } from 'vitest';
import { formatCurrency, formatPercentage, formatCompact, formatFileSize, formatPhoneNumber, formatCreditCard, formatNumber } from './formatters';

describe('formatCurrency', () => {
  it('formats as USD by default', () => {
    expect(formatCurrency(1234.56)).toContain('1,234.56');
  });
});

describe('formatPercentage', () => {
  it('formats as percentage with 2 decimal places', () => {
    expect(formatPercentage(0.1234)).toBe('12.34%');
  });
  it('respects decimal places', () => {
    expect(formatPercentage(0.1234, 4)).toBe('12.3400%');
  });
});

describe('formatCompact', () => {
  it('formats large numbers compactly', () => {
    expect(formatCompact(1234)).toBe('1.2K');
    expect(formatCompact(1234567)).toBe('1.2M');
  });
});

describe('formatFileSize', () => {
  it('formats bytes', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(1024)).toBe('1 KB');
    expect(formatFileSize(1048576)).toBe('1 MB');
    expect(formatFileSize(1073741824)).toBe('1 GB');
  });
});

describe('formatPhoneNumber', () => {
  it('formats US phone number', () => {
    expect(formatPhoneNumber('1234567890')).toBe('(123) 456-7890');
  });
  it('returns original for non-US', () => {
    expect(formatPhoneNumber('1234567890', 'UK')).toBe('1234567890');
  });
});

describe('formatCreditCard', () => {
  it('formats credit card with spaces', () => {
    expect(formatCreditCard('1234567890123456')).toBe('1234 5678 9012 3456');
  });
});

describe('formatNumber', () => {
  it('formats with minimumFractionDigits', () => {
    expect(formatNumber(1234.5678, { minimumFractionDigits: 2 })).toMatch(/1,234/);
  });
});
