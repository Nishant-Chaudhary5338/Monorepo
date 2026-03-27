/**
 * Resolve an import specifier to an absolute file path
 */
export declare function resolveImportPath(fromFile: string, specifier: string, projectPath: string, allFiles: string[]): string | null;
/**
 * Calculate relative import path between two files
 */
export declare function calculateRelativePath(fromFile: string, toFile: string): string;
/**
 * Calculate new import path after a file has been moved
 */
export declare function calculateNewImportPathAfterMove(importingFile: string, originalImportedFile: string, newImportedFile: string, originalImportSpecifier: string): string;
/**
 * Check if an import specifier points to a specific file
 */
export declare function importMatchesFile(specifier: string, filePath: string, fromFile: string, projectPath: string): boolean;
/**
 * Get the depth of a relative import (number of ../)
 */
export declare function getImportDepth(specifier: string): number;
/**
 * Check if import is deep (2+ levels of ../)
 */
export declare function isDeepImport(specifier: string): boolean;
/**
 * Normalize import path for comparison
 */
export declare function normalizeImportPath(specifier: string): string;
/**
 * Check if two import specifiers point to the same module
 */
export declare function importsAreEqual(spec1: string, spec2: string): boolean;
/**
 * Build a map of file basenames to full paths for quick lookup
 */
export declare function buildFileIndex(files: string[]): Map<string, string[]>;
/**
 * Find files that import a specific file
 */
export declare function findFilesImporting(targetFile: string, allFiles: string[], projectPath: string): string[];
/**
 * Get all possible import paths for a file
 */
export declare function getPossibleImportPaths(targetFile: string, fromFile: string): string[];
/**
 * Calculate import path depth for analysis
 */
export declare function analyzeImportPath(specifier: string): {
    isRelative: boolean;
    isAbsolute: boolean;
    depth: number;
    isDeep: boolean;
    segments: string[];
};
//# sourceMappingURL=path-resolver.d.ts.map