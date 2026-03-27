import type { ImportGraph, ImportInfo } from '../types.js';
/**
 * Build a complete import graph for all source files in a directory
 */
export declare function buildImportGraph(rootDir: string): Promise<ImportGraph>;
/**
 * Resolve an import specifier to an actual file path
 */
export declare function resolveImportPath(fromFile: string, specifier: string, rootDir: string, allFiles: string[]): string | null;
/**
 * Detect circular dependencies in the import graph
 */
export declare function detectCircularDependencies(graph: ImportGraph): string[][];
/**
 * Find deep imports (../../../ pattern)
 */
export declare function findDeepImports(graph: ImportGraph): {
    file: string;
    import: string;
    depth: number;
}[];
/**
 * Detect cross-feature imports (importing from sibling feature folders)
 */
export declare function findCrossFeatureImports(graph: ImportGraph, rootDir: string, srcDir?: string): {
    from: string;
    to: string;
    importPath: string;
}[];
/**
 * Find unused imports in a file
 */
export declare function findUnusedImports(content: string, imports: ImportInfo[]): string[];
/**
 * Calculate coupling between two files (how much A depends on B)
 */
export declare function calculateCoupling(graph: ImportGraph, fileA: string, fileB: string): number;
//# sourceMappingURL=import-tracker.d.ts.map