import type { ParsedFile, ImportInfo, ExportInfo, FunctionInfo, JSXInfo, ComponentAnalysis, HookUsage } from '../types.js';
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
 * Full component analysis of a file
 */
export declare function analyzeComponent(filePath: string): ComponentAnalysis | null;
/**
 * Analyze multiple files in batch
 */
export declare function analyzeComponents(filePaths: string[]): Promise<ComponentAnalysis[]>;
//# sourceMappingURL=ast-parser.d.ts.map