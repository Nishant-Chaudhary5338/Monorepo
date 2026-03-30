import { describe, it, expect } from 'vitest';
import { parseQueryParams, stringifyQueryParams, addQueryParams, removeQueryParams, getQueryParam, setQueryParam } from './query-params';

describe('parseQueryParams', () => {
  it('parses query string', () => {
    expect(parseQueryParams('?foo=bar&baz=1')).toEqual({ foo: 'bar', baz: '1' });
  });
  it('handles string without leading ?', () => {
    expect(parseQueryParams('foo=bar')).toEqual({ foo: 'bar' });
  });
  it('handles empty string', () => {
    expect(parseQueryParams('')).toEqual({});
  });
});

describe('stringifyQueryParams', () => {
  it('creates query string', () => {
    expect(stringifyQueryParams({ foo: 'bar', num: 1 })).toBe('foo=bar&num=1');
  });
  it('skips null/undefined', () => {
    expect(stringifyQueryParams({ foo: 'bar', skip: null, also: undefined })).toBe('foo=bar');
  });
});

describe('addQueryParams', () => {
  it('adds params to URL', () => {
    const result = addQueryParams('https://example.com', { foo: 'bar' });
    expect(result).toBe('https://example.com?foo=bar');
  });
  it('merges with existing params', () => {
    const result = addQueryParams('https://example.com?existing=1', { foo: 'bar' });
    expect(result).toContain('existing=1');
    expect(result).toContain('foo=bar');
  });
});

describe('removeQueryParams', () => {
  it('removes specified params', () => {
    const result = removeQueryParams('https://example.com?foo=1&bar=2&baz=3', ['bar']);
    expect(result).toContain('foo=1');
    expect(result).toContain('baz=3');
    expect(result).not.toContain('bar=');
  });
  it('returns original URL without query', () => {
    expect(removeQueryParams('https://example.com', ['foo'])).toBe('https://example.com');
  });
});

describe('getQueryParam', () => {
  it('gets single param', () => {
    expect(getQueryParam('https://example.com?foo=bar', 'foo')).toBe('bar');
  });
  it('returns null for missing param', () => {
    expect(getQueryParam('https://example.com?foo=bar', 'baz')).toBeNull();
  });
  it('returns null for URL without query', () => {
    expect(getQueryParam('https://example.com', 'foo')).toBeNull();
  });
});

describe('setQueryParam', () => {
  it('sets a param', () => {
    const result = setQueryParam('https://example.com', 'foo', 'bar');
    expect(result).toBe('https://example.com?foo=bar');
  });
});
