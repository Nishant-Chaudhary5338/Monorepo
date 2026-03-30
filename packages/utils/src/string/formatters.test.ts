import { describe, it, expect } from 'vitest';
import { capitalize, capitalizeWords, titleCase, truncate, truncateMiddle, wrapText, formatInitials, maskString } from './formatters';

describe('capitalize', () => {
  it('capitalizes first letter', () => {
    expect(capitalize('hello')).toBe('Hello');
    expect(capitalize('world')).toBe('World');
  });
  it('handles empty string', () => { expect(capitalize('')).toBe(''); });
  it('handles single character', () => { expect(capitalize('a')).toBe('A'); });
});

describe('capitalizeWords', () => {
  it('capitalizes first letter of each word', () => {
    expect(capitalizeWords('hello world')).toBe('Hello World');
    expect(capitalizeWords('the quick brown fox')).toBe('The Quick Brown Fox');
  });
  it('handles empty string', () => { expect(capitalizeWords('')).toBe(''); });
});

describe('titleCase', () => {
  it('converts to title case', () => {
    expect(titleCase('hello-world')).toBe('Hello World');
    expect(titleCase('my_variable_name')).toBe('My Variable Name');
  });
  it('handles empty string', () => { expect(titleCase('')).toBe(''); });
});

describe('truncate', () => {
  it('truncates long strings', () => {
    expect(truncate('Hello World', 8)).toBe('Hello...');
  });
  it('keeps short strings unchanged', () => {
    expect(truncate('Hi', 10)).toBe('Hi');
  });
  it('uses custom suffix', () => {
    expect(truncate('Hello World', 10, '...')).toBe('Hello W...');
  });
});

describe('truncateMiddle', () => {
  it('truncates middle of string', () => {
    const result = truncateMiddle('verylongfilename.txt', 12);
    expect(result).toHaveLength(12);
    expect(result).toContain('...');
  });
  it('keeps short strings unchanged', () => {
    expect(truncateMiddle('short', 10)).toBe('short');
  });
});

describe('wrapText', () => {
  it('wraps text to max width', () => {
    const lines = wrapText('The quick brown fox jumps', 10);
    expect(lines.length).toBeGreaterThan(1);
    lines.forEach(line => { expect(line.length).toBeLessThanOrEqual(10); });
  });
  it('handles single long word', () => {
    const lines = wrapText('supercalifragilistic', 5);
    expect(lines).toEqual(['supercalifragilistic']);
  });
});

describe('formatInitials', () => {
  it('extracts initials from name', () => {
    expect(formatInitials('John Doe')).toBe('JD');
    expect(formatInitials('Jane Mary Smith')).toBe('JM');
  });
  it('limits to 2 characters', () => {
    expect(formatInitials('A B C D')).toBe('AB');
  });
});

describe('maskString', () => {
  it('masks middle of string with default options', () => {
    const masked = maskString('1234567890');
    expect(masked).toContain('*');
    expect(masked).toMatch(/7890$/);
  });
  it('shows first N characters', () => {
    const masked = maskString('1234567890', { showFirst: 4 });
    expect(masked).toMatch(/^1234/);
  });
  it('returns short strings unchanged', () => {
    expect(maskString('1234', { showFirst: 2, showLast: 2 })).toBe('1234');
  });
});
