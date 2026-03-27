#!/usr/bin/env node
// ============================================================================
// TYPESCRIPT ENFORCER MCP SERVER
// Enforce TypeScript best practices across the monorepo
// ============================================================================

import { McpServerBase } from '../../_shared/index.js';
import type { ToolResult } from '../../_shared/index.js';
import * as fs from 'fs';
import * as path from 'path';
import { scanFile, scanDirectory } from './scanner.js';
import type { ScanOptions, RuleName, Severity } from './types.js';

// ============================================================================
// VALID RULES
// ============================================================================

const VALID_RULES: RuleName[] = [
  'no-any',
  'generics',
  'utility-types',
  'modifiers',
  'type-guards',
  'discriminated-unions',
  'branded-types',
];

// ============================================================================
// MAIN SERVER
// ============================================================================

class TypeScriptEnforcerServer extends McpServerBase {
  constructor() {
    super({ name: 'typescript-enforcer', version: '2.0.0' });
  }

  protected registerTools(): void {
    this.addTool(
      'scan_file',
      'Analyze a single TypeScript/JavaScript file for type safety violations. Runs all rules by default (no-any, generics, utility-types, modifiers, type-guards). Returns violations with line numbers, severity, current code, suggested fix, and explanation of why it matters.',
      {
        type: 'object',
        properties: {
          path: { type: 'string', description: 'Path to the TypeScript/JavaScript file to analyze' },
          rules: {
            type: 'array',
            items: { type: 'string', enum: VALID_RULES },
            description: `Specific rules to run. Defaults to all. Options: ${VALID_RULES.join(', ')}`,
          },
          severity: {
            type: 'string',
            enum: ['error', 'warning', 'info'],
            description: 'Minimum severity to report (default: info shows all)',
            default: 'info',
          },
        },
        required: ['path'],
      },
      this.handleScanFile.bind(this)
    );

    this.addTool(
      'scan_directory',
      'Recursively scan a directory for TypeScript violations. Returns per-file results sorted by worst score first, plus summary statistics and breakdown by rule.',
      {
        type: 'object',
        properties: {
          path: { type: 'string', description: 'Directory path to scan recursively' },
          rules: {
            type: 'array',
            items: { type: 'string', enum: VALID_RULES },
            description: 'Specific rules to run (default: all)',
          },
          severity: {
            type: 'string',
            enum: ['error', 'warning', 'info'],
            description: 'Minimum severity to report (default: info)',
            default: 'info',
          },
          maxFiles: { type: 'number', description: 'Maximum number of files to scan (default: unlimited)' },
          ignore: {
            type: 'array',
            items: { type: 'string' },
            description: 'Additional patterns to ignore (default ignores node_modules, build, dist, .next, .git)',
          },
        },
        required: ['path'],
      },
      this.handleScanDirectory.bind(this)
    );

    this.addTool(
      'scan_specific_rule',
      'Run a single specific rule across a file or directory. Useful for targeted fixes.',
      {
        type: 'object',
        properties: {
          rule: {
            type: 'string',
            enum: VALID_RULES,
            description: `The rule to run. Options: ${VALID_RULES.join(', ')}`,
          },
          path: { type: 'string', description: 'File or directory path to scan' },
          severity: {
            type: 'string',
            enum: ['error', 'warning', 'info'],
            description: 'Minimum severity to report (default: info)',
            default: 'info',
          },
        },
        required: ['rule', 'path'],
      },
      this.handleScanSpecificRule.bind(this)
    );

    this.addTool(
      'list_rules',
      'List all available TypeScript enforcement rules with descriptions and what they check for. Returns rule names, descriptions, severity levels, and example violations.',
      { type: 'object', properties: {} },
      this.handleListRules.bind(this)
    );
  }

  // ========================================================================
  // HANDLERS
  // ========================================================================

