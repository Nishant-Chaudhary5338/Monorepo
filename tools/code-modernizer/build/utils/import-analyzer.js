"use strict";
// ============================================================================
// IMPORT ANALYZER - Analyze import dependencies and detect patterns
// ============================================================================
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildImportGraph = buildImportGraph;
exports.detectCircularDependencies = detectCircularDependencies;
exports.detectCrossFeatureImports = detectCrossFeatureImports;
exports.detectMissingBarrelExports = detectMissingBarrelExports;
exports.getImportStats = getImportStats;
exports.detectUnusedImports = detectUnusedImports;
exports.generateDependencyMatrix = generateDependencyMatrix;
const path = __importStar(require("path"));
/**
 * Build import graph from parsed files
 */
function buildImportGraph(files, projectPath) {
    const graph = new Map();
    for (const file of files) {
        const relativePath = path.relative(projectPath, file.filePath);
        const imports = new Set();
        for (const imp of file.imports) {
            if (imp.source.startsWith('.')) {
                const dir = path.dirname(file.filePath);
                const resolved = path.resolve(dir, imp.source);
                const extensions = ['', '.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx'];
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
function detectCircularDependencies(graph) {
    const cycles = [];
    const visited = new Set();
    const stack = [];
    function dfs(node) {
        if (stack.includes(node)) {
            const cycleStart = stack.indexOf(node);
            cycles.push([...stack.slice(cycleStart), node]);
            return;
        }
        if (visited.has(node))
            return;
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
function detectCrossFeatureImports(files, projectPath, featuresDir = 'src/features') {
    const violations = [];
    for (const file of files) {
        const relativePath = path.relative(projectPath, file.filePath);
        const fromFeature = extractFeature(relativePath, featuresDir);
        if (!fromFeature)
            continue;
        for (const imp of file.imports) {
            if (!imp.source.startsWith('.'))
                continue;
            const dir = path.dirname(file.filePath);
            const resolved = path.resolve(dir, imp.source);
            const extensions = ['', '.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx'];
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
function extractFeature(filePath, featuresDir) {
    const normalized = filePath.replace(/\\/g, '/');
    const featuresIndex = normalized.indexOf(featuresDir + '/');
    if (featuresIndex === -1)
        return null;
    const afterFeatures = normalized.slice(featuresIndex + featuresDir.length + 1);
    const segments = afterFeatures.split('/');
    return segments[0] || null;
}
/**
 * Detect missing barrel exports
 */
function detectMissingBarrelExports(files, projectPath) {
    const directories = new Map();
    for (const file of files) {
        const relativePath = path.relative(projectPath, file.filePath);
        const dir = path.dirname(relativePath);
        if (!directories.has(dir)) {
            directories.set(dir, []);
        }
        directories.get(dir).push(relativePath);
    }
    const missingBarrels = [];
    for (const [dir, dirFiles] of directories) {
        if (dir === '.' || dir === 'src')
            continue;
        const hasIndex = dirFiles.some((f) => f.endsWith('/index.ts') || f.endsWith('/index.tsx') || f.endsWith('/index.js'));
        if (!hasIndex && dirFiles.length > 1) {
            missingBarrels.push(dir);
        }
    }
    return missingBarrels;
}
/**
 * Get import statistics
 */
function getImportStats(files) {
    const totalImports = 0;
    const relativeImports = 0;
    const packageImports = 0;
    const packageCounts = new Map();
    for (const file of files) {
        for (const imp of file.imports) {
            totalImports++;
            if (imp.source.startsWith('.')) {
                relativeImports++;
            }
            else {
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
function detectUnusedImports(content, imports) {
    const unused = [];
    for (const imp of imports) {
        const unusedSpecifiers = [];
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
function generateDependencyMatrix(graph, files) {
    const matrix = [];
    for (const i = 0; i < files.length; i++) {
        matrix[i] = [];
        for (const j = 0; j < files.length; j++) {
            const imports = graph.get(files[i]) || new Set();
            matrix[i][j] = imports.has(files[j]) ? 1 : 0;
        }
    }
    return matrix;
}
//# sourceMappingURL=import-analyzer.js.map