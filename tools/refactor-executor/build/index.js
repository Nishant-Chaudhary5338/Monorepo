#!/usr/bin/env node
"use strict";
// ============================================================================
// REFACTOR EXECUTOR MCP SERVER
// Safe execution of refactor plans on legacy React codebases
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const _01_validate_refactor_plan_js_1 = require("./tools/01-validate-refactor-plan.js");
const _02_create_target_structure_js_1 = require("./tools/02-create-target-structure.js");
const _03_move_files_js_1 = require("./tools/03-move-files.js");
const _04_update_imports_js_1 = require("./tools/04-update-imports.js");
const _05_rename_files_js_1 = require("./tools/05-rename-files.js");
const _06_split_modules_js_1 = require("./tools/06-split-modules.js");
const _07_create_index_files_js_1 = require("./tools/07-create-index-files.js");
const _08_validate_build_js_1 = require("./tools/08-validate-build.js");
const _09_rollback_on_failure_js_1 = require("./tools/09-rollback-on-failure.js");
const _10_apply_refactor_js_1 = require("./tools/10-apply-refactor.js");
// ============================================================================
// TOOL DEFINITIONS
// ============================================================================
const REFACTOR_PLAN_SCHEMA = {
    type: 'object',
    description: 'Refactor plan with moves, renames, and splits',
    properties: {
        moves: {
            type: 'array',
            description: 'Files to move',
            items: {
                type: 'object',
                properties: {
                    from: { type: 'string', description: 'Source path' },
                    to: { type: 'string', description: 'Destination path' },
                    reason: { type: 'string', description: 'Reason for move' },
                },
                required: ['from', 'to'],
            },
        },
        renames: {
            type: 'array',
            description: 'Files to rename',
            items: {
                type: 'object',
                properties: {
                    from: { type: 'string', description: 'Current path' },
                    to: { type: 'string', description: 'New path' },
                    reason: { type: 'string', description: 'Reason for rename' },
                },
                required: ['from', 'to'],
            },
        },
        splits: {
            type: 'array',
            description: 'Files to split into smaller modules',
            items: {
                type: 'object',
                properties: {
                    file: { type: 'string', description: 'File to split' },
                    suggestion: { type: 'string', description: 'Split suggestion' },
                    reason: { type: 'string', description: 'Reason for split' },
                    proposedFiles: {
                        type: 'array',
                        items: { type: 'string' },
                        description: 'Proposed split file paths',
                    },
                },
                required: ['file', 'proposedFiles'],
            },
        },
    },
};
const TOOLS = [
    {
        name: 'validate-refactor-plan',
        description: 'Validate refactor plan: ensure paths exist, no duplicate destinations, no conflicting moves',
        inputSchema: {
            type: 'object',
            properties: {
                path: { type: 'string', description: 'Path to legacy app root directory' },
                refactorPlan: REFACTOR_PLAN_SCHEMA,
            },
            required: ['path', 'refactorPlan'],
        },
    },
    {
        name: 'create-target-structure',
        description: 'Create target directory structure for refactoring',
        inputSchema: {
            type: 'object',
            properties: {
                path: { type: 'string', description: 'Path to legacy app root directory' },
                refactorPlan: REFACTOR_PLAN_SCHEMA,
                backupPath: { type: 'string', description: 'Optional backup directory path' },
            },
            required: ['path', 'refactorPlan'],
        },
    },
    {
        name: 'move-files',
        description: 'Move files according to refactor plan',
        inputSchema: {
            type: 'object',
            properties: {
                path: { type: 'string', description: 'Path to legacy app root directory' },
                refactorPlan: REFACTOR_PLAN_SCHEMA,
                backupPath: { type: 'string', description: 'Optional backup directory path' },
            },
            required: ['path', 'refactorPlan'],
        },
    },
    {
        name: 'update-imports',
        description: 'Update relative imports after file moves using AST (no regex)',
        inputSchema: {
            type: 'object',
            properties: {
                path: { type: 'string', description: 'Path to legacy app root directory' },
                refactorPlan: REFACTOR_PLAN_SCHEMA,
                movedFiles: {
                    type: 'object',
                    description: 'Optional mapping of old path to new path',
                    additionalProperties: { type: 'string' },
                },
            },
            required: ['path', 'refactorPlan'],
        },
    },
    {
        name: 'rename-files',
        description: 'Rename files according to naming standardization plan',
        inputSchema: {
            type: 'object',
            properties: {
                path: { type: 'string', description: 'Path to legacy app root directory' },
                refactorPlan: REFACTOR_PLAN_SCHEMA,
                backupPath: { type: 'string', description: 'Optional backup directory path' },
            },
            required: ['path', 'refactorPlan'],
        },
    },
    {
        name: 'split-modules',
        description: 'Split large utility files into smaller modules',
        inputSchema: {
            type: 'object',
            properties: {
                path: { type: 'string', description: 'Path to legacy app root directory' },
                refactorPlan: REFACTOR_PLAN_SCHEMA,
                backupPath: { type: 'string', description: 'Optional backup directory path' },
            },
            required: ['path', 'refactorPlan'],
        },
    },
    {
        name: 'create-index-files',
        description: 'Generate barrel export index.ts files for directories',
        inputSchema: {
            type: 'object',
            properties: {
                path: { type: 'string', description: 'Path to legacy app root directory' },
                refactorPlan: REFACTOR_PLAN_SCHEMA,
            },
            required: ['path', 'refactorPlan'],
        },
    },
    {
        name: 'validate-build',
        description: 'Run build command and detect errors',
        inputSchema: {
            type: 'object',
            properties: {
                path: { type: 'string', description: 'Path to legacy app root directory' },
                buildCommand: { type: 'string', description: 'Build command to run (default: npm run build)' },
            },
            required: ['path'],
        },
    },
    {
        name: 'rollback-on-failure',
        description: 'Revert all changes from backup',
        inputSchema: {
            type: 'object',
            properties: {
                path: { type: 'string', description: 'Path to legacy app root directory' },
                backupPath: { type: 'string', description: 'Backup directory path' },
            },
            required: ['path', 'backupPath'],
        },
    },
    {
        name: 'apply-refactor',
        description: 'Apply full refactor pipeline with automatic rollback on failure',
        inputSchema: {
            type: 'object',
            properties: {
                path: { type: 'string', description: 'Path to legacy app root directory' },
                refactorPlan: REFACTOR_PLAN_SCHEMA,
                dryRun: { type: 'boolean', description: 'If true, only validate without making changes' },
                buildCommand: { type: 'string', description: 'Build command to run (default: npm run build)' },
            },
            required: ['path', 'refactorPlan'],
        },
    },
];
// ============================================================================
// SERVER
// ============================================================================
class RefactorExecutorServer {
    server;
    constructor() {
        this.server = new index_js_1.Server({ name: 'refactor-executor', version: '1.0.0' }, { capabilities: { tools: {} } });
        this.setupHandlers();
        this.server.onerror = (error) => console.error('[Refactor Executor Error]', error);
        process.on('SIGINT', async () => {
            await this.server.close();
            process.exit(0);
        });
    }
    setupHandlers() {
        this.server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => ({
            tools: TOOLS,
        }));
        this.server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            if (!args)
                throw new types_js_1.McpError(types_js_1.ErrorCode.InvalidParams, 'Missing arguments');
            const appPath = args.path;
            const refactorPlan = args.refactorPlan;
            try {
                let result;
                switch (name) {
                    case 'validate-refactor-plan':
                        result = await (0, _01_validate_refactor_plan_js_1.validateRefactorPlan)({ path: appPath, refactorPlan: refactorPlan });
                        break;
                    case 'create-target-structure':
                        result = await (0, _02_create_target_structure_js_1.createTargetStructure)({
                            path: appPath,
                            refactorPlan: refactorPlan,
                            backupPath: args.backupPath,
                        });
                        break;
                    case 'move-files':
                        result = await (0, _03_move_files_js_1.moveFiles)({
                            path: appPath,
                            refactorPlan: refactorPlan,
                            backupPath: args.backupPath,
                        });
                        break;
                    case 'update-imports':
                        result = await (0, _04_update_imports_js_1.updateImports)({
                            path: appPath,
                            refactorPlan: refactorPlan,
                            movedFiles: args.movedFiles,
                        });
                        break;
                    case 'rename-files':
                        result = await (0, _05_rename_files_js_1.renameFiles)({
                            path: appPath,
                            refactorPlan: refactorPlan,
                            backupPath: args.backupPath,
                        });
                        break;
                    case 'split-modules':
                        result = await (0, _06_split_modules_js_1.splitModules)({
                            path: appPath,
                            refactorPlan: refactorPlan,
                            backupPath: args.backupPath,
                        });
                        break;
                    case 'create-index-files':
                        result = await (0, _07_create_index_files_js_1.createIndexFiles)({ path: appPath, refactorPlan: refactorPlan });
                        break;
                    case 'validate-build':
                        result = await (0, _08_validate_build_js_1.validateBuild)({
                            path: appPath,
                            buildCommand: args.buildCommand,
                        });
                        break;
                    case 'rollback-on-failure':
                        result = await (0, _09_rollback_on_failure_js_1.rollbackOnFailure)({
                            path: appPath,
                            backupPath: args.backupPath,
                        });
                        break;
                    case 'apply-refactor':
                        result = await (0, _10_apply_refactor_js_1.applyRefactor)({
                            path: appPath,
                            refactorPlan: refactorPlan,
                            dryRun: args.dryRun,
                            buildCommand: args.buildCommand,
                        });
                        break;
                    default:
                        throw new types_js_1.McpError(types_js_1.ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
                }
                return {
                    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                };
            }
            catch (error) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                error: true,
                                message: {
                                    error: true,
                                    code: error instanceof Error ? error.constructor.name : 'UNKNOWN_ERROR',
                                    message: error instanceof Error ? error.message : String(error),
                                    suggestion: 'Check input parameters and ensure all required values are provided.',
                                    timestamp: new Date().toISOString(),
                                },
                                tool: name,
                            }, null, 2),
                        },
                    ],
                    isError: true,
                };
            }
        });
    }
    async run() {
        const transport = new stdio_js_1.StdioServerTransport();
        await this.server.connect(transport);
        console.error('Refactor Executor MCP server running on stdio');
    }
}
const server = new RefactorExecutorServer();
server.run().catch(console.error);
//# sourceMappingURL=index.js.map