  private async handleScanFile(args: unknown): Promise<ToolResult> {
    const startTime = Date.now();
    const { path: targetPath, rules, severity } = args as { path: string; rules?: RuleName[]; severity?: Severity };

    const resolvedPath = path.resolve(targetPath);

    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`File not found: ${resolvedPath}`);
    }
    if (fs.statSync(resolvedPath).isDirectory()) {
      throw new Error(`${resolvedPath} is a directory. Use scan_directory instead.`);
    }

    const options: ScanOptions = {
      rules,
      severity: severity || 'info',
    };

    const result = scanFile(resolvedPath, options);
    const duration = Date.now() - startTime;

    return this.success({
      ...result,
      metadata: {
        timestamp: new Date().toISOString(),
        duration,
        version: '2.0.0',
      },
    });
  }

  private async handleScanDirectory(args: unknown): Promise<ToolResult> {
    const startTime = Date.now();
    const { path: targetPath, rules, severity, maxFiles, ignore } = args as {
      path: string;
      rules?: RuleName[];
      severity?: Severity;
      maxFiles?: number;
      ignore?: string[];
    };

    const resolvedPath = path.resolve(targetPath);

    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`Directory not found: ${resolvedPath}`);
    }
    if (!fs.statSync(resolvedPath).isDirectory()) {
      throw new Error(`${resolvedPath} is a file. Use scan_file instead.`);
    }

    const options: ScanOptions = {
      rules,
      severity: severity || 'info',
      maxFiles,
      ignore,
    };

    const result = scanDirectory(resolvedPath, options);
    const duration = Date.now() - startTime;

    return this.success({
      ...result,
      metadata: {
        timestamp: new Date().toISOString(),
        duration,
        version: '2.0.0',
      },
    });
  }

  private async handleScanSpecificRule(args: unknown): Promise<ToolResult> {
    const startTime = Date.now();
    const { rule, path: targetPath, severity } = args as { rule: RuleName; path: string; severity?: Severity };

    if (!VALID_RULES.includes(rule)) {
      throw new Error(`Invalid rule: ${rule}. Valid rules: ${VALID_RULES.join(', ')}`);
    }

    const resolvedPath = path.resolve(targetPath);

    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`Path not found: ${resolvedPath}`);
    }

    const options: ScanOptions = {
      rules: [rule],
      severity: severity || 'info',
    };

    if (fs.statSync(resolvedPath).isDirectory()) {
      const result = scanDirectory(resolvedPath, options);
      const duration = Date.now() - startTime;

      return this.success({
        rule,
        ...result,
        metadata: {
          timestamp: new Date().toISOString(),
          duration,
          version: '2.0.0',
        },
      });
    } else {
      const result = scanFile(resolvedPath, options);
      const duration = Date.now() - startTime;

      return this.success({
        rule,
        ...result,
        metadata: {
          timestamp: new Date().toISOString(),
          duration,
          version: '2.0.0',
        },
      });
    }
  }

  private async handleListRules(): Promise<ToolResult> {
    const rules = [
      {
        name: 'no-any',
        severity: 'error',
        description: "Detect all 'any' type usages and suggest proper types",
        checks: [
          ': any type annotations',
          'as any type assertions',
          'any[] and any[]',
          'Promise<any>',
          'Record<string, any>',
          'Generic <any>',
        ],
        example: {
          current: 'function parse(args: any): any { ... }',
          suggestion: 'function parse<T>(args: ParseInput): ParseResult<T> { ... }',
        },
      },
      {
        name: 'generics',
        severity: 'warning',
        description: 'Detect functions/classes that should use generics for reusability',
        checks: [
          'Functions returning any/unknown that could be generic',
          'Type assertions in returns that indicate missing generics',
          'Object.entries/keys/values without type narrowing',
          'Untyped Array/Map/Set constructors',
          'Utility functions that should be generic',
          'Classes with repeated type assertions',
        ],
        example: {
          current: 'function clone(obj: Record<string, any>): any { ... }',
          suggestion: 'function clone<T extends Record<string, unknown>>(obj: T): T { ... }',
        },
      },
      {
        name: 'utility-types',
        severity: 'info',
        description: 'Detect patterns that should use TypeScript utility types',
        checks: [
          'Manual Partial (all properties optional)',
          'Manual Pick (selecting specific properties)',
          'Manual Record (index signatures)',
          'Nullable unions that should use NonNullable',
          'Promise unwrapping that should use Awaited',
          'Type annotations that should use satisfies',
        ],
        example: {
          current: 'interface Foo { a?: string; b?: number; c?: boolean }',
          suggestion: 'type Foo = Partial<BaseFoo>',
        },
      },
      {
        name: 'modifiers',
        severity: 'info',
        description: 'Detect missing readonly, const, as const, satisfies modifiers',
        checks: [
          'const arrays that should be as const',
          'const objects that should be as const',
          'Interface properties that should be readonly (IDs, timestamps)',
          'Function parameters that should be readonly',
          'let variables that should be const',
          'Enum-like constants without as const',
        ],
        example: {
          current: "const TYPES = ['a', 'b', 'c']",
          suggestion: "const TYPES = ['a', 'b', 'c'] as const",
        },
      },
      {
        name: 'type-guards',
        severity: 'info',
        description: 'Detect runtime checks that should be type predicates (is keyword)',
        checks: [
          'typeof check functions returning boolean instead of type predicate',
          'Arrow function type checks without predicates',
          'Inline typeof with unnecessary casts',
          'instanceof checks with casts',
          'Property existence checks with casts',
          'Null check functions without generic type predicates',
        ],
        example: {
          current: 'function isString(v: unknown): boolean { return typeof v === "string" }',
          suggestion: 'function isString(v: unknown): v is string { return typeof v === "string" }',
        },
      },
    ];

    return this.success({
      rules,
      totalRules: rules.length,
      note: 'discriminated-unions and branded-types rules are planned for future implementation.',
      metadata: {
        timestamp: new Date().toISOString(),
        version: '2.0.0',
      },
    });
  }
}

// ============================================================================
// ENTRY POINT
// ============================================================================

new TypeScriptEnforcerServer().run().catch(console.error);