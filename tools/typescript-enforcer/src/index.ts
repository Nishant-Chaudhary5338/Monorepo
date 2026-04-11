#!/usr/bin/env node
// ============================================================================
// TYPESCRIPT ENFORCER MCP SERVER
// Enforce TypeScript best practices across the monorepo
// ============================================================================

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
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

const TOOLS = [
  {
    name: 'scan_file',
    description: 'Analyze a single TypeScript/JavaScript file for type safety violations. Runs all rules by default (no-any, generics, utility-types, modifiers, type-guards). Returns violations with line numbers, severity, current code, suggested fix, and explanation of why it matters.',
    inputSchema: {
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
  },
  {
    name: 'scan_directory',
    description: 'Recursively scan a directory for TypeScript violations. Returns per-file results sorted by worst score first, plus summary statistics and breakdown by rule.',
    inputSchema: {
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
          description: 'Additional patterns to ignore',
        },
      },
      required: ['path'],
    },
  },
  {
    name: 'scan_specific_rule',
    description: 'Run a single specific rule across a file or directory. Useful for targeted fixes.',
    inputSchema: {
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
  },
  {
    name: 'list_rules',
    description: 'List all available TypeScript enforcement rules with descriptions and what they check for.',
    inputSchema: { type: 'object', properties: {} },
  },
];

// ============================================================================
// SERVER
// ============================================================================

const server = new Server(
  { name: 'typescript-enforcer', version: '2.0.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  if (!args && name !== 'list_rules') throw new McpError(ErrorCode.InvalidParams, 'Missing arguments');

  const startTime = Date.now();

  try {
    let result: unknown;

    switch (name) {
      case 'scan_file': {
        const { path: targetPath, rules, severity } = args as { path: string; rules?: RuleName[]; severity?: Severity };
        const resolvedPath = path.resolve(targetPath);
        if (!fs.existsSync(resolvedPath)) throw new Error(`File not found: ${resolvedPath}`);
        if (fs.statSync(resolvedPath).isDirectory()) throw new Error(`${resolvedPath} is a directory. Use scan_directory instead.`);
        const options: ScanOptions = { rules, severity: severity || 'info' };
        result = { ...scanFile(resolvedPath, options), metadata: { timestamp: new Date().toISOString(), duration: Date.now() - startTime, version: '2.0.0' } };
        break;
      }

      case 'scan_directory': {
        const { path: targetPath, rules, severity, maxFiles, ignore } = args as { path: string; rules?: RuleName[]; severity?: Severity; maxFiles?: number; ignore?: string[] };
        const resolvedPath = path.resolve(targetPath);
        if (!fs.existsSync(resolvedPath)) throw new Error(`Directory not found: ${resolvedPath}`);
        if (!fs.statSync(resolvedPath).isDirectory()) throw new Error(`${resolvedPath} is a file. Use scan_file instead.`);
        const options: ScanOptions = { rules, severity: severity || 'info', maxFiles, ignore };
        result = { ...scanDirectory(resolvedPath, options), metadata: { timestamp: new Date().toISOString(), duration: Date.now() - startTime, version: '2.0.0' } };
        break;
      }

      case 'scan_specific_rule': {
        const { rule, path: targetPath, severity } = args as { rule: RuleName; path: string; severity?: Severity };
        if (!VALID_RULES.includes(rule)) throw new Error(`Invalid rule: ${rule}`);
        const resolvedPath = path.resolve(targetPath);
        if (!fs.existsSync(resolvedPath)) throw new Error(`Path not found: ${resolvedPath}`);
        const options: ScanOptions = { rules: [rule], severity: severity || 'info' };
        const scanResult = fs.statSync(resolvedPath).isDirectory()
          ? scanDirectory(resolvedPath, options)
          : scanFile(resolvedPath, options);
        result = { rule, ...scanResult, metadata: { timestamp: new Date().toISOString(), duration: Date.now() - startTime, version: '2.0.0' } };
        break;
      }

      case 'list_rules': {
        result = {
          rules: [
            { name: 'no-any', severity: 'error', description: "Detect all 'any' type usages and suggest proper types", checks: [': any type annotations', 'as any type assertions', 'any[] and any[]', 'Promise<any>', 'Record<string, any>', 'Generic <any>'] },
            { name: 'generics', severity: 'warning', description: 'Detect functions/classes that should use generics for reusability' },
            { name: 'utility-types', severity: 'info', description: 'Detect patterns that should use TypeScript utility types' },
            { name: 'modifiers', severity: 'info', description: 'Detect missing readonly, const, as const, satisfies modifiers' },
            { name: 'type-guards', severity: 'info', description: 'Detect runtime checks that should be type predicates' },
          ],
          totalRules: 5,
          metadata: { timestamp: new Date().toISOString(), version: '2.0.0' },
        };
        break;
      }

      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }

    return {
      content: [{ type: 'text', text: JSON.stringify({ success: true, ...result as Record<string, unknown> }, null, 2) }],
    };
  } catch (error) {
    return {
      content: [{ type: 'text', text: JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error', tool: name }, null, 2) }],
      isError: true,
    };
  }
});

server.onerror = (error) => console.error('[TypeScript Enforcer Error]', error);

process.on('SIGINT', async () => {
  await server.close();
  process.exit(0);
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.error('typescript-enforcer MCP server v2.0.0 running on stdio');
