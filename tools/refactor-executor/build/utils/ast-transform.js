"use strict";
// ============================================================================
// AST TRANSFORM - AST-based import rewriting for refactoring
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
exports.parseFile = parseFile;
exports.extractImports = extractImports;
exports.calculateNewImportPath = calculateNewImportPath;
exports.rewriteImports = rewriteImports;
exports.rewriteSingleImport = rewriteSingleImport;
exports.generateImportStatement = generateImportStatement;
exports.generateExportStatement = generateExportStatement;
exports.generateReExport = generateReExport;
const path = __importStar(require("path"));
// Lazy-load parser
let parser = null;
function getParser() {
    if (!parser) {
        parser = require('@typescript-eslint/parser');
    }
    return parser;
}
/**
 * Parser options based on file extension
 */
function getParserOptions(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: ext === '.jsx' || ext === '.tsx',
        },
        range: true,
        loc: true,
        comment: true,
    };
}
/**
 * Parse a file into AST
 */
function parseFile(filePath, content) {
    try {
        const p = getParser();
        const ast = p.parse(content, getParserOptions(filePath));
        const imports = extractImports(ast, content);
        return { filePath, content, ast, imports };
    }
    catch {
        try {
            const p = getParser();
            const ast = p.parse(content, {
                ecmaVersion: 2022,
                sourceType: 'module',
                ecmaFeatures: { jsx: true },
                range: true,
                loc: true,
            });
            const imports = extractImports(ast, content);
            return { filePath, content, ast, imports };
        }
        catch {
            return null;
        }
    }
}
/**
 * Extract imports from AST with column positions
 */
function extractImports(ast, content) {
    const imports = [];
    const lines = content.split('\n');
    function walk(node) {
        if (!node || typeof node !== 'object')
            return;
        if (node.type === 'ImportDeclaration') {
            const source = node.source?.value || '';
            const specifiers = [];
            let isDefault = false;
            for (const spec of node.specifiers || []) {
                if (spec.type === 'ImportDefaultSpecifier') {
                    specifiers.push(spec.local?.name || '');
                    isDefault = true;
                }
                else if (spec.type === 'ImportSpecifier') {
                    specifiers.push(spec.imported?.name || spec.local?.name || '');
                }
                else if (spec.type === 'ImportNamespaceSpecifier') {
                    specifiers.push(`* as ${spec.local?.name || ''}`);
                }
            }
            const line = node.loc?.start?.line || 0;
            const lineContent = lines[line - 1] || '';
            const startColumn = node.loc?.start?.column || 0;
            const endColumn = node.loc?.end?.column || lineContent.length;
            imports.push({
                source,
                specifiers,
                isDefault,
                line,
                startColumn,
                endColumn,
            });
        }
        for (const key of Object.keys(node)) {
            if (key === 'parent' || key === 'loc' || key === 'range')
                continue;
            const child = node[key];
            if (Array.isArray(child)) {
                for (const item of child)
                    walk(item);
            }
            else if (child && typeof child === 'object' && child.type) {
                walk(child);
            }
        }
    }
    walk(ast);
    return imports;
}
/**
 * Calculate new relative import path after file move
 */
