import { describe, it, expect } from 'vitest';
import { toCamelCase, toSnakeCase, toKebabCase, toPascalCase, toDotCase, toConstantCase, toSentenceCase } from './converters';

describe('toCamelCase', () => {
  it('converts from various cases', () => {
    expect(toCamelCase('hello-world')).toBe('helloWorld');
    expect(toCamelCase('hello_world')).toBe('helloWorld');
    expect(toCamelCase('hello world')).toBe('helloWorld');
  });
  it('handles already camelCase', () => {
    expect(toCamelCase('helloWorld')).toBe('helloWorld');
  });
});

describe('toSnakeCase', () => {
  it('converts from various cases', () => {
    expect(toSnakeCase('helloWorld')).toBe('hello_world');
    expect(toSnakeCase('hello-world')).toBe('hello_world');
    expect(toSnakeCase('hello world')).toBe('hello_world');
  });
  it('handles already snake_case', () => {
    expect(toSnakeCase('hello_world')).toBe('hello_world');
  });
});

describe('toKebabCase', () => {
  it('converts from various cases', () => {
    expect(toKebabCase('helloWorld')).toBe('hello-world');
    expect(toKebabCase('hello_world')).toBe('hello-world');
    expect(toKebabCase('hello world')).toBe('hello-world');
  });
});

describe('toPascalCase', () => {
  it('converts from various cases', () => {
    expect(toPascalCase('hello-world')).toBe('HelloWorld');
    expect(toPascalCase('hello_world')).toBe('HelloWorld');
    expect(toPascalCase('hello world')).toBe('HelloWorld');
  });
});

describe('toDotCase', () => {
  it('converts from various cases', () => {
    expect(toDotCase('helloWorld')).toBe('hello.world');
    expect(toDotCase('hello-world')).toBe('hello.world');
    expect(toDotCase('hello_world')).toBe('hello.world');
  });
});

describe('toConstantCase', () => {
  it('converts from various cases', () => {
    expect(toConstantCase('helloWorld')).toBe('HELLO_WORLD');
    expect(toConstantCase('hello-world')).toBe('HELLO_WORLD');
    expect(toConstantCase('hello world')).toBe('HELLO_WORLD');
  });
});

describe('toSentenceCase', () => {
  it('converts from various cases', () => {
    expect(toSentenceCase('helloWorld')).toBe('Hello world');
    expect(toSentenceCase('hello_world')).toBe('Hello world');
    expect(toSentenceCase('hello-world')).toBe('Hello world');
  });
});
