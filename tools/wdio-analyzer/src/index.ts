#!/usr/bin/env node
// ============================================================================
// WDIO ANALYZER MCP SERVER
// Static analysis for WebdriverIO + TypeScript test suites.
// Scores selector robustness, detects anti-patterns, audits POM coverage,
// and suggests targeted refactors — all without running a browser.
// ============================================================================

import { McpServerBase } from '../../_shared/index.js';
import type { ToolResult } from '../../_shared/index.js';
import * as fs from 'fs';
import * as path from 'path';

// ============================================================================
// TYPES
// ============================================================================

interface SelectorFinding {
  file: string;
  line: number;
  selector: string;
  strategy: string;
  score: number;
  recommendation?: string;
}

interface AntiPatternFinding {
  file: string;
  line: number;
  code: string;
  pattern: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  fix: string;
}

interface PomCoverageResult {
  pomFile: string;
  specFiles: string[];
  publicGetters: string[];
  publicMethods: string[];
  coveredGetters: string[];
  uncoveredGetters: string[];
  coveredMethods: string[];
  uncoveredMethods: string[];
  phantomCalls: string[];
  coveragePercent: number;
}

// ============================================================================
// FILE SYSTEM HELPERS
// ============================================================================

function scanFiles(target: string, exts: string[]): string[] {
  const results: string[] = [];
  const stat = fs.statSync(target);

  if (stat.isFile()) {
    if (exts.some(e => target.endsWith(e))) results.push(target);
    return results;
  }

  function walk(dir: string): void {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (['node_modules', 'build', 'dist', '.git'].includes(entry.name)) continue;
        walk(fullPath);
      } else if (exts.some(e => entry.name.endsWith(e))) {
        results.push(fullPath);
      }
    }
  }

  walk(target);
  return results;
}

function readLines(filePath: string): string[] {
  return fs.readFileSync(filePath, 'utf-8').split('\n');
}

// ============================================================================
// SELECTOR ANALYSIS
// ============================================================================

interface SelectorScore {
  strategy: string;
  score: number;
  recommendation?: string;
}

// NOTE: patterns match only the selector string value (inner part of $('...'))
const SELECTOR_PATTERNS: Array<{ pattern: RegExp; strategy: string; score: number; recommendation?: string }> = [
  {
    pattern: /\[data-testid=['"]([^'"]+)['"]\]|\[data-testid=([^\]]+)\]/,
    strategy: 'data-testid',
    score: 9,
  },
  {
    pattern: /\[data-test-id=['"]([^'"]+)['"]\]|\[data-test=['"]([^'"]+)['"]\]/,
    strategy: 'data-test-id / data-test',
    score: 9,
  },
  {
    pattern: /\[aria-label=['"]([^'"]+)['"]\]/,
    strategy: 'aria-label',
    score: 8,
  },
  {
    pattern: /\[role=['"]([^'"]+)['"]\]/,
    strategy: 'aria-role',
    score: 7,
  },
  {
    pattern: /^#[a-zA-Z][\w-]*$/,
    strategy: 'id',
    score: 7,
    recommendation: 'Safe if the ID is not dynamically generated. Verify it is stable across renders.',
  },
  {
    pattern: /\[name=['"]([^'"]+)['"]\]/,
    strategy: 'name attribute',
    score: 6,
  },
  {
    pattern: /\[placeholder=['"]([^'"]+)['"]\]/,
    strategy: 'placeholder',
    score: 5,
    recommendation: 'Prefer data-testid — placeholders change with UX copy.',
  },
  {
    pattern: /\/\/[^"'\s]*text\(\)/,
    strategy: 'XPath text()',
    score: 4,
    recommendation: 'Brittle: breaks when copy changes. Use aria-label or data-testid.',
  },
  {
    pattern: /^\.[a-zA-Z][\w-]*(\s+\.[a-zA-Z][\w-]*)*/,
    strategy: 'CSS class',
    score: 3,
    recommendation: 'CSS classes change with styling refactors. Switch to data-testid.',
  },
  {
    pattern: /[a-z]+\s+[a-z]|[a-z]+\s*>\s*[a-z]/,
    strategy: 'Nested CSS / tag chain',
    score: 2,
    recommendation: 'Very brittle. Any DOM restructure breaks this selector. Add data-testid to the element.',
  },
];

