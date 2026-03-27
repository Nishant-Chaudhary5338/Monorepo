import type { ImportInfo, ParsedFile, ImportUpdate } from '../types.js';
/**
 * Parse a file into AST
 */
export declare function parseFile(filePath: string, content: string): ParsedFile | null;
/**
 * Extract imports from AST with column positions
 */
export declare function extractImports(ast: unknown, content: string): ImportInfo[];
/**
 * Calculate new relative import path after file move
 */
export declare function calculateNewImportPath(importingFile: string, importedFile: string, oldImportedFile: string, importSpecifier: string): string;
/**
 * Rewrite imports in a file based on moved files mapping
 */
export declare function rewriteImports(filePath: string, content: string, movedFiles: Record<string, string>, // old path -> new path
projectPath: string): {
    newContent: string;
    updates: ImportUpdate[];
};
/**
 * Rewrite import path in a single import statement
 */
export declare function rewriteSingleImport(content: string, oldSpecifier: string, newSpecifier: string): string;
/**
 * Generate import statement
 */
export declare function generateImportStatement(specifiers: string[], source: string, isDefault?: boolean): string;
/**
 * Generate export statement
 */
export declare function generateExportStatement(names: string[], isDefault?: boolean): string;
/**
 * Generate re-export statement for barrel files
 */
export declare function generateReExport(source: string, names?: string[], isDefault?: boolean): string;
//# sourceMappingURL=ast-transform.d.ts.map