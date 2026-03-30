#!/usr/bin/env node
/**
 * scan-all.ts — Parallel Review-Fix-ReReview Pipeline
 *
 * Usage:
 *   npx tsx scan-all.ts <path> [--concurrency=8]
 *   npx tsx scan-all.ts packages/ui/components
 *   npx tsx scan-all.ts packages/ui/components --concurrency=4
 *
 * What it does:
 *   1. Discovers all component directories under the given path
 *   2. Reviews ALL components in parallel
 *   3. Fixes ALL components in parallel (based on review results)
 *   4. Re-reviews ALL components in parallel (to verify fixes)
 *   5. Outputs consolidated report
 */

import { MCPClient } from './mcp-client.js';
import { fileURLToPath } from 'url';
import { dirname, join, resolve, basename } from 'path';
import { existsSync, readdirSync, statSync } from 'fs';
import * as os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ============================================================================
// TYPES
// ============================================================================

interface ReviewIssue {
  id: string;
  category: string;
  severity: 'error' | 'warning' | 'info';
  line?: number;
  message: string;
  suggestion: string;
  fixable: boolean;
  fixType?: string;
}

interface ReviewSummary {
  component: string;
  file: string;
  linesOfCode: number;
  overallScore: number;
  grade: string;
  totalIssues: number;
  criticalIssues: number;
  warningIssues: number;
  infoIssues: number;
  estimatedFixTime: string;
  categories: Record<string, number>;
}

interface ReviewResult {
  success: boolean;
  summary: ReviewSummary;
  issues: ReviewIssue[];
  typescriptErrors: string[];
  testResults: Record<string, unknown>;
}

interface FixResult {
  success: boolean;
  component: string;
  summary: {
    totalFixable: number;
    applied: number;
    skipped: number;
    failed: number;
    scoreBefore?: number;
    gradeBefore?: string;
  };
  fixes: Array<{ issueId: string; applied: boolean; detail: string }>;
  typescriptCheck: { passed: boolean; errors: string[] };
}

interface ComponentResult {
  name: string;
  path: string;
  initialReview?: ReviewResult;
  fixResult?: FixResult;
  finalReview?: ReviewResult;
  error?: string;
}

interface ScanReport {
  timestamp: string;
  totalComponents: number;
  componentsScanned: number;
  componentsWithErrors: number;
  totalIssuesFound: number;
  totalIssuesFixed: number;
  averageScoreBefore: number;
  averageScoreAfter: number;
  results: ComponentResult[];
}

// ============================================================================
// HELPERS
// ============================================================================

function findMonorepoRoot(startDir: string): string {
  let current = startDir;
  while (current !== '/' && current !== '.') {
    if (existsSync(join(current, 'pnpm-workspace.yaml'))) {
      return current;
    }
    current = dirname(current);
  }
  return resolve(startDir, '..', '..');
}

function getServerPath(serverName: string): string {
  return join(__dirname, '..', '..', serverName, 'build', `${serverName}`, 'src', 'index.js');
}

function discoverComponents(rootPath: string): string[] {
  const components: string[] = [];

  if (!existsSync(rootPath)) {
    console.error(`❌ Path does not exist: ${rootPath}`);
    process.exit(1);
  }

  const stat = statSync(rootPath);

  // If path points directly to a component directory (has .tsx file matching dir name)
  if (stat.isDirectory()) {
    const dirName = basename(rootPath);
    const componentFile = join(rootPath, `${dirName}.tsx`);
    if (existsSync(componentFile)) {
      return [rootPath];
    }

    // Otherwise, scan subdirectories for components
    const entries = readdirSync(rootPath);
    for (const entry of entries) {
      const entryPath = join(rootPath, entry);
      if (statSync(entryPath).isDirectory()) {
        const componentFile = join(entryPath, `${entry}.tsx`);
        if (existsSync(componentFile)) {
          components.push(entryPath);
        }
      }
    }
  }

  return components;
}

// ============================================================================
// PARALLEL EXECUTION ENGINE
// ============================================================================

