// @ts-nocheck
// ============================================================================
// AST PARSER - Parse JS/JSX/TS/TSX files to AST using @typescript-eslint
// ============================================================================
import * as path from 'path';
import fs from 'fs-extra';
import { createRequire } from 'module';
const _require = createRequire(import.meta.url);
// Lazy-load parser to avoid issues at module level
let parser = null;
function getParser() {
    if (!parser) {
        parser = _require('@typescript-eslint/parser');
    }
    return parser;
}
/**
 * Determine parser options based on file extension
 */
function getParserOptions(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const isTS = ext === '.ts' || ext === '.tsx';
    return {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: ext === '.jsx' || ext === '.tsx',
        },
        ...(isTS && {
            project: undefined,
            warnOnUnsupportedTypeScriptVersion: false,
        }),
    };
}
/**
 * Read file content safely
 */
export function readFileContent(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf-8');
    }
    catch {
        return null;
    }
}
/**
 * Parse a file into an AST
 */
export function parseFile(filePath) {
    const content = readFileContent(filePath);
    if (!content)
        return null;
    try {
        const p = getParser();
        const ast = p.parse(content, {
            ...getParserOptions(filePath),
            range: true,
            loc: true,
            comment: true,
        });
        const imports = extractImports(ast);
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
                comment: true,
            });
            const imports = extractImports(ast);
            return { filePath, content, ast, imports };
        }
        catch {
            return null;
        }
    }
}
/**
 * Extract import declarations from AST
 */