function calculateNewImportPath(importingFile, importedFile, oldImportedFile, importSpecifier) {
    // If the import was to the moved file, calculate new relative path
    const importingDir = path.dirname(importingFile);
    let newRelativePath = path.relative(importingDir, importedFile);
    // Ensure it starts with ./ or ../
    if (!newRelativePath.startsWith('.')) {
        newRelativePath = './' + newRelativePath;
    }
    // Remove extension if present (for cleaner imports)
    const ext = path.extname(newRelativePath);
    if (['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
        newRelativePath = newRelativePath.slice(0, -ext.length);
    }
    // Handle index files
    if (newRelativePath.endsWith('/index')) {
        newRelativePath = newRelativePath.slice(0, -'/index'.length) || '.';
    }
    return newRelativePath;
}
/**
 * Rewrite imports in a file based on moved files mapping
 */
function rewriteImports(filePath, content, movedFiles, // old path -> new path
projectPath) {
    const parsed = parseFile(filePath, content);
    if (!parsed) {
        return { newContent: content, updates: [] };
    }
    const updates = [];
    const lines = content.split('\n');
    let newContent = content;
    const offset = 0; // Track character offset for replacements
    // Process imports in reverse order to maintain positions
    const sortedImports = [...parsed.imports].sort((a, b) => b.line - a.line);
    for (const imp of sortedImports) {
        // Skip non-relative imports
        if (!imp.source.startsWith('.'))
            continue;
        // Resolve the imported file
        const importingDir = path.dirname(filePath);
        const resolvedImport = path.resolve(importingDir, imp.source);
        // Try common extensions
        const extensions = ['', '.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx', '/index.js', '/index.jsx'];
        let actualResolved = '';
        for (const ext of extensions) {
            const candidate = resolvedImport + ext;
            if (candidate in movedFiles || Object.values(movedFiles).includes(candidate)) {
                actualResolved = candidate;
                break;
            }
        }
        if (!actualResolved) {
            // Check if any moved file matches this import
            for (const [oldPath, newPath] of Object.entries(movedFiles)) {
                const oldBasename = path.basename(oldPath, path.extname(oldPath));
                if (imp.source.includes(oldBasename)) {
                    actualResolved = oldPath;
                    break;
                }
            }
        }
        if (actualResolved && actualResolved in movedFiles) {
            const newFilePath = movedFiles[actualResolved];
            const newImportPath = calculateNewImportPath(filePath, newFilePath, actualResolved, imp.source);
            if (newImportPath !== imp.source) {
                // Find the exact import statement in the line
                const lineContent = lines[imp.line - 1];
                const oldImportStatement = `'${imp.source}'`;
                const newImportStatement = `'${newImportPath}'`;
                if (lineContent.includes(oldImportStatement)) {
                    updates.push({
                        file: filePath,
                        oldImport: imp.source,
                        newImport: newImportPath,
                        line: imp.line,
                    });
                }
            }
        }
    }
    // Apply updates (in reverse order to preserve line numbers)
    const uniqueUpdates = updates.filter((update, index, self) => index === self.findIndex((u) => u.line === update.line && u.oldImport === update.oldImport));
    for (const update of uniqueUpdates.sort((a, b) => b.line - a.line)) {
        const lineIndex = update.line - 1;
        const oldLine = lines[lineIndex];
        const newLine = oldLine.replace(`'${update.oldImport}'`, `'${update.newImport}'`).replace(`"${update.oldImport}"`, `"${update.newImport}"`);
        lines[lineIndex] = newLine;
    }
    newContent = lines.join('\n');
    return { newContent, updates: uniqueUpdates };
}
/**
 * Rewrite import path in a single import statement
 */
function rewriteSingleImport(content, oldSpecifier, newSpecifier) {
    // Handle both single and double quotes
    return content
        .replace(`'${oldSpecifier}'`, `'${newSpecifier}'`)
        .replace(`"${oldSpecifier}"`, `"${newSpecifier}"`);
}
/**
 * Generate import statement
 */
function generateImportStatement(specifiers, source, isDefault = false) {
    if (isDefault && specifiers.length === 1) {
        return `import ${specifiers[0]} from '${source}';`;
    }
    if (specifiers.length === 0) {
        return `import '${source}';`;
    }
    return `import { ${specifiers.join(', ')} } from '${source}';`;
}
/**
 * Generate export statement
 */
function generateExportStatement(names, isDefault = false) {
    if (isDefault && names.length === 1) {
        return `export default ${names[0]};`;
    }
    return `export { ${names.join(', ')} };`;
}
/**
 * Generate re-export statement for barrel files
 */
function generateReExport(source, names, isDefault = false) {
    if (isDefault && names && names.length === 1) {
        return `export { default as ${names[0]} } from '${source}';`;
    }
    if (!names || names.length === 0) {
        return `export * from '${source}';`;
    }
    return `export { ${names.join(', ')} } from '${source}';`;
}
//# sourceMappingURL=ast-transform.js.map