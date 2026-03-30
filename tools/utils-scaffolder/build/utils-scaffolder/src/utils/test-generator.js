export function generateFunctionTest(moduleName, funcName, testCases) {
    const testBody = testCases.map(tc => `  ${tc}`).join('\n\n');
    return `import { describe, it, expect } from 'vitest'
import { ${funcName} } from '../${moduleName}'

describe('${funcName}', () => {
${testBody}
})
`;
}
export function generateHookTest(hookName, hookModuleName, testCases) {
    const testBody = testCases.map(tc => `  ${tc}`).join('\n\n');
    return `import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { ${hookName} } from './${hookModuleName}'

describe('${hookName}', () => {
${testBody}
})
`;
}
export function generateClassTest(className, testCases) {
    const testBody = testCases.map(tc => `  ${tc}`).join('\n\n');
    return `import { describe, it, expect } from 'vitest'
import { ${className} } from './${className}'

describe('${className}', () => {
${testBody}
})
`;
}
export const commonTestCases = {
    handlesNullInput: (fnName) => `it('handles null input gracefully', () => {
    expect(() => ${fnName}(null as any)).not.toThrow()
  })`,
    handlesUndefinedInput: (fnName) => `it('handles undefined input gracefully', () => {
    expect(() => ${fnName}(undefined as any)).not.toThrow()
  })`,
    handlesEmptyString: (fnName) => `it('handles empty string', () => {
    const result = ${fnName}('')
    expect(result).toBeDefined()
  })`,
    handlesEmptyArray: (fnName) => `it('handles empty array', () => {
    const result = ${fnName}([])
    expect(result).toEqual([])
  })`,
    returnsCorrectType: (fnName, expectedType) => `it('returns correct type', () => {
    const result = ${fnName}('test')
    expect(typeof result).toBe('${expectedType}')
  })`,
};
//# sourceMappingURL=test-generator.js.map