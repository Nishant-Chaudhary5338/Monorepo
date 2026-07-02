import type { ToolDefinition, ToolHandler } from '../types/mcp.types.js';
/**
 * Registry for managing MCP tools
 */
export declare class ToolRegistry {
    private tools;
    /**
     * Register a new tool
     */
    register(name: string, description: string, inputSchema: ToolDefinition['inputSchema'], handler: ToolHandler): void;
    /**
     * Get a tool definition by name
     */
    getDefinition(name: string): ToolDefinition | undefined;
    /**
     * Get a tool handler by name
     */
    getHandler(name: string): ToolHandler | undefined;
    /**
     * Check if a tool is registered
     */
    has(name: string): boolean;
    /**
     * Get all tool definitions (for ListTools handler)
     */
    getAllDefinitions(): ToolDefinition[];
    /**
     * Get all registered tool names
     */
    getToolNames(): string[];
    /**
     * Get the number of registered tools
     */
    get size(): number;
    /**
     * Unregister a tool
     */
    unregister(name: string): boolean;
    /**
     * Clear all registered tools
     */
    clear(): void;
}
//# sourceMappingURL=ToolRegistry.d.ts.map