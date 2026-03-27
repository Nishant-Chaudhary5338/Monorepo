import type { ImportGraph } from '../types.js';
/**
 * Detect feature name from a file path
 */
export declare function detectFeatureFromPath(filePath: string, rootDir: string): string | null;
/**
 * Detect feature from route path
 */
export declare function detectFeatureFromRoute(routePath: string): string | null;
/**
 * Cluster files by their import relationships to detect features
 */
export declare function detectFeaturesByImportClustering(rootDir: string): Promise<Record<string, string[]>>;
/**
 * Extract route paths from routing files
 */
export declare function extractRoutePaths(rootDir: string): Promise<{
    path: string;
    component: string;
}[]>;
/**
 * Classify a file type based on its path and content
 */
export declare function classifyFileType(filePath: string, rootDir: string): 'feature' | 'shared' | 'utility' | 'config';
/**
 * Standard subdirectories for each feature
 */
export declare const FEATURE_SUBDIRS: readonly ["components", "hooks", "api", "pages", "types", "utils"];
/**
 * Standard shared layer directories
 */
export declare const SHARED_DIRS: readonly ["components", "hooks", "utils", "types", "lib", "styles"];
/**
 * Standard app-level directories
 */
export declare const APP_DIRS: readonly ["router", "store", "providers"];
/**
 * Generate target path for a file based on its classification
 */
export declare function generateTargetPath(filePath: string, rootDir: string, features: string[], featureMap: Record<string, string[]>): string;
/**
 * Convert string to kebab-case
 */
export declare function toKebabCase(str: string): string;
/**
 * Convert string to PascalCase
 */
export declare function toPascalCase(str: string): string;
/**
 * Convert string to camelCase
 */
export declare function toCamelCase(str: string): string;
/**
 * Detect current naming convention of a file
 */
export declare function detectNamingConvention(filePath: string): 'kebab-case' | 'camelCase' | 'PascalCase' | 'SCREAMING_SNAKE' | 'snake_case';
/**
 * Suggest better name for a file based on its content and context
 */
export declare function suggestFileName(filePath: string, content: string): string | null;
/**
 * Get the feature a file belongs to based on its path
 */
export declare function getFileFeature(filePath: string, rootDir: string): string | null;
/**
 * Check if an import crosses feature boundaries
 */
export declare function isCrossFeatureImport(fromFile: string, importSource: string, rootDir: string, allFiles: string[]): boolean;
/**
 * Calculate import depth (number of ../ traversals)
 */
export declare function getImportDepth(importSource: string): number;
/**
 * Check if files are tightly coupled (mutual imports with many connections)
 */
export declare function areTightlyCoupled(graph: ImportGraph, fileA: string, fileB: string, threshold?: number): boolean;
/**
 * Detect if a file is a "kitchen sink" utility file
 */
export declare function isKitchenSinkFile(filePath: string): boolean;
/**
 * Suggest splits for a utility file based on exported functions
 */
export declare function suggestUtilitySplits(filePath: string, content: string): {
    category: string;
    functions: string[];
}[];
//# sourceMappingURL=refactor-helpers.d.ts.map