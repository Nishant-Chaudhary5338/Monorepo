import { describe, it, expect } from 'vitest';
import { fuzzySearch, createSearchIndex, highlightMatches } from './search';

describe('fuzzySearch', () => {
  const items = [
    { name: 'JavaScript', desc: 'Programming language' },
    { name: 'TypeScript', desc: 'Typed JS' },
    { name: 'Python', desc: 'Snake language' },
    { name: 'Java', desc: 'Enterprise language' },
  ];
  it('returns exact matches first', () => {
    const result = fuzzySearch(items, 'Java', { keys: ['name'] });
    expect(result[0].name).toBe('Java');
  });
  it('returns partial matches', () => {
    const result = fuzzySearch(items, 'script', { keys: ['name'] });
    expect(result.length).toBeGreaterThan(0);
  });
  it('returns all items for empty query', () => {
    const result = fuzzySearch(items, '', { keys: ['name'] });
    expect(result.length).toBe(4);
  });
  it('respects limit', () => {
    const result = fuzzySearch(items, 'a', { keys: ['name'], limit: 2 });
    expect(result.length).toBeLessThanOrEqual(2);
  });
});

describe('createSearchIndex', () => {
  it('creates index from items', () => {
    const items = [
      { title: 'Hello World', content: 'foo' },
      { title: 'Goodbye', content: 'bar' },
    ];
    const index = createSearchIndex(items, ['title']);
    expect(index.get('hello')).toEqual([{ title: 'Hello World', content: 'foo' }]);
  });
});

describe('highlightMatches', () => {
  it('highlights matching text', () => {
    expect(highlightMatches('Hello World', 'World')).toBe('Hello <mark>World</mark>');
  });
  it('uses custom highlight tag', () => {
    expect(highlightMatches('Hello World', 'World', 'strong')).toBe('Hello <strong>World</strong>');
  });
  it('returns original for empty query', () => {
    expect(highlightMatches('Hello World', '')).toBe('Hello World');
  });
  it('is case insensitive', () => {
    expect(highlightMatches('Hello World', 'hello')).toBe('<mark>Hello</mark> World');
  });
});
