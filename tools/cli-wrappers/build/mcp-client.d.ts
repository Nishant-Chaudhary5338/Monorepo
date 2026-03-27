#!/usr/bin/env node
export interface MCPResponse {
    success: boolean;
    [key: string]: unknown;
}
export declare class MCPClient {
    private serverPath;
    private requestId;
    constructor(serverPath: string);
    callTool(toolName: string, args: Record<string, unknown>): Promise<MCPResponse>;
}
export declare function createCLIWrapper(serverModuleName: string, toolName: string): void;
//# sourceMappingURL=mcp-client.d.ts.map