function classifySelector(selectorStr: string): SelectorScore {
  for (const { pattern, strategy, score, recommendation } of SELECTOR_PATTERNS) {
    if (pattern.test(selectorStr)) {
      return { strategy, score, recommendation };
    }
  }
  return {
    strategy: 'unknown / complex',
    score: 1,
    recommendation: 'Could not classify selector. Review manually and add data-testid if possible.',
  };
}

// Match $('...') and $$('...')
const SELECTOR_RE = /\$\$?\(['"`]([^'"`]+)['"`]\)/g;

function findSelectors(lines: string[], filePath: string): SelectorFinding[] {
  const findings: SelectorFinding[] = [];

  lines.forEach((line, idx) => {
    let match: RegExpExecArray | null;
    const re = new RegExp(SELECTOR_RE.source, 'g');
    while ((match = re.exec(line)) !== null) {
      const selector = match[1];
      const { strategy, score, recommendation } = classifySelector(selector);
      findings.push({
        file: filePath,
        line: idx + 1,
        selector,
        strategy,
        score,
        recommendation,
      });
    }
  });

  return findings;
}

// ============================================================================
// ANTI-PATTERN DETECTION
// ============================================================================

interface AntiPatternRule {
  id: string;
  pattern: RegExp;
  severity: 'error' | 'warning' | 'info';
  message: string;
  fix: string;
}

const ANTI_PATTERN_RULES: AntiPatternRule[] = [
  {
    id: 'no-browser-pause',
    pattern: /browser\.pause\s*\(\s*\d+\s*\)/,
    severity: 'error',
    message: '`browser.pause()` is a hard-coded wait. It makes tests slow and flaky.',
    fix: 'Replace with `await el.waitForDisplayed()`, `await el.waitForClickable()`, or `browser.waitUntil()`.',
  },
  {
    id: 'no-browser-sleep',
    pattern: /browser\.sleep\s*\(\s*\d+\s*\)/,
    severity: 'error',
    message: '`browser.sleep()` is deprecated and causes brittle waits.',
    fix: 'Use `await browser.waitUntil(() => condition, { timeout: N })` instead.',
  },
  {
    id: 'missing-await',
    pattern: /(?<!await\s)(?<!\w)\$\$?\(['"]/,
    severity: 'warning',
    message: 'WebdriverIO element commands return Promises. Missing `await` causes silent test failures.',
    fix: 'Add `await` before `$()` / `$$()` calls and all element interactions.',
  },
  {
    id: 'raw-selector-in-spec',
    pattern: /(?:describe|it|before|after)[\s\S]*?\$\$?\(['"]/,
    severity: 'warning',
    message: 'Selectors defined directly inside spec files bypass the Page Object Model.',
    fix: 'Move all selectors and element interactions into a Page Object class.',
  },
  {
    id: 'magic-timeout',
    pattern: /\{\s*timeout\s*:\s*\d{4,}\s*\}/,
    severity: 'info',
    message: 'Magic number timeout detected. Hard-coded numbers are hard to maintain.',
    fix: 'Extract to a named constant: `const TIMEOUTS = { MEDIUM: 10_000 }` then use `{ timeout: TIMEOUTS.MEDIUM }`.',
  },
  {
    id: 'console-log-in-spec',
    pattern: /console\.(log|warn|info)\s*\(/,
    severity: 'info',
    message: '`console.log` left in spec file. Pollutes test output.',
    fix: 'Remove debug logs before committing. Use a dedicated logger or WDIO\'s built-in logging.',
  },
  {
    id: 'no-aftereach-teardown',
    pattern: /beforeEach\s*\(async/,
    severity: 'info',
    message: 'A `beforeEach` hook is present but no `afterEach` teardown was found. Dirty state can leak between tests.',
    fix: 'Add an `afterEach` hook to clean up state (e.g. clear cookies, reset mock data).',
  },
  {
    id: 'multiple-browser-url-in-it',
    pattern: /it\s*\([\s\S]*?browser\.url[\s\S]*?browser\.url/,
    severity: 'warning',
    message: 'Multiple `browser.url()` calls inside one `it()` block suggests poor test isolation.',
    fix: 'Each `it()` should test one scenario. Move navigation to `beforeEach` or split into separate tests.',
  },
  {
    id: 'hardcoded-url',
    pattern: /browser\.url\s*\(\s*['"]https?:\/\//,
    severity: 'warning',
    message: 'Hardcoded absolute URL inside test. Will break in different environments.',
    fix: 'Use `browser.url(page.path)` via the Page Object, or read from `browser.options.baseUrl`.',
  },
  {
    id: 'expect-without-await',
    pattern: /(?<!await\s)expect\s*\(\s*(?:await\s*)?\$\$?\(/,
    severity: 'error',
    message: 'Calling `expect()` on an un-awaited element chain. The assertion runs on a Promise, not the resolved element.',
    fix: 'Use `await expect(el).toBeDisplayed()` — always await the outer `expect()` call.',
  },
];

function detectAntiPatterns(lines: string[], filePath: string): AntiPatternFinding[] {
  const findings: AntiPatternFinding[] = [];
  const fullContent = lines.join('\n');

  for (const rule of ANTI_PATTERN_RULES) {
    if (rule.id === 'no-aftereach-teardown') {
      if (rule.pattern.test(fullContent) && !/afterEach/.test(fullContent)) {
        findings.push({
          file: filePath,
          line: 0,
          code: '(file-level)',
          pattern: rule.id,
          severity: rule.severity,
          message: rule.message,
          fix: rule.fix,
        });
      }
      continue;
    }

    if (rule.id === 'multiple-browser-url-in-it') {
      if (rule.pattern.test(fullContent)) {
        findings.push({
          file: filePath,
          line: 0,
          code: '(file-level)',
          pattern: rule.id,
          severity: rule.severity,
          message: rule.message,
          fix: rule.fix,
        });
      }
      continue;
    }

    lines.forEach((line, idx) => {
      if (rule.pattern.test(line)) {
        findings.push({
          file: filePath,
          line: idx + 1,
          code: line.trim(),
          pattern: rule.id,
          severity: rule.severity,
          message: rule.message,
          fix: rule.fix,
        });
      }
    });
  }

  return findings;
}

// ============================================================================
// POM COVERAGE AUDIT
// ============================================================================

function extractPomMembers(pomSource: string): { getters: string[]; methods: string[] } {
  const getters: string[] = [];
  const methods: string[] = [];

  // Public getters: `get propName()`
  const getterRe = /^\s*get\s+(\w+)\s*\(\)/gm;
  let m: RegExpExecArray | null;
  while ((m = getterRe.exec(pomSource)) !== null) {
    getters.push(m[1]);
  }

  // Public methods: `async methodName(` or `methodName(` — not constructor, not private (_)
  const methodRe = /^\s*(?:async\s+)?(\w+)\s*\([^)]*\)\s*(?::\s*\S+)?\s*\{/gm;
  while ((m = methodRe.exec(pomSource)) !== null) {
    const name = m[1];
    if (['constructor', 'registerTools', 'run', 'shutdown'].includes(name)) continue;
    if (name.startsWith('_')) continue;
    if (getters.includes(name)) continue;
    methods.push(name);
  }

  return { getters, methods };
}

function findUsagesInSpecs(names: string[], specFiles: string[]): Set<string> {
  const used = new Set<string>();
  for (const specFile of specFiles) {
    const content = fs.readFileSync(specFile, 'utf-8');
    for (const name of names) {
      if (new RegExp(`\\.${name}\\b`).test(content)) {
        used.add(name);
      }
    }
  }
  return used;
}

// ============================================================================
// SUGGEST REFACTOR
// ============================================================================

function applyAutoFixes(lines: string[]): { lines: string[]; changes: string[] } {
  const changes: string[] = [];
  const fixed = lines.map((line, idx) => {
    const lineNum = idx + 1;

    // Fix browser.pause → browser.waitUntil comment
    if (/browser\.pause\s*\(\d+\)/.test(line)) {
      const replacement = line.replace(
        /browser\.pause\s*\((\d+)\)/g,
        'await browser.waitUntil(() => true, { timeout: $1 }) /* TODO: replace with a real condition */'
      );
      changes.push(`Line ${lineNum}: Replaced browser.pause() with browser.waitUntil()`);
      return replacement;
    }

    // Fix magic timeouts
    if (/\{\s*timeout\s*:\s*(\d{4,})\s*\}/.test(line)) {
      changes.push(`Line ${lineNum}: Magic timeout — consider extracting to TIMEOUTS constant`);
    }

    // Fix console.log removal
    if (/console\.(log|warn|info)\s*\(/.test(line)) {
      changes.push(`Line ${lineNum}: Removed console.${line.match(/console\.(\w+)/)?.[1] ?? 'log'}()`);
      return line.replace(/^\s*console\.(log|warn|info)\s*\([^)]*\);?\s*$/, '');
    }

    return line;
  });

  return { lines: fixed.filter(l => l !== undefined), changes };
}

// ============================================================================
// MCP SERVER
// ============================================================================

class WdioAnalyzerServer extends McpServerBase {
  constructor() {
    super({ name: 'wdio-analyzer', version: '1.0.0' });
  }

  protected registerTools(): void {
    this.addTool(
      'analyze_selectors',
      'Scan WebdriverIO test files and score every selector for robustness (1-10). Returns per-file findings with strategy classification and improvement recommendations.',
      {
        type: 'object',
        properties: {
          filePath: {
            type: 'string',
            description: 'Absolute path to a single .ts / .js file to analyze',
          },
          dirPath: {
            type: 'string',
            description: 'Absolute path to a directory — all .ts / .js files are scanned recursively',
          },
        },
      },
      async (args) => this.handleAnalyzeSelectors(args)
    );

    this.addTool(
      'detect_anti_patterns',
      'Scan test files for known WebdriverIO anti-patterns: browser.pause(), missing await, raw selectors in specs, magic timeouts, console.log leftovers, missing teardown, and more. Returns findings grouped by severity.',
      {
        type: 'object',
        properties: {
          filePath: {
            type: 'string',
            description: 'Absolute path to a single file',
          },
          dirPath: {
            type: 'string',
            description: 'Absolute path to a directory to scan recursively',
          },
        },
      },
      async (args) => this.handleDetectAntiPatterns(args)
    );

    this.addTool(
      'audit_pom_coverage',
      'Compare a Page Object Model class against a directory of spec files. Reports which public getters and methods are covered, which are dead code, and which are called in specs but missing from the POM (typos / stale refs).',
      {
        type: 'object',
        properties: {
          pomFile: {
            type: 'string',
            description: 'Absolute path to the Page Object class file (e.g. LoginPage.ts)',
          },
          specDir: {
            type: 'string',
            description: 'Absolute path to the directory containing spec files',
          },
        },
        required: ['pomFile', 'specDir'],
      },
      async (args) => this.handleAuditPomCoverage(args)
    );

    this.addTool(
      'suggest_refactor',
      'Read a WebdriverIO test file, apply automated fixes for detected anti-patterns (pause → waitUntil, remove console.log, etc.), and return the refactored source with a change summary. Pass dryRun=false to write to disk.',
      {
        type: 'object',
        properties: {
          filePath: {
            type: 'string',
            description: 'Absolute path to the test file to refactor',
          },
          dryRun: {
            type: 'boolean',
            description: 'When true (default) returns the refactored source without writing to disk',
          },
        },
        required: ['filePath'],
      },
      async (args) => this.handleSuggestRefactor(args)
    );
  }

  private async handleAnalyzeSelectors(args: any): Promise<ToolResult> {
    try {
      const target = args.filePath ?? args.dirPath;
      if (!target) return this.error(new Error('Provide filePath or dirPath'));
      if (!fs.existsSync(target)) return this.error(new Error(`Path not found: ${target}`));

      const files = scanFiles(target, ['.ts', '.js']);
      const allFindings: SelectorFinding[] = [];

      for (const file of files) {
        const lines = readLines(file);
        allFindings.push(...findSelectors(lines, file));
      }

      const scores = allFindings.map(f => f.score);
      const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
      const fragile = allFindings.filter(f => f.score <= 4);
      const moderate = allFindings.filter(f => f.score >= 5 && f.score <= 6);
      const robust = allFindings.filter(f => f.score >= 7);

      const byFile = files.reduce<Record<string, SelectorFinding[]>>((acc, f) => {
        acc[f] = allFindings.filter(s => s.file === f);
        return acc;
      }, {});

      return this.success({
        summary: {
          filesScanned: files.length,
          totalSelectors: allFindings.length,
          averageScore: Math.round(avgScore * 10) / 10,
          robustCount: robust.length,
          moderateCount: moderate.length,
          fragileCount: fragile.length,
          overallHealth: avgScore >= 7 ? 'good' : avgScore >= 5 ? 'needs work' : 'poor',
        },
        scoreGuide: {
          9: 'data-testid / data-test',
          8: 'aria-label',
          7: 'id / aria-role',
          6: 'name attribute',
          5: 'placeholder',
          4: 'XPath text()',
          3: 'CSS class',
          2: 'Nested tag chain',
          1: 'Unknown / complex',
        },
        fragileSelectors: fragile.map(f => ({
          file: path.relative(process.cwd(), f.file),
          line: f.line,
          selector: f.selector,
          score: f.score,
          strategy: f.strategy,
          recommendation: f.recommendation,
        })),
        allFindings: allFindings.map(f => ({
          file: path.relative(process.cwd(), f.file),
          line: f.line,
          selector: f.selector,
          score: f.score,
          strategy: f.strategy,
          recommendation: f.recommendation,
        })),
      });
    } catch (err) {
      return this.error(err);
    }
  }

  private async handleDetectAntiPatterns(args: any): Promise<ToolResult> {
    try {
      const target = args.filePath ?? args.dirPath;
      if (!target) return this.error(new Error('Provide filePath or dirPath'));
      if (!fs.existsSync(target)) return this.error(new Error(`Path not found: ${target}`));

      const files = scanFiles(target, ['.ts', '.js']);
      const allFindings: AntiPatternFinding[] = [];

      for (const file of files) {
        const lines = readLines(file);
        allFindings.push(...detectAntiPatterns(lines, file));
      }

      const errors = allFindings.filter(f => f.severity === 'error');
      const warnings = allFindings.filter(f => f.severity === 'warning');
      const infos = allFindings.filter(f => f.severity === 'info');

      return this.success({
        summary: {
          filesScanned: files.length,
          totalFindings: allFindings.length,
          errors: errors.length,
          warnings: warnings.length,
          info: infos.length,
          clean: allFindings.length === 0,
        },
        findings: {
          errors: errors.map(f => ({
            file: path.relative(process.cwd(), f.file),
            line: f.line,
            code: f.code,
            pattern: f.pattern,
            message: f.message,
            fix: f.fix,
          })),
          warnings: warnings.map(f => ({
            file: path.relative(process.cwd(), f.file),
            line: f.line,
            code: f.code,
            pattern: f.pattern,
            message: f.message,
            fix: f.fix,
          })),
          info: infos.map(f => ({
            file: path.relative(process.cwd(), f.file),
            line: f.line,
            code: f.code,
            pattern: f.pattern,
            message: f.message,
            fix: f.fix,
          })),
        },
      });
    } catch (err) {
      return this.error(err);
    }
  }

  private async handleAuditPomCoverage(args: any): Promise<ToolResult> {
    try {
      const { pomFile, specDir } = args;
      if (!fs.existsSync(pomFile)) return this.error(new Error(`POM file not found: ${pomFile}`));
      if (!fs.existsSync(specDir)) return this.error(new Error(`Spec directory not found: ${specDir}`));

      const pomSource = fs.readFileSync(pomFile, 'utf-8');
      const { getters, methods } = extractPomMembers(pomSource);
      const specFiles = scanFiles(specDir, ['.spec.ts', '.spec.js', '.test.ts', '.test.js']);

      if (specFiles.length === 0) {
        return this.error(new Error(`No spec files found in: ${specDir}`));
      }

      const allMembers = [...getters, ...methods];
      const usedSet = findUsagesInSpecs(allMembers, specFiles);

      const coveredGetters = getters.filter(g => usedSet.has(g));
      const uncoveredGetters = getters.filter(g => !usedSet.has(g));
      const coveredMethods = methods.filter(m => usedSet.has(m));
      const uncoveredMethods = methods.filter(m => !usedSet.has(m));

      // Find calls in specs that don't exist in POM
      const allSpecContent = specFiles.map(f => fs.readFileSync(f, 'utf-8')).join('\n');
      const calledRe = /\.(\w+)\b/g;
      const specCalls = new Set<string>();
      let sm: RegExpExecArray | null;
      while ((sm = calledRe.exec(allSpecContent)) !== null) {
        specCalls.add(sm[1]);
      }
      const phantomCalls = [...specCalls].filter(
        c => !allMembers.includes(c) && c.length > 3 && !/^(then|catch|finally|length|push|map|filter|find|forEach|toString|valueOf)$/.test(c)
      );

      const total = allMembers.length;
      const covered = coveredGetters.length + coveredMethods.length;
      const coveragePercent = total > 0 ? Math.round((covered / total) * 100) : 0;

      return this.success({
        pomFile: path.relative(process.cwd(), pomFile),
        specFilesAnalyzed: specFiles.map(f => path.relative(process.cwd(), f)),
        coverage: {
          percent: coveragePercent,
          health: coveragePercent >= 80 ? 'good' : coveragePercent >= 50 ? 'moderate' : 'low',
          coveredMembers: covered,
          totalMembers: total,
        },
        getters: {
          covered: coveredGetters,
          uncovered: uncoveredGetters,
        },
        methods: {
          covered: coveredMethods,
          uncovered: uncoveredMethods,
        },
        phantomCalls: phantomCalls.slice(0, 20),
      });
    } catch (err) {
      return this.error(err);
    }
  }

  private async handleSuggestRefactor(args: any): Promise<ToolResult> {
    try {
      const { filePath, dryRun = true } = args;
      if (!fs.existsSync(filePath)) return this.error(new Error(`File not found: ${filePath}`));

      const original = fs.readFileSync(filePath, 'utf-8');
      const lines = original.split('\n');

      const antiBefore = detectAntiPatterns(lines, filePath);
      const { lines: fixedLines, changes } = applyAutoFixes(lines);
      const fixedSource = fixedLines.join('\n');
      const antiAfter = detectAntiPatterns(fixedLines, filePath);

      if (!dryRun) {
        fs.writeFileSync(filePath, fixedSource, 'utf-8');
      }

      return this.success({
        filePath: path.relative(process.cwd(), filePath),
        dryRun,
        written: !dryRun,
        changes,
        findingsBefore: antiBefore.length,
        findingsAfter: antiAfter.length,
        remainingFindings: antiAfter.map(f => ({
          line: f.line,
          pattern: f.pattern,
          message: f.message,
          fix: f.fix,
        })),
        refactoredSource: fixedSource,
      });
    } catch (err) {
      return this.error(err);
    }
  }
}

new WdioAnalyzerServer().run().catch(console.error);
