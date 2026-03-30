import { describe, it, expect } from 'vitest';
import { formatDate, formatRelativeTime, formatDuration, formatToISO, formatToLocalString, formatTimestamp } from './formatters';

describe('formatDate', () => {
  it('formats Date object', () => {
    const date = new Date(2024, 0, 15);
    expect(formatDate(date, 'yyyy-MM-dd')).toBe('2024-01-15');
  });
  it('formats ISO string', () => {
    expect(formatDate('2024-01-15', 'MM/dd/yyyy')).toBe('01/15/2024');
  });
  it('returns empty for invalid date', () => {
    expect(formatDate('invalid', 'yyyy-MM-dd')).toBe('');
  });
});

describe('formatRelativeTime', () => {
  it('formats relative time', () => {
    const date = new Date(Date.now() - 60000);
    const result = formatRelativeTime(date);
    expect(result).toContain('minute');
  });
  it('returns empty for invalid date', () => {
    expect(formatRelativeTime('invalid')).toBe('');
  });
});

describe('formatDuration', () => {
  it('formats milliseconds', () => {
    expect(formatDuration(1000)).toBe('1s');
    expect(formatDuration(60000)).toBe('1m');
    expect(formatDuration(3600000)).toBe('1h');
    expect(formatDuration(86400000)).toBe('1d');
  });
  it('formats compound duration', () => {
    const ms = 2 * 86400000 + 3 * 3600000 + 4 * 60000 + 5 * 1000;
    const result = formatDuration(ms);
    expect(result).toContain('2d');
    expect(result).toContain('3h');
    expect(result).toContain('4m');
    expect(result).toContain('5s');
  });
  it('returns 0s for zero', () => {
    expect(formatDuration(0)).toBe('0s');
  });
});

describe('formatToISO', () => {
  it('formats to ISO string', () => {
    const date = new Date('2024-01-15T00:00:00Z');
    const result = formatToISO(date);
    expect(result).toContain('2024-01-15');
  });
});

describe('formatToLocalString', () => {
  it('formats to locale string', () => {
    const date = new Date('2024-01-15');
    const result = formatToLocalString(date, 'en-US');
    expect(result).toContain('2024');
  });
  it('handles string input', () => {
    const result = formatToLocalString('2024-01-15', 'en-US');
    expect(result).toContain('2024');
  });
  it('returns empty for invalid date', () => {
    expect(formatToLocalString('invalid')).toBe('');
  });
});

describe('formatTimestamp', () => {
  it('formats timestamp', () => {
    const timestamp = new Date(2024, 0, 15, 14, 30).getTime();
    const result = formatTimestamp(timestamp);
    expect(result).toContain('Jan');
    expect(result).toContain('15');
    expect(result).toContain('2024');
  });
});
