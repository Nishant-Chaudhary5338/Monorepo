#!/usr/bin/env node
import { MCPClient } from './mcp-client.js';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import { existsSync, readFileSync } from 'fs';

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
  metrics: Record<string, unknown>;
  patterns: Record<string, unknown>;
  quickFixes: Array<Record<string, unknown>>;
  typescriptErrors: string[];
  testResults: Record<string, unknown>;
}

interface FixResult {
  issueId: string;
  category: string;
  line?: number;
  message: string;
  applied: boolean;
  detail: string;
}

interface FixOutput {
  success: boolean;
  component: string;
  file: string;
  summary: {
    totalFixable: number;
    applied: number;
    skipped: number;
    failed: number;
    scoreBefore?: number;
    gradeBefore?: string;
  };
  fixes: FixResult[];
  remainingIssues: ReviewIssue[];
  typescriptCheck: {
    passed: boolean;
    errors: string[];
  };
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

async function readStdin(): Promise<string> {
  return new Promise((resolve) => {
    let data = '';
    if (process.stdin.isTTY) {
      resolve('');
      return;
    }
    process.stdin.setEncoding('utf-8');
    process.stdin.on('data', (chunk) => {
      data += chunk;
    });
    process.stdin.on('end', () => {
      resolve(data);
    });
    setTimeout(() => {
      if (!data) resolve('');
    }, 500);
  });
}

function getServerPath(serverName: string): string {
  return join(__dirname, '..', '..', serverName, 'build', `${serverName}`, 'src', 'index.js');
}

// ============================================================================
// DISPLAY HELPERS
// ============================================================================

function printHeader(title: string): void {
  console.log('');
  console.log('═'.repeat(55));
  console.log(`  ${title}`);
  console.log('═'.repeat(55));
  console.log('');
}

function printDivider(): void {
  console.log('─'.repeat(55));
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

function getSeverityIcon(severity: string): string {
  switch (severity) {
    case 'error': return '❌';
    case 'warning': return '⚠️';
    case 'info': return 'ℹ️';
    default: return '•';
  }
}

function printReviewSummary(label: string, summary: ReviewSummary): void {
  const emoji = getGradeEmoji(summary.grade);
  console.log(`📋 ${label}`);
  console.log(`   Score: ${summary.overallScore}/100 (Grade: ${emoji} ${summary.grade})`);
  console.log(`   Issues: ${summary.criticalIssues} errors, ${summary.warningIssues} warnings, ${summary.infoIssues} info`);
  console.log(`   Est. fix time: ${summary.estimatedFixTime}`);
  console.log('');
}

function printCategoryBreakdown(categories: Record<string, number>): void {
  const active = Object.entries(categories).filter(([_, count]) => count > 0);
  if (active.length === 0) return;
  
  console.log('   Category breakdown:');
  for (const [category, count] of active) {
    const bar = '█'.repeat(Math.min(count, 20));
    console.log(`     ${category.padEnd(18)} ${bar} ${count}`);
  }
  console.log('');
}

function printFixResult(fix: FixResult): void {
  const icon = fix.applied ? '✅' : '⏭️';
  const location = fix.line ? `L${fix.line}` : '';
  console.log(`   ${icon} [${fix.category}] ${location ? `@${location} ` : ''}${fix.detail}`);
}

function printScoreDelta(before?: number, after?: number): void {
  if (before !== undefined && after !== undefined) {
    const delta = after - before;
    if (delta > 0) {
      console.log(`   📈 +${delta} score improvement`);
    } else if (delta < 0) {
      console.log(`   📉 ${delta} score change`);
    } else {
      console.log(`   ➡️  Score unchanged`);
    }
  }
}

// ============================================================================
// MAIN PIPELINE
// ============================================================================

async function runPipeline(componentPath: string): Promise<void> {
  const monorepoRoot = findMonorepoRoot(process.cwd());
  const absolutePath = resolve(monorepoRoot, componentPath);
  
  if (!existsSync(absolutePath)) {
    console.error(`❌ Component path does not exist: ${absolutePath}`);
    process.exit(1);
  }

  const componentName = componentPath.split('/').pop() || 'Component';
  
  // Get server paths
  const reviewerServerPath = getServerPath('component-reviewer');
  const fixerServerPath = getServerPath('component-fixer');

  printHeader(`COMPONENT FIX PIPELINE: ${componentName}`);

  // ─── PASS 1: REVIEW ─────────────────────────────────────────
  console.log('🔍 Running initial review...');
  console.log('');

  const reviewerClient = new MCPClient(reviewerServerPath);
  let reviewResult: ReviewResult;
  
  try {
    const rawResult = await reviewerClient.callTool('review', { path: absolutePath });
    reviewResult = rawResult as unknown as ReviewResult;
  } catch (error) {
    console.error('❌ Review failed:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }

  if (!reviewResult.success) {
    console.error('❌ Review returned failure');
    process.exit(1);
  }

  // Display initial review
  printReviewSummary('INITIAL REVIEW', reviewResult.summary);
  printCategoryBreakdown(reviewResult.summary.categories);

  // Count fixable issues
  const fixableIssues = reviewResult.issues.filter(i => i.fixable);
  const nonFixableIssues = reviewResult.issues.filter(i => !i.fixable);

  if (fixableIssues.length === 0) {
    console.log('✨ No fixable issues found! Component is clean.');
    if (nonFixableIssues.length > 0) {
      console.log('');
      console.log(`   ${nonFixableIssues.length} issue(s) require manual attention:`);
      for (const issue of nonFixableIssues.slice(0, 5)) {
        const icon = getSeverityIcon(issue.severity);
        const location = issue.line ? `L${issue.line}` : '';
        console.log(`   ${icon} [${issue.category}] ${location ? `@${location} ` : ''}${issue.message}`);
      }
      if (nonFixableIssues.length > 5) {
        console.log(`   ... and ${nonFixableIssues.length - 5} more`);
      }
    }
    printDivider();
    return;
  }

  console.log(`🔧 ${fixableIssues.length} fixable issue(s) found. Applying fixes...`);
  console.log('');

  // ─── FIX ────────────────────────────────────────────────────
  const fixerClient = new MCPClient(fixerServerPath);
  let fixResult: FixOutput;

  try {
    const rawResult = await fixerClient.callTool('fix_from_review', {
      path: absolutePath,
      reviewJson: JSON.stringify(reviewResult),
    });
    fixResult = rawResult as unknown as FixOutput;
  } catch (error) {
    console.error('❌ Fix failed:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }

  if (!fixResult.success) {
    console.error('❌ Fix returned failure');
    process.exit(1);
  }

  // Display fix results
  console.log('🔧 FIX RESULTS');
  printDivider();
  
  for (const fix of fixResult.fixes) {
    printFixResult(fix);
  }

  console.log('');
  console.log(`   Summary: ${fixResult.summary.applied} applied, ${fixResult.summary.skipped} skipped, ${fixResult.summary.failed} failed`);
  
  // TypeScript check
  if (fixResult.typescriptCheck) {
    if (fixResult.typescriptCheck.passed) {
      console.log('   ✅ TypeScript check: PASSED');
    } else {
      console.log(`   ⚠️  TypeScript check: ${fixResult.typescriptCheck.errors.length} error(s)`);
      for (const err of fixResult.typescriptCheck.errors.slice(0, 3)) {
        console.log(`      ${err}`);
      }
      if (fixResult.typescriptCheck.errors.length > 3) {
        console.log(`      ... and ${fixResult.typescriptCheck.errors.length - 3} more`);
      }
    }
  }

  console.log('');

  // ─── PASS 2: RE-REVIEW ──────────────────────────────────────
  if (fixResult.summary.applied > 0) {
    console.log('🔍 Running post-fix review...');
    console.log('');

    let finalReview: ReviewResult;
    try {
      const rawResult = await reviewerClient.callTool('review', { path: absolutePath });
      finalReview = rawResult as unknown as ReviewResult;
    } catch (error) {
      console.error('⚠️  Post-fix review failed:', error instanceof Error ? error.message : String(error));
      printDivider();
      return;
    }

    printReviewSummary('FINAL REVIEW', finalReview.summary);

    // Show remaining issues
    if (finalReview.summary.totalIssues > 0) {
      console.log(`   ${finalReview.summary.totalIssues} issue(s) remaining:`);
      for (const issue of finalReview.issues.slice(0, 5)) {
        const icon = getSeverityIcon(issue.severity);
        const fixable = issue.fixable ? '🔧' : '👤';
        const location = issue.line ? `L${issue.line}` : '';
        console.log(`   ${fixable} ${icon} [${issue.category}] ${location ? `@${location} ` : ''}${issue.message}`);
      }
      if (finalReview.issues.length > 5) {
        console.log(`   ... and ${finalReview.issues.length - 5} more`);
      }
      console.log('');
    }

    // Score delta
    printScoreDelta(fixResult.summary.scoreBefore, finalReview.summary.overallScore);
    console.log('');
  }

  // ─── FINAL SUMMARY ─────────────────────────────────────────
  printDivider();
  
  const scoreBefore = fixResult.summary.scoreBefore;
  const gradeBefore = fixResult.summary.gradeBefore;
  
  if (fixResult.summary.applied > 0) {
    // Re-review was run, get final score
    const scoreAfter = reviewResult.summary.overallScore; // This is stale, but we'd need the final review
    console.log(`  ✅ ${fixResult.summary.applied} fix(es) applied`);
    if (gradeBefore) {
      const emoji = getGradeEmoji(gradeBefore);
      console.log(`  ${emoji} Grade: ${gradeBefore}`);
    }
    if (scoreBefore !== undefined) {
      console.log(`  📊 Score: ${scoreBefore}/100`);
    }
  } else {
    console.log('  ℹ️  No fixes were applied');
  }

  printDivider();
}

// ============================================================================
// STDIN MODE
// ============================================================================

async function runStdinMode(): Promise<void> {
  const stdinData = await readStdin();
  
  if (!stdinData.trim()) {
    console.error('❌ No input received from stdin');
    console.error('');
    console.error('Usage:');
    console.error('  component-reviewer packages/ui/components/Card | review-and-fix --stdin');
    process.exit(1);
  }

  let reviewResult: ReviewResult;
  try {
    reviewResult = JSON.parse(stdinData);
  } catch {
    console.error('❌ Invalid JSON from stdin');
    process.exit(1);
  }

  // Extract component path from review result
  const componentFile = reviewResult.summary?.file;
  if (!componentFile) {
    console.error('❌ Could not determine component path from review output');
    process.exit(1);
  }

  const monorepoRoot = findMonorepoRoot(process.cwd());
  const absolutePath = resolve(monorepoRoot, componentFile);
  const componentDir = dirname(absolutePath);
  const componentName = reviewResult.summary.component;

  const fixerServerPath = getServerPath('component-fixer');
  const fixerClient = new MCPClient(fixerServerPath);

  printHeader(`FIXING: ${componentName}`);

  printReviewSummary('REVIEW INPUT', reviewResult.summary);

  const fixableIssues = reviewResult.issues.filter(i => i.fixable);
  if (fixableIssues.length === 0) {
    console.log('✨ No fixable issues found.');
    process.exit(0);
  }

  console.log(`🔧 Applying ${fixableIssues.length} fix(es)...`);
  console.log('');

  let fixResult: FixOutput;
  try {
    const rawResult = await fixerClient.callTool('fix_from_review', {
      path: componentDir,
      reviewJson: JSON.stringify(reviewResult),
    });
    fixResult = rawResult as unknown as FixOutput;
  } catch (error) {
    console.error('❌ Fix failed:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }

  for (const fix of fixResult.fixes) {
    printFixResult(fix);
  }

  console.log('');
  console.log(`   ${fixResult.summary.applied} applied, ${fixResult.summary.skipped} skipped, ${fixResult.summary.failed} failed`);
  
  printDivider();
}

// ============================================================================
// ENTRY POINT
// ============================================================================

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  // Stdin mode
  if (args.includes('--stdin') || args.includes('-')) {
    await runStdinMode();
    return;
  }

  // Help
  if (args.includes('--help') || args.includes('-h')) {
    console.log('Usage:');
    console.log('  review-and-fix <component-path>');
    console.log('');
    console.log('Examples:');
    console.log('  review-and-fix packages/ui/components/Card');
    console.log('  review-and-fix packages/ui/components/avatar');
    console.log('');
    console.log('Pipeline mode (stdin):');
    console.log('  component-reviewer packages/ui/components/Card | review-and-fix --stdin');
    process.exit(0);
  }

  // Regular pipeline mode
  const componentPath = args.find(a => !a.startsWith('-'));
  if (!componentPath) {
    console.error('Usage: review-and-fix <component-path>');
    console.error('       component-reviewer <path> | review-and-fix --stdin');
    console.error('');
    console.error('Run review-and-fix --help for more info.');
    process.exit(1);
  }

  await runPipeline(componentPath);
}

main().catch((error) => {
  console.error('❌ Fatal error:', error.message);
  process.exit(1);
});