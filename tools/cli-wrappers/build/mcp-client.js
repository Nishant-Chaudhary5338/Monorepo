#!/usr/bin/env node
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import { existsSync } from 'fs';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
/**
 * Find the monorepo root by looking for pnpm-workspace.yaml
 */
function findMonorepoRoot(startDir) {
    let current = startDir;
    while (current !== '/' && current !== '.') {
        if (existsSync(join(current, 'pnpm-workspace.yaml'))) {
            return current;
        }
        current = dirname(current);
    }
    // Fallback: assume we're 3 levels deep (packages/ui -> root)
    return resolve(startDir, '..', '..');
}
export class MCPClient {
    serverPath;
    requestId = 1;
    constructor(serverPath) {
        this.serverPath = serverPath;
    }
    async callTool(toolName, args) {
        return new Promise((resolve, reject) => {
            console.error('[MCP DEBUG] Spawning MCP server:', this.serverPath);
            const childProcess = spawn('node', [this.serverPath], {
                stdio: ['pipe', 'pipe', 'pipe'],
            });
            let stdoutData = '';
            let stderrData = '';
            let responseReceived = false;
            let initialized = false;
            // Handle stdout data
            childProcess.stdout?.on('data', (data) => {
                const chunk = data.toString();
                console.error('[MCP DEBUG] stdout chunk:', chunk);
                stdoutData += chunk;
                // Try to parse JSON-RPC response
                const lines = stdoutData.split('\n');
                for (const line of lines) {
                    if (line.trim() && line.includes('"jsonrpc"')) {
                        try {
                            const response = JSON.parse(line);
                            console.error('[MCP DEBUG] Parsed response:', response);
                            // Handle initialize response - send initialized notification
                            if (response.id === 1 && response.result && !initialized) {
                                console.error('[MCP DEBUG] Received initialize response, sending initialized notification');
                                initialized = true;
                                // Send initialized notification (required by MCP protocol)
                                const initializedNotification = {
                                    jsonrpc: '2.0',
                                    method: 'initialized',
                                    params: {},
                                };
                                childProcess.stdin?.write(JSON.stringify(initializedNotification) + '\n');
                                // Now send the tool call request
                                console.error('[MCP DEBUG] Sending tool call request:', toolName, args);
                                setTimeout(() => {
                                    const toolRequest = {
                                        jsonrpc: '2.0',
                                        id: this.requestId,
                                        method: 'tools/call',
                                        params: {
                                            name: toolName,
                                            arguments: args,
                                        },
                                    };
                                    childProcess.stdin?.write(JSON.stringify(toolRequest) + '\n');
                                }, 50);
                                continue;
                            }
                            // Handle tool call response
                            if (response.id === this.requestId && response.result) {
                                console.error('[MCP DEBUG] Received tool call response');
                                responseReceived = true;
                                const content = response.result.content?.[0]?.text;
                                if (content) {
                                    try {
                                        const result = JSON.parse(content);
                                        resolve(result);
                                    }
                                    catch {
                                        resolve({ success: true, output: content });
                                    }
                                }
                                else {
                                    resolve({ success: true, ...response.result });
                                }
                                childProcess.kill();
                                return;
                            }
                            else if (response.error) {
                                console.error('[MCP DEBUG] Received error:', response.error);
                                reject(new Error(response.error.message || 'MCP error'));
                                childProcess.kill();
                                return;
                            }
                        }
                        catch (e) {
                            // Not valid JSON, continue
                        }
                    }
                }
            });
            // Handle stderr (MCP servers log to stderr)
            childProcess.stderr?.on('data', (data) => {
                stderrData += data.toString();
            });
            // Handle process exit
            childProcess.on('close', (code) => {
                if (!responseReceived) {
                    if (code !== 0) {
                        reject(new Error(`Process exited with code ${code}: ${stderrData}`));
                    }
                    else {
                        reject(new Error('No response received from MCP server'));
                    }
                }
            });
            // Handle errors
            childProcess.on('error', (error) => {
                reject(error);
            });
            // Send MCP initialize request
            const initRequest = {
                jsonrpc: '2.0',
                id: this.requestId++,
                method: 'initialize',
                params: {
                    protocolVersion: '2024-11-05',
                    capabilities: {},
                    clientInfo: {
                        name: 'cli-wrapper',
                        version: '1.0.0',
                    },
                },
            };
            childProcess.stdin?.write(JSON.stringify(initRequest) + '\n');
            // Set timeout (120 seconds for complex operations)
            setTimeout(() => {
                if (!responseReceived) {
                    childProcess.kill();
                    reject(new Error('Timeout waiting for MCP server response'));
                }
            }, 120000);
        });
    }
}
export function createCLIWrapper(serverModuleName, toolName) {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.error(`Usage: ${serverModuleName} <path>`);
        console.error(`Example: ${serverModuleName} packages/ui/components/Button`);
        process.exit(1);
    }
    const componentPath = args[0];
    // Resolve componentPath to absolute path relative to monorepo root
    const monorepoRoot = findMonorepoRoot(process.cwd());
    const absoluteComponentPath = resolve(monorepoRoot, componentPath);
    // Find the MCP server module
    const serverPath = join(__dirname, '..', '..', serverModuleName, 'build', 'index.js');
    const client = new MCPClient(serverPath);
    client.callTool(toolName, { path: absoluteComponentPath })
        .then((result) => {
        if (result.success) {
            console.log(JSON.stringify(result, null, 2));
            process.exit(0);
        }
        else {
            console.error(JSON.stringify(result, null, 2));
            process.exit(1);
        }
    })
        .catch((error) => {
        console.error('Error:', error.message);
        process.exit(1);
    });
}
//# sourceMappingURL=mcp-client.js.map