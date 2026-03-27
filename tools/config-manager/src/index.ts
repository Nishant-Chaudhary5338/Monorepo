#!/usr/bin/env node
// ============================================================================
// CONFIG MANAGER MCP SERVER
// Manage and validate configurations across monorepo packages
// ============================================================================

import { McpServerBase } from '../../_shared/index.js';
import type { ToolResult } from '../../_shared/index.js';
import * as fs from 'fs';
import * as path from 'path';

// ============================================================================
// HELPERS
// ============================================================================

function findMonorepoRoot(startDir: string): string {
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

function getAllPackages(root: string): { name: string; path: string; pkg: unknown }[] {
  const dirs = ['apps', 'packages', 'tools'] as const;
  const packages: { name: string; path: string; pkg: unknown }[] = [];
  for (const dir of dirs) {
    const dirPath = path.join(root, dir);
    if (!fs.existsSync(dirPath)) continue;
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
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

// ============================================================================
// MAIN SERVER
// ============================================================================

class ConfigManagerServer extends McpServerBase {

  constructor() {
    super({ name: 'config-manager', version: '2.0.0' });
  }

  protected registerTools(): void {
    

    
  }

  private handleValidatePackageJson(args: unknown) {
    const root = args?.root ? path.resolve(args.root) : findMonorepoRoot(process.cwd());
    const targetPackage = args?.package;
    const packages = getAllPackages(root);
    const filtered = targetPackage
      ? packages.filter(p => p.name === targetPackage)
      : packages;

    const results: unknown[] = [];

    for (const pkg of filtered) {
      const issues: string[] = [];
      const p = pkg.pkg;

      // Library packages should have exports/main/module/types
      if (pkg.path.includes('/packages/') && !p.exports && !p.main && !p.module) {
        issues.push('Library package missing exports, main, or module field');
      }

      // Check exports field if present
      if (p.exports) {
        if (typeof p.exports === 'object' && !p.exports['.']) {
          issues.push('exports field missing root "." entry');
        }
      }

      // Apps should have build and dev scripts
      if (pkg.path.includes('/apps/')) {
        if (!p.scripts?.build) issues.push('App missing build script');
        if (!p.scripts?.dev) issues.push('App missing dev script');
      }

      // All packages should have name and version
      if (!p.name) issues.push('Missing name field');
      if (!p.version) issues.push('Missing version field');

      // Check type field
      if (!p.type) issues.push('Missing type field (consider "module")');

      // Check for lint script
      if (!p.scripts?.lint && !p.scripts?.['lint:fix']) {
        issues.push('Missing lint script');
      }

      results.push({
        package: pkg.name,
        path: pkg.path,
        healthy: issues.length === 0,
        issues,
        fields: {
          name: p.name,
          version: p.version,
          type: p.type,
          main: p.main || null,
          module: p.module || null,
          types: p.types || p.typings || null,
          exports: p.exports || null,
          scripts: Object.keys(p.scripts || {}),
        },
      });
    }

    const totalIssues = results.reduce((sum, r) => sum + r.issues.length, 0);

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          summary: `${totalIssues} issues found across ${filtered.length} packages`,
          packagesChecked: filtered.length,
          healthyPackages: results.filter(r => r.healthy).length,
          results,
        }, null, 2),
      }],
    };
  }

  private handleCheckTsconfigExtends(args: unknown) {
    const root = args?.root ? path.resolve(args.root) : findMonorepoRoot(process.cwd());
    const packages = getAllPackages(root);
    const results: unknown[] = [];

    for (const pkg of packages) {
      const tsconfigPath = path.join(pkg.path, 'tsconfig.json');
      if (!fs.existsSync(tsconfigPath)) continue;

      try {
        const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));
        const issues: string[] = [];

        if (tsconfig.extends) {
          const resolvedPath = path.resolve(pkg.path, tsconfig.extends);
          if (!fs.existsSync(resolvedPath)) {
            issues.push(`extends "${tsconfig.extends}" points to non-existent file`);
          }
        }

        // Check app-specific tsconfig files
        const appTsconfig = path.join(pkg.path, 'tsconfig.app.json');
        if (fs.existsSync(appTsconfig)) {
          const appConfig = JSON.parse(fs.readFileSync(appTsconfig, 'utf-8'));
          if (appConfig.extends) {
            const resolvedPath = path.resolve(pkg.path, appConfig.extends);
            if (!fs.existsSync(resolvedPath)) {
              issues.push(`tsconfig.app.json extends "${appConfig.extends}" points to non-existent file`);
            }
          }
        }

        results.push({
          package: pkg.name,
          hasTsconfig: true,
          extends: tsconfig.extends || null,
          healthy: issues.length === 0,
          issues,
        });
      } catch {
        results.push({
          package: pkg.name,
          hasTsconfig: true,
          healthy: false,
          issues: ['tsconfig.json is not valid JSON'],
        });
      }
    }

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          summary: `Checked ${results.length} packages with tsconfig.json`,
          healthyPackages: results.filter(r => r.healthy).length,
          results,
        }, null, 2),
      }],
    };
  }

  private handleCompareConfigs(args: unknown) {
    const root = args?.root ? path.resolve(args.root) : findMonorepoRoot(process.cwd());
    const configFile = args.configFile;
    const packages = getAllPackages(root);

    const configs = new Map<string, { content: string; packages: string[] }>();

    for (const pkg of packages) {
      const configPath = path.join(pkg.path, configFile);
      if (!fs.existsSync(configPath)) continue;

      const content = fs.readFileSync(configPath, 'utf-8').trim();
      if (!configs.has(content)) configs.set(content, { content, packages: [] });
      configs.get(content)!.packages.push(pkg.name);
    }

    const variants = [...configs.values()].map((c, i) => ({
      variant: i + 1,
      hash: Buffer.from(c.content).toString('base64').slice(0, 12),
      packages: c.packages,
      preview: c.content.slice(0, 300),
    }));

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          configFile,
          uniqueVariants: variants.length,
          consistent: variants.length <= 1,
          packagesWithConfig: variants.reduce((sum, v) => sum + v.packages.length, 0),
          packagesWithoutConfig: packages.length - variants.reduce((sum, v) => sum + v.packages.length, 0),
          variants,
          recommendation: variants.length <= 1
            ? 'All configs are consistent'
            : `${variants.length} different variants found. Consider normalizing to a single config.`,
        }, null, 2),
      }],
    };
  }

  private handleGenerateEnvExample(args: unknown) {
    const targetPath = path.resolve(args.path);
    const envFiles: string[] = [];

    if (fs.statSync(targetPath).isDirectory()) {
      const entries = fs.readdirSync(targetPath);
      for (const entry of entries) {
        if (entry.startsWith('.env')) {
          envFiles.push(path.join(targetPath, entry));
        }
      }
    } else if (fs.existsSync(targetPath)) {
      envFiles.push(targetPath);
    }

    const generated: string[] = [];

    for (const envFile of envFiles) {
      const content = fs.readFileSync(envFile, 'utf-8');
      const lines = content.split('\n');
      const exampleLines: string[] = [];

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) {
          exampleLines.push(line);
          continue;
        }

        const eqIndex = trimmed.indexOf('=');
        if (eqIndex > 0) {
          const key = trimmed.slice(0, eqIndex).trim();
          exampleLines.push(`${key}=`);
        } else {
          exampleLines.push(line);
        }
      }

      const examplePath = envFile + '.example';
      fs.writeFileSync(examplePath, exampleLines.join('\n'));
      generated.push(examplePath);
    }

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          success: true,
          envFilesFound: envFiles.length,
          generated,
          message: `Generated ${generated.length} .env.example files`,
        }, null, 2),
      }],
    };
  }

  private handleExtractEnvUsage(args: unknown) {
    const root = args?.root ? path.resolve(args.root) : findMonorepoRoot(process.cwd());
    const targetPackage = args?.package;
    const packages = getAllPackages(root);
    const filtered = targetPackage
      ? packages.filter(p => p.name === targetPackage)
      : packages;

    function scanFiles(dir: string): string[] {
      const files: string[] = [];
      if (!fs.existsSync(dir)) return files;
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          if (['node_modules', 'build', 'dist', '.next', '.git'].includes(entry.name)) continue;
          files.push(...scanFiles(fullPath));
        } else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) {
          files.push(fullPath);
        }
      }
      return files;
    }

    const results: unknown[] = [];

    for (const pkg of filtered) {
      const srcDir = path.join(pkg.path, 'src');
      const sourceFiles = scanFiles(srcDir);
      const envVars = new Map<string, { file: string; line: number }[]>();

      for (const file of sourceFiles) {
        const content = fs.readFileSync(file, 'utf-8');
        const lines = content.split('\n');
        for (const i = 0; i < lines.length; i++) {
          const matches = lines[i].matchAll(/process\.env\.(\w+)/g);
          for (const m of matches) {
            const varName = m[1];
            if (!envVars.has(varName)) envVars.set(varName, []);
            envVars.get(varName)!.push({
              file: path.relative(root, file),
              line: i + 1,
            });
          }
        }
      }

      if (envVars.size > 0) {
        results.push({
          package: pkg.name,
          totalEnvVars: envVars.size,
          envVars: Object.fromEntries(
            [...envVars.entries()].map(([k, v]) => [k, { references: v.length, locations: v.slice(0, 3) }])
          ),
        });
      }
    }

    const allVars = new Set<string>();
    for (const r of results) {
      for (const v of Object.keys(r.envVars)) allVars.add(v);
    }

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          summary: `Found ${allVars.size} unique env vars across ${results.length} packages`,
          packagesChecked: filtered.length,
          results,
        }, null, 2),
      }],
    };
  }

  private handleCheckConfigDrift(args: unknown) {
    const root = args?.root ? path.resolve(args.root) : findMonorepoRoot(process.cwd());
    const packages = getAllPackages(root);
    const configFiles = ['tsconfig.json', 'eslint.config.js', '.prettierrc', 'postcss.config.js', 'vitest.config.ts'] as const;
    const drift: unknown[] = [];

    for (const configFile of configFiles) {
      const configs = new Map<string, string[]>();
      for (const pkg of packages) {
        const configPath = path.join(pkg.path, configFile);
        if (!fs.existsSync(configPath)) continue;
        const content = fs.readFileSync(configPath, 'utf-8').trim();
        if (!configs.has(content)) configs.set(content, []);
        configs.get(content)!.push(pkg.name);
      }

      if (configs.size > 1) {
        drift.push({
          file: configFile,
          variants: configs.size,
          packages: Object.fromEntries(
            [...configs.entries()].map(([content, pkgs], i) => [`variant_${i + 1}`, { hash: Buffer.from(content).toString('base64').slice(0, 12), packages: pkgs }])
          ),
        });
      }
    }

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          summary: `Found ${drift.length} config files with drift`,
          configsChecked: configFiles.length,
          consistentConfigs: configFiles.length - drift.length,
          drift,
          recommendation: drift.length > 0
            ? 'Consider creating shared config packages to eliminate drift'
            : 'All checked configs are consistent',
        }, null, 2),
      }],
    };
  }

  private handleListConfigFiles(args: unknown) {
    const root = args?.root ? path.resolve(args.root) : findMonorepoRoot(process.cwd());
    const packages = getAllPackages(root);
    const knownConfigs = [
      'tsconfig.json', 'tsconfig.app.json', 'tsconfig.node.json',
      'eslint.config.js', '.eslintrc.js', '.eslintrc.json',
      '.prettierrc', '.prettierrc.js', '.prettierrc.json',
      'postcss.config.js', 'vitest.config.ts', 'vite.config.ts',
      'tailwind.config.js', 'tailwind.config.ts',
      '.env', '.env.local', '.env.development', '.env.production',
    ];

    const results: unknown[] = [];

    for (const pkg of packages) {
      const present: string[] = [];
      const missing: string[] = [];

      for (const config of knownConfigs) {
        if (fs.existsSync(path.join(pkg.path, config))) {
          present.push(config);
        }
      }

      // Check what's expected based on package type
      if (pkg.path.includes('/apps/')) {
        if (!present.includes('vite.config.ts')) missing.push('vite.config.ts (expected for Vite apps)');
        if (!present.includes('tsconfig.json')) missing.push('tsconfig.json');
      }
      if (pkg.path.includes('/packages/')) {
        if (!present.includes('tsconfig.json')) missing.push('tsconfig.json');
      }

      results.push({
        package: pkg.name,
        present,
        missing,
        configCount: present.length,
      });
    }

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({
          summary: `Listed config files for ${packages.length} packages`,
          results,
        }, null, 2),
      }],
    };
  }
}

// ============================================================================
// ENTRY POINT
// ============================================================================

new ConfigManagerServer().run().catch(console.error);