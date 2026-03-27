#!/usr/bin/env node
// ============================================================================
// MCP TOOL IMPROVISER - Main Server
// Deep analysis and improvement of MCP tools
// ============================================================================
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ErrorCode, ListToolsRequestSchema, McpError, } from '@modelcontextprotocol/sdk/types.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { analyzeTool, scanToolsDirectory } from './analyzer.js';
import { applyDiffs, rollbackFromBackup } from './generator.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// ============================================================================
// HELPER: Find tools directory
// ============================================================================
function findToolsDir() {
    // The improviser is at tools/mcp-tool-improviser/src/index.ts
    // Tools directory is at tools/
    return path.resolve(__dirname, '..', '..');
}
// ============================================================================
// MAIN SERVER
// ============================================================================
class McpToolImproviserServer {
    server;
    constructor() {
        this.server = new Server({ name: 'mcp-tool-improviser', version: '1.0.0' }, { capabilities: { tools: {} } });
        this.setupToolHandlers();
        this.server.onerror = (error) => console.error('[MCP Tool Improviser Error]', error);
        process.on('SIGINT', async () => {
            await this.server.close();
            process.exit(0);
        });
    }
    setupToolHandlers() {
        this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools: [
                {
                    name: 'analyze_tool',
                    description: 'Deep analysis of a single MCP tool across 7 dimensions (description quality, schema completeness, error handling, edge case coverage, response structure, code quality, contextual depth). Returns JSON report with scores, detailed issues, and proposed diffs with reasons explaining each improvement. Example: {path: "tools/component-factory/src/index.ts"}. Use this first to see what needs fixing before applying.',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            path: {
                                type: 'string',
                                description: 'Path to the MCP tool source file (typically src/index.ts) or the tool directory',
                            },
                        },
                        required: ['path'],
                    },
                },
                {
                    name: 'batch_analyze',
                    description: 'Analyze ALL MCP tools in the tools/ directory and return a comprehensive report. Shows worst/best performers, summary statistics, and all proposed diffs. Use this to get a full picture before deciding which tools to improve. Example: {} (auto-detects tools directory). Returns {totalTools, averageScore, toolResults[], summary, worstPerformers[], bestPerformers[]}.',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            toolsDir: {
                                type: 'string',
                                description: 'Path to tools directory (auto-detected if omitted)',
                            },
                        },
                    },
                },
                {
                    name: 'apply_improvements',
                    description: 'Apply approved diffs to improve MCP tools. Creates timestamped backups (.bak files) before modifying. Use analyze_tool or batch_analyze first to get the diffs, review them, then pass the diffs here. Example: {diffs: [...], dryRun: false}. Set dryRun: true to preview changes without writing. Returns {results[], with appliedChanges count and backupPath for each}.',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            diffs: {
                                type: 'array',
                                description: 'Array of ProposedDiff objects from analyze_tool/batch_analyze results',
                                items: {
                                    type: 'object',
                                    properties: {
                                        file: { type: 'string', description: 'File path to modify' },
                                        reason: { type: 'string', description: 'Why this change is being made' },
                                        improvementImpact: { type: 'string', description: 'Expected improvement impact' },
                                        changes: {
                                            type: 'array',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    type: { type: 'string', enum: ['replace', 'insert_after', 'insert_before', 'delete'] },
                                                    search: { type: 'string' },
                                                    insert: { type: 'string' },
                                                    description: { type: 'string' },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                            dryRun: {
                                type: 'boolean',
                                description: 'If true, validate changes without writing to files (default: false)',
                                default: false,
                            },
                        },
                        required: ['diffs'],
                    },
                },
                {
                    name: 'rollback',
                    description: 'Restore a file from its backup. Use this if an applied improvement caused issues. Example: {backupPath: "tools/component-factory/src/index.ts.bak.2026-03-22T01-08-43-000Z", originalPath: "tools/component-factory/src/index.ts"}. Returns {success, restored: boolean}.',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            backupPath: { type: 'string', description: 'Path to the .bak backup file' },
                            originalPath: { type: 'string', description: 'Path to restore to' },
                        },
                        required: ['backupPath', 'originalPath'],
                    },
                },
            ],
        }));
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            switch (request.params.name) {
                case 'analyze_tool':
                    return await this.handleAnalyzeTool(request.params.arguments);
                case 'batch_analyze':
                    return await this.handleBatchAnalyze(request.params.arguments);
                case 'apply_improvements':
                    return await this.handleApplyImprovements(request.params.arguments);
                case 'rollback':
                    return await this.handleRollback(request.params.arguments);
                default:
                    throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
            }
        });
    }
    // ========================================================================
    // HANDLERS
    // ========================================================================
    async handleAnalyzeTool(args) {
        const startTime = Date.now();
        let targetPath = path.resolve(args.path);
        try {
            // If directory, find src/index.ts
            if (fs.existsSync(targetPath) && fs.statSync(targetPath).isDirectory()) {
                const indexPath = path.join(targetPath, 'src', 'index.ts');
                if (fs.existsSync(indexPath)) {
                    targetPath = indexPath;
                }
                else {
                    throw new Error(`No src/index.ts found in ${targetPath}`);
                }
            }
            if (!fs.existsSync(targetPath)) {
                throw new Error(`File not found: ${targetPath}`);
            }
            const result = analyzeTool(targetPath);
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
                            path: args.path,
                            suggestion: 'Ensure the path points to a valid MCP tool source file or directory with src/index.ts.',
                            timestamp: new Date().toISOString(),
                        }, null, 2),
                    },
                ],
                isError: true,
            };
        }
    }
    async handleBatchAnalyze(args) {
        const startTime = Date.now();
        try {
            const toolsDir = args?.toolsDir ? path.resolve(args.toolsDir) : findToolsDir();
            const toolPaths = scanToolsDirectory(toolsDir);
            if (toolPaths.length === 0) {
                throw new Error(`No MCP tools found in ${toolsDir}. Each tool should have src/index.ts.`);
            }
            const toolResults = [];
            for (const toolPath of toolPaths) {
                try {
                    const result = analyzeTool(toolPath);
                    toolResults.push(result);
                }
                catch (err) {
                    // Skip tools that fail analysis
                    console.error(`Failed to analyze ${toolPath}:`, err);
                }
            }
            // Calculate summary
            const scores = toolResults.map((r) => r.overallScore);
            const averageScore = scores.length > 0 ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10 : 0;
            const allDiffs = toolResults.flatMap((r) => r.proposedDiffs);
            const summary = {
                criticalIssues: toolResults.reduce((sum, r) => sum + r.scores.descriptionQuality.issues.filter((i) => i.severity === 'critical').length, 0),
                highIssues: toolResults.reduce((sum, r) => {
                    let count = 0;
                    for (const dim of Object.values(r.scores)) {
                        count += dim.issues.filter((i) => i.severity === 'high').length;
                    }
                    return sum + count;
                }, 0),
                mediumIssues: toolResults.reduce((sum, r) => {
                    let count = 0;
                    for (const dim of Object.values(r.scores)) {
                        count += dim.issues.filter((i) => i.severity === 'medium').length;
                    }
                    return sum + count;
                }, 0),
                lowIssues: toolResults.reduce((sum, r) => {
                    const count = 0;
                    for (const dim of Object.values(r.scores)) {
                        count += dim.issues.filter((i) => i.severity === 'low').length;
                    }
                    return sum + count;
                }, 0),
                totalDiffs: allDiffs.length,
            };
            const sorted = [...toolResults].sort((a, b) => a.overallScore - b.overallScore);
            const batchResult = {
                timestamp: new Date().toISOString(),
                totalTools: toolResults.length,
                averageScore,
                toolResults,
                summary,
                worstPerformers: sorted.slice(0, 5).map((r) => ({ tool: r.tool, score: r.overallScore })),
                bestPerformers: sorted.slice(-5).reverse().map((r) => ({ tool: r.tool, score: r.overallScore })),
            };
            const duration = Date.now() - startTime;
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            success: true,
                            ...batchResult,
                            metadata: {
                                timestamp: new Date().toISOString(),
                                duration,
                                version: '1.0.0',
                                toolsDirectory: toolsDir,
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
                            suggestion: 'Ensure the tools directory exists and contains MCP tools with src/index.ts files.',
                            timestamp: new Date().toISOString(),
                        }, null, 2),
                    },
                ],
                isError: true,
            };
        }
    }
    async handleApplyImprovements(args) {
        const startTime = Date.now();
        try {
            const diffs = args.diffs;
            const dryRun = args.dryRun || false;
            if (!diffs || !Array.isArray(diffs) || diffs.length === 0) {
                throw new Error('No diffs provided. Run analyze_tool or batch_analyze first to get proposed diffs.');
            }
            if (dryRun) {
                // Validate changes without applying
                const validation = diffs.map((diff) => {
                    const issues = [];
                    for (const change of diff.changes) {
                        if (change.type === 'replace' && change.search) {
                            if (!fs.existsSync(diff.file)) {
                                issues.push(`File not found: ${diff.file}`);
                            }
                            else {
                                const source = fs.readFileSync(diff.file, 'utf-8');
                                if (!source.includes(change.search)) {
                                    issues.push(`Search string not found in ${diff.file}: "${change.search.slice(0, 80)}..."`);
                                }
                            }
                        }
                    }
                    return { file: diff.file, valid: issues.length === 0, issues };
                });
                const duration = Date.now() - startTime;
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                success: true,
                                dryRun: true,
                                validation,
                                totalChanges: diffs.reduce((sum, d) => sum + d.changes.length, 0),
                                validFiles: validation.filter((v) => v.valid).length,
                                invalidFiles: validation.filter((v) => !v.valid).length,
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
            // Apply changes
            const results = applyDiffs(diffs);
            const duration = Date.now() - startTime;
            const successCount = results.filter((r) => r.success).length;
            const failCount = results.filter((r) => !r.success).length;
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            success: failCount === 0,
                            results,
                            summary: {
                                totalFiles: results.length,
                                succeeded: successCount,
                                failed: failCount,
                                totalChangesApplied: results.reduce((sum, r) => sum + r.appliedChanges, 0),
                            },
                            backupPaths: results.filter((r) => r.backupPath).map((r) => ({ file: r.file, backup: r.backupPath })),
                            rollbackNote: 'To undo changes, use the rollback tool with the backup path.',
                            metadata: {
                                timestamp: new Date().toISOString(),
                                duration,
                                version: '1.0.0',
                            },
                        }, null, 2),
                    },
                ],
                isError: failCount > 0,
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
                            suggestion: 'Ensure diffs array is valid and contains ProposedDiff objects from analyze_tool.',
                            timestamp: new Date().toISOString(),
                        }, null, 2),
                    },
                ],
                isError: true,
            };
        }
    }
    async handleRollback(args) {
        try {
            const { backupPath, originalPath } = args;
            if (!backupPath || !originalPath) {
                throw new Error('Both backupPath and originalPath are required.');
            }
            const resolvedBackup = path.resolve(backupPath);
            const resolvedOriginal = path.resolve(originalPath);
            if (!fs.existsSync(resolvedBackup)) {
                throw new Error(`Backup file not found: ${resolvedBackup}`);
            }
            const success = rollbackFromBackup(resolvedBackup, resolvedOriginal);
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            success,
                            restored: success,
                            backupPath: resolvedBackup,
                            originalPath: resolvedOriginal,
                            message: success
                                ? `Successfully restored ${resolvedOriginal} from backup.`
                                : `Failed to restore from backup.`,
                            timestamp: new Date().toISOString(),
                        }, null, 2),
                    },
                ],
                isError: !success,
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
                            timestamp: new Date().toISOString(),
                        }, null, 2),
                    },
                ],
                isError: true,
            };
        }
    }
    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error('MCP Tool Improviser v1.0 running on stdio');
    }
}
// ============================================================================
// ENTRY POINT
// ============================================================================
const server = new McpToolImproviserServer();
server.run().catch(console.error);
//# sourceMappingURL=index.js.map