async function runInParallel<T, R>(
  items: T[],
  fn: (item: T, index: number) => Promise<R>,
  concurrency: number
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex++;
      try {
        results[index] = await fn(items[index], index);
      } catch (error) {
        // Store error as result
        results[index] = { error: error instanceof Error ? error.message : String(error) } as unknown as R;
      }
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

// ============================================================================
// PHASE EXECUTORS
// ============================================================================

async function reviewComponent(componentPath: string): Promise<ReviewResult> {
  const reviewerPath = getServerPath('component-reviewer');
  const client = new MCPClient(reviewerPath);
  const result = await client.callTool('review', { path: componentPath });
  return result as unknown as ReviewResult;
}

async function fixComponent(componentPath: string, reviewJson: string): Promise<FixResult> {
  const fixerPath = getServerPath('component-fixer');
  const client = new MCPClient(fixerPath);
  const result = await client.callTool('fix_from_review', {
    path: componentPath,
    reviewJson,
  });
  return result as unknown as FixResult;
}

// ============================================================================
// DISPLAY HELPERS
// ============================================================================

function printHeader(title: string): void {
  console.log('');
  console.log('═'.repeat(60));
  console.log(`  ${title}`);
  console.log('═'.repeat(60));
  console.log('');
}

function getGradeEmoji(grade: string): string {
  switch (grade) {
    case 'A+': return '🏆';
    case 'A': return '✅';
    case 'B': return '👍';
    case 'C': return '⚠️';
    case 'D': return '🔶';
    case 'F': return '❌';
    default: return '📋';
  }
}

function printComponentResult(result: ComponentResult, index: number): void {
  const emoji = result.error ? '❌' : '✅';
  const name = result.name.padEnd(20);

  if (result.error) {
    console.log(`  ${index + 1}. ${emoji} ${name} — ERROR: ${result.error}`);
    return;
  }

  const initial = result.initialReview?.summary;
  const final = result.finalReview?.summary;
  const fix = result.fixResult?.summary;

  const scoreBefore = initial?.overallScore ?? '?';
  const scoreAfter = final?.overallScore ?? scoreBefore;
  const gradeBefore = initial?.grade ?? '?';
  const gradeAfter = final?.grade ?? gradeBefore;
  const fixed = fix?.applied ?? 0;
  const total = initial?.totalIssues ?? 0;

  const delta = typeof scoreAfter === 'number' && typeof scoreBefore === 'number'
    ? scoreAfter - scoreBefore
    : 0;
  const deltaStr = delta > 0 ? ` (+${delta})` : delta < 0 ? ` (${delta})` : '';

  console.log(
    `  ${index + 1}. ${emoji} ${name} ` +
    `${getGradeEmoji(gradeBefore as string)} ${gradeBefore} → ${getGradeEmoji(gradeAfter as string)} ${gradeAfter} ` +
    `| Score: ${scoreBefore} → ${scoreAfter}${deltaStr} ` +
    `| Fixed: ${fixed}/${total}`
  );
}

// ============================================================================
// MAIN PIPELINE
// ============================================================================

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  // Parse arguments
  let targetPath = '.';
  let concurrency = os.cpus().length;

  for (const arg of args) {
    if (arg.startsWith('--concurrency=')) {
      concurrency = parseInt(arg.split('=')[1]) || concurrency;
    } else if (!arg.startsWith('--')) {
      targetPath = arg;
    }
  }

  const monorepoRoot = findMonorepoRoot(process.cwd());
  const absolutePath = resolve(monorepoRoot, targetPath);

  printHeader(`COMPONENT SCAN PIPELINE`);
  console.log(`  📂 Path: ${targetPath}`);
  console.log(`  🖥️  Concurrency: ${concurrency} (CPU cores: ${os.cpus().length})`);
  console.log('');

  // Discover components
  const components = discoverComponents(absolutePath);
  if (components.length === 0) {
    console.log('  ⚠️  No components found at the specified path.');
    console.log('  Make sure the path contains directories with matching .tsx files.');
    process.exit(0);
  }

  console.log(`  🔍 Found ${components.length} component(s): ${components.map(c => basename(c)).join(', ')}`);
  console.log('');

  const startTime = Date.now();

  // ─── PHASE 1: PARALLEL REVIEW ─────────────────────────────
  printHeader(`PHASE 1: REVIEWING ${components.length} COMPONENTS`);
  console.log(`  ⏳ Reviewing all components in parallel (concurrency: ${concurrency})...`);
  console.log('');

  const reviewResults = await runInParallel(
    components,
    async (path, i) => {
      const name = basename(path);
      process.stderr.write(`  🔍 [${i + 1}/${components.length}] Reviewing ${name}...\n`);
      const result = await reviewComponent(path);
      return { name, path, result };
    },
    concurrency
  );

  const initialReviews: ComponentResult[] = reviewResults.map((r) => {
    if ('error' in r) {
      return { name: basename(r.path || ''), path: r.path || '', error: (r as { error: string }).error };
    }
    return {
      name: r.name,
      path: r.path,
      initialReview: r.result,
    };
  });

  // Count issues
  let totalIssues = 0;
  let totalFixable = 0;
  for (const r of initialReviews) {
    if (r.initialReview) {
      totalIssues += r.initialReview.summary.totalIssues;
      totalFixable += r.initialReview.issues.filter(i => i.fixable).length;
    }
  }

  console.log(`  📊 Total issues found: ${totalIssues} (${totalFixable} fixable)`);
  console.log('');

  // ─── PHASE 2: PARALLEL FIX ────────────────────────────────
  if (totalFixable > 0) {
    printHeader(`PHASE 2: FIXING ${totalFixable} ISSUES`);
    console.log(`  ⏳ Fixing all components in parallel (concurrency: ${concurrency})...`);
    console.log('');

    const fixResults = await runInParallel(
      initialReviews.filter(r => r.initialReview),
      async (comp, i) => {
        process.stderr.write(`  🔧 [${i + 1}/${initialReviews.length}] Fixing ${comp.name}...\n`);
        const reviewJson = JSON.stringify(comp.initialReview);
        const result = await fixComponent(comp.path, reviewJson);
        return { name: comp.name, path: comp.path, fixResult: result };
      },
      concurrency
    );

    // Merge fix results back
    for (const fr of fixResults) {
      if ('error' in fr) continue;
      const comp = initialReviews.find(r => r.name === fr.name);
      if (comp) {
        comp.fixResult = fr.fixResult;
      }
    }

    const totalFixed = fixResults.reduce((sum, r) => {
      if ('error' in r) return sum;
      return sum + (r.fixResult?.summary.applied ?? 0);
    }, 0);

    console.log(`  ✅ Total fixes applied: ${totalFixed}`);
    console.log('');
  }

  // ─── PHASE 3: PARALLEL RE-REVIEW ──────────────────────────
  const componentsWithFixes = initialReviews.filter(r => r.fixResult?.summary?.applied ?? 0 > 0);
  if (componentsWithFixes.length > 0) {
    printHeader(`PHASE 3: RE-REVIEWING ${componentsWithFixes.length} COMPONENTS`);
    console.log(`  ⏳ Re-reviewing fixed components in parallel...`);
    console.log('');

    const reReviewResults = await runInParallel(
      componentsWithFixes,
      async (comp, i) => {
        process.stderr.write(`  🔍 [${i + 1}/${componentsWithFixes.length}] Re-reviewing ${comp.name}...\n`);
        const result = await reviewComponent(comp.path);
        return { name: comp.name, result };
      },
      concurrency
    );

    for (const rr of reReviewResults) {
      if ('error' in rr) continue;
      const comp = initialReviews.find(r => r.name === rr.name);
      if (comp) {
        comp.finalReview = rr.result;
      }
    }
  } else {
    // No fixes applied — final review is same as initial
    for (const r of initialReviews) {
      r.finalReview = r.initialReview;
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  // ─── FINAL REPORT ─────────────────────────────────────────
  printHeader(`SCAN COMPLETE — ${elapsed}s`);

  console.log(`  #  Component            Grade                Score           Fixed`);
  console.log(`  ${'─'.repeat(56)}`);

  for (let i = 0; i < initialReviews.length; i++) {
    printComponentResult(initialReviews[i], i);
  }

  // Summary stats
  const avgScoreBefore = initialReviews.reduce((s, r) => s + (r.initialReview?.summary.overallScore ?? 0), 0) / initialReviews.length;
  const avgScoreAfter = initialReviews.reduce((s, r) => s + (r.finalReview?.summary.overallScore ?? r.initialReview?.summary.overallScore ?? 0), 0) / initialReviews.length;
  const totalFixed = initialReviews.reduce((s, r) => s + (r.fixResult?.summary.applied ?? 0), 0);
  const componentsWithErrors = initialReviews.filter(r => r.error).length;

  console.log('');
  console.log(`  📊 Summary:`);
  console.log(`     Components scanned: ${initialReviews.length}`);
  console.log(`     Components with errors: ${componentsWithErrors}`);
  console.log(`     Issues found: ${totalIssues}`);
  console.log(`     Issues fixed: ${totalFixed}`);
  console.log(`     Average score: ${avgScoreBefore.toFixed(0)} → ${avgScoreAfter.toFixed(0)}`);
  console.log(`     Elapsed: ${elapsed}s`);
  console.log('');

  // Write JSON report
  const report: ScanReport = {
    timestamp: new Date().toISOString(),
    totalComponents: initialReviews.length,
    componentsScanned: initialReviews.length - componentsWithErrors,
    componentsWithErrors,
    totalIssuesFound: totalIssues,
    totalIssuesFixed: totalFixed,
    averageScoreBefore: Math.round(avgScoreBefore),
    averageScoreAfter: Math.round(avgScoreAfter),
    results: initialReviews,
  };

  const reportPath = join(monorepoRoot, 'scan-report.json');
  const { writeFileSync } = await import('fs');
  writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`  📄 Report saved to: ${reportPath}`);
  console.log('');

  // Exit with error code if there are unresolved errors
  if (componentsWithErrors > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('❌ Fatal error:', error.message);
  process.exit(1);
});