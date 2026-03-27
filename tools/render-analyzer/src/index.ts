#!/usr/bin/env node
import { McpServerBase } from '../../_shared/index.js';
import type { ToolResult } from '../../_shared/index.js';
import * as fs from 'fs';
import * as path from 'path';

// ============================================================================
// TYPES
// ============================================================================

interface RenderIssue {
  type: 'missing-memo' | 'missing-usememo' | 'missing-usecallback' | 'inline-object' | 'inline-array' | 'inline-function' | 'new-object-prop' | 'context-value';
  component: string;
  file: string;
  line: number;
  description: string;
  severity: 'high' | 'medium' | 'low';
  fix: string;
}

interface ComponentRenderProfile {
  name: string;
  file: string;
  hasMemo: boolean;
  hasUseMemo: boolean;
  hasUseCallback: boolean;
  propsCount: number;
  inlineObjects: number;
  inlineFunctions: number;
  issues: RenderIssue[];
}

// ============================================================================
// SOURCE ANALYSIS
// ============================================================================

function scanDirectory(dir: string): string[] {
  const files: string[] = [];
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', 'build', 'dist', '.next', '__tests__'].includes(entry.name)) continue;
      files.push(...scanDirectory(fullPath));
    } else if (entry.name.match(/\.(tsx|jsx)$/)) {
      if (entry.name.includes('.test.') || entry.name.includes('.spec.') || entry.name.includes('.stories.')) continue;
      files.push(fullPath);
    }
  }
  return files;
}

function extractComponents(content: string): string[] {
  const components: string[] = [];
  // function ComponentName
  const fnRegex = /(?:export\s+(?:default\s+)?)?(?:const|function)\s+([A-Z]\w+)/g;
  let match;
  while ((match = fnRegex.exec(content)) !== null) {
    if (!components.includes(match[1])) components.push(match[1]);
  }
  return components;
}

function analyzeComponent(content: string, componentName: string, filePath: string): ComponentRenderProfile {
  const lines = content.split('\n');
  const issues: RenderIssue[] = [];

  const hasMemo = content.includes(`memo(${componentName})`) || content.includes('React.memo');
  const hasUseMemo = content.includes('useMemo');
  const hasUseCallback = content.includes('useCallback');

  const inlineObjects = 0;
  const inlineFunctions = 0;
  let propsCount = 0;

  // Find component body
  const compStart = content.indexOf(componentName);
  if (compStart === -1) {
    return { name: componentName, file: filePath, hasMemo, hasUseMemo, hasUseCallback, propsCount, inlineObjects, inlineFunctions, issues };
  }

  // Extract component function body (rough)
  const returnIndex = content.indexOf('return', compStart);
  if (returnIndex === -1) {
    return { name: componentName, file: filePath, hasMemo, hasUseMemo, hasUseCallback, propsCount, inlineObjects, inlineFunctions, issues };
  }

  const componentBody = content.slice(compStart);
  const bodyLines = componentBody.split('\n');

  for (let i = 0; i < bodyLines.length; i++) {
    const line = bodyLines[i];
    const lineNum = content.slice(0, compStart).split('\n').length + i;

    // Inline object literals as props: style={{...}}
    const inlineObjMatches = line.match(/\{\{[^}]+\}\}/g);
    if (inlineObjMatches) {
      inlineObjects += inlineObjMatches.length;
      for (const _m of inlineObjMatches) {
        issues.push({
          type: 'inline-object',
          component: componentName,
          file: filePath,
          line: lineNum,
          description: `Inline object literal creates a new reference on every render, causing child re-renders.`,
          severity: 'medium',
          fix: `Extract to a const outside the component or wrap with useMemo:\nconst style = useMemo(() => ({ /* styles */ }), []);`,
        });
      }
    }

    // Inline array literals as props: items={[...]}
    const inlineArrMatches = line.match(/=\s*\[[^\]]*\]/g);
    if (inlineArrMatches && line.includes('<')) {
      inlineObjects += inlineArrMatches.length;
      for (const _m of inlineArrMatches) {
        issues.push({
          type: 'inline-array',
          component: componentName,
          file: filePath,
          line: lineNum,
          description: `Inline array literal creates a new reference on every render.`,
          severity: 'medium',
          fix: `Extract to useMemo:\nconst items = useMemo(() => [...], [deps]);`,
        });
      }
    }

    // Inline arrow functions as props: onClick={() => ...} onClick={e => ...}
    const inlineFnMatches = line.match(/on\w+=\{(?:\([^)]*\)\s*=>|[\w]+\s*=>)/g);
    if (inlineFnMatches) {
      inlineFunctions += inlineFnMatches.length;
      for (const _m of inlineFnMatches) {
        issues.push({
          type: 'inline-function',
          component: componentName,
          file: filePath,
          line: lineNum,
          description: `Inline function creates a new reference on every render. Use useCallback to memoize.`,
          severity: 'medium',
          fix: `const handler = useCallback((e) => { /* handler logic */ }, [deps]);`,
        });
      }
    }

    // Count props (rough: count { destructured } in component params)
    const propsMatch = line.match(/\(\s*\{\s*([^}]+)\s*\}/);
    if (propsMatch) {
      propsCount = propsMatch[1].split(',').length;
    }

    // Detect new Date(), new Object(), etc inside component
    if (line.match(/new\s+(Date|Object|Array|Map|Set|RegExp)\(/)) {
      issues.push({
        type: 'new-object-prop',
        component: componentName,
        file: filePath,
        line: lineNum,
        description: `Creating new object instance on every render. Move outside component or memoize.`,
        severity: 'low',
        fix: `const obj = useMemo(() => new Date(), []);`,
      });
    }

    // Detect context value without useMemo
    if (line.includes('value=') && line.includes('{') && !hasUseMemo) {
      issues.push({
        type: 'context-value',
        component: componentName,
        file: filePath,
        line: lineNum,
        description: `Context value object is recreated on every render. Wrap with useMemo.`,
        severity: 'high',
        fix: `const contextValue = useMemo(() => ({ prop1, prop2 }), [prop1, prop2]);`,
      });
    }
  }

  // Missing memo check
  if (!hasMemo && !content.includes('export default memo(')) {
    issues.push({
      type: 'missing-memo',
      component: componentName,
      file: filePath,
      line: 1,
      description: `Component is not wrapped with React.memo. It will re-render whenever parent re-renders, even if props haven't changed.`,
      severity: 'medium',
      fix: `export default memo(${componentName});`,
    });
  }

  return {
    name: componentName,
    file: filePath,
    hasMemo,
    hasUseMemo,
    hasUseCallback,
    propsCount,
    inlineObjects,
    inlineFunctions,
    issues,
  };
}

