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
// REVIEW FUNCTIONS
// ============================================================================

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

function runTests(componentDir: string): { passed: number, failed: number, errors: string[] } {
  try {
    const testFile = fs.readdirSync(componentDir).find(f => f.endsWith('.test.tsx') || f.endsWith('.test.ts'));
    if (!testFile) {
      return { passed: 0, failed: 0, errors: ['No test file found'] };
    }

    const testFilePath = path.join(componentDir, testFile);
    const output = execSync(`npx vitest run ${testFilePath} --reporter=json 2>&1`, {
      cwd: path.join(componentDir, '..', '..'),
      stdio: 'pipe',
      timeout: 60000,
    }).toString();

    try {
      const result = JSON.parse(output);
      const testResult = result.testResults?.[0];
      return {
        passed: testResult?.numPassedTests || result.numPassedTests || 0,
        failed: testResult?.numFailedTests || result.numFailedTests || 0,
        errors: testResult?.message ? [testResult.message] : [],
      };
    } catch (parseError) {
      // If JSON parsing fails, check if tests actually passed
      if (output.includes('Tests') && output.includes('passed')) {
        return { passed: 1, failed: 0, errors: [] };
      }
      return { passed: 0, failed: 0, errors: ['Failed to parse test output'] };
    }
  } catch (error: unknown) {
    const output = error.stdout?.toString() || error.stderr?.toString() || error.message;
    // Check if it's actually a test failure vs execution error
    if (output.includes('FAIL') || output.includes('failed')) {
      return { passed: 0, failed: 1, errors: [output.substring(0, 500)] };
    }
    return { passed: 0, failed: 0, errors: [output.substring(0, 500)] };
  }
}

// Check for void element issues in test files
function checkVoidElementIssues(componentDir: string, componentName: string): string[] {
  const issues: string[] = [];
  const testFile = path.join(componentDir, `${componentName}.test.tsx`);
  
  if (!fs.existsSync(testFile)) {
    return issues;
  }

  const testContent = fs.readFileSync(testFile, 'utf-8');
  const voidComponents = ['input', 'img', 'separator', 'divider'] as const;
  const isVoid = voidComponents.includes(componentName.toLowerCase());

  if (isVoid) {
    // Check for children usage in void element tests
    if (testContent.includes(`>${componentName}</`) || 
        testContent.includes('>Test Content</') ||
        testContent.includes('>Test</') ||
        testContent.includes('>Click me</')) {
      issues.push(`Void element '${componentName}' should not have children in tests - use props like placeholder, value instead`);
    }
  }

  return issues;
}

function checkAccessibility(componentDir: string, componentName: string): string[] {
  const issues: string[] = [];
  const mainFile = path.join(componentDir, `${componentName}.tsx`);

  if (!fs.existsSync(mainFile)) {
    issues.push('Component file not found');
    return issues;
  }

  const content = fs.readFileSync(mainFile, 'utf-8');

  // Check for proper semantic HTML
  if (content.includes('<div') && componentName.toLowerCase() === 'button') {
    issues.push('Button component should use <button> element, not <div>');
  }

  // Check for aria attributes
  if (!content.includes('aria-') && !content.includes('role=')) {
    issues.push('Consider adding ARIA attributes for accessibility');
  }

  // Check for focus styles
  if (!content.includes('focus-visible')) {
    issues.push('Consider adding focus-visible styles for keyboard navigation');
  }

  // Check for displayName
  if (!content.includes('displayName')) {
    issues.push('Consider adding displayName for better React DevTools debugging');
  }

  return issues;
}

function calculateQualityScore(
  typescriptPassed: boolean,
  testResults: { passed: number, failed: number },
  a11yIssues: string[]
): number {
  const score = 100;

  if (!typescriptPassed) score -= 30;
  if (testResults.failed > 0) score -= 25;
  score -= Math.min(a11yIssues.length * 5, 20);

  return Math.max(0, score);
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

class ComponentReviewerServer extends McpServerBase {

  constructor() {
    super({ name: 'component-reviewer', version: '2.0.0' });
  }

  protected registerTools(): void {
    

    
  }

  private async handleReview(args: unknown) {
    const { path: componentPath } = args;
    try {
      const resolvedPath = path.resolve(componentPath);
      if (!fs.existsSync(resolvedPath)) {
        throw new Error(`Component path does not exist: ${componentPath}`);
      }

      const componentName = path.basename(componentPath);
      
      // Run TypeScript check
      const tsResult = runTypeScriptCheck(componentPath);
      
      // Run tests
      const testResults = runTests(componentPath);
      
      // Check accessibility
      const a11yIssues = checkAccessibility(componentPath, componentName);
      
      // Calculate quality score
      const qualityScore = calculateQualityScore(tsResult.passed, testResults, a11yIssues);

      const suggestions: string[] = [];
      if (!tsResult.passed) suggestions.push('Fix TypeScript compilation errors');
      if (testResults.failed > 0) suggestions.push('Fix failing tests');
      if (a11yIssues.length > 0) suggestions.push('Address accessibility issues');
      if (qualityScore < 80) suggestions.push('Consider refactoring for better code quality');

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            component: componentName,
            typescriptErrors: tsResult.errors,
            testResults: {
              passed: testResults.passed,
              failed: testResults.failed,
              errors: testResults.errors,
            },
            accessibilityIssues: a11yIssues,
            codeQualityScore: qualityScore,
            suggestions,
            summary: qualityScore >= 80 ? 'Good quality' : qualityScore >= 60 ? 'Needs improvement' : 'Poor quality - requires significant changes',
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

new ComponentReviewerServer().run().catch(console.error);