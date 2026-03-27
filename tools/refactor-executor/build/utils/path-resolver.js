"use strict";
// ============================================================================
// PATH RESOLVER - Import path resolution and calculation
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
exports.resolveImportPath = resolveImportPath;
exports.calculateRelativePath = calculateRelativePath;
exports.calculateNewImportPathAfterMove = calculateNewImportPathAfterMove;
exports.importMatchesFile = importMatchesFile;
exports.getImportDepth = getImportDepth;
exports.isDeepImport = isDeepImport;
exports.normalizeImportPath = normalizeImportPath;
exports.importsAreEqual = importsAreEqual;
exports.buildFileIndex = buildFileIndex;
exports.findFilesImporting = findFilesImporting;
exports.getPossibleImportPaths = getPossibleImportPaths;
exports.analyzeImportPath = analyzeImportPath;
const path = __importStar(require("path"));
/**
 * Resolve an import specifier to an absolute file path
 */
function resolveImportPath(fromFile, specifier, projectPath, allFiles) {
    // Skip node_modules imports (non-relative)
    if (!specifier.startsWith('.') && !specifier.startsWith('/')) {
        return null;
    }
    const fromDir = path.dirname(fromFile);
    let resolved;
    if (specifier.startsWith('.')) {
        // Relative import
        resolved = path.resolve(fromDir, specifier);
    }
    else {
        // Absolute import from project root
        resolved = path.resolve(projectPath, specifier.startsWith('/') ? specifier.slice(1) : specifier);
    }
    // Try exact match first
    if (allFiles.includes(resolved)) {
        return resolved;
    }
    // Try with extensions
    const extensions = ['.ts', '.tsx', '.js', '.jsx'];
    for (const ext of extensions) {
        const candidate = resolved + ext;
        if (allFiles.includes(candidate)) {
            return candidate;
        }
    }
    // Try index files
    const indexExtensions = ['/index.ts', '/index.tsx', '/index.js', '/index.jsx'];
    for (const ext of indexExtensions) {
        const candidate = resolved + ext;
        if (allFiles.includes(candidate)) {
            return candidate;
        }
    }
    return null;
}
/**
 * Calculate relative import path between two files
 */
function calculateRelativePath(fromFile, toFile) {
    const fromDir = path.dirname(fromFile);
    let relativePath = path.relative(fromDir, toFile);
    // Ensure it starts with ./ or ../
    if (!relativePath.startsWith('.')) {
        relativePath = './' + relativePath;
    }
    // Remove extension for cleaner imports
    const ext = path.extname(relativePath);
    if (['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
        relativePath = relativePath.slice(0, -ext.length);
    }
    // Handle index files - simplify to directory path
    if (relativePath.endsWith('/index')) {
        relativePath = relativePath.slice(0, -'/index'.length) || '.';
    }
    return relativePath;
}
/**
 * Calculate new import path after a file has been moved
 */
function calculateNewImportPathAfterMove(importingFile, originalImportedFile, newImportedFile, originalImportSpecifier) {
    return calculateRelativePath(importingFile, newImportedFile);
}
/**
 * Check if an import specifier points to a specific file
 */
function importMatchesFile(specifier, filePath, fromFile, projectPath) {
    const resolved = resolveImportPath(fromFile, specifier, projectPath, [filePath]);
    return resolved === filePath;
}
/**
 * Get the depth of a relative import (number of ../)
 */
function getImportDepth(specifier) {
    if (!specifier.startsWith('.'))
        return 0;
    return (specifier.match(/\.\.\//g) || []).length;
}
/**
 * Check if import is deep (2+ levels of ../)
 */
function isDeepImport(specifier) {
    return getImportDepth(specifier) >= 2;
}
/**
 * Normalize import path for comparison
 */
function normalizeImportPath(specifier) {
    // Remove extension
    const ext = path.extname(specifier);
    let normalized = specifier;
    if (['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
        normalized = specifier.slice(0, -ext.length);
    }
    // Handle index files
    if (normalized.endsWith('/index')) {
        normalized = normalized.slice(0, -'/index'.length) || '.';
    }
    return normalized;
}
/**
 * Check if two import specifiers point to the same module
 */
function importsAreEqual(spec1, spec2) {
    return normalizeImportPath(spec1) === normalizeImportPath(spec2);
}
/**
 * Build a map of file basenames to full paths for quick lookup
 */
function buildFileIndex(files) {
    const index = new Map();
    for (const file of files) {
        const basename = path.basename(file, path.extname(file));
        if (!index.has(basename)) {
            index.set(basename, []);
        }
        index.get(basename).push(file);
    }
    return index;
}
/**
 * Find files that import a specific file
 */
function findFilesImporting(targetFile, allFiles, projectPath) {
    const importers = [];
    const targetBasename = path.basename(targetFile, path.extname(targetFile));
    for (const file of allFiles) {
        if (file === targetFile)
            continue;
        // Simple heuristic: check if file content references the target
        // This is a simplified version - real implementation would parse AST
        const fileBasename = path.basename(file);
        const relPath = path.relative(path.dirname(file), targetFile);
        const importPath = relPath.startsWith('.') ? relPath : './' + relPath;
        // Would need to read file content and check imports
        // For now, return empty - actual implementation in ast-transform.ts
    }
    return importers;
}
/**
 * Get all possible import paths for a file
 */
function getPossibleImportPaths(targetFile, fromFile) {
    const paths = [];
    const relPath = calculateRelativePath(fromFile, targetFile);
    paths.push(relPath);
    // Add version with extension
    const ext = path.extname(targetFile);
    if (ext && !relPath.endsWith(ext)) {
        paths.push(relPath + ext);
    }
    // Add index version if applicable
    if (path.basename(targetFile).startsWith('index.')) {
        const dirPath = relPath.slice(0, -('/index' + ext).length) || '.';
        paths.push(dirPath);
    }
    return paths;
}
/**
 * Calculate import path depth for analysis
 */
function analyzeImportPath(specifier) {
    const isRelative = specifier.startsWith('.');
    const isAbsolute = specifier.startsWith('/');
    const depth = getImportDepth(specifier);
    const isDeep = isDeepImport(specifier);
    const segments = specifier.split('/').filter(Boolean);
    return { isRelative, isAbsolute, depth, isDeep, segments };
}
//# sourceMappingURL=path-resolver.js.map