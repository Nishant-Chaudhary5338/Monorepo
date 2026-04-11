import { spawn, ChildProcess } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function findMonorepoRoot(startDir: string): string {
  let current = startDir;
  while (current !== '/' && current !== '.') {
    if (existsSync(join(current, 'pnpm-workspace.yaml'))) {
      return current;
    }
    current = dirname(current);
  }
  return startDir;
}

export interface MCPResponse {
  success: boolean;
  [key: string]: unknown;
}

export class MCPClient {
  private serverPath: string;
  private requestId: number = 1;

  constructor(serverPath: string) {
    this.serverPath = serverPath;
  }

  async callTool(toolName: string, args: Record<string, unknown>): Promise<MCPResponse> {
    return new Promise((resolve, reject) => {
      const childProcess: ChildProcess = spawn('node', [this.serverPath], {
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      let stdoutData = '';
      let responseReceived = false;
      let initialized = false;

      childProcess.stdout?.on('data', (data: Buffer) => {
        stdoutData += data.toString();
        const lines = stdoutData.split('\n');
        for (const line of lines) {
          if (line.trim() && line.includes('"jsonrpc"')) {
            try {
              const response = JSON.parse(line);

              if (response.id === 1 && response.result && !initialized) {
                initialized = true;
                childProcess.stdin?.write(
                  JSON.stringify({ jsonrpc: '2.0', method: 'initialized', params: {} }) + '\n'
                );
                setTimeout(() => {
                  childProcess.stdin?.write(
                    JSON.stringify({
                      jsonrpc: '2.0',
                      id: this.requestId,
                      method: 'tools/call',
                      params: { name: toolName, arguments: args },
                    }) + '\n'
                  );
                }, 50);
                continue;
              }

              if (response.id === this.requestId && response.result) {
                responseReceived = true;
                const content = response.result.content?.[0]?.text;
                if (content) {
                  try {
                    resolve(JSON.parse(content));
                  } catch {
                    resolve({ success: true, output: content });
                  }
                } else {
                  resolve({ success: true, ...response.result });
                }
                childProcess.kill();
                return;
              } else if (response.error) {
                reject(new Error(response.error.message || 'MCP error'));
                childProcess.kill();
                return;
              }
            } catch {
              // not valid JSON, continue
            }
          }
        }
      });

      childProcess.on('close', (code) => {
        if (!responseReceived) {
          reject(new Error(code !== 0 ? `Process exited with code ${code}` : 'No response from MCP server'));
        }
      });

      childProcess.on('error', reject);

      childProcess.stdin?.write(
        JSON.stringify({
          jsonrpc: '2.0',
          id: this.requestId++,
          method: 'initialize',
          params: {
            protocolVersion: '2024-11-05',
            capabilities: {},
            clientInfo: { name: 'mcp-demo-server', version: '1.0.0' },
          },
        }) + '\n'
      );

      setTimeout(() => {
        if (!responseReceived) {
          childProcess.kill();
          reject(new Error('Timeout waiting for MCP server response'));
        }
      }, 120000);
    });
  }
}

export function getServerPath(serverName: string): string {
  const monoRepoRoot = findMonorepoRoot(__dirname);
  return join(monoRepoRoot, 'tools', serverName, 'build', 'index.js');
}
