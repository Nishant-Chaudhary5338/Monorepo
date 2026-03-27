#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ErrorCode, ListToolsRequestSchema, McpError, } from '@modelcontextprotocol/sdk/types.js';
import * as fs from 'fs';
import * as path from 'path';
import { analyzeUI } from './orchestrator.js';
// ============================================================================
// MCP SERVER
// ============================================================================
class AnalyzeUIDesignServer {
    server;
    constructor() {
        this.server = new Server({ name: 'analyze-ui-design', version: '1.0.0' }, { capabilities: { tools: {} } });
        this.setupToolHandlers();
        this.server.onerror = (error) => console.error('[MCP Error]', error);
        process.on('SIGINT', async () => {
            await this.server.close();
            process.exit(0);
        });
    }
    setupToolHandlers() {
        this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools: [
                {
                    name: 'analyze_ui_design',
                    description: 'Analyze a UI design image or PDF and extract a Component Blueprint JSON. ' +
                        'Detects components (Input, Button, Heading, Text, etc.), layout structure, ' +
                        'design system hints, and testing hints. Supports PNG, JPG, JPEG, WebP, GIF, BMP, TIFF, and PDF.',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            file: {
                                type: 'string',
                                description: 'Path to the image or PDF file to analyze',
                            },
                            platform: {
                                type: 'string',
                                enum: ['web', 'mobile'],
                                description: 'Target platform (default: web)',
                                default: 'web',
                            },
                            confidenceThreshold: {
                                type: 'number',
                                description: 'Minimum confidence score for detections (0-1, default: 0.3)',
                                default: 0.3,
                            },
                            maxImageWidth: {
                                type: 'number',
                                description: 'Maximum image width for processing (default: 1920)',
                                default: 1920,
                            },
                            outputPath: {
                                type: 'string',
                                description: 'Optional path to save the JSON output to a file',
                            },
                        },
                        required: ['file'],
                    },
                },
                {
                    name: 'analyze_and_save',
                    description: 'Analyze a UI design and save the Component Blueprint to a JSON file. ' +
                        'Convenience wrapper that analyzes and writes output in one step.',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            file: {
                                type: 'string',
                                description: 'Path to the image or PDF file to analyze',
                            },
                            outputPath: {
                                type: 'string',
                                description: 'Path to save the JSON output',
                            },
                            platform: {
                                type: 'string',
                                enum: ['web', 'mobile'],
                                description: 'Target platform (default: web)',
                                default: 'web',
                            },
                        },
                        required: ['file', 'outputPath'],
                    },
                },
                {
                    name: 'get_supported_formats',
                    description: 'List all supported input file formats',
                    inputSchema: {
                        type: 'object',
                        properties: {},
                    },
                },
            ],
        }));
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            switch (request.params.name) {
                case 'analyze_ui_design':
                    return await this.handleAnalyze(request.params.arguments);
                case 'analyze_and_save':
                    return await this.handleAnalyzeAndSave(request.params.arguments);
                case 'get_supported_formats':
                    return await this.handleGetFormats();
                default:
                    throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
            }
        });
    }
    async handleAnalyze(args) {
        const { file, platform = 'web', confidenceThreshold = 0.3, maxImageWidth = 1920, outputPath } = args;
        try {
            this.validateFilePath(file);
            const blueprint = await analyzeUI(file, {
                platform,
                confidenceThreshold,
                maxImageWidth,
            });
            // Optionally save to file
            if (outputPath) {
                const dir = path.dirname(outputPath);
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }
                fs.writeFileSync(outputPath, JSON.stringify(blueprint, null, 2));
            }
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(blueprint, null, 2),
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
                            error: {
                                error: true,
                                code: error instanceof Error ? error.constructor.name : 'UNKNOWN_ERROR',
                                message: error instanceof Error ? error.message : String(error),
                                suggestion: 'Check input parameters and ensure all required values are provided.',
                                timestamp: new Date().toISOString(),
                            },
                            file,
                        }),
                    },
                ],
                isError: true,
            };
        }
    }
    async handleAnalyzeAndSave(args) {
        const { file, outputPath, platform = 'web' } = args;
        try {
            this.validateFilePath(file);
            this.validateOutputPath(outputPath);
            const blueprint = await analyzeUI(file, { platform });
            const dir = path.dirname(outputPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(outputPath, JSON.stringify(blueprint, null, 2));
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            success: true,
                            file,
                            outputPath,
                            componentCount: blueprint.components.length,
                            screenType: blueprint.meta.screenType,
                            confidence: blueprint.meta.confidence,
                            message: `Analysis complete. ${blueprint.components.length} components detected. Blueprint saved to ${outputPath}`,
                        }),
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
                            error: error instanceof Error ? error.message : 'Unknown error',
                            file,
                            outputPath,
                        }),
                    },
                ],
                isError: true,
            };
        }
    }
    async handleGetFormats() {
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({
                        supportedFormats: {
                            images: ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp', '.tiff'],
                            documents: ['.pdf'],
                        },
                        maxImageWidth: 1920,
                        defaultPlatform: 'web',
                        platforms: ['web', 'mobile'],
                    }),
                },
            ],
        };
    }
    validateFilePath(filePath) {
        if (!filePath) {
            throw new Error('File path is required');
        }
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }
        const ext = path.extname(filePath).toLowerCase();
        const supported = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp', '.tiff', '.pdf'];
        if (!supported.includes(ext)) {
            throw new Error(`Unsupported file format: ${ext}. Supported: ${supported.join(', ')}`);
        }
    }
    validateOutputPath(outputPath) {
        if (!outputPath) {
            throw new Error('Output path is required');
        }
        if (!outputPath.endsWith('.json')) {
            throw new Error('Output path must end with .json');
        }
    }
    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error('analyze-ui-design MCP server v1.0 running on stdio');
    }
}
// ============================================================================
// ENTRY POINT
// ============================================================================
const server = new AnalyzeUIDesignServer();
server.run().catch(console.error);
//# sourceMappingURL=index.js.map