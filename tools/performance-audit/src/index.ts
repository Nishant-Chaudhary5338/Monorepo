#!/usr/bin/env node
import { McpServerBase } from '../../_shared/index.js';
import type { ToolResult } from '../../_shared/index.js';
import * as fs from 'fs';
import * as path from 'path';

// ============================================================================
// TYPES
// ============================================================================

interface PerformanceIssue {
  type: 'heavy-import' | 'large-bundle' | 'unnecessary-rerender' | 'unoptimized-image' | 'sync-operation' | 'memory-leak' | 'deep-nesting';
  file: string;
  line: number;
  description: string;
  severity: 'high' | 'medium' | 'low';
  impact: string;
  fix: string;
}

// ============================================================================
// ANALYSIS
// ============================================================================

function scanDirectory(dir: string, exts: string[] = ['.ts', '.tsx', '.js', '.jsx']): string[] {
  const files: string[] = [];
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', 'build', 'dist', '.next', '.git'].includes(entry.name)) continue;
      files.push(...scanDirectory(fullPath, exts));
    } else if (exts.some(e => entry.name.endsWith(e))) {
      if (entry.name.includes('.test.') || entry.name.includes('.spec.') || entry.name.includes('.stories.')) continue;
      files.push(fullPath);
    }
  }
  return files;
}

const HEAVY_LIBRARIES = [
  'moment', 'lodash', 'rxjs', 'jquery', 'three', 'chart.js', 'd3',
  '@material-ui/icons', '@mui/icons-material', 'antd', 'bootstrap',
];

