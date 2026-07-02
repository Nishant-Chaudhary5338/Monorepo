// ============================================================================
// MCP SERVER BASE - Abstract base class for all MCP servers
// ============================================================================
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ErrorCode, ListToolsRequestSchema, McpError, } from '@modelcontextprotocol/sdk/types.js';
import { ToolRegistry } from './ToolRegistry.js';
/**
 * Abstract base class for MCP servers.
 * Eliminates boilerplate by handling:
 * - Server setup and configuration
 * - Tool registration
 * - Request handlers (ListTools, CallTool)
 * - Error handling
 * - SIGINT cleanup
 *
 * @example
 * ```typescript
 * class MyToolServer extends McpServerBase {
 *   constructor() {
 *     super({ name: 'my-tool', version: '1.0.0' });
 *   }
 *
 *   protected registerTools(): void {
 *     this.addTool('my_action', 'Does something', { ... }, this.handleMyAction.bind(this));
 *   }
 *
 *   private async handleMyAction(args: unknown): Promise<ToolResult> {
 *     // Tool-specific logic
 *     return this.success({ result: 'done' });
 *   }
 * }
 *
 * new MyToolServer().run();
 * ```
 */
export class McpServerBase {
    server;
    registry;
    config;
    constructor(config) {
        this.config = config;
        this.registry = new ToolRegistry();
        this.server = new Server({ name: config.name, version: config.version }, { capabilities: { tools: {} } });
        this.setupHandlers();
        this.setupErrorHandlers();
        // Allow subclasses to register their tools
        this.registerTools();
    }
    /**
     * Register a tool with the server
     */
    addTool(name, description, inputSchema, handler) {
        this.registry.register(name, description, inputSchema, handler);
    }
    /**
     * Set up ListTools and CallTool request handlers
     */
    setupHandlers() {
        // ListTools handler
        this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools: this.registry.getAllDefinitions(),
        }));
        // CallTool handler
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            const handler = this.registry.getHandler(name);
            if (!handler) {
                throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
            }
            try {
                return await handler(args);
            }
            catch (error) {
                if (error instanceof McpError) {
                    throw error;
                }
                const message = error instanceof Error ? error.message : String(error);
                throw new McpError(ErrorCode.InternalError, `Tool execution failed: ${message}`);
            }
        });
    }
    /**
     * Set up error handlers
     */
    setupErrorHandlers() {
        this.server.onerror = (error) => {
            console.error(`[${this.config.name}] MCP Error:`, error);
        };
        process.on('SIGINT', async () => {
            await this.shutdown();
        });
    }
    /**
     * Create a success response
     */
    success(data) {
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({ success: true, ...data }, null, 2),
                },
            ],
        };
    }
    /**
     * Create an error response
     */
    error(error) {
        const errorObj = this.formatError(error);
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({ success: false, error: errorObj }, null, 2),
                },
            ],
            isError: true,
        };
    }
    /**
     * Format an error for the response
     */
    formatError(error) {
        if (error instanceof McpError) {
            return {
                code: String(error.code),
                message: error.message,
                timestamp: new Date().toISOString(),
            };
        }
        if (error instanceof Error) {
            return {
                code: error.constructor.name || 'Error',
                message: error.message,
                suggestion: this.getSuggestion(error),
                timestamp: new Date().toISOString(),
            };
        }
        return {
            code: 'UNKNOWN_ERROR',
            message: String(error),
            timestamp: new Date().toISOString(),
        };
    }
    /**
     * Get helpful suggestions for common errors
     */
    getSuggestion(error) {
        const msg = error.message.toLowerCase();
        if (msg.includes('enoent') || msg.includes('no such file')) {
            return 'Ensure the file or directory exists and the path is correct.';
        }
        if (msg.includes('eacces') || msg.includes('permission denied')) {
            return 'Check file permissions or run with appropriate privileges.';
        }
        if (msg.includes('eexist') || msg.includes('already exists')) {
            return 'The resource already exists. Use a different name or delete the existing one.';
        }
        return undefined;
    }
    /**
     * Start the server
     */
    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error(`${this.config.name} MCP server v${this.config.version} running on stdio`);
    }
    /**
     * Gracefully shutdown the server
     */
    async shutdown() {
        await this.server.close();
        process.exit(0);
    }
}
//# sourceMappingURL=McpServerBase.js.map