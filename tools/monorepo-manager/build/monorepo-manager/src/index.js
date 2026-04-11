#!/usr/bin/env node
// ============================================================================
// MONOREPO MANAGER MCP SERVER
// Generic workspace operations for pnpm/turborepo monorepos
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
            fs.existsSync(path.join(dir, 'turbo.json')) ||
            fs.existsSync(path.join(dir, 'lerna.json'))) {
            return dir;
        }
        dir = path.dirname(dir);
    }
    throw new Error('No monorepo root found (no pnpm-workspace.yaml, turbo.json, or lerna.json)');
}
function readWorkspaceConfig(root) {
    const pnpmWorkspace = path.join(root, 'pnpm-workspace.yaml');
    if (fs.existsSync(pnpmWorkspace)) {
        const content = fs.readFileSync(pnpmWorkspace, 'utf-8');
        const match = content.match(/packages:\s*\n((?:\s+-\s+.+\n?)+)/);
        if (match) {
            return match[1].split('\n')
                .filter(l => l.trim().startsWith('-'))
                .map(l => l.replace(/.*-\s+['"]?/, '').replace(/['"]$/, '').trim())
                .filter(Boolean);
        }
    }
    return ['apps/*', 'packages/*', 'tools/*'];
}
function expandGlob(pattern, root) {
    const results = [];
    const basePattern = pattern.replace(/\*$/, '');
    if (pattern.includes('*')) {
        const parentDir = path.join(root, basePattern);
        if (fs.existsSync(parentDir)) {
            const entries = fs.readdirSync(parentDir, { withFileTypes: true });
            for (const entry of entries) {
                if (entry.isDirectory()) {
                    const pkgPath = path.join(parentDir, entry.name);
                    if (fs.existsSync(path.join(pkgPath, 'package.json'))) {
                        results.push(pkgPath);
                    }
                }
            }
        }
    }
    else {
        const pkgPath = path.join(root, pattern);
        if (fs.existsSync(path.join(pkgPath, 'package.json'))) {
            results.push(pkgPath);
        }
    }
    return results;
}
function getPackageInfo(pkgPath) {
    const pkgJsonPath = path.join(pkgPath, 'package.json');
    if (!fs.existsSync(pkgJsonPath))
        return null;
    const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
    const relativePath = pkgPath;
    let type = 'package';
    if (relativePath.includes('/apps/'))
        type = 'app';
    else if (relativePath.includes('/tools/'))
        type = 'tool';
    else if (relativePath.includes('/configs/') || relativePath.includes('/packages/eslint') || relativePath.includes('/packages/typescript') || relativePath.includes('/packages/tailwind'))
        type = 'config';
    return {
        name: pkg.name || path.basename(pkgPath),
        version: pkg.version || '0.0.0',
        path: pkgPath,
        type,
        dependencies: pkg.dependencies || {},
        devDependencies: pkg.devDependencies || {},
        scripts: pkg.scripts || {},
        exports: pkg.exports,
    };
}
function getWorkspaceInfo(root) {
    const rootPkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf-8'));
    const workspacePatterns = readWorkspaceConfig(root);
    const packages = [];
    for (const pattern of workspacePatterns) {
        const pkgPaths = expandGlob(pattern, root);
        for (const pkgPath of pkgPaths) {
            const info = getPackageInfo(pkgPath);
            if (info)
                packages.push(info);
        }
    }
    let turboVersion;
    const turboJson = path.join(root, 'turbo.json');
    if (fs.existsSync(turboJson)) {
        const turboPkg = path.join(root, 'node_modules/turbo/package.json');
        if (fs.existsSync(turboPkg)) {
            turboVersion = JSON.parse(fs.readFileSync(turboPkg, 'utf-8')).version;
        }
    }
    return {
        root,
        packageManager: rootPkg.packageManager || 'unknown',
        turboVersion,
        packages,
    };
}
function getDependencyGraph(packages) {
    const graph = new Map();
    const pkgNames = new Set(packages.map(p => p.name));
    for (const pkg of packages) {
        const deps = [];
        const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
        for (const dep of Object.keys(allDeps)) {
            if (pkgNames.has(dep)) {
                deps.push(dep);
            }
        }
        graph.set(pkg.name, deps);
    }
    return graph;
}
function findDependents(packages, targetPkg) {
    const dependents = [];
    for (const pkg of packages) {
        const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
        if (allDeps[targetPkg] && pkg.name !== targetPkg) {
            dependents.push(pkg.name);
        }
    }
    return dependents;
}
// ============================================================================
// MAIN SERVER
// ============================================================================
class MonorepoManagerServer extends McpServerBase {
    constructor() {
        super({ name: 'monorepo-manager', version: '2.0.0' });
    }
    registerTools() {
        this.addTool('list_packages', 'List all packages in the monorepo workspace with their metadata', {
            type: 'object',
            properties: {
                root: { type: 'string', description: 'Monorepo root path (auto-detected if omitted)' },
                filter: {
                    type: 'string',
                    enum: ['all', 'app', 'package', 'tool', 'config'],
                    description: 'Filter by package type (default: all)',
                },
            },
        }, async (args) => this.success(this.handleListPackages(args)));
        this.addTool('find_dependents', 'Find all packages that depend on a given package', {
            type: 'object',
            properties: {
                root: { type: 'string', description: 'Monorepo root path (auto-detected if omitted)' },
                package: { type: 'string', description: 'Package name to find dependents of' },
            },
            required: ['package'],
        }, async (args) => this.success(this.handleFindDependents(args)));
        this.addTool('dependency_graph', 'Build the full workspace dependency graph and detect circular dependencies', {
            type: 'object',
            properties: {
                root: { type: 'string', description: 'Monorepo root path (auto-detected if omitted)' },
            },
        }, async (args) => this.success(this.handleDependencyGraph(args)));
        this.addTool('check_health', 'Run a workspace health check: detect version mismatches, missing scripts, and orphaned packages', {
            type: 'object',
            properties: {
                root: { type: 'string', description: 'Monorepo root path (auto-detected if omitted)' },
            },
        }, async (args) => this.success(this.handleCheckHealth(args)));
    }
    handleListPackages(args) {
        const root = args?.root ? path.resolve(args.root) : findMonorepoRoot(process.cwd());
        const filter = args?.filter || 'all';
        const workspace = getWorkspaceInfo(root);
        let packages = workspace.packages;
        if (filter !== 'all') {
            packages = packages.filter(p => p.type === filter);
        }
        return {
            content: [{
                    type: 'text',
                    text: JSON.stringify({
                        root: workspace.root,
                        packageManager: workspace.packageManager,
                        turboVersion: workspace.turboVersion,
                        totalPackages: workspace.packages.length,
                        filteredCount: packages.length,
                        packages: packages.map(p => ({
                            name: p.name,
                            version: p.version,
                            type: p.type,
                            path: p.path,
                            internalDeps: Object.keys({ ...p.dependencies, ...p.devDependencies })
                                .filter(d => workspace.packages.some(wp => wp.name === d)),
                            scripts: Object.keys(p.scripts),
                        })),
                    }, null, 2),
                }],
        };
    }
    handleFindDependents(args) {
        const root = args?.root ? path.resolve(args.root) : findMonorepoRoot(process.cwd());
        const targetPkg = args.package;
        const workspace = getWorkspaceInfo(root);
        const dependents = findDependents(workspace.packages, targetPkg);
        return {
            content: [{
                    type: 'text',
                    text: JSON.stringify({
                        package: targetPkg,
                        found: workspace.packages.some(p => p.name === targetPkg),
                        dependents,
                        dependentCount: dependents.length,
                        impact: dependents.length === 0 ? 'low' : dependents.length <= 2 ? 'medium' : 'high',
                    }, null, 2),
                }],
        };
    }
    handleDependencyGraph(args) {
        const root = args?.root ? path.resolve(args.root) : findMonorepoRoot(process.cwd());
        const workspace = getWorkspaceInfo(root);
        const graph = getDependencyGraph(workspace.packages);
        const graphObj = {};
        for (const [pkg, deps] of graph) {
            if (deps.length > 0)
                graphObj[pkg] = deps;
        }
        // Find circular dependencies
        const circular = [];
        for (const [pkg, deps] of graph) {
            for (const dep of deps) {
                const depDeps = graph.get(dep) || [];
                if (depDeps.includes(pkg)) {
                    const pair = [pkg, dep].sort();
                    if (!circular.some(c => c[0] === pair[0] && c[1] === pair[1])) {
                        circular.push(pair);
                    }
                }
            }
        }
        return {
            content: [{
                    type: 'text',
                    text: JSON.stringify({
                        dependencies: graphObj,
                        circularDependencies: circular,
                        hasCircularDeps: circular.length > 0,
                        summary: {
                            totalPackages: workspace.packages.length,
                            packagesWithInternalDeps: Object.keys(graphObj).length,
                            circularCount: circular.length,
                        },
                    }, null, 2),
                }],
        };
    }
    handleCheckHealth(args) {
        const root = args?.root ? path.resolve(args.root) : findMonorepoRoot(process.cwd());
        const workspace = getWorkspaceInfo(root);
        const issues = [];
        // Check for version mismatches of shared dependencies
        const depVersions = new Map();
        for (const pkg of workspace.packages) {
            for (const [dep, version] of Object.entries({ ...pkg.dependencies, ...pkg.devDependencies })) {
                if (!depVersions.has(dep))
                    depVersions.set(dep, new Map());
                const versions = depVersions.get(dep);
                if (!versions.has(version))
                    versions.set(version, []);
                versions.get(version).push(pkg.name);
            }
        }
        for (const [dep, versions] of depVersions) {
            if (versions.size > 1) {
                issues.push({
                    type: 'version-mismatch',
                    severity: 'warning',
                    dependency: dep,
                    versions: Object.fromEntries(versions),
                    message: `${dep} has ${versions.size} different versions across workspace`,
                });
            }
        }
        // Check for packages without scripts
        for (const pkg of workspace.packages) {
            if (pkg.type === 'app' && !pkg.scripts.build) {
                issues.push({
                    type: 'missing-script',
                    severity: 'warning',
                    package: pkg.name,
                    script: 'build',
                    message: `App ${pkg.name} has no build script`,
                });
            }
            if (!pkg.scripts.lint && pkg.type !== 'config') {
                issues.push({
                    type: 'missing-script',
                    severity: 'info',
                    package: pkg.name,
                    script: 'lint',
                    message: `${pkg.name} has no lint script`,
                });
            }
        }
        // Check circular deps
        const graph = getDependencyGraph(workspace.packages);
        for (const [pkg, deps] of graph) {
            for (const dep of deps) {
                const depDeps = graph.get(dep) || [];
                if (depDeps.includes(pkg)) {
                    issues.push({
                        type: 'circular-dependency',
                        severity: 'error',
                        packages: [pkg, dep],
                        message: `Circular dependency: ${pkg} <-> ${dep}`,
                    });
                }
            }
        }
        const errors = issues.filter(i => i.severity === 'error').length;
        const warnings = issues.filter(i => i.severity === 'warning').length;
        return {
            content: [{
                    type: 'text',
                    text: JSON.stringify({
                        healthy: errors === 0,
                        summary: `${errors} errors, ${warnings} warnings, ${issues.length} total issues`,
                        issues,
                        stats: {
                            totalPackages: workspace.packages.length,
                            uniqueDependencies: depVersions.size,
                            versionMismatches: issues.filter(i => i.type === 'version-mismatch').length,
                            circularDependencies: issues.filter(i => i.type === 'circular-dependency').length,
                        },
                    }, null, 2),
                }],
        };
    }
    handleRunAcrossPackages(args) {
        const root = args?.root ? path.resolve(args.root) : findMonorepoRoot(process.cwd());
        const command = args.command;
        const filter = args?.filter || 'all';
        const workspace = getWorkspaceInfo(root);
        let packages = workspace.packages;
        if (filter !== 'all') {
            packages = packages.filter(p => p.type === filter);
        }
        const results = [];
        for (const pkg of packages) {
            const hasScript = pkg.scripts[command];
            if (!hasScript && !command.includes(' ')) {
                results.push({
                    package: pkg.name,
                    skipped: true,
                    reason: `No "${command}" script`,
                });
                continue;
            }
            const cmd = hasScript
                ? `cd ${pkg.path} && pnpm run ${command}`
                : `cd ${pkg.path} && ${command}`;
            try {
                const output = execSync(cmd, {
                    cwd: root,
                    encoding: 'utf-8',
                    timeout: 60000,
                    stdio: 'pipe',
                });
                results.push({ package: pkg.name, success: true, output: output.trim().slice(0, 500) });
            }
            catch (error) {
                results.push({
                    package: pkg.name,
                    success: false,
                    error: (error.stderr || error.message || '').trim().slice(0, 500),
                });
            }
        }
        const succeeded = results.filter((r) => r.success).length;
        const failed = results.filter((r) => !r.success && !r.skipped).length;
        const skipped = results.filter((r) => r.skipped).length;
        return {
            content: [{
                    type: 'text',
                    text: JSON.stringify({
                        command,
                        summary: `${succeeded} succeeded, ${failed} failed, ${skipped} skipped`,
                        results,
                    }, null, 2),
                }],
        };
    }
    handleFindSharedDeps(args) {
        const a = args;
        const root = a?.root ? path.resolve(a.root) : findMonorepoRoot(process.cwd());
        const minPackages = a?.minPackages || 2;
        const workspace = getWorkspaceInfo(root);
        const depUsage = new Map();
        const internalNames = new Set(workspace.packages.map(p => p.name));
        for (const pkg of workspace.packages) {
            for (const dep of Object.keys({ ...pkg.dependencies, ...pkg.devDependencies })) {
                if (internalNames.has(dep))
                    continue;
                if (!depUsage.has(dep))
                    depUsage.set(dep, new Set());
                depUsage.get(dep).add(pkg.name);
            }
        }
        const shared = {};
        for (const [dep, users] of depUsage) {
            if (users.size >= minPackages) {
                shared[dep] = { packages: [...users], count: users.size };
            }
        }
        const sorted = Object.entries(shared)
            .sort((a, b) => b[1].count - a[1].count);
        return {
            content: [{
                    type: 'text',
                    text: JSON.stringify({
                        minPackages,
                        sharedDepsCount: sorted.length,
                        sharedDeps: Object.fromEntries(sorted.slice(0, 30)),
                        extractionCandidates: sorted
                            .filter(([, v]) => v.count >= 3)
                            .map(([dep]) => dep),
                    }, null, 2),
                }],
        };
    }
    handleSyncConfig(args) {
        const a = args;
        const root = a?.root ? path.resolve(a.root) : findMonorepoRoot(process.cwd());
        const configFile = a.configFile;
        const workspace = getWorkspaceInfo(root);
        const configContents = new Map();
        for (const pkg of workspace.packages) {
            const configPath = path.join(pkg.path, configFile);
            if (fs.existsSync(configPath)) {
                const content = fs.readFileSync(configPath, 'utf-8').trim();
                if (!configContents.has(content))
                    configContents.set(content, []);
                configContents.get(content).push(pkg.name);
            }
        }
        const configs = [...configContents.entries()].map(([content, pkgs]) => ({
            hash: Buffer.from(content).toString('base64').slice(0, 12),
            packages: pkgs,
            contentPreview: content.slice(0, 200),
        }));
        const consistent = configs.length <= 1;
        return {
            content: [{
                    type: 'text',
                    text: JSON.stringify({
                        configFile,
                        consistent,
                        uniqueVariants: configs.length,
                        packagesWithConfig: configs.reduce((sum, c) => sum + c.packages.length, 0),
                        packagesWithoutConfig: workspace.packages.length - configs.reduce((sum, c) => sum + c.packages.length, 0),
                        variants: configs,
                        recommendation: consistent
                            ? 'All configs are consistent'
                            : `${configs.length} different variants found. Consider creating a shared config package.`,
                    }, null, 2),
                }],
        };
    }
}
// ============================================================================
// ENTRY POINT
// ============================================================================
new MonorepoManagerServer().run().catch(console.error);
//# sourceMappingURL=index.js.map