function analyzeFile(filePath: string): PerformanceIssue[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const issues: PerformanceIssue[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Heavy library imports
    for (const lib of HEAVY_LIBRARIES) {
      if (line.includes(`from '${lib}'`) || line.includes(`from "${lib}"`)) {
        issues.push({
          type: 'heavy-import',
          file: filePath,
          line: i + 1,
          description: `Heavy library '${lib}' imported. Consider lighter alternatives or tree-shaking.`,
          severity: 'high',
          impact: `Increases bundle size significantly. ${lib} may add 50KB-500KB to bundle.`,
          fix: lib === 'moment' ? "Replace with 'dayjs' or 'date-fns'" :
            lib === 'lodash' ? "Use 'lodash-es' or import specific functions: import debounce from 'lodash/debounce'" :
              `Consider lighter alternative for ${lib}`,
        });
      }
    }

    // Full lodash import
    if (line.match(/import\s+\*\s+as\s+lodash/i) || line.match(/import\s+_\s+from\s+['"]lodash['"]/)) {
      issues.push({
        type: 'heavy-import',
        file: filePath,
        line: i + 1,
        description: 'Full lodash import prevents tree-shaking.',
        severity: 'high',
        impact: 'Adds ~70KB to bundle. Only used functions should be imported.',
        fix: "Import specific functions: import debounce from 'lodash/debounce'",
      });
    }

    // Sync file operations in components
    if (line.match(/fs\.(readFileSync|writeFileSync|readdirSync|statSync)/) && content.includes('React')) {
      issues.push({
        type: 'sync-operation',
        file: filePath,
        line: i + 1,
        description: 'Synchronous file operation in React component blocks rendering.',
        severity: 'high',
        impact: 'Blocks main thread, causes UI freezing.',
        fix: 'Use async versions or move to useEffect/use server action.',
      });
    }

    // Unoptimized images
    if (line.match(/<img\s/) && !line.includes('loading=') && !line.includes('next/image')) {
      issues.push({
        type: 'unoptimized-image',
        file: filePath,
        line: i + 1,
        description: 'Image without lazy loading or optimization.',
        severity: 'medium',
        impact: 'Loads full-size image eagerly, increasing page load time.',
        fix: 'Add loading="lazy" and use optimized image formats (WebP/AVIF).',
      });
    }

    // Large inline SVGs
    if (line.match(/<svg[\s\S]{500,}/)) {
      issues.push({
        type: 'large-bundle',
        file: filePath,
        line: i + 1,
        description: 'Large inline SVG increases component size.',
        severity: 'low',
        impact: 'Increases JS bundle size.',
        fix: 'Extract SVG to separate file and import as component or use as src.',
      });
    }

    // useEffect without cleanup (potential memory leak)
    if (line.includes('useEffect(') || line.includes('useEffect (')) {
      const effectBlock = lines.slice(i, Math.min(i + 20, lines.length)).join('\n');
      if (effectBlock.includes('addEventListener') && !effectBlock.includes('removeEventListener')) {
        issues.push({
          type: 'memory-leak',
          file: filePath,
          line: i + 1,
          description: 'useEffect adds event listener without cleanup.',
          severity: 'high',
          impact: 'Memory leak: listener accumulates on each render.',
          fix: 'Return cleanup function: return () => element.removeEventListener(...)',
        });
      }
      if (effectBlock.includes('setInterval') && !effectBlock.includes('clearInterval')) {
        issues.push({
          type: 'memory-leak',
          file: filePath,
          line: i + 1,
          description: 'useEffect creates interval without cleanup.',
          severity: 'high',
          impact: 'Memory leak: interval continues after component unmount.',
          fix: 'Return cleanup: return () => clearInterval(id);',
        });
      }
      if (effectBlock.includes('setTimeout') && !effectBlock.includes('clearTimeout')) {
        issues.push({
          type: 'memory-leak',
          file: filePath,
          line: i + 1,
          description: 'useEffect creates timeout without cleanup.',
          severity: 'medium',
          impact: 'Potential memory leak if component unmounts before timeout fires.',
          fix: 'Return cleanup: return () => clearTimeout(id);',
        });
      }
    }

    // Deeply nested ternaries
    const ternaryCount = (line.match(/\?/g) || []).length;
    if (ternaryCount >= 3) {
      issues.push({
        type: 'deep-nesting',
        file: filePath,
        line: i + 1,
        description: `${ternaryCount} nested ternary operators reduce readability and may impact performance.`,
        severity: 'medium',
        impact: 'Hard to maintain, may cause unnecessary re-evaluations.',
        fix: 'Extract to named variables or use early returns.',
      });
    }

    // Console.log in production code
    if (line.match(/console\.(log|debug|info)\(/) && !filePath.includes('.test.') && !filePath.includes('dev')) {
      issues.push({
        type: 'large-bundle',
        file: filePath,
        line: i + 1,
        description: 'console.log statement in source code.',
        severity: 'low',
        impact: 'Adds unnecessary code to production bundle.',
        fix: 'Remove or replace with proper logging library that can be tree-shaken.',
      });
    }

    // Dynamic imports that could be static
    if (line.match(/import\(['"][^'"]+['"]\)/) && !line.includes('lazy') && !line.includes('Suspense')) {
      issues.push({
        type: 'large-bundle',
        file: filePath,
        line: i + 1,
        description: 'Dynamic import without lazy loading pattern.',
        severity: 'low',
        impact: 'May cause unnecessary network requests.',
        fix: 'Use React.lazy() with Suspense for code splitting.',
      });
    }
  }

  return issues;
}

// ============================================================================
// BUNDLE ANALYSIS
// ============================================================================

function analyzePackageJson(projectRoot: string): PerformanceIssue[] {
  const issues: PerformanceIssue[] = [];
  const pkgPath = path.join(projectRoot, 'package.json');
  if (!fs.existsSync(pkgPath)) return issues;

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

  for (const lib of HEAVY_LIBRARIES) {
    if (allDeps[lib]) {
      issues.push({
        type: 'heavy-import',
        file: pkgPath,
        line: 1,
        description: `Heavy dependency '${lib}' in package.json.`,
        severity: 'high',
        impact: `Increases install size and bundle. Consider lighter alternatives.`,
        fix: lib === 'moment' ? 'Replace with dayjs (2KB vs 70KB)' :
          lib === 'lodash' ? 'Replace with lodash-es for tree-shaking' :
            `Evaluate if ${lib} is necessary or has lighter alternative.`,
      });
    }
  }

  return issues;
}

// ============================================================================
// MAIN SERVER
// ============================================================================

class PerformanceAuditServer extends McpServerBase {

  constructor() {
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  protected registerTools(): void {
    

    
  }

  private async handleAuditBundle(args: unknown) {
    const { path: targetPath } = args;
    try {
      const isDir = fs.statSync(targetPath).isDirectory();
      const projectRoot = isDir ? targetPath : path.dirname(targetPath);
      const files = isDir ? scanDirectory(targetPath) : [targetPath];

      const allIssues: PerformanceIssue[] = analyzePackageJson(projectRoot);
      for (const file of files) {
        allIssues.push(...analyzeFile(file));
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            summary: {
              totalIssues: allIssues.length,
              high: allIssues.filter(i => i.severity === 'high').length,
              medium: allIssues.filter(i => i.severity === 'medium').length,
              low: allIssues.filter(i => i.severity === 'low').length,
            },
            issues: allIssues,
          }, null, 2),
        }],
      };
    } catch (error) {
      return this.error(error);
    }
  }

  private async handleDetectHeavy(args: unknown) {
    const { path: targetPath } = args;
    try {
      const isDir = fs.statSync(targetPath).isDirectory();
      const files = isDir ? scanDirectory(targetPath) : [targetPath];
      const issues: PerformanceIssue[] = [];

      for (const file of files) {
        issues.push(...analyzeFile(file).filter(i => i.type === 'heavy-import'));
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ success: true, heavyImports: issues.length, issues }, null, 2),
        }],
      };
    } catch (error) {
      return {
        content: [{ type: 'text', text: JSON.stringify({ success: false, error: {
          error: true,
          code: error instanceof Error ? error.constructor.name : 'UNKNOWN_ERROR',
          message: error instanceof Error ? error.message : String(error),
          suggestion: 'Check input parameters and ensure all required values are provided.',
          timestamp: new Date().toISOString(),
        } }, null, 2) }],
        isError: true,
      };
    }
  }

  private async handleRenderPerf(args: unknown) {
    const { path: targetPath } = args;
    try {
      const isDir = fs.statSync(targetPath).isDirectory();
      const files = isDir ? scanDirectory(targetPath) : [targetPath];
      const issues: PerformanceIssue[] = [];

      for (const file of files) {
        issues.push(...analyzeFile(file).filter(i => !['heavy-import'].includes(i.type)));
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            renderIssues: issues.length,
            byType: {
              memoryLeak: issues.filter(i => i.type === 'memory-leak').length,
              syncOperation: issues.filter(i => i.type === 'sync-operation').length,
              unoptimizedImage: issues.filter(i => i.type === 'unoptimized-image').length,
              deepNesting: issues.filter(i => i.type === 'deep-nesting').length,
            },
            issues,
          }, null, 2),
        }],
      };
    } catch (error) {
      return {
        content: [{ type: 'text', text: JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, null, 2) }],
        isError: true,
      };
    }
  }
}

// ============================================================================
// ENTRY POINT
// ============================================================================

new PerformanceAuditServer().run().catch(console.error);