#!/usr/bin/env node
// ============================================================================
// DEPENDENCY AUDITOR MCP SERVER
// Deep dependency analysis for monorepos
// ============================================================================
import { McpServerBase } from '../../_shared/index.js';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
// ============================================================================
// HELPERS
// ============================================================================
function findMonorepoRoot(startDir) {
    let dir = startDir;
    while (dir !== '/' && dir !== '.') {
        if (fs.existsSync(path.join(dir, 'pnpm-workspace.yaml')) ||
            fs.existsSync(path.join(dir, 'turbo.json'))) {
            return dir;
        }
        dir = path.dirname(dir);
    }
    throw new Error('No monorepo root found');
}
function getAllPackages(root) {
    const dirs = ['apps', 'packages', 'tools'];
    const packages = [];
    for (const dir of dirs) {
        const dirPath = path.join(root, dir);
        if (!fs.existsSync(dirPath))
            continue;
        const entries = fs.readdirSync(dirPath, { withFileTypes: true });
        for (const entry of entries) {
            if (!entry.isDirectory())
                continue;
            const pkgPath = path.join(dirPath, entry.name);
            const pkgJson = path.join(pkgPath, 'package.json');
            if (fs.existsSync(pkgJson)) {
                const pkg = JSON.parse(fs.readFileSync(pkgJson, 'utf-8'));
                packages.push({ name: pkg.name || entry.name, path: pkgPath, pkg });
            }
        }
    }
    return packages;
}
function scanSourceFiles(dir, exts = ['.ts', '.tsx', '.js', '.jsx']) {
    const files = [];
    if (!fs.existsSync(dir))
        return files;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (['node_modules', 'build', 'dist', '.next', '__tests__', '.git'].includes(entry.name))
                continue;
            files.push(...scanSourceFiles(fullPath, exts));
        }
        else if (exts.some(e => entry.name.endsWith(e))) {
            if (entry.name.includes('.test.') || entry.name.includes('.spec.') || entry.name.includes('.stories.'))
                continue;
            files.push(fullPath);
        }
    }
    return files;
}
function extractImports(content) {
    const imports = [];
    // ES module imports
    const esMatches = content.matchAll(/import\s+(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)\s+from\s+)?['"]([^'"]+)['"]/g);
    for (const m of esMatches)
        imports.push(m[1]);
    // require()
    const reqMatches = content.matchAll(/require\s*\(\s*['"]([^'"]+)['"]\s*\)/g);
    for (const m of reqMatches)
        imports.push(m[1]);
    return imports;
}
function getExternalPackageName(importPath) {
    if (importPath.startsWith('.') || importPath.startsWith('/'))
        return null;
    // Handle scoped packages
    if (importPath.startsWith('@')) {
        const parts = importPath.split('/');
        return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : importPath;
    }
    return importPath.split('/')[0];
}
// ============================================================================
// MAIN SERVER
// ============================================================================
class DepAuditorServer extends McpServerBase {
    constructor() {
        super({ name: 'dep-auditor', version: '2.0.0' });
    }
    registerTools() {
    }
    handleFindUnusedDeps(args) {
        const root = args?.root ? path.resolve(args.root) : findMonorepoRoot(process.cwd());
        const targetPackage = args?.package;
        const packages = getAllPackages(root);
        const filtered = targetPackage
            ? packages.filter(p => p.name === targetPackage)
            : packages;
        const results = [];
        for (const pkg of filtered) {
            const declaredDeps = new Set([
                ...Object.keys(pkg.pkg.dependencies || {}),
                ...Object.keys(pkg.pkg.devDependencies || {}),
            ]);
            // Scan src for actual imports
            const srcDir = path.join(pkg.path, 'src');
            const sourceFiles = scanSourceFiles(srcDir);
            const usedDeps = new Set();
            for (const file of sourceFiles) {
                const content = fs.readFileSync(file, 'utf-8');
                const imports = extractImports(content);
                for (const imp of imports) {
                    const extName = getExternalPackageName(imp);
                    if (extName)
                        usedDeps.add(extName);
                }
            }
            const unused = [...declaredDeps].filter(d => {
                if (d.startsWith('@types/'))
                    return false; // Type defs are "used" implicitly
                if (['typescript', 'vitest', 'jest', 'eslint', 'prettier', '@types/node'].includes(d))
                    return false; // Tooling
                return !usedDeps.has(d);
            });
            if (unused.length > 0) {
                results.push({
                    package: pkg.name,
                    unusedDeps: unused,
                    totalDeclared: declaredDeps.size,
                    totalUsed: usedDeps.size,
                });
            }
        }
        const totalUnused = results.reduce((sum, r) => sum + r.unusedDeps.length, 0);
        return {
            content: [{
                    type: 'text',
                    text: JSON.stringify({
                        summary: `Found ${totalUnused} potentially unused dependencies across ${results.length} packages`,
                        packagesAudited: filtered.length,
                        packagesWithUnusedDeps: results.length,
                        results,
                    }, null, 2),
                }],
        };
    }
    handleFindDuplicateDeps(args) {
        const root = args?.root ? path.resolve(args.root) : findMonorepoRoot(process.cwd());
        const packages = getAllPackages(root);
        const depVersions = new Map();
        for (const pkg of packages) {
            const allDeps = { ...pkg.pkg.dependencies, ...pkg.pkg.devDependencies };
            for (const [dep, version] of Object.entries(allDeps)) {
                if (!depVersions.has(dep))
                    depVersions.set(dep, new Map());
                const versions = depVersions.get(dep);
                const ver = version;
                if (!versions.has(ver))
                    versions.set(ver, []);
                versions.get(ver).push(pkg.name);
            }
        }
        const duplicates = [];
        for (const [dep, versions] of depVersions) {
            if (versions.size > 1) {
                duplicates.push({
                    dependency: dep,
                    versions: Object.fromEntries(versions),
                    versionCount: versions.size,
                });
            }
        }
        duplicates.sort((a, b) => b.versionCount - a.versionCount);
        return {
            content: [{
                    type: 'text',
                    text: JSON.stringify({
                        summary: `Found ${duplicates.length} dependencies with version mismatches`,
                        totalDependencies: depVersions.size,
                        duplicates,
                        recommendation: duplicates.length > 0
                            ? 'Consider aligning versions using a shared dependency or pnpm overrides'
                            : 'All dependency versions are consistent',
                    }, null, 2),
                }],
        };
    }
    handleCheckOutdated(args) {
        const root = args?.root ? path.resolve(args.root) : findMonorepoRoot(process.cwd());
        const targetPackage = args?.package;
        const packages = getAllPackages(root);
        const filtered = targetPackage
            ? packages.filter(p => p.name === targetPackage)
            : packages;
        const results = [];
        for (const pkg of filtered) {
            const allDeps = { ...pkg.pkg.dependencies, ...pkg.pkg.devDependencies };
            for (const [dep, declaredVersion] of Object.entries(allDeps)) {
                try {
                    // Check what's actually installed
                    const depPkgPath = path.join(pkg.path, 'node_modules', dep.replace('/', path.sep), 'package.json');
                    let installedVersion = null;
                    if (fs.existsSync(depPkgPath)) {
                        installedVersion = JSON.parse(fs.readFileSync(depPkgPath, 'utf-8')).version;
                    }
                    // Check latest from npm
                    let latestVersion = null;
                    try {
                        latestVersion = execSync(`npm view ${dep} version 2>/dev/null`, {
                            encoding: 'utf-8',
                            timeout: 10000,
                        }).trim();
                    }
                    catch {
                        // Can't reach npm
                    }
                    const declared = declaredVersion;
                    const cleanDeclared = declared.replace(/[^0-9.]/g, '');
                    if (latestVersion && cleanDeclared !== latestVersion) {
                        results.push({
                            package: pkg.name,
                            dependency: dep,
                            declared: cleanDeclared,
                            installed: installedVersion,
                            latest: latestVersion,
                            type: pkg.pkg.dependencies?.[dep] ? 'production' : 'dev',
                        });
                    }
                }
                catch {
                    // Skip errors
                }
            }
        }
        // Deduplicate
        const seen = new Set();
        const unique = results.filter(r => {
            const key = `${r.package}:${r.dependency}`;
            if (seen.has(key))
                return false;
            seen.add(key);
            return true;
        });
        unique.sort((a, b) => a.dependency.localeCompare(b.dependency));
        return {
            content: [{
                    type: 'text',
                    text: JSON.stringify({
                        summary: `Found ${unique.length} outdated dependencies`,
                        packagesChecked: filtered.length,
                        outdated: unique.slice(0, 50),
                        note: results.length > 50 ? `Showing first 50 of ${results.length} results` : undefined,
                    }, null, 2),
                }],
        };
    }
    handleAnalyzeBundleImpact(args) {
        const root = args?.root ? path.resolve(args.root) : findMonorepoRoot(process.cwd());
        const packages = getAllPackages(root);
        const analysis = [];
        for (const pkg of packages) {
            const prodDeps = new Set(Object.keys(pkg.pkg.dependencies || {}));
            const devDeps = new Set(Object.keys(pkg.pkg.devDependencies || {}));
            const srcDir = path.join(pkg.path, 'src');
            const sourceFiles = scanSourceFiles(srcDir);
            const usedInSrc = new Set();
            for (const file of sourceFiles) {
                const content = fs.readFileSync(file, 'utf-8');
                const imports = extractImports(content);
                for (const imp of imports) {
                    const extName = getExternalPackageName(imp);
                    if (extName)
                        usedInSrc.add(extName);
                }
            }
            const usedInProd = [...usedInSrc].filter(d => prodDeps.has(d));
            const usedInDevOnly = [...usedInSrc].filter(d => devDeps.has(d) && !prodDeps.has(d));
            const declaredButNotUsed = [...prodDeps].filter(d => !usedInSrc.has(d));
            analysis.push({
                package: pkg.name,
                productionDeps: prodDeps.size,
                devDeps: devDeps.size,
                usedInSource: usedInSrc.size,
                usedInProduction: usedInProd,
                usedInDevOnly: usedInDevOnly,
                declaredButNotUsed: declaredButNotUsed,
                potentialBundleReduction: declaredButNotUsed,
            });
        }
        return {
            content: [{
                    type: 'text',
                    text: JSON.stringify({
                        summary: `Analyzed ${packages.length} packages for bundle impact`,
                        packages: analysis,
                    }, null, 2),
                }],
        };
    }
    handleFindUndeclaredDeps(args) {
        const root = args?.root ? path.resolve(args.root) : findMonorepoRoot(process.cwd());
        const targetPackage = args?.package;
        const packages = getAllPackages(root);
        const workspaceNames = new Set(packages.map(p => p.name));
        const filtered = targetPackage
            ? packages.filter(p => p.name === targetPackage)
            : packages;
        const results = [];
        for (const pkg of filtered) {
            const declaredDeps = new Set([
                ...Object.keys(pkg.pkg.dependencies || {}),
                ...Object.keys(pkg.pkg.devDependencies || {}),
            ]);
            const srcDir = path.join(pkg.path, 'src');
            const sourceFiles = scanSourceFiles(srcDir);
            const undeclared = new Set();
            for (const file of sourceFiles) {
                const content = fs.readFileSync(file, 'utf-8');
                const imports = extractImports(content);
                for (const imp of imports) {
                    const extName = getExternalPackageName(imp);
                    if (extName && !declaredDeps.has(extName) && !workspaceNames.has(extName)) {
                        undeclared.add(extName);
                    }
                }
            }
            if (undeclared.size > 0) {
                results.push({
                    package: pkg.name,
                    undeclaredDeps: [...undeclared],
                    warning: 'These are phantom dependencies - they work because hoisting puts them in root node_modules',
                });
            }
        }
        const totalUndeclared = results.reduce((sum, r) => sum + r.undeclaredDeps.length, 0);
        return {
            content: [{
                    type: 'text',
                    text: JSON.stringify({
                        summary: `Found ${totalUndeclared} undeclared (phantom) dependencies across ${results.length} packages`,
                        packagesChecked: filtered.length,
                        results,
                        recommendation: totalUndeclared > 0
                            ? 'Add these to package.json dependencies to prevent breakage when hoisting changes'
                            : 'No phantom dependencies detected',
                    }, null, 2),
                }],
        };
    }
    handleDepSizes(args) {
        const root = args?.root ? path.resolve(args.root) : findMonorepoRoot(process.cwd());
        const topN = args?.topN || 20;
        const nmPath = path.join(root, 'node_modules');
        if (!fs.existsSync(nmPath)) {
            return {
                content: [{
                        type: 'text',
                        text: JSON.stringify({ error: 'node_modules not found. Run pnpm install first.' }),
                    }],
                isError: true,
            };
        }
        function getDirSize(dir) {
            let size = 0;
            try {
                const entries = fs.readdirSync(dir, { withFileTypes: true });
                for (const entry of entries) {
                    const fullPath = path.join(dir, entry.name);
                    if (entry.isDirectory()) {
                        if (entry.name === '.git')
                            continue;
                        size += getDirSize(fullPath);
                    }
                    else if (entry.isFile()) {
                        size += fs.statSync(fullPath).size;
                    }
                }
            }
            catch { }
            return size;
        }
        const depSizes = [];
        const entries = fs.readdirSync(nmPath, { withFileTypes: true });
        for (const entry of entries) {
            if (!entry.isDirectory())
                continue;
            if (entry.name.startsWith('.'))
                continue;
            if (entry.name.startsWith('@')) {
                // Scoped packages
                const scopeDir = path.join(nmPath, entry.name);
                const scopeEntries = fs.readdirSync(scopeDir, { withFileTypes: true });
                for (const scopeEntry of scopeEntries) {
                    if (!scopeEntry.isDirectory())
                        continue;
                    const fullPath = path.join(scopeDir, scopeEntry.name);
                    const size = getDirSize(fullPath);
                    depSizes.push({
                        name: `${entry.name}/${scopeEntry.name}`,
                        sizeBytes: size,
                        sizeMB: (size / 1024 / 1024).toFixed(2),
                    });
                }
            }
            else {
                const fullPath = path.join(nmPath, entry.name);
                const size = getDirSize(fullPath);
                depSizes.push({
                    name: entry.name,
                    sizeBytes: size,
                    sizeMB: (size / 1024 / 1024).toFixed(2),
                });
            }
        }
        depSizes.sort((a, b) => b.sizeBytes - a.sizeBytes);
        const totalSize = depSizes.reduce((sum, d) => sum + d.sizeBytes, 0);
        return {
            content: [{
                    type: 'text',
                    text: JSON.stringify({
                        totalSizeMB: (totalSize / 1024 / 1024).toFixed(2),
                        totalDependencies: depSizes.length,
                        topDeps: depSizes.slice(0, topN),
                    }, null, 2),
                }],
        };
    }
}
// ============================================================================
// ENTRY POINT
// ============================================================================
new DepAuditorServer().run().catch(console.error);
//# sourceMappingURL=index.js.map