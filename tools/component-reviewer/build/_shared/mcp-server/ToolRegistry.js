// ============================================================================
// TOOL REGISTRY - Tool registration and lookup helper
// ============================================================================
/**
 * Registry for managing MCP tools
 */
export class ToolRegistry {
    tools = new Map();
    /**
     * Register a new tool
     */
    register(name, description, inputSchema, handler) {
        if (this.tools.has(name)) {
            throw new Error(`Tool already registered: ${name}`);
        }
        this.tools.set(name, {
            definition: {
                name,
                description,
                inputSchema,
            },
            handler,
        });
    }
    /**
     * Get a tool definition by name
     */
    getDefinition(name) {
        return this.tools.get(name)?.definition;
    }
    /**
     * Get a tool handler by name
     */
    getHandler(name) {
        return this.tools.get(name)?.handler;
    }
    /**
     * Check if a tool is registered
     */
    has(name) {
        return this.tools.has(name);
    }
    /**
     * Get all tool definitions (for ListTools handler)
     */
    getAllDefinitions() {
        return Array.from(this.tools.values()).map(t => t.definition);
    }
    /**
     * Get all registered tool names
     */
    getToolNames() {
        return Array.from(this.tools.keys());
    }
    /**
     * Get the number of registered tools
     */
    get size() {
        return this.tools.size;
    }
    /**
     * Unregister a tool
     */
    unregister(name) {
        return this.tools.delete(name);
    }
    /**
     * Clear all registered tools
     */
    clear() {
        this.tools.clear();
    }
}
//# sourceMappingURL=ToolRegistry.js.map