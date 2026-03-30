import { describe, it, expect } from 'vitest';
import { interpolate, createTemplate } from './template';

describe('interpolate', () => {
  it('replaces template variables', () => {
    expect(interpolate('Hello {{name}}!', { name: 'World' })).toBe('Hello World!');
  });
  it('replaces multiple variables', () => {
    expect(interpolate('{{greeting}}, {{name}}!', { greeting: 'Hi', name: 'Alice' })).toBe('Hi, Alice!');
  });
  it('leaves unmatched variables as-is', () => {
    expect(interpolate('Hello {{name}}!', {})).toBe('Hello {{name}}!');
  });
  it('handles number and boolean values', () => {
    expect(interpolate('Count: {{count}}', { count: 42 })).toBe('Count: 42');
    expect(interpolate('Active: {{active}}', { active: true })).toBe('Active: true');
  });
});

describe('createTemplate', () => {
  it('creates reusable template function', () => {
    const greet = createTemplate('Hello {{name}}!');
    expect(greet({ name: 'World' })).toBe('Hello World!');
    expect(greet({ name: 'Alice' })).toBe('Hello Alice!');
  });
});
