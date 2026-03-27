import type { AnalysisIssue, DiffChange } from './types.js';
export declare const descriptionPatterns: {
    minLength: number;
    shouldInclude: string[];
    enrichDescription(toolName: string, currentDesc: string, inputSchema: Record<string, unknown>): {
        improved: string;
        changes: DiffChange[];
    };
    checkDescription(desc: string): AnalysisIssue | null;
};
export declare const schemaPatterns: {
    checkProperty(propName: string, prop: unknown): AnalysisIssue[];
    checkRequiredVsDefault(schema: unknown): AnalysisIssue[];
};
export declare const errorPatterns: {
    genericCatch: RegExp;
    genericCatchAlt: RegExp;
    checkGenericErrorHandling(source: string): AnalysisIssue | null;
    generateStructuredError(errorVar?: string): string;
    checkMissingValidation(source: string, toolName: string): AnalysisIssue[];
};
export declare const edgeCasePatterns: {
    checkEmptyDirectory(source: string): AnalysisIssue | null;
    checkLargeFiles(source: string): AnalysisIssue | null;
    checkSymlinks(source: string): AnalysisIssue | null;
    checkPermissions(source: string): AnalysisIssue | null;
    checkConcurrentAccess(source: string): AnalysisIssue | null;
};
export declare const responsePatterns: {
    checkConsistentFormat(source: string): AnalysisIssue | null;
    checkMissingSuccessField(source: string): AnalysisIssue | null;
};
export declare const codeQualityPatterns: {
    checkDuplicatedScanDirectory(source: string, filePath: string): AnalysisIssue | null;
    checkDuplicatedFindTsconfig(source: string, filePath: string): AnalysisIssue | null;
    checkLongFunctions(source: string): AnalysisIssue[];
    checkAnyTypes(source: string): AnalysisIssue[];
};
export declare const contextualPatterns: {
    checkMissingWhy(source: string): AnalysisIssue | null;
    checkMissingConfidenceScores(source: string): AnalysisIssue | null;
    checkMissingSuggestions(source: string): AnalysisIssue | null;
};
export declare function runAllPatternChecks(source: string, filePath: string, tools: {
    name: string;
    description: string;
    inputSchema: unknown;
}[]): AnalysisIssue[];
//# sourceMappingURL=patterns.d.ts.map