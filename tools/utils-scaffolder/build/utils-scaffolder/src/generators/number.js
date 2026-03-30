// ============================================================================
// NUMBER MODULE GENERATOR
// ============================================================================
export function generateNumberModule() {
    return {
        'index.ts': `// ============================================================================
// NUMBER MODULE - Number formatting and utilities
// ============================================================================

// ============================================================================
// FORMATTERS
// ============================================================================

/**
 * Formats a number as currency
 * @param value - Number to format
 * @param currency - Currency code (default: 'USD')
 * @param locale - Locale string (default: 'en-US')
 * @returns Formatted currency string
 * @example formatCurrency(1234.56, 'USD') // '$1,234.56'
 */
export function formatCurrency(value: number, currency = 'USD', locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
}

/**
 * Formats a number as percentage
 * @param value - Number to format (0-1 range)
 * @param decimals - Decimal places (default: 2)
 * @returns Formatted percentage string
 * @example formatPercentage(0.1234) // '12.34%'
 */
export function formatPercentage(value: number, decimals = 2): string {
  return (value * 100).toFixed(decimals) + '%';
}

/**
 * Formats a large number with compact notation
 * @param value - Number to format
 * @param locale - Locale string (default: 'en-US')
 * @returns Compact formatted string
 * @example formatCompact(1234567) // '1.2M'
 */
export function formatCompact(value: number, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}

/**
 * Formats bytes to human-readable file size
 * @param bytes - Number of bytes
 * @param decimals - Decimal places (default: 2)
 * @returns Formatted file size string
 * @example formatFileSize(1048576) // '1 MB'
 */
export function formatFileSize(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}

/**
 * Formats a phone number
 * @param phone - Phone number string
 * @param country - Country code (default: 'US')
 * @returns Formatted phone number
 * @example formatPhoneNumber('1234567890') // '(123) 456-7890'
 */
export function formatPhoneNumber(phone: string, country = 'US'): string {
  const cleaned = phone.replace(/\\D/g, '');
  if (country === 'US' && cleaned.length === 10) {
    return '(' + cleaned.slice(0, 3) + ') ' + cleaned.slice(3, 6) + '-' + cleaned.slice(6);
  }
  if (country === 'US' && cleaned.length === 11 && cleaned.startsWith('1')) {
    return '+1 (' + cleaned.slice(1, 4) + ') ' + cleaned.slice(4, 7) + '-' + cleaned.slice(7);
  }
  return phone;
}

/**
 * Formats a credit card number
 * @param cardNumber - Credit card number string
 * @returns Formatted credit card string
 * @example formatCreditCard('4111111111111111') // '4111 1111 1111 1111'
 */
export function formatCreditCard(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\\D/g, '');
  const groups = cleaned.match(/.{1,4}/g);
  return groups ? groups.join(' ') : cardNumber;
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Clamps a number between min and max
 * @param value - Number to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 * @example clamp(150, 0, 100) // 100
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Generates a random float between min and max
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Random float
 */
export function random(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Generates a random integer between min and max (inclusive)
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Random integer
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Creates an array of numbers in a range
 * @param start - Start value
 * @param end - End value
 * @param step - Step size (default: 1)
 * @returns Array of numbers
 * @example range(1, 10, 2) // [1, 3, 5, 7, 9]
 */
export function range(start: number, end: number, step = 1): number[] {
  const result: number[] = [];
  if (step > 0) {
    for (let i = start; i < end; i += step) result.push(i);
  } else if (step < 0) {
    for (let i = start; i > end; i += step) result.push(i);
  }
  return result;
}

/**
 * Rounds a number to specified decimal places
 * @param value - Number to round
 * @param decimals - Decimal places (default: 0)
 * @returns Rounded number
 * @example roundTo(3.14159, 2) // 3.14
 */
export function roundTo(value: number, decimals = 0): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Calculates the average of an array of numbers
 * @param values - Array of numbers
 * @returns Average value
 */
export function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/**
 * Calculates the sum of an array of numbers
 * @param values - Array of numbers
 * @returns Sum value
 */
export function sum(values: number[]): number {
  return values.reduce((s, v) => s + v, 0);
}

/**
 * Calculates the median of an array of numbers
 * @param values - Array of numbers
 * @returns Median value
 * @example median([1, 2, 3, 4, 5]) // 3
 */
export function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Calculates a percentile value
 * @param values - Array of numbers
 * @param percentile - Percentile (0-100)
 * @returns Percentile value
 */
export function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
}

// ============================================================================
// CONVERTERS
// ============================================================================

/**
 * Converts a number to Roman numeral
 * @param num - Number to convert (1-3999)
 * @returns Roman numeral string
 * @example toRoman(12) // 'XII'
 */
export function toRoman(num: number): string {
  if (num < 1 || num > 3999) return String(num);
  const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const numerals = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
  let result = '';
  for (let i = 0; i < values.length; i++) {
    while (num >= values[i]) {
      result += numerals[i];
      num -= values[i];
    }
  }
  return result;
}

/**
 * Converts a Roman numeral to number
 * @param str - Roman numeral string
 * @returns Number value
 */
export function fromRoman(str: string): number {
  const map: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let result = 0;
  for (let i = 0; i < str.length; i++) {
    const curr = map[str[i]] || 0;
    const next = map[str[i + 1]] || 0;
    result += curr < next ? -curr : curr;
  }
  return result;
}

/**
 * Converts a number to hex string
 * @param num - Number to convert
 * @returns Hex string
 */
export function toHex(num: number): string {
  return num.toString(16);
}

/**
 * Converts a hex string to number
 * @param hex - Hex string
 * @returns Number value
 */
export function fromHex(hex: string): number {
  return parseInt(hex, 16);
}

/**
 * Converts a number to binary string
 * @param num - Number to convert
 * @returns Binary string
 */
export function toBinary(num: number): string {
  return num.toString(2);
}

/**
 * Converts bytes to human-readable size
 * @param bytes - Number of bytes
 * @returns Human-readable size string
 */
export function bytesToSize(bytes: number): string {
  return formatFileSize(bytes);
}
`,
        'number.test.ts': `import { describe, it, expect } from 'vitest'
import {
  formatCurrency, formatPercentage, formatCompact, formatFileSize,
  clamp, random, randomInt, range, roundTo, average, sum, median,
  percentile, toRoman, fromRoman, toHex, fromHex, toBinary,
} from './index'

describe('Number Module', () => {
  describe('formatCurrency', () => {
    it('formats USD currency', () => {
      expect(formatCurrency(1234.56)).toContain('1,234.56')
    })
  })

  describe('formatPercentage', () => {
    it('formats percentage', () => {
      expect(formatPercentage(0.1234)).toBe('12.34%')
    })
  })

  describe('formatFileSize', () => {
    it('formats bytes', () => {
      expect(formatFileSize(1048576)).toBe('1 MB')
    })
    it('handles zero', () => {
      expect(formatFileSize(0)).toBe('0 Bytes')
    })
  })

  describe('clamp', () => {
    it('clamps values to range', () => {
      expect(clamp(150, 0, 100)).toBe(100)
      expect(clamp(-10, 0, 100)).toBe(0)
      expect(clamp(50, 0, 100)).toBe(50)
    })
  })

  describe('range', () => {
    it('creates range array', () => {
      expect(range(1, 5)).toEqual([1, 2, 3, 4])
      expect(range(0, 10, 2)).toEqual([0, 2, 4, 6, 8])
    })
  })

  describe('roundTo', () => {
    it('rounds to decimal places', () => {
      expect(roundTo(3.14159, 2)).toBe(3.14)
      expect(roundTo(3.14159, 0)).toBe(3)
    })
  })

  describe('average', () => {
    it('calculates average', () => {
      expect(average([1, 2, 3, 4, 5])).toBe(3)
    })
    it('handles empty array', () => {
      expect(average([])).toBe(0)
    })
  })

  describe('sum', () => {
    it('calculates sum', () => {
      expect(sum([1, 2, 3, 4, 5])).toBe(15)
    })
  })

  describe('median', () => {
    it('calculates median for odd length', () => {
      expect(median([1, 2, 3, 4, 5])).toBe(3)
    })
    it('calculates median for even length', () => {
      expect(median([1, 2, 3, 4])).toBe(2.5)
    })
  })

  describe('toRoman', () => {
    it('converts numbers to roman', () => {
      expect(toRoman(12)).toBe('XII')
      expect(toRoman(4)).toBe('IV')
      expect(toRoman(1994)).toBe('MCMXCIV')
    })
  })

  describe('fromRoman', () => {
    it('converts roman to numbers', () => {
      expect(fromRoman('XII')).toBe(12)
      expect(fromRoman('IV')).toBe(4)
    })
  })

  describe('toHex', () => {
    it('converts to hex', () => {
      expect(toHex(255)).toBe('ff')
    })
  })

  describe('fromHex', () => {
    it('converts from hex', () => {
      expect(fromHex('ff')).toBe(255)
    })
  })

  describe('toBinary', () => {
    it('converts to binary', () => {
      expect(toBinary(10)).toBe('1010')
    })
  })

  describe('randomInt', () => {
    it('generates number in range', () => {
      for (let i = 0; i < 100; i++) {
        const val = randomInt(1, 10)
        expect(val).toBeGreaterThanOrEqual(1)
        expect(val).toBeLessThanOrEqual(10)
      }
    })
  })
})
`,
    };
}
//# sourceMappingURL=number.js.map