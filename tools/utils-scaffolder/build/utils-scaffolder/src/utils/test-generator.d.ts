export declare function generateFunctionTest(moduleName: string, funcName: string, testCases: string[]): string;
export declare function generateHookTest(hookName: string, hookModuleName: string, testCases: string[]): string;
export declare function generateClassTest(className: string, testCases: string[]): string;
export declare const commonTestCases: {
    handlesNullInput: (fnName: string) => string;
    handlesUndefinedInput: (fnName: string) => string;
    handlesEmptyString: (fnName: string) => string;
    handlesEmptyArray: (fnName: string) => string;
    returnsCorrectType: (fnName: string, expectedType: string) => string;
};
//# sourceMappingURL=test-generator.d.ts.map