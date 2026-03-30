// ============================================================================
// DATE MODULE GENERATOR
// ============================================================================
export function generateDateModule() {
    return {
        'index.ts': `// ============================================================================
// DATE MODULE - Date formatting, parsing, and manipulation
// ============================================================================

/**
 * Formats a date to a string using a simple pattern
 * @param date - Date to format
 * @param pattern - Format pattern (YYYY, MM, DD, HH, mm, ss)
 * @returns Formatted date string
 * @example formatDate(new Date(), 'YYYY-MM-DD') // '2024-01-15'
 */
export function formatDate(date: Date, pattern: string): string {
  const tokens: Record<string, string> = {
    YYYY: date.getFullYear().toString(),
    MM: String(date.getMonth() + 1).padStart(2, '0'),
    DD: String(date.getDate()).padStart(2, '0'),
    HH: String(date.getHours()).padStart(2, '0'),
    mm: String(date.getMinutes()).padStart(2, '0'),
    ss: String(date.getSeconds()).padStart(2, '0'),
  };

  let result = pattern;
  for (const [token, value] of Object.entries(tokens)) {
    result = result.replace(token, value);
  }
  return result;
}

/**
 * Parses a date string
 * @param dateString - Date string to parse
 * @returns Parsed Date object or null
 * @example parseDate('2024-01-15') // Date object
 */
export function parseDate(dateString: string): Date | null {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Adds time to a date
 * @param date - Starting date
 * @param amount - Amount to add
 * @param unit - Time unit
 * @returns New date with added time
 * @example addTime(new Date(), 7, 'days')
 */
export function addTime(date: Date, amount: number, unit: 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years'): Date {
  const result = new Date(date);
  switch (unit) {
    case 'seconds': result.setSeconds(result.getSeconds() + amount); break;
    case 'minutes': result.setMinutes(result.getMinutes() + amount); break;
    case 'hours': result.setHours(result.getHours() + amount); break;
    case 'days': result.setDate(result.getDate() + amount); break;
    case 'weeks': result.setDate(result.getDate() + amount * 7); break;
    case 'months': result.setMonth(result.getMonth() + amount); break;
    case 'years': result.setFullYear(result.getFullYear() + amount); break;
  }
  return result;
}

/**
 * Calculates difference between two dates
 * @param date1 - First date
 * @param date2 - Second date
 * @param unit - Unit for difference
 * @returns Difference in specified unit
 * @example diffDates(new Date('2024-01-15'), new Date('2024-01-01'), 'days') // 14
 */
export function diffDates(date1: Date, date2: Date, unit: 'seconds' | 'minutes' | 'hours' | 'days' = 'days'): number {
  const diffMs = date1.getTime() - date2.getTime();
  const units: Record<string, number> = {
    seconds: 1000,
    minutes: 60 * 1000,
    hours: 60 * 60 * 1000,
    days: 24 * 60 * 60 * 1000,
  };
  return Math.floor(diffMs / units[unit]);
}

/**
 * Checks if a year is a leap year
 * @param year - Year to check
 * @returns True if leap year
 * @example isLeapYear(2024) // true
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Gets the number of days in a month
 * @param year - Year
 * @param month - Month (0-indexed)
 * @returns Number of days
 * @example getDaysInMonth(2024, 1) // 29 (February 2024)
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Gets relative time string from a date
 * @param date - Date to compare
 * @param now - Reference date (default: now)
 * @returns Relative time string
 * @example relativeTime(new Date(Date.now() - 3600000)) // '1 hour ago'
 */
export function relativeTime(date: Date, now: Date = new Date()): string {
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return \`\${Math.floor(seconds / 60)} minute\${Math.floor(seconds / 60) === 1 ? '' : 's'} ago\`;
  if (seconds < 86400) return \`\${Math.floor(seconds / 3600)} hour\${Math.floor(seconds / 3600) === 1 ? '' : 's'} ago\`;
  if (seconds < 604800) return \`\${Math.floor(seconds / 86400)} day\${Math.floor(seconds / 86400) === 1 ? '' : 's'} ago\`;
  if (seconds < 2592000) return \`\${Math.floor(seconds / 604800)} week\${Math.floor(seconds / 604800) === 1 ? '' : 's'} ago\`;
  if (seconds < 31536000) return \`\${Math.floor(seconds / 2592000)} month\${Math.floor(seconds / 2592000) === 1 ? '' : 's'} ago\`;
  return \`\${Math.floor(seconds / 31536000)} year\${Math.floor(seconds / 31536000) === 1 ? '' : 's'} ago\`;
}

/**
 * Checks if a date is today
 * @param date - Date to check
 * @returns True if date is today
 * @example isToday(new Date()) // true
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
}

/**
 * Gets the start of a time period
 * @param date - Reference date
 * @param unit - Time unit
 * @returns Date at start of period
 * @example startOfDay(new Date()) // Today at 00:00:00
 */
export function startOf(date: Date, unit: 'day' | 'week' | 'month' | 'year'): Date {
  const result = new Date(date);
  switch (unit) {
    case 'day': result.setHours(0, 0, 0, 0); break;
    case 'week': result.setDate(result.getDate() - result.getDay()); result.setHours(0, 0, 0, 0); break;
    case 'month': result.setDate(1); result.setHours(0, 0, 0, 0); break;
    case 'year': result.setMonth(0, 1); result.setHours(0, 0, 0, 0); break;
  }
  return result;
}

/**
 * Gets the end of a time period
 * @param date - Reference date
 * @param unit - Time unit
 * @returns Date at end of period
 * @example endOfDay(new Date()) // Today at 23:59:59
 */
export function endOf(date: Date, unit: 'day' | 'week' | 'month' | 'year'): Date {
  const result = new Date(date);
  switch (unit) {
    case 'day': result.setHours(23, 59, 59, 999); break;
    case 'week': result.setDate(result.getDate() + (6 - result.getDay())); result.setHours(23, 59, 59, 999); break;
    case 'month': result.setMonth(result.getMonth() + 1, 0); result.setHours(23, 59, 59, 999); break;
    case 'year': result.setMonth(11, 31); result.setHours(23, 59, 59, 999); break;
  }
  return result;
}
`,
        'date.test.ts': `import { describe, it, expect } from 'vitest'
import {
  formatDate, parseDate, addTime, diffDates, isLeapYear,
  getDaysInMonth, isToday, startOf, endOf,
} from './index'

describe('Date Module', () => {
  describe('formatDate', () => {
    it('formats date with pattern', () => {
      const date = new Date(2024, 0, 15, 10, 30, 45)
      expect(formatDate(date, 'YYYY-MM-DD')).toBe('2024-01-15')
      expect(formatDate(date, 'HH:mm:ss')).toBe('10:30:45')
    })
  })

  describe('parseDate', () => {
    it('parses valid date string', () => {
      const result = parseDate('2024-01-15')
      expect(result).toBeInstanceOf(Date)
    })
    it('returns null for invalid date', () => {
      expect(parseDate('invalid')).toBeNull()
    })
  })

  describe('addTime', () => {
    it('adds days to date', () => {
      const date = new Date(2024, 0, 1)
      const result = addTime(date, 7, 'days')
      expect(result.getDate()).toBe(8)
    })
  })

  describe('diffDates', () => {
    it('calculates difference in days', () => {
      const d1 = new Date(2024, 0, 15)
      const d2 = new Date(2024, 0, 1)
      expect(diffDates(d1, d2, 'days')).toBe(14)
    })
  })

  describe('isLeapYear', () => {
    it('returns true for leap year', () => {
      expect(isLeapYear(2024)).toBe(true)
    })
    it('returns false for non-leap year', () => {
      expect(isLeapYear(2023)).toBe(false)
    })
  })

  describe('getDaysInMonth', () => {
    it('returns correct days for February in leap year', () => {
      expect(getDaysInMonth(2024, 1)).toBe(29)
    })
    it('returns correct days for February in non-leap year', () => {
      expect(getDaysInMonth(2023, 1)).toBe(28)
    })
  })

  describe('isToday', () => {
    it('returns true for today', () => {
      expect(isToday(new Date())).toBe(true)
    })
  })

  describe('startOf', () => {
    it('returns start of day', () => {
      const result = startOf(new Date(2024, 0, 15, 10, 30), 'day')
      expect(result.getHours()).toBe(0)
      expect(result.getMinutes()).toBe(0)
    })
  })
})
`,
    };
}
//# sourceMappingURL=date.js.map