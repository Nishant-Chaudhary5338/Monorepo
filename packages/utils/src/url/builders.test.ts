import { describe, it, expect } from 'vitest';
import { buildUrl, joinPaths } from './builders';

describe('buildUrl', () => {
  it('builds URL with base and path', () => {
    expect(buildUrl('https://api.example.com', '/users')).toBe('https://api.example.com/users');
  });
  it('appends query params', () => {
    const url = buildUrl('https://api.example.com', '/users', { page: 1, limit: 10 });
    expect(url).toContain('page=1');
    expect(url).toContain('limit=10');
  });
  it('skips null/undefined params', () => {
    const url = buildUrl('https://api.example.com', '/users', { page: 1, filter: null, sort: undefined });
    expect(url).toContain('page=1');
    expect(url).not.toContain('filter');
    expect(url).not.toContain('sort');
  });
});

describe('joinPaths', () => {
  it('joins paths', () => {
    expect(joinPaths('/api', 'users', '123')).toBe('/api/users/123');
  });
  it('handles trailing slashes', () => {
    expect(joinPaths('/api/', '/users/')).toBe('/api/users');
  });
  it('filters empty segments', () => {
    expect(joinPaths('/api', '', 'users')).toBe('/api/users');
  });
});
