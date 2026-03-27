import type { ImportInfo, ParsedFile } from '../types.js';
/**
 * Build import graph from parsed files
 */
export declare function buildImportGraph(files: ParsedFile[], projectPath: string): Map<string, Set<string>>;
/**
 * Detect circular dependencies in import graph
 */
export declare function detectCircularDependencies(graph: Map<string, Set<string>>): string[][];
/**
 * Detect cross-feature imports
 */
export declare function detectCrossFeatureImports(files: ParsedFile[], projectPath: string, featuresDir?: string): Array<{
    fromFile: string;
    toFile: string;
    importPath: string;
    line: number;
    fromFeature: string;
    toFeature: string;
}>;
/**
 * Detect missing barrel exports
 */
export declare function detectMissingBarrelExports(files: ParsedFile[], projectPath: string): string[];
/**
 * Get import statistics
 */
export declare function getImportStats(files: ParsedFile[]): {
    totalImports: number;
    relativeImports: number;
    packageImports: number;
    averageImportsPerFile: number;
    mostImportedPackages: Array<{
        name: string;
        count: number;
    }>;
};
/**
 * Detect unused imports (basic heuristic)
 */
export declare function detectUnusedImports(content: string, imports: ImportInfo[]): Array<{
    source: string;
    specifiers: string[];
    line: number;
}>;
/**
 * Generate import dependency matrix
 */
export declare function generateDependencyMatrix(graph: Map<string, Set<string>>, files: string[]): number[][];
//# sourceMappingURL=import-analyzer.d.ts.map