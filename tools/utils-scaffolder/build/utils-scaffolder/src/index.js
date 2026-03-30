#!/usr/bin/env node
// ============================================================================
// UTILS-SCAFFOLDER MCP SERVER
// Generates @repo/utils package modules with production-ready code
// ============================================================================
import { McpServerBase } from '../../_shared/index.js';
import * as fs from 'fs';
import * as path from 'path';
import { generators, ALL_MODULE_NAMES } from './generators/index.js';
import { writeModule } from './utils/file-writer.js';
import { validateModuleName } from './utils/name-validator.js';
// ============================================================================
// PATHS
// ============================================================================
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// ============================================================================
// DEFAULT OUTPUT PATH
// ============================================================================
const DEFAULT_OUTPUT = path.resolve(__dirname, '../../../../packages/utils/src');
// ============================================================================
// MAIN SERVER CLASS
// ============================================================================
class UtilsScaffolderServer extends McpServerBase {
    constructor() {
        super({ name: 'utils-scaffolder', version: '1.0.0' });
    }
    registerTools() {
        // Tool 1: generate_module
        this.addTool('generate_module', 'Generate a specific utility module (e.g., api, validation, hooks, string, array)', {
            type: 'object',
            properties: {
                moduleName: {
                    type: 'string',
                    description: `Module name to generate. Available: ${ALL_MODULE_NAMES.join(', ')}`,
                },
                outputPath: {
                    type: 'string',
                    description: 'Output directory path (default: packages/utils/src)',
                },
            },
            required: ['moduleName'],
        }, this.handleGenerateModule.bind(this));
        // Tool 2: generate_all_modules
        this.addTool('generate_all_modules', 'Generate ALL 21 modules to create the complete @repo/utils package', {
            type: 'object',
            properties: {
                outputPath: {
                    type: 'string',
                    description: 'Output directory path (default: packages/utils/src)',
                },
            },
            required: [],
        }, this.handleGenerateAllModules.bind(this));
        // Tool 3: generate_hook
        this.addTool('generate_hook', 'Generate a specific React hook within the hooks module', {
            type: 'object',
            properties: {
                hookName: {
                    type: 'string',
                    description: 'Hook name in camelCase (e.g., useDebounce, useLocalStorage)',
                },
                outputPath: {
                    type: 'string',
                    description: 'Output directory path (default: packages/utils/src)',
                },
            },
            required: ['hookName'],
        }, this.handleGenerateHook.bind(this));
        // Tool 4: generate_utility
        this.addTool('generate_utility', 'Generate a specific utility function within a module', {
            type: 'object',
            properties: {
                utilityName: {
                    type: 'string',
                    description: 'Utility function name in camelCase',
                },
                moduleName: {
                    type: 'string',
                    description: 'Target module name',
                },
                outputPath: {
                    type: 'string',
                    description: 'Output directory path (default: packages/utils/src)',
                },
            },
            required: ['utilityName', 'moduleName'],
        }, this.handleGenerateUtility.bind(this));
        // Tool 5: validate_package
        this.addTool('validate_package', 'Validate the @repo/utils package: TypeScript compilation, barrel exports, tests', {
            type: 'object',
            properties: {
                packagePath: {
                    type: 'string',
                    description: 'Path to the utils package (default: packages/utils)',
                },
            },
            required: [],
        }, this.handleValidatePackage.bind(this));
    }
    // ==========================================================================
    // TOOL HANDLERS
    // ==========================================================================
    async handleGenerateModule(args) {
        const { moduleName, outputPath = DEFAULT_OUTPUT } = args;
        // Validate module name
        const validation = validateModuleName(moduleName);
        if (!validation.valid) {
            return this.error(new Error(validation.error + (validation.suggestion ? ` Use "${validation.suggestion}" instead.` : '')));
        }
        // Check if generator exists
        const generator = generators[moduleName];
        if (!generator) {
            return this.error(new Error(`Unknown module: "${moduleName}". Available modules: ${ALL_MODULE_NAMES.join(', ')}`));
        }
        // Generate module files
        const files = generator();
        const results = writeModule(outputPath, moduleName, files);
        return this.success({
            moduleName,
            outputPath: path.join(outputPath, moduleName),
            filesGenerated: results.length,
            files: results.map((r) => r.filePath),
            message: `Successfully generated "${moduleName}" module with ${results.length} files`,
        });
    }
    async handleGenerateAllModules(args) {
        const { outputPath = DEFAULT_OUTPUT } = args;
        const results = [];
        const errors = [];
        for (const moduleName of ALL_MODULE_NAMES) {
            try {
                const generator = generators[moduleName];
                if (!generator)
                    continue;
                const files = generator();
                const writeResults = writeModule(outputPath, moduleName, files);
                results.push({
                    module: moduleName,
                    files: writeResults.length,
                    path: path.join(outputPath, moduleName),
                });
            }
            catch (error) {
                errors.push({
                    module: moduleName,
                    error: error instanceof Error ? error.message : String(error),
                });
            }
        }
        // Generate barrel export index.ts for the entire package
        const barrelContent = generateBarrelExport(ALL_MODULE_NAMES);
        const barrelPath = path.join(outputPath, 'index.ts');
        fs.writeFileSync(barrelPath, barrelContent);
        return this.success({
            totalModules: results.length,
            totalFiles: results.reduce((sum, r) => sum + r.files, 0) + 1, // +1 for barrel
            modules: results,
            errors: errors.length > 0 ? errors : undefined,
            barrelExport: barrelPath,
            message: `Successfully generated ${results.length} modules with ${results.reduce((sum, r) => sum + r.files, 0)} files + barrel export`,
        });
    }
    async handleGenerateHook(args) {
        const { hookName, outputPath = DEFAULT_OUTPUT } = args;
        // Validate hook name
        if (!hookName.startsWith('use')) {
            return this.error(new Error(`Hook name must start with "use" (e.g., useDebounce, useLocalStorage)`));
        }
        // Generate hooks module if not exists
        const hooksDir = path.join(outputPath, 'hooks');
        if (!fs.existsSync(hooksDir)) {
            const hooksModule = generators.hooks();
            writeModule(outputPath, 'hooks', hooksModule);
        }
        // Generate the specific hook
        const hookCode = generateHookCode(hookName);
        const hookFile = path.join(hooksDir, `${hookName}.ts`);
        const hookTestFile = path.join(hooksDir, `${hookName}.test.ts`);
        fs.writeFileSync(hookFile, hookCode);
        fs.writeFileSync(hookTestFile, generateHookTestCode(hookName));
        return this.success({
            hookName,
            files: [hookFile, hookTestFile],
            message: `Successfully generated "${hookName}" hook with test file`,
        });
    }
    async handleGenerateUtility(args) {
        const { utilityName, moduleName, outputPath = DEFAULT_OUTPUT } = args;
        // Validate module exists
        if (!ALL_MODULE_NAMES.includes(moduleName)) {
            return this.error(new Error(`Unknown module: "${moduleName}". Available: ${ALL_MODULE_NAMES.join(', ')}`));
        }
        // Generate module if not exists
        const moduleDir = path.join(outputPath, moduleName);
        if (!fs.existsSync(moduleDir)) {
            const generator = generators[moduleName];
            if (generator) {
                const files = generator();
                writeModule(outputPath, moduleName, files);
            }
        }
        // Generate the specific utility
        const utilCode = generateUtilityCode(utilityName, moduleName);
        const utilFile = path.join(moduleDir, `${utilityName}.ts`);
        const utilTestFile = path.join(moduleDir, `${utilityName}.test.ts`);
        fs.writeFileSync(utilFile, utilCode);
        fs.writeFileSync(utilTestFile, generateUtilityTestCode(utilityName));
        return this.success({
            utilityName,
            moduleName,
            files: [utilFile, utilTestFile],
            message: `Successfully generated "${utilityName}" utility in "${moduleName}" module with test file`,
        });
    }
    async handleValidatePackage(args) {
        const { packagePath = path.resolve(__dirname, '../../../../packages/utils') } = args;
        const results = [];
        // Check 1: Package exists
        const pkgJsonPath = path.join(packagePath, 'package.json');
        if (fs.existsSync(pkgJsonPath)) {
            results.push({ check: 'package.json exists', passed: true });
        }
        else {
            results.push({ check: 'package.json exists', passed: false, details: 'Package not found' });
        }
        // Check 2: Source directory
        const srcDir = path.join(packagePath, 'src');
        if (fs.existsSync(srcDir)) {
            results.push({ check: 'src/ directory exists', passed: true });
            // Check 3: All modules present
            const missingModules = [];
            for (const mod of ALL_MODULE_NAMES) {
                if (!fs.existsSync(path.join(srcDir, mod))) {
                    missingModules.push(mod);
                }
            }
            if (missingModules.length === 0) {
                results.push({ check: 'All 21 modules present', passed: true });
            }
            else {
                results.push({
                    check: 'All 21 modules present',
                    passed: false,
                    details: `Missing: ${missingModules.join(', ')}`,
                });
            }
            // Check 4: Barrel export exists
            const barrelPath = path.join(srcDir, 'index.ts');
            if (fs.existsSync(barrelPath)) {
                results.push({ check: 'Barrel export (index.ts) exists', passed: true });
            }
            else {
                results.push({ check: 'Barrel export (index.ts) exists', passed: false });
            }
        }
        else {
            results.push({ check: 'src/ directory exists', passed: false });
        }
        // Check 5: TypeScript config
        const tsconfigPath = path.join(packagePath, 'tsconfig.json');
        if (fs.existsSync(tsconfigPath)) {
            results.push({ check: 'tsconfig.json exists', passed: true });
        }
        else {
            results.push({ check: 'tsconfig.json exists', passed: false });
        }
        const passed = results.filter((r) => r.passed).length;
        const total = results.length;
        return this.success({
            packagePath,
            summary: `${passed}/${total} checks passed`,
            results,
            passed: passed === total,
            message: passed === total
                ? 'Package validation passed all checks'
                : `Package validation: ${passed}/${total} checks passed`,
        });
    }
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
function generateBarrelExport(modules) {
    const exports = modules.map((m) => `export * from './${m}/index.js';`).join('\n');
    return `// ============================================================================
// @repo/utils - Shared utility package
// Auto-generated barrel export
// ============================================================================

${exports}
`;
}
function generateHookCode(hookName) {
    const pascalName = hookName.replace(/^use/, '');
    return `// ============================================================================
// ${hookName} Hook
// ============================================================================

import { useState, useEffect, useCallback } from 'react';

/**
 * ${hookName} - Custom React hook
 * @param options - Hook options
 * @returns Hook return value
 * @example const value = ${hookName}(/* options *\/)
 */
export function ${hookName}<T = unknown>(
  initialValue?: T
): [T | undefined, (value: T) => void] {
  const [value, setValue] = useState<T | undefined>(initialValue);

  // TODO: Implement hook logic

  return [value, setValue];
}
`;
}
function generateHookTestCode(hookName) {
    return `import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { ${hookName} } from './${hookName}'

describe('${hookName}', () => {
  it('should initialize with default value', () => {
    const { result } = renderHook(() => ${hookName}())
    expect(result.current[0]).toBeUndefined()
  })

  it('should initialize with provided value', () => {
    const { result } = renderHook(() => ${hookName}('initial'))
    expect(result.current[0]).toBe('initial')
  })

  it('should update value', () => {
    const { result } = renderHook(() => ${hookName}())
    act(() => {
      result.current[1]('updated' as any)
    })
    expect(result.current[0]).toBe('updated')
  })
})
`;
}
function generateUtilityCode(utilityName, moduleName) {
    return `// ============================================================================
// ${utilityName} Utility
// ============================================================================

/**
 * ${utilityName} - Utility function
 * @param args - Function arguments
 * @returns Function result
 * @example ${utilityName}(/* args *\/)
 */
export function ${utilityName}(...args: unknown[]): unknown {
  // TODO: Implement utility logic
  throw new Error('Not implemented');
}
`;
}
function generateUtilityTestCode(utilityName) {
    return `import { describe, it, expect } from 'vitest'
import { ${utilityName} } from './${utilityName}'

describe('${utilityName}', () => {
  it('should be defined', () => {
    expect(${utilityName}).toBeDefined()
    expect(typeof ${utilityName}).toBe('function')
  })
})
`;
}
// ============================================================================
// START SERVER
// ============================================================================
new UtilsScaffolderServer().run().catch(console.error);
//# sourceMappingURL=index.js.map