// ============================================================================
// IMPORT ANALYZER - Analyze import dependencies and detect patterns
// ============================================================================

import * as path from 'path';
import type { ImportInfo, ParsedFile } from '../types.js';

/**
 * Build import graph from parsed files
 */
export function buildImportGraph(
  files: ParsedFile[],
  projectPath: string
): Map<string, Set<string>> {
  const graph = new Map<string, Set<string>>();

  for (const file of files) {
    const relativePath = path.relative(projectPath, file.filePath);
    const imports = new Set<string>();

    for (const imp of file.imports) {
      if (imp.source.startsWith('.')) {
        const dir = path.dirname(file.filePath);
        const resolved = path.resolve(dir, imp.source);
        const extensions = ['', '.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx'] as const;

        for (const ext of extensions) {
          const candidate = resolved + ext;
          const candidateRelative = path.relative(projectPath, candidate);
          if (files.some((f) => path.relative(projectPath, f.filePath) === candidateRelative)) {
            imports.add(candidateRelative);
            break;
          }
        }
      }
    }

    graph.set(relativePath, imports);
  }

  return graph;
}

/**
 * Detect circular dependencies in import graph
 */
export function detectCircularDependencies(graph: Map<string, Set<string>>): string[][] {
  const cycles: string[][] = [];
  const visited = new Set<string>();
  const stack: string[] = [];

  function dfs(node: string) {
    if (stack.includes(node)) {
      const cycleStart = stack.indexOf(node);
      cycles.push([...stack.slice(cycleStart), node]);
      return;
    }

    if (visited.has(node)) return;

    visited.add(node);
    stack.push(node);

    const neighbors = graph.get(node) || new Set();
    for (const neighbor of neighbors) {
      dfs(neighbor);
    }

    stack.pop();
  }

  for (const node of graph.keys()) {
    dfs(node);
  }

  return cycles;
}

/**
 * Detect cross-feature imports
 */
export function detectCrossFeatureImports(
  files: ParsedFile[],
  projectPath: string,
  featuresDir: string = 'src/features'
): Array<{
  fromFile: string;
  toFile: string;
  importPath: string;
  line: number;
  fromFeature: string;
  toFeature: string;
}> {
  const violations: Array<{
    fromFile: string;
    toFile: string;
    importPath: string;
    line: number;
    fromFeature: string;
    toFeature: string;
  }> = [];

  for (const file of files) {
    const relativePath = path.relative(projectPath, file.filePath);
    const fromFeature = extractFeature(relativePath, featuresDir);

    if (!fromFeature) continue;

    for (const imp of file.imports) {
      if (!imp.source.startsWith('.')) continue;

      const dir = path.dirname(file.filePath);
      const resolved = path.resolve(dir, imp.source);
      const extensions = ['', '.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx'] as const;

      for (const ext of extensions) {
        const candidate = resolved + ext;
        const candidateRelative = path.relative(projectPath, candidate);
        const toFeature = extractFeature(candidateRelative, featuresDir);

        if (toFeature && toFeature !== fromFeature) {
          violations.push({
            fromFile: relativePath,
            toFile: candidateRelative,
            importPath: imp.source,
            line: imp.line,
            fromFeature,
            toFeature,
          });
          break;
        }
      }
    }
  }

  return violations;
}

/**
 * Extract feature name from file path
 */
function extractFeature(filePath: string, featuresDir: string): string | null {
  const normalized = filePath.replace(/\\/g, '/');
  const featuresIndex = normalized.indexOf(featuresDir + '/');

  if (featuresIndex === -1) return null;

  const afterFeatures = normalized.slice(featuresIndex + featuresDir.length + 1);
  const segments = afterFeatures.split('/');

  return segments[0] || null;
}

/**
 * Detect missing barrel exports
 */
export function detectMissingBarrelExports(
  files: ParsedFile[],
  projectPath: string
): string[] {
  const directories = new Map<string, string[]>();

  for (const file of files) {
    const relativePath = path.relative(projectPath, file.filePath);
    const dir = path.dirname(relativePath);

    if (!directories.has(dir)) {
      directories.set(dir, []);
    }
    directories.get(dir)!.push(relativePath);
  }

  const missingBarrels: string[] = [];

  for (const [dir, dirFiles] of directories) {
    if (dir === '.' || dir === 'src') continue;

    const hasIndex = dirFiles.some(
      (f) => f.endsWith('/index.ts') || f.endsWith('/index.tsx') || f.endsWith('/index.js')
    );

    if (!hasIndex && dirFiles.length > 1) {
      missingBarrels.push(dir);
    }
  }

  return missingBarrels;
}

/**
 * Get import statistics
 */
export function getImportStats(files: ParsedFile[]): {
  totalImports: number;
  relativeImports: number;
  packageImports: number;
  averageImportsPerFile: number;
  mostImportedPackages: Array<{ name: string; count: number }>;
} {
  const totalImports = 0;
  const relativeImports = 0;
  const packageImports = 0;
  const packageCounts = new Map<string, number>();

  for (const file of files) {
    for (const imp of file.imports) {
      totalImports++;

      if (imp.source.startsWith('.')) {
        relativeImports++;
      } else {
        packageImports++;
        const packageName = imp.source.startsWith('@')
          ? imp.source.split('/').slice(0, 2).join('/')
          : imp.source.split('/')[0];
        packageCounts.set(packageName, (packageCounts.get(packageName) || 0) + 1);
      }
    }
  }

  const mostImportedPackages = Array.from(packageCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalImports,
    relativeImports,
    packageImports,
    averageImportsPerFile: files.length > 0 ? totalImports / files.length : 0,
    mostImportedPackages,
  };
}

/**
 * Detect unused imports (basic heuristic)
 */
export function detectUnusedImports(
  content: string,
  imports: ImportInfo[]
): Array<{ source: string; specifiers: string[]; line: number }> {
  const unused: Array<{ source: string; specifiers: string[]; line: number }> = [];

  for (const imp of imports) {
    const unusedSpecifiers: string[] = [];

    for (const specifier of imp.specifiers) {
      const cleanSpec = specifier.replace('* as ', '');
      const afterImport = content.slice(imp.endColumn);
      const regex = new RegExp(`\\b${cleanSpec}\\b`);
      if (!regex.test(afterImport)) {
        unusedSpecifiers.push(specifier);
      }
    }

    if (unusedSpecifiers.length > 0) {
      unused.push({
        source: imp.source,
        specifiers: unusedSpecifiers,
        line: imp.line,
      });
    }
  }

  return unused;
}

/**
 * Generate import dependency matrix
 */
export function generateDependencyMatrix(
  graph: Map<string, Set<string>>,
  files: string[]
): number[][] {
  const matrix: number[][] = [];

  for (const i = 0; i < files.length; i++) {
    matrix[i] = [];
    for (const j = 0; j < files.length; j++) {
      const imports = graph.get(files[i]) || new Set();
      matrix[i][j] = imports.has(files[j]) ? 1 : 0;
    }
  }

  return matrix;
}