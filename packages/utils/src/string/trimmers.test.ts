import { describe, it, expect } from 'vitest';
import { trimWhitespace, stripHtml, stripMarkdown, normalizeWhitespace, removeNonAlphanumeric, removeDuplicates, reverseString } from './trimmers';

describe('trimWhitespace', () => {
  it('trims and normalizes whitespace', () => {
    expect(trimWhitespace('  hello   world  ')).toBe('hello world');
    expect(trimWhitespace('multiple   spaces')).toBe('multiple spaces');
  });
});

describe('stripHtml', () => {
  it('removes HTML tags', () => {
    expect(stripHtml('<p>Hello</p>')).toBe('Hello');
  });
  it('handles nbsp entities', () => {
    expect(stripHtml('Hello&nbsp;World')).toBe('Hello World');
  });
});

describe('stripMarkdown', () => {
  it('removes markdown formatting', () => {
    expect(stripMarkdown('# Heading')).toBe('Heading');
    expect(stripMarkdown('**bold** and *italic*')).toBe('bold and italic');
  });
  it('removes links', () => {
    expect(stripMarkdown('[text](url)')).toBe('text');
  });
  it('removes list markers', () => {
    expect(stripMarkdown('- item')).toBe('item');
    expect(stripMarkdown('* item')).toBe('item');
  });
});

describe('normalizeWhitespace', () => {
  it('normalizes multiple spaces', () => {
    expect(normalizeWhitespace('  hello   world  ')).toBe('hello world');
  });
});

describe('removeNonAlphanumeric', () => {
  it('keeps only letters, numbers, and spaces', () => {
    expect(removeNonAlphanumeric('Hello, World! 123')).toBe('Hello World 123');
  });
});

describe('removeDuplicates', () => {
  it('removes duplicate characters', () => {
    expect(removeDuplicates('aabbcc')).toBe('abc');
    expect(removeDuplicates('hello')).toBe('helo');
  });
});

describe('reverseString', () => {
  it('reverses a string', () => {
    expect(reverseString('hello')).toBe('olleh');
    expect(reverseString('abc')).toBe('cba');
  });
});