export function extractImports(ast) {
    const imports = [];
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
            imports.push({
                source,
                specifiers,
                isDefault,
                line: node.loc?.start?.line || 0,
                startColumn: node.loc?.start?.column || 0,
                endColumn: node.loc?.end?.column || 0,
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
 * Extract export declarations from AST
 */
export function extractExports(ast) {
    const exports = [];
    function walk(node) {
        if (!node || typeof node !== 'object')
            return;
        if (node.type === 'ExportDefaultDeclaration') {
            const decl = node.declaration;
            let name = 'default';
            if (decl?.type === 'FunctionDeclaration' || decl?.type === 'ClassDeclaration') {
                name = decl.id?.name || 'default';
            }
            else if (decl?.type === 'Identifier') {
                name = decl.name;
            }
            exports.push({ name, isDefault: true, line: node.loc?.start?.line || 0 });
        }
        if (node.type === 'ExportNamedDeclaration') {
            if (node.declaration) {
                const decl = node.declaration;
                if (decl.type === 'VariableDeclaration') {
                    for (const d of decl.declarations || []) {
                        if (d.id?.name) {
                            exports.push({ name: d.id.name, isDefault: false, line: node.loc?.start?.line || 0 });
                        }
                    }
                }
                else if (decl.id?.name) {
                    exports.push({ name: decl.id.name, isDefault: false, line: node.loc?.start?.line || 0 });
                }
            }
            for (const spec of node.specifiers || []) {
                const name = spec.exported?.name || spec.local?.name || '';
                if (name) {
                    exports.push({ name, isDefault: false, line: node.loc?.start?.line || 0 });
                }
            }
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
    return exports;
}
/**
 * Extract function declarations from AST
 */
export function extractFunctions(ast) {
    const functions = [];
    const exportedNames = new Set();
    function collectExports(node) {
        if (!node || typeof node !== 'object')
            return;
        if (node.type === 'ExportNamedDeclaration' && node.declaration) {
            const decl = node.declaration;
            if (decl.type === 'FunctionDeclaration' && decl.id?.name) {
                exportedNames.add(decl.id.name);
            }
            else if (decl.type === 'VariableDeclaration') {
                for (const d of decl.declarations || []) {
                    if (d.id?.name)
                        exportedNames.add(d.id.name);
                }
            }
        }
        if (node.type === 'ExportDefaultDeclaration' && node.declaration?.id?.name) {
            exportedNames.add(node.declaration.id.name);
        }
        for (const key of Object.keys(node)) {
            if (key === 'parent' || key === 'loc' || key === 'range')
                continue;
            const child = node[key];
            if (Array.isArray(child)) {
                for (const item of child)
                    collectExports(item);
            }
            else if (child && typeof child === 'object' && child.type) {
                collectExports(child);
            }
        }
    }
    collectExports(ast);
    function walk(node) {
        if (!node || typeof node !== 'object')
            return;
        if (node.type === 'FunctionDeclaration' && node.id?.name) {
            const params = (node.params || []).map((p) => {
                if (p.type === 'Identifier')
                    return p.name;
                if (p.type === 'ObjectPattern')
                    return '{...}';
                if (p.type === 'ArrayPattern')
                    return '[...]';
                return '...';
            });
            const name = node.id.name;
            functions.push({
                name,
                params,
                line: node.loc?.start?.line || 0,
                isExported: exportedNames.has(name),
                isComponent: /^[A-Z]/.test(name),
            });
        }
        if (node.type === 'VariableDeclarator' && node.init) {
            const initType = node.init.type;
            if ((initType === 'ArrowFunctionExpression' || initType === 'FunctionExpression') && node.id?.name) {
                const params = (node.init.params || []).map((p) => {
                    if (p.type === 'Identifier')
                        return p.name;
                    if (p.type === 'ObjectPattern')
                        return '{...}';
                    return '...';
                });
                const name = node.id.name;
                functions.push({
                    name,
                    params,
                    line: node.loc?.start?.line || 0,
                    isExported: exportedNames.has(name),
                    isComponent: /^[A-Z]/.test(name),
                });
            }
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
    return functions;
}
/**
 * Extract JSX elements and calculate nesting depth
 */
export function extractJSX(ast) {
    const elements = [];
    function walk(node, currentDepth = 0) {
        if (!node || typeof node !== 'object')
            return;
        if (node.type === 'JSXElement' || node.type === 'JSXFragment') {
            let tagName = 'Fragment';
            if (node.type === 'JSXElement' && node.openingElement?.name) {
                const name = node.openingElement.name;
                if (name.type === 'JSXIdentifier') {
                    tagName = name.name;
                }
                else if (name.type === 'JSXMemberExpression') {
                    tagName = `${name.object?.name || ''}.${name.property?.name || ''}`;
                }
            }
            const childrenCount = (node.children || []).filter((c) => c.type === 'JSXElement' || c.type === 'JSXFragment').length;
            elements.push({
                tagName,
                depth: currentDepth,
                line: node.loc?.start?.line || 0,
                childrenCount,
            });
            for (const child of node.children || []) {
                walk(child, currentDepth + 1);
            }
        }
        for (const key of Object.keys(node)) {
            if (key === 'parent' || key === 'loc' || key === 'range' || key === 'children')
                continue;
            const child = node[key];
            if (Array.isArray(child)) {
                for (const item of child)
                    walk(item, currentDepth);
            }
            else if (child && typeof child === 'object' && child.type) {
                walk(child, currentDepth);
            }
        }
    }
    walk(ast);
    return elements;
}
/**
 * Extract React hook usage from AST
 */
export function extractHooks(ast) {
    const hooks = [];
    function walk(node) {
        if (!node || typeof node !== 'object')
            return;
        if (node.type === 'CallExpression' && node.callee?.type === 'Identifier') {
            const name = node.callee.name;
            if (/^use[A-Z]/.test(name)) {
                hooks.push({
                    name,
                    line: node.loc?.start?.line || 0,
                });
            }
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
    return hooks;
}
/**
 * Detect if file contains JSX
 */
export function hasJSX(ast) {
    let found = false;
    function walk(node) {
        if (found || !node || typeof node !== 'object')
            return;
        if (node.type === 'JSXElement' || node.type === 'JSXFragment') {
            found = true;
            return;
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
    return found;
}
/**
 * Detect fetch/axios API calls
 */
export function extractApiCalls(ast) {
    const calls = [];
    function walk(node) {
        if (!node || typeof node !== 'object')
            return;
        // Detect fetch calls
        if (node.type === 'CallExpression') {
            const callee = node.callee;
            // fetch('url')
            if (callee?.type === 'Identifier' && callee.name === 'fetch') {
                const urlArg = node.arguments?.[0];
                if (urlArg?.type === 'Literal' && typeof urlArg.value === 'string') {
                    calls.push({ method: 'GET', url: urlArg.value, line: node.loc?.start?.line || 0 });
                }
                else if (urlArg?.type === 'TemplateLiteral') {
                    calls.push({ method: 'GET', url: 'template-literal', line: node.loc?.start?.line || 0 });
                }
            }
            // axios.get/post/put/delete
            if (callee?.type === 'MemberExpression' && callee.object?.name === 'axios') {
                const method = callee.property?.name?.toUpperCase() || 'GET';
                const urlArg = node.arguments?.[0];
                if (urlArg?.type === 'Literal' && typeof urlArg.value === 'string') {
                    calls.push({ method, url: urlArg.value, line: node.loc?.start?.line || 0 });
                }
                else {
                    calls.push({ method, url: 'dynamic', line: node.loc?.start?.line || 0 });
                }
            }
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
    return calls;
}
//# sourceMappingURL=ast-parser.js.map