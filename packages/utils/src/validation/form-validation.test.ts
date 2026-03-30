import { describe, it, expect } from 'vitest';
import { createFormSchema, validateField, sanitizeInput, validateFileUpload } from './form-validation';
import { z } from 'zod';

describe('createFormSchema', () => {
  it('creates string field schema', () => {
    const schema = createFormSchema({ name: { type: 'string', required: true } });
    expect(schema.parse({ name: 'John' })).toEqual({ name: 'John' });
  });
  it('creates email field schema', () => {
    const schema = createFormSchema({ email: { type: 'email', required: true } });
    expect(schema.parse({ email: 'user@example.com' })).toEqual({ email: 'user@example.com' });
    expect(() => schema.parse({ email: 'invalid' })).toThrow();
  });
  it('creates number field schema', () => {
    const schema = createFormSchema({ age: { type: 'number', required: true } });
    expect(schema.parse({ age: 25 })).toEqual({ age: 25 });
  });
  it('creates boolean field schema', () => {
    const schema = createFormSchema({ active: { type: 'boolean', required: true } });
    expect(schema.parse({ active: true })).toEqual({ active: true });
  });
  it('handles optional fields', () => {
    const schema = createFormSchema({ nickname: { type: 'string', required: false } });
    expect(schema.parse({})).toEqual({});
  });
});

describe('validateField', () => {
  it('returns success for valid value', () => {
    const result = validateField('hello', z.string());
    expect(result.success).toBe(true);
  });
  it('returns error for invalid value', () => {
    const result = validateField(123, z.string());
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});

describe('sanitizeInput', () => {
  it('escapes HTML entities', () => {
    expect(sanitizeInput('<script>alert(1)</script>')).toContain('&lt;script&gt;');
  });
  it('escapes quotes', () => {
    expect(sanitizeInput('He said hello')).toContain('&quot;');
  });
});

describe('validateFileUpload', () => {
  it('validates file size', () => {
    const result = validateFileUpload({ size: 1000, type: 'image/png' }, { maxSize: 500 });
    expect(result.valid).toBe(false);
    expect(result.error).toContain('size');
  });
  it('validates file type', () => {
    const result = validateFileUpload({ size: 100, type: 'text/plain' }, { allowedTypes: ['image/png'] });
    expect(result.valid).toBe(false);
    expect(result.error).toContain('type');
  });
  it('passes valid file', () => {
    const result = validateFileUpload({ size: 100, type: 'image/png' }, { maxSize: 1000, allowedTypes: ['image/png'] });
    expect(result.valid).toBe(true);
  });
});
