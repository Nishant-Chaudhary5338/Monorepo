import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { ToolRegistry } from './ToolRegistry.js';
import type { ServerConfig, ToolDefinition, ToolHandler, ToolResult } from '../types/mcp.types.js';
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
export declare abstract class McpServerBase {
    protected server: Server;
    protected registry: ToolRegistry;
    protected config: ServerConfig;
    constructor(config: ServerConfig);
    /**
     * Subclasses must implement this to register their tools.
     * Use `this.addTool()` to register each tool.
     */
    protected abstract registerTools(): void;
    /**
     * Register a tool with the server
     */
    protected addTool(name: string, description: string, inputSchema: ToolDefinition['inputSchema'], handler: ToolHandler): void;
    /**
     * Set up ListTools and CallTool request handlers
     */
    private setupHandlers;
    /**
     * Set up error handlers
     */
    private setupErrorHandlers;
    /**
     * Create a success response
     */
    protected success<T extends Record<string, unknown>>(data: T): ToolResult;
    /**
     * Create an error response
     */
    protected error(error: unknown): ToolResult;
    /**
     * Format an error for the response
     */
    private formatError;
    /**
     * Get helpful suggestions for common errors
     */
    private getSuggestion;
    /**
     * Start the server
     */
    run(): Promise<void>;
    /**
     * Gracefully shutdown the server
     */
    shutdown(): Promise<void>;
}
//# sourceMappingURL=McpServerBase.d.ts.map