// ============================================================================
// MAIN SERVER
// ============================================================================

class RenderAnalyzerServer extends McpServerBase {

  constructor() {
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  protected registerTools(): void {
    

    
  }

  private async handleDetectRerenders(args: unknown) {
    const { path: targetPath, severity = 'all' } = args;
    try {
      const files = fs.statSync(targetPath).isDirectory()
        ? scanDirectory(targetPath)
        : [targetPath];

      const severityOrder = { high: 0, medium: 1, low: 2 } as const;
      const minSeverity = severityOrder[severity as keyof typeof severityOrder] ?? 2;

      const profiles: ComponentRenderProfile[] = [];
      const totalIssues = 0;

      for (const file of files) {
        const content = fs.readFileSync(file, 'utf-8');
        const components = extractComponents(content);
        for (const comp of components) {
          const profile = analyzeComponent(content, comp, file);
          const filteredIssues = profile.issues.filter(i => severityOrder[i.severity] <= minSeverity);
          profile.issues = filteredIssues;
          totalIssues += filteredIssues.length;
          profiles.push(profile);
        }
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            summary: {
              totalComponents: profiles.length,
              totalIssues,
              componentsWithIssues: profiles.filter(p => p.issues.length > 0).length,
            },
            profiles: profiles.filter(p => p.issues.length > 0),
          }, null, 2),
        }],
      };
    } catch (error) {
      return this.error(error);
    }
  }

  private async handleCheckMemo(args: unknown) {
    const { path: targetPath } = args;
    try {
      const files = fs.statSync(targetPath).isDirectory()
        ? scanDirectory(targetPath)
        : [targetPath];

      const results: unknown[] = [];
      const totalComponents = 0;
      const memoizedCount = 0;
      const useMemoCount = 0;
      const useCallbackCount = 0;

      for (const file of files) {
        const content = fs.readFileSync(file, 'utf-8');
        const components = extractComponents(content);
        for (const comp of components) {
          totalComponents++;
          const profile = analyzeComponent(content, comp, file);
          if (profile.hasMemo) memoizedCount++;
          if (profile.hasUseMemo) useMemoCount++;
          if (profile.hasUseCallback) useCallbackCount++;
          results.push({
            component: comp,
            file,
            hasMemo: profile.hasMemo,
            hasUseMemo: profile.hasUseMemo,
            hasUseCallback: profile.hasUseCallback,
            propsCount: profile.propsCount,
          });
        }
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            summary: {
              totalComponents,
              memoized: memoizedCount,
              notMemoized: totalComponents - memoizedCount,
              useMemoUsage: useMemoCount,
              useCallbackUsage: useCallbackCount,
            },
            components: results,
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

  private async handleAnalyzeProps(args: unknown) {
    const { path: targetPath } = args;
    try {
      const files = fs.statSync(targetPath).isDirectory()
        ? scanDirectory(targetPath)
        : [targetPath];

      const results: unknown[] = [];

      for (const file of files) {
        const content = fs.readFileSync(file, 'utf-8');
        const components = extractComponents(content);
        for (const comp of components) {
          const profile = analyzeComponent(content, comp, file);
          if (profile.inlineObjects > 0 || profile.inlineFunctions > 0) {
            results.push({
              component: comp,
              file,
              inlineObjects: profile.inlineObjects,
              inlineFunctions: profile.inlineFunctions,
              propsCount: profile.propsCount,
              issues: profile.issues.filter(i => ['inline-object', 'inline-array', 'inline-function'].includes(i.type)),
            });
          }
        }
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            componentsWithPropIssues: results.length,
            results,
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

new RenderAnalyzerServer().run().catch(console.error);