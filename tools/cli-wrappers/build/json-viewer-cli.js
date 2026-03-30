#!/usr/bin/env node
import { MCPClient } from './mcp-client.js';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import { existsSync, readFileSync } from 'fs';
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
    return resolve(startDir, '..', '..');
}
async function readStdin() {
    return new Promise((resolve) => {
        let data = '';
        if (process.stdin.isTTY) {
            resolve('');
            return;
        }
        process.stdin.setEncoding('utf-8');
        process.stdin.on('data', (chunk) => {
            data += chunk;
        });
        process.stdin.on('end', () => {
            resolve(data);
        });
        // Timeout if no data comes
        setTimeout(() => {
            if (!data)
                resolve('');
        }, 500);
    });
}
async function main() {
    const args = process.argv.slice(2);
    const serverPath = join(__dirname, '..', '..', 'json-viewer', 'build', 'json-viewer', 'src', 'index.js');
    // Check for --list flag
    if (args.includes('--list') || args.includes('-l')) {
        const client = new MCPClient(serverPath);
        const result = await client.callTool('list_responses', {});
        console.log(JSON.stringify(result, null, 2));
        process.exit(0);
    }
    // Try to read from stdin first (piped input)
    const stdinData = await readStdin();
    if (stdinData.trim()) {
        // Piped JSON input
        const label = args.find(a => !a.startsWith('-')) || 'piped-response';
        const client = new MCPClient(serverPath);
        const result = await client.callTool('view_json', {
            data: stdinData,
            label,
            open: true,
        });
        console.log(JSON.stringify(result, null, 2));
        process.exit(0);
    }
    // Check for file path argument
    const filePath = args.find(a => !a.startsWith('-'));
    if (filePath) {
        const monorepoRoot = findMonorepoRoot(process.cwd());
        const absolutePath = resolve(monorepoRoot, filePath);
        if (!existsSync(absolutePath)) {
            console.error(`File not found: ${absolutePath}`);
            process.exit(1);
        }
        const content = readFileSync(absolutePath, 'utf-8');
        const label = filePath.replace(/[^a-zA-Z0-9-_]/g, '-').slice(0, 50);
        const client = new MCPClient(serverPath);
        const result = await client.callTool('view_json', {
            data: content,
            label,
            open: true,
        });
        console.log(JSON.stringify(result, null, 2));
        process.exit(0);
    }
    // No input provided
    console.error('Usage:');
    console.error('  # Pipe JSON from another tool:');
    console.error('  typescript-enforcer scan_file packages/ui | json-viewer');
    console.error('');
    console.error('  # View a JSON file:');
    console.error('  json-viewer path/to/response.json');
    console.error('');
    console.error('  # List saved responses:');
    console.error('  json-viewer --list');
    process.exit(1);
}
main().catch((error) => {
    console.error('Error:', error.message);
    process.exit(1);
});
//# sourceMappingURL=json-viewer-cli.js.map