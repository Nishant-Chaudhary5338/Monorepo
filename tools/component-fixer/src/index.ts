#!/usr/bin/env node
import { McpServerBase } from '../../_shared/index.js';
import type { ToolResult } from '../../_shared/index.js';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ============================================================================
// PATHS (ES module compatible)
// ============================================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ============================================================================
// FIX FUNCTIONS
// ============================================================================

// HTML void elements that cannot have children
const VOID_ELEMENTS = [
  'input', 'img', 'br', 'hr', 'meta', 'link', 'area', 'base', 'col', 'embed',
  'source', 'track', 'wbr', 'param', 'keygen', 'menuitem'
];

// Components that render void elements
const VOID_COMPONENTS = ['input', 'img', 'separator', 'divider'] as const;

function isVoidElement(componentName: string): boolean {
  const lowerName = componentName.toLowerCase();
  return VOID_COMPONENTS.includes(lowerName);
}

function autoFixComponent(componentDir: string, componentName: string): { fixed: string[], remaining: string[] } {
  const fixed: string[] = [];
  const remaining: string[] = [];
  const mainFile = path.join(componentDir, `${componentName}.tsx`);
  const testFile = path.join(componentDir, `${componentName}.test.tsx`);
  const indexFile = path.join(componentDir, 'index.ts');

  if (!fs.existsSync(mainFile)) {
    remaining.push('Component file not found');
    return { fixed, remaining };
  }

  let content = fs.readFileSync(mainFile, 'utf-8');
  let modified = false;

  // Fix import paths
  if (content.includes('@/lib/utils')) {
    content = content.replace(
      /import\s+{?\s*cn\s*}?\s+from\s+["']@\/lib\/utils["']/g,
      'import { cn } from "../../lib/utils"'
    );
    fixed.push('Fixed @/lib/utils import path to relative path');
    modified = true;
  }

  // Add displayName if missing
  if (!content.includes('displayName')) {
    const exportMatch = content.match(/export\s*\{([^}]+)\}/);
    const componentNameFromExport = exportMatch ? exportMatch[1].split(',')[0].trim() : componentName;
    content = content.replace(
      /export\s*\{[^}]+\}/,
      `export { ${componentNameFromExport} }\n${componentNameFromExport}.displayName = "${componentNameFromExport}"`
    );
    fixed.push('Added displayName for better React DevTools debugging');
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(mainFile, content);
  }

  // Fix test file for void elements
  if (fs.existsSync(testFile) && isVoidElement(componentName)) {
    let testContent = fs.readFileSync(testFile, 'utf-8');
    let testModified = false;

    // Check if tests incorrectly use children
    if (testContent.includes(`>${componentName}</`) || testContent.includes('>Test Content</') || testContent.includes('>Test</')) {
      // Replace children-based tests with prop-based tests for void elements
      testContent = testContent.replace(
        /render\(<${componentName}>[^<]*<\/${componentName}>?\)/g,
        `render(<${componentName} placeholder="test" />)`
      );
      
      // Fix assertions that look for text content
      testContent = testContent.replace(
        /expect\(screen\.getByText\([^)]+\)\)\.toBeInTheDocument\(\)/g,
        `expect(screen.getByPlaceholderText('test')).toBeInTheDocument()`
      );
      
      fixed.push('Fixed void element tests - removed children, using props instead');
      testModified = true;
    }

    if (testModified) {
      fs.writeFileSync(testFile, testContent);
    }
  }

  // Fix index.ts to export types
  if (fs.existsSync(indexFile)) {
    let indexContent = fs.readFileSync(indexFile, 'utf-8');
    let indexModified = false;

    // Check if types are exported
    if (!indexContent.includes('export type') && !indexContent.includes(`${componentName}Props`)) {
      // Add type export
      indexContent = indexContent.replace(
        /export\s*\{[^}]+\}/,
        `export { ${componentName} } from './${componentName}'\nexport type { ${componentName}Props } from './${componentName}'`
      );
      fixed.push('Added type export to index.ts');
      indexModified = true;
    }

    if (indexModified) {
      fs.writeFileSync(indexFile, indexContent);
    }
  }

  return { fixed, remaining };
}

function runTypeScriptCheck(componentDir: string): { errors: string[], passed: boolean } {
  try {
    const tsconfigPath = findTsconfig(componentDir);
    if (!tsconfigPath) {
      return { errors: ['No tsconfig.json found'], passed: false };
    }

    execSync(`npx tsc --noEmit --project ${tsconfigPath}`, {
      cwd: componentDir,
      stdio: 'pipe',
      timeout: 30000,
    });
    return { errors: [], passed: true };
  } catch (error: unknown) {
    const output = error.stdout?.toString() || error.stderr?.toString() || error.message;
    const errors = output.split('\n').filter((line: string) => line.trim().length > 0);
    return { errors, passed: false };
  }
}

function findTsconfig(dir: string): string | null {
  let current = dir;
  while (current !== '/' && current !== '.') {
    const tsconfig = path.join(current, 'tsconfig.json');
    if (fs.existsSync(tsconfig)) return tsconfig;
    current = path.dirname(current);
  }
  return null;
}

// ============================================================================
// MAIN SERVER CLASS
// ============================================================================

class ComponentFixerServer extends McpServerBase {

  constructor() {
    super({ name: 'component-fixer', version: '2.0.0' });
  }

  protected registerTools(): void {
    

    
  }

  private async handleFix(args: unknown) {
    const { path: componentPath } = args;
    try {
      if (!fs.existsSync(componentPath)) {
        throw new Error(`Component path does not exist: ${componentPath}`);
      }

      const componentName = path.basename(componentPath);
      
      // Run auto-fix
      const fixResult = autoFixComponent(componentPath, componentName);
      
      // Run TypeScript check after fix
      const tsResult = runTypeScriptCheck(componentPath);

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            component: componentName,
            fixes: {
              applied: fixResult.fixed,
              remaining: fixResult.remaining,
            },
            typescriptCheck: {
              passed: tsResult.passed,
              errors: tsResult.errors,
            },
            message: fixResult.fixed.length > 0 
              ? `Applied ${fixResult.fixed.length} fix(es)` 
              : 'No fixes needed',
          }, null, 2),
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ success: false, error: {
          error: true,
          code: error instanceof Error ? error.constructor.name : 'UNKNOWN_ERROR',
          message: error instanceof Error ? error.message : String(error),
          suggestion: 'Check input parameters and ensure all required values are provided.',
          timestamp: new Date().toISOString(),
        } }, null, 2),
        }],
        isError: true,
      };
    }
  }
}

// ============================================================================
// ENTRY POINT
// ============================================================================

new ComponentFixerServer().run().catch(console.error);