#!/usr/bin/env node
// ============================================================================
// LEGACY ANALYZER MCP SERVER
// Modular analysis tools for legacy React (CRA) codebases
// ============================================================================
import { Server } from '@modelcontextprotocol/sdk/server/index';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio';
import { CallToolRequestSchema, ErrorCode, ListToolsRequestSchema, McpError, } from '@modelcontextprotocol/sdk/types';
import { detectProjectTech } from './tools/01-detect-project-tech.js';
import { analyzeFolderStructure } from './tools/02-analyze-folder-structure.js';
import { analyzeComponents } from './tools/03-analyze-components.js';
import { analyzeStateManagement } from './tools/04-analyze-state-management.js';
import { analyzeApiLayer } from './tools/05-analyze-api-layer.js';
import { analyzeRouting } from './tools/06-analyze-routing.js';
import { analyzeStyling } from './tools/07-analyze-styling.js';
import { analyzeAssets } from './tools/08-analyze-assets.js';
import { detectAntiPatterns } from './tools/09-detect-anti-patterns.js';
import { detectDuplication } from './tools/10-detect-duplication.js';
import { analyzeDependenciesUsage } from './tools/11-analyze-dependencies-usage.js';
import { analyzeLegacyApp } from './tools/12-analyze-legacy-app.js';
import { detectFeatures } from './tools/13-detect-features.js';
import { classifyFiles } from './tools/14-classify-files.js';
import { detectSharedModules } from './tools/15-detect-shared-modules.js';
import { designTargetStructure } from './tools/16-design-target-structure.js';
import { mapFilesToTarget } from './tools/17-map-files-to-target.js';
import { detectBoundaryViolations } from './tools/18-detect-boundary-violations.js';
import { suggestModuleSplitting } from './tools/19-suggest-module-splitting.js';
import { namingStandardizer } from './tools/20-naming-standardizer.js';
import { generateRefactorPlan } from './tools/21-generate-refactor-plan.js';
import { refactorFolderStructure } from './tools/22-refactor-folder-structure.js';
// ============================================================================
// TOOL DEFINITIONS
// ============================================================================
const CONFIG_SCHEMA = {
    type: 'object',
    description: 'Optional configuration overrides',
    properties: {
        largeComponentLines: { type: 'number', description: 'Line count threshold for large components (default: 300)' },
        largeUtilLines: { type: 'number', description: 'Line count threshold for large utility files (default: 200)' },
        largeAssetImageKB: { type: 'number', description: 'Size threshold in KB for large images (default: 100)' },
        largeAssetVideoMB: { type: 'number', description: 'Size threshold in MB for large videos (default: 1)' },
        propDrillingDepth: { type: 'number', description: 'Depth threshold for prop drilling detection (default: 3)' },
        duplicationThreshold: { type: 'number', description: 'Similarity threshold 0-1 for duplication detection (default: 0.8)' },
    },
};
const TOOLS = [
    {
        name: 'detect-project-tech',
        description: 'Detect React version, JavaScript vs TypeScript, CRA config, and major dependencies',
        inputSchema: {
            type: 'object',
            properties: {
                path: { type: 'string', description: 'Path to legacy app root directory' },
                config: CONFIG_SCHEMA,
            },
            required: ['path'],
        },
    },
    {
        name: 'analyze-folder-structure',
        description: 'Analyze folder structure: flat vs feature-based, presence of standard folders, nesting depth',
        inputSchema: {
            type: 'object',
            properties: {
                path: { type: 'string', description: 'Path to legacy app root directory' },
                config: CONFIG_SCHEMA,
            },
            required: ['path'],
        },
    },
    {
        name: 'analyze-components',
        description: 'Scan all components: count, large components (>300 lines), complex components with multiple responsibilities',
        inputSchema: {
            type: 'object',
            properties: {
                path: { type: 'string', description: 'Path to legacy app root directory' },
                config: CONFIG_SCHEMA,
            },
            required: ['path'],
        },
    },
    {
        name: 'analyze-state-management',
        description: 'Detect Redux, Context API, local state patterns, normalized state, derived state, Reselect usage',
        inputSchema: {
            type: 'object',
            properties: {
                path: { type: 'string', description: 'Path to legacy app root directory' },
                config: CONFIG_SCHEMA,
            },
            required: ['path'],
        },
    },
    {
        name: 'analyze-api-layer',
        description: 'Detect axios/fetch usage, centralized vs scattered API calls, endpoint duplication',
        inputSchema: {
            type: 'object',
            properties: {
                path: { type: 'string', description: 'Path to legacy app root directory' },
                config: CONFIG_SCHEMA,
            },
            required: ['path'],
        },
    },
    {
        name: 'analyze-routing',
        description: 'Detect react-router usage, route structure (flat vs nested), lazy loading usage',
        inputSchema: {
            type: 'object',
            properties: {
                path: { type: 'string', description: 'Path to legacy app root directory' },
                config: CONFIG_SCHEMA,
            },
            required: ['path'],
        },
    },
    {
        name: 'analyze-styling',
        description: 'Detect CSS/SCSS/Tailwind/styled-components, inline styles, hardcoded colors, duplicate classes',
        inputSchema: {
            type: 'object',
            properties: {
                path: { type: 'string', description: 'Path to legacy app root directory' },
                config: CONFIG_SCHEMA,
            },
            required: ['path'],
        },
    },
    {
        name: 'analyze-assets',
        description: 'Detect large images/videos, assets inside src, unused assets',
        inputSchema: {
            type: 'object',
            properties: {
                path: { type: 'string', description: 'Path to legacy app root directory' },
                config: CONFIG_SCHEMA,
            },
            required: ['path'],
        },
    },
    {
        name: 'detect-anti-patterns',
        description: 'Detect prop drilling, tight coupling, duplicated logic, large utility files, god components',
        inputSchema: {
            type: 'object',
            properties: {
                path: { type: 'string', description: 'Path to legacy app root directory' },
                config: CONFIG_SCHEMA,
            },
            required: ['path'],
        },
    },
    {
        name: 'detect-duplication',
        description: 'Detect duplicate components, duplicate utility functions, similar file structures',
        inputSchema: {
            type: 'object',
            properties: {
                path: { type: 'string', description: 'Path to legacy app root directory' },
                config: CONFIG_SCHEMA,
            },
            required: ['path'],
        },
    },
    {
        name: 'analyze-dependencies-usage',
        description: 'Deep analysis of external libraries, internal imports, UI package usage, import anti-patterns',
        inputSchema: {
            type: 'object',
            properties: {
                path: { type: 'string', description: 'Path to legacy app root directory' },
                config: CONFIG_SCHEMA,
            },
            required: ['path'],
        },
    },
    {
        name: 'analyze-legacy-app',
        description: 'Complete analysis: calls all tools and produces unified report with health score and migration hints',
        inputSchema: {
            type: 'object',
            properties: {
                path: { type: 'string', description: 'Path to legacy app root directory' },
                config: CONFIG_SCHEMA,
            },
            required: ['path'],
        },
    },
    {
        name: 'detect-features',
        description: 'Identify logical features/domains in the app using file names, routing, folder grouping, and import clustering',
        inputSchema: {
            type: 'object',
            properties: {
                path: { type: 'string', description: 'Path to legacy app root directory' },
                config: CONFIG_SCHEMA,
            },
            required: ['path'],
        },
    },
    {
        name: 'classify-files',
        description: 'Classify each file into feature-specific, shared, utility, or config type',
        inputSchema: {
            type: 'object',
            properties: {
                path: { type: 'string', description: 'Path to legacy app root directory' },
                config: CONFIG_SCHEMA,
            },
            required: ['path'],
        },
    },
    {
        name: 'detect-shared-modules',
        description: 'Identify files used across multiple features (shared modules)',
        inputSchema: {
            type: 'object',
            properties: {
                path: { type: 'string', description: 'Path to legacy app root directory' },
                config: CONFIG_SCHEMA,
            },
            required: ['path'],
        },
    },
    {
        name: 'design-target-structure',
        description: 'Generate scalable folder structure suggestion based on feature-based architecture',
        inputSchema: {
            type: 'object',
            properties: {
                path: { type: 'string', description: 'Path to legacy app root directory' },
                config: CONFIG_SCHEMA,
            },
            required: ['path'],
        },
    },
    {
        name: 'map-files-to-target',
        description: 'Map existing files to new target structure',
        inputSchema: {
            type: 'object',
            properties: {
                path: { type: 'string', description: 'Path to legacy app root directory' },
                config: CONFIG_SCHEMA,
            },
            required: ['path'],
        },
    },
    {
        name: 'detect-boundary-violations',
        description: 'Detect cross-feature imports, deep relative imports, and tight coupling issues',
        inputSchema: {
            type: 'object',
            properties: {
                path: { type: 'string', description: 'Path to legacy app root directory' },
                config: CONFIG_SCHEMA,
            },
            required: ['path'],
        },
    },
    {
        name: 'suggest-module-splitting',
        description: 'Suggest splitting large or generic files into smaller modules',
        inputSchema: {
            type: 'object',
            properties: {
                path: { type: 'string', description: 'Path to legacy app root directory' },
                config: CONFIG_SCHEMA,
            },
            required: ['path'],
        },
    },
    {
        name: 'naming-standardizer',
        description: 'Suggest better file and folder naming conventions',
        inputSchema: {
            type: 'object',
            properties: {
                path: { type: 'string', description: 'Path to legacy app root directory' },
                config: CONFIG_SCHEMA,
            },
            required: ['path'],
        },
    },
    {
        name: 'generate-refactor-plan',
        description: 'Combine all analysis outputs into a single structured refactor plan',
        inputSchema: {
            type: 'object',
            properties: {
                path: { type: 'string', description: 'Path to legacy app root directory' },
                config: CONFIG_SCHEMA,
            },
            required: ['path'],
        },
    },
    {
        name: 'refactor-folder-structure',
        description: 'Aggregator: calls all refactoring suggestion tools and produces final structured plan',
        inputSchema: {
            type: 'object',
            properties: {
                path: { type: 'string', description: 'Path to legacy app root directory' },
                config: CONFIG_SCHEMA,
            },
            required: ['path'],
        },
    },
];
// ============================================================================
// SERVER
// ============================================================================
class LegacyAnalyzerServer {
    server;
    constructor() {
        this.server = new Server({ name: 'legacy-analyzer', version: '1.0.0' }, { capabilities: { tools: {} } });
        this.setupHandlers();
        this.server.onerror = (error) => console.error('[Legacy Analyzer Error]', error);
        process.on('SIGINT', async () => {
            await this.server.close();
            process.exit(0);
        });
    }
    setupHandlers() {
        this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools: TOOLS,
        }));
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            if (!args)
                throw new McpError(ErrorCode.InvalidParams, 'Missing arguments');
            const appPath = args.path;
            const config = (args.config || {});
            try {
                let result;
                switch (name) {
                    case 'detect-project-tech':
                        result = await detectProjectTech(appPath, config);
                        break;
                    case 'analyze-folder-structure':
                        result = await analyzeFolderStructure(appPath, config);
                        break;
                    case 'analyze-components':
                        result = await analyzeComponents(appPath, config);
                        break;
                    case 'analyze-state-management':
                        result = await analyzeStateManagement(appPath, config);
                        break;
                    case 'analyze-api-layer':
                        result = await analyzeApiLayer(appPath, config);
                        break;
                    case 'analyze-routing':
                        result = await analyzeRouting(appPath, config);
                        break;
                    case 'analyze-styling':
                        result = await analyzeStyling(appPath, config);
                        break;
                    case 'analyze-assets':
                        result = await analyzeAssets(appPath, config);
                        break;
                    case 'detect-anti-patterns':
                        result = await detectAntiPatterns(appPath, config);
                        break;
                    case 'detect-duplication':
                        result = await detectDuplication(appPath, config);
                        break;
                    case 'analyze-dependencies-usage':
                        result = await analyzeDependenciesUsage(appPath, config);
                        break;
                    case 'analyze-legacy-app':
                        result = await analyzeLegacyApp(appPath, config);
                        break;
                    case 'detect-features':
                        result = await detectFeatures(appPath, config);
                        break;
                    case 'classify-files':
                        result = await classifyFiles(appPath, config);
                        break;
                    case 'detect-shared-modules':
                        result = await detectSharedModules(appPath, config);
                        break;
                    case 'design-target-structure':
                        result = await designTargetStructure(appPath, config);
                        break;
                    case 'map-files-to-target':
                        result = await mapFilesToTarget(appPath, config);
                        break;
                    case 'detect-boundary-violations':
                        result = await detectBoundaryViolations(appPath, config);
                        break;
                    case 'suggest-module-splitting':
                        result = await suggestModuleSplitting(appPath, config);
                        break;
                    case 'naming-standardizer':
                        result = await namingStandardizer(appPath, config);
                        break;
                    case 'generate-refactor-plan':
                        result = await generateRefactorPlan(appPath, config);
                        break;
                    case 'refactor-folder-structure':
                        result = await refactorFolderStructure(appPath, config);
                        break;
                    default:
                        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
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
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error('Legacy Analyzer MCP server running on stdio');
    }
}
const server = new LegacyAnalyzerServer();
server.run().catch(console.error);
//# sourceMappingURL=index.js.map