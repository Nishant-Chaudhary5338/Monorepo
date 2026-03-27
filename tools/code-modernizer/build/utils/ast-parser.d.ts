import type { ParsedFile, ImportInfo, ExportInfo, FunctionInfo, JSXInfo, HookUsage } from '../types.js';
/**
 * Read file content safely
 */
export declare function readFileContent(filePath: string): string | null;
/**
 * Parse a file into an AST
 */
export declare function parseFile(filePath: string): ParsedFile | null;
/**
 * Extract import declarations from AST
 */
export declare function extractImports(ast: unknown): ImportInfo[];
/**
 * Extract export declarations from AST
 */
export declare function extractExports(ast: unknown): ExportInfo[];
/**
 * Extract function declarations from AST
 */
export declare function extractFunctions(ast: unknown): FunctionInfo[];
/**
 * Extract JSX elements and calculate nesting depth
 */
export declare function extractJSX(ast: unknown): JSXInfo[];
/**
 * Extract React hook usage from AST
 */
export declare function extractHooks(ast: unknown): HookUsage[];
/**
 * Detect if file contains JSX
 */
export declare function hasJSX(ast: unknown): boolean;
/**
 * Detect fetch/axios API calls
 */
export declare function extractApiCalls(ast: unknown): {
    method: string;
    url: string;
    line: number;
}[];
//# sourceMappingURL=ast-parser.d.ts.map