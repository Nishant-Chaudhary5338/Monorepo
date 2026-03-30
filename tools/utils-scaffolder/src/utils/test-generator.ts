export function generateFunctionTest(
  moduleName: string,
  funcName: string,
  testCases: string[]
): string {
  const testBody = testCases.map(tc => `  ${tc}`).join('\n\n');
  return `import { describe, it, expect } from 'vitest'
import { ${funcName} } from '../${moduleName}'

describe('${funcName}', () => {
${testBody}
})
`;
}

export function generateHookTest(
  hookName: string,
  hookModuleName: string,
  testCases: string[]
): string {
  const testBody = testCases.map(tc => `  ${tc}`).join('\n\n');
  return `import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { ${hookName} } from './${hookModuleName}'

describe('${hookName}', () => {
${testBody}
})
`;
}

export function generateClassTest(
  className: string,
  testCases: string[]
): string {
  const testBody = testCases.map(tc => `  ${tc}`).join('\n\n');
  return `import { describe, it, expect } from 'vitest'
import { ${className} } from './${className}'

describe('${className}', () => {
${testBody}
})
`;
}

export const commonTestCases = {
  handlesNullInput: (fnName: string) =>
    `it('handles null input gracefully', () => {
    expect(() => ${fnName}(null as any)).not.toThrow()
  })`,
  handlesUndefinedInput: (fnName: string) =>
    `it('handles undefined input gracefully', () => {
    expect(() => ${fnName}(undefined as any)).not.toThrow()
  })`,
  handlesEmptyString: (fnName: string) =>
    `it('handles empty string', () => {
    const result = ${fnName}('')
    expect(result).toBeDefined()
  })`,
  handlesEmptyArray: (fnName: string) =>
    `it('handles empty array', () => {
    const result = ${fnName}([])
    expect(result).toEqual([])
  })`,
  returnsCorrectType: (fnName: string, expectedType: string) =>
    `it('returns correct type', () => {
    const result = ${fnName}('test')
    expect(typeof result).toBe('${expectedType}')
  })`,
};