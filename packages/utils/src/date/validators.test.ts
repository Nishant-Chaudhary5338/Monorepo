import { describe, it, expect } from 'vitest';
import { isValidDate, isDateRangeValid, isAgeValid } from './validators';

describe('isValidDate', () => {
  it('returns true for valid Date object', () => {
    expect(isValidDate(new Date())).toBe(true);
  });
  it('returns true for valid ISO string', () => {
    expect(isValidDate('2024-01-15')).toBe(true);
  });
  it('returns true for valid timestamp', () => {
    expect(isValidDate(Date.now())).toBe(true);
  });
  it('returns false for invalid date', () => {
    expect(isValidDate('not a date')).toBe(false);
  });
  it('returns false for non-date types', () => {
    expect(isValidDate(null)).toBe(false);
    expect(isValidDate(undefined)).toBe(false);
    expect(isValidDate({})).toBe(false);
  });
});

describe('isDateRangeValid', () => {
  it('returns true when in range', () => {
    const date = new Date(2024, 5, 15);
    expect(isDateRangeValid(date, new Date(2024, 0, 1), new Date(2024, 11, 31))).toBe(true);
  });
  it('returns false when before min', () => {
    const date = new Date(2023, 0, 1);
    expect(isDateRangeValid(date, new Date(2024, 0, 1), new Date(2024, 11, 31))).toBe(false);
  });
  it('returns false when after max', () => {
    const date = new Date(2025, 0, 1);
    expect(isDateRangeValid(date, new Date(2024, 0, 1), new Date(2024, 11, 31))).toBe(false);
  });
  it('handles no min/max', () => {
    expect(isDateRangeValid(new Date())).toBe(true);
  });
});

describe('isAgeValid', () => {
  it('returns true when age meets minimum', () => {
    const birthDate = new Date(2000, 0, 1);
    expect(isAgeValid(birthDate, 18)).toBe(true);
  });
  it('returns false when age does not meet minimum', () => {
    const birthDate = new Date(2020, 0, 1);
    expect(isAgeValid(birthDate, 18)).toBe(false);
  });
  it('handles string input', () => {
    expect(isAgeValid('2000-01-01', 18)).toBe(true);
  });
  it('returns false for invalid date', () => {
    expect(isAgeValid('invalid', 18)).toBe(false);
  });
});
