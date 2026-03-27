#!/usr/bin/env node
// ============================================================================
// TYPESCRIPT ENFORCER MCP SERVER
// Enforce TypeScript best practices across the monorepo
// ============================================================================
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ErrorCode, ListToolsRequestSchema, McpError, } from '@modelcontextprotocol/sdk/types.js';
import * as fs from 'fs';
import * as path from 'path';
import { scanFile, scanDirectory } from './scanner.js';
// ============================================================================
// VALID RULES
// ============================================================================
const VALID_RULES = [
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
class TypeScriptEnforcerServer {
    server;
    constructor() {
        this.server = new Server({ name: 'typescript-enforcer', version: '1.0.0' }, { capabilities: { tools: {} } });
        this.setupToolHandlers();
        this.server.onerror = (error) => console.error('[TypeScript Enforcer Error]', error);
        process.on('SIGINT', async () => {
            await this.server.close();
            process.exit(0);
        });
    }
    setupToolHandlers() {
        this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools: [
                {
                    name: 'scan_file',
                    description: 'Analyze a single TypeScript/JavaScript file for type safety violations. Runs all rules by default (no-any, generics, utility-types, modifiers, type-guards). Returns violations with line numbers, severity, current code, suggested fix, and explanation of why it matters. Example: {path: "src/utils/helpers.ts"}. Use rules parameter to filter which rules to run.',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            path: {
                                type: 'string',
                                description: 'Path to the TypeScript/JavaScript file to analyze',
                            },
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
                    description: 'Recursively scan a directory for TypeScript violations. Returns per-file results sorted by worst score first, plus summary statistics and breakdown by rule. Example: {path: "tools/"} or {path: "packages/ui/src"}. Use maxFiles to limit scan size for large codebases.',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            path: {
                                type: 'string',
                                description: 'Directory path to scan recursively',
                            },
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
                            maxFiles: {
                                type: 'number',
                                description: 'Maximum number of files to scan (default: unlimited)',
                            },
                            ignore: {
                                type: 'array',
                                items: { type: 'string' },
                                description: 'Additional patterns to ignore (default ignores node_modules, build, dist, .next, .git)',
                            },
                        },
                        required: ['path'],
                    },
                },
                {
                    name: 'scan_specific_rule',
                    description: 'Run a single specific rule across a file or directory. Useful for targeted fixes. Example: {rule: "no-any", path: "tools/"}. Returns only violations for that rule.',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            rule: {
                                type: 'string',
                                enum: VALID_RULES,
                                description: `The rule to run. Options: ${VALID_RULES.join(', ')}`,
                            },
                            path: {
                                type: 'string',
                                description: 'File or directory path to scan',
                            },
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
                    description: 'List all available TypeScript enforcement rules with descriptions and what they check for. Returns rule names, descriptions, severity levels, and example violations.',
                    inputSchema: {
                        type: 'object',
                        properties: {},
                    },
                },
            ],
        }));
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            switch (request.params.name) {
                case 'scan_file':
                    return await this.handleScanFile(request.params.arguments);
                case 'scan_directory':
                    return await this.handleScanDirectory(request.params.arguments);
                case 'scan_specific_rule':
                    return await this.handleScanSpecificRule(request.params.arguments);
                case 'list_rules':
                    return await this.handleListRules();
                default:
                    throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
            }
        });
    }
    // ========================================================================
    // HANDLERS
    // ========================================================================
    async handleScanFile(args) {
        const startTime = Date.now();
        const targetPath = path.resolve(args.path);
        try {
            if (!fs.existsSync(targetPath)) {
                throw new Error(`File not found: ${targetPath}`);
            }
            if (fs.statSync(targetPath).isDirectory()) {
                throw new Error(`${targetPath} is a directory. Use scan_directory instead.`);
            }
            const options = {
                rules: args.rules,
                severity: args.severity || 'info',
            };
            const result = scanFile(targetPath, options);
            const duration = Date.now() - startTime;
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            success: true,
                            ...result,
                            metadata: {
                                timestamp: new Date().toISOString(),
                                duration,
                                version: '1.0.0',
                            },
                        }, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            success: false,
                            error: true,
                            code: error instanceof Error ? error.constructor.name : 'UNKNOWN_ERROR',
                            message: error instanceof Error ? error.message : String(error),
                            suggestion: 'Ensure the path points to a valid TypeScript/JavaScript file.',
                            timestamp: new Date().toISOString(),
                        }, null, 2),
                    },
                ],
                isError: true,
            };
        }
    }
    async handleScanDirectory(args) {
        const startTime = Date.now();
        const targetPath = path.resolve(args.path);
        try {
            if (!fs.existsSync(targetPath)) {
                throw new Error(`Directory not found: ${targetPath}`);
            }
            if (!fs.statSync(targetPath).isDirectory()) {
                throw new Error(`${targetPath} is a file. Use scan_file instead.`);
            }
            const options = {
                rules: args.rules,
                severity: args.severity || 'info',
                maxFiles: args.maxFiles,
                ignore: args.ignore,
            };
            const result = scanDirectory(targetPath, options);
            const duration = Date.now() - startTime;
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            success: true,
                            ...result,
                            metadata: {
                                timestamp: new Date().toISOString(),
                                duration,
                                version: '1.0.0',
                            },
                        }, null, 2),
                    },
                ],
            };
        }
        catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            success: false,
                            error: true,
                            code: error instanceof Error ? error.constructor.name : 'UNKNOWN_ERROR',
                            message: error instanceof Error ? error.message : String(error),
                            suggestion: 'Ensure the path points to a valid directory.',
                            timestamp: new Date().toISOString(),
                        }, null, 2),
                    },
                ],
                isError: true,
            };
        }
    }
    async handleScanSpecificRule(args) {
        const startTime = Date.now();
        const targetPath = path.resolve(args.path);
        const rule = args.rule;
        try {
            if (!VALID_RULES.includes(rule)) {
                throw new Error(`Invalid rule: ${rule}. Valid rules: ${VALID_RULES.join(', ')}`);
            }
            if (!fs.existsSync(targetPath)) {
                throw new Error(`Path not found: ${targetPath}`);
            }
            const options = {
                rules: [rule],
                severity: args.severity || 'info',
            };
            if (fs.statSync(targetPath).isDirectory()) {
                const result = scanDirectory(targetPath, options);
                const duration = Date.now() - startTime;
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                success: true,
                                rule,
                                ...result,
                                metadata: {
                                    timestamp: new Date().toISOString(),
                                    duration,
                                    version: '1.0.0',
                                },
                            }, null, 2),
                        },
                    ],
                };
            }
            else {
                const result = scanFile(targetPath, options);
                const duration = Date.now() - startTime;
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                success: true,
                                rule,
                                ...result,
                                metadata: {
                                    timestamp: new Date().toISOString(),
                                    duration,
                                    version: '1.0.0',
                                },
                            }, null, 2),
                        },
                    ],
                };
            }
        }
        catch (error) {
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            success: false,
                            error: true,
                            code: error instanceof Error ? error.constructor.name : 'UNKNOWN_ERROR',
                            message: error instanceof Error ? error.message : String(error),
                            timestamp: new Date().toISOString(),
                        }, null, 2),
                    },
                ],
                isError: true,
            };
        }
    }
    async handleListRules() {
        const rules = [
            {
                name: 'no-any',
                severity: 'error',
                description: "Detect all 'any' type usages and suggest proper types",
                checks: [
                    ': unknown type annotations',
                    'as any type assertions',
                    'unknown[] and unknown[]',
                    'Promise<unknown>',
                    'Record<string, unknown>',
                    'Generic <any>',
                ],
                example: {
                    current: 'function parse(args: unknown): unknown { ... }',
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
                    current: 'function clone(obj: Record<string, unknown>): unknown { ... }',
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
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({
                        success: true,
                        rules,
                        totalRules: rules.length,
                        note: 'discriminated-unions and branded-types rules are planned for future implementation.',
                        metadata: {
                            timestamp: new Date().toISOString(),
                            version: '1.0.0',
                        },
                    }, null, 2),
                },
            ],
        };
    }
    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error('TypeScript Enforcer MCP server v1.0 running on stdio');
    }
}
// ============================================================================
// ENTRY POINT
// ============================================================================
const server = new TypeScriptEnforcerServer();
server.run().catch(console.error);
//# sourceMappingURL=index.js.map