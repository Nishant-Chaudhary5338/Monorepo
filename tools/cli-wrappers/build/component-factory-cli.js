#!/usr/bin/env node
import { MCPClient } from './mcp-client.js';
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
function parseArgs() {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.error('Usage: component-factory generate <ComponentName> [outputPath] [--no-tests] [--no-stories] [--no-types] [--no-docs]');
        console.error('       component-factory generate --name=<ComponentName> [--output=<path>] [--no-tests] [--no-stories] [--no-types] [--no-docs]');
        console.error('');
        console.error('Examples:');
        console.error('  component-factory generate Input packages/ui/components');
        console.error('  component-factory generate --name=Input --output=packages/ui/components');
        console.error('  component-factory generate Button --no-stories');
        console.error('  component-factory generate Card');
        process.exit(1);
    }
    // Check if first arg is 'generate' command
    let name;
    let outputPath = 'packages/ui/components';
    let includeTests = true;
    let includeStories = true;
    let includeTypes = true;
    let includeDocs = true;
    let startIndex = 0;
    // If first arg is 'generate', skip it
    if (args[0] === 'generate') {
        startIndex = 1;
    }
    // Parse all arguments
    for (let i = startIndex; i < args.length; i++) {
        const arg = args[i];
        // Skip $npm_config_* literal strings (pnpm doesn't expand them)
        if (arg.startsWith('$npm_config_')) {
            continue;
        }
        // Handle --name=value style
        if (arg.startsWith('--name=')) {
            name = arg.split('=')[1];
            continue;
        }
        // Handle --output=path style
        if (arg.startsWith('--output=')) {
            outputPath = arg.split('=')[1];
            continue;
        }
        // Handle flag options
        if (arg === '--no-tests') {
            includeTests = false;
            continue;
        }
        if (arg === '--no-stories') {
            includeStories = false;
            continue;
        }
        if (arg === '--no-types') {
            includeTypes = false;
            continue;
        }
        if (arg === '--no-docs') {
            includeDocs = false;
            continue;
        }
        // Handle positional arguments
        if (!arg.startsWith('--')) {
            if (!name) {
                name = arg;
            }
            else if (outputPath === 'packages/ui/components') {
                outputPath = arg;
            }
        }
    }
    if (!name) {
        console.error('Error: Component name is required');
        console.error('Usage: component-factory generate <ComponentName> [outputPath]');
        console.error('       component-factory generate --name=<ComponentName>');
        process.exit(1);
    }
    return {
        name,
        outputPath,
        includeTests,
        includeStories,
        includeTypes,
        includeDocs,
    };
}
async function main() {
    console.log('[DEBUG] Starting component-factory CLI wrapper');
    console.log('[DEBUG] process.argv:', process.argv);
    const options = parseArgs();
    console.log('[DEBUG] Parsed options:', options);
    // Resolve outputPath to absolute path relative to monorepo root
    const monorepoRoot = findMonorepoRoot(process.cwd());
    console.log('[DEBUG] Monorepo root:', monorepoRoot);
    const absoluteOutputPath = resolve(monorepoRoot, options.outputPath);
    console.log('[DEBUG] Absolute output path:', absoluteOutputPath);
    const serverPath = join(__dirname, '..', '..', 'component-factory', 'build', 'index.js');
    console.log('[DEBUG] Server path:', serverPath);
    const client = new MCPClient(serverPath);
    console.log('[DEBUG] MCPClient created, calling tool...');
    try {
        const result = await client.callTool('generate_component', {
            name: options.name,
            outputPath: absoluteOutputPath,
            includeTests: options.includeTests,
            includeStories: options.includeStories,
            includeTypes: options.includeTypes,
            includeDocs: options.includeDocs,
        });
        console.log('[DEBUG] Tool call completed');
        if (result.success) {
            console.log(JSON.stringify(result, null, 2));
            process.exit(0);
        }
        else {
            console.error(JSON.stringify(result, null, 2));
            process.exit(1);
        }
    }
    catch (error) {
        const err = error;
        console.error('[DEBUG] Error:', err.message);
        console.error('[DEBUG] Stack:', err.stack);
        process.exit(1);
    }
}
console.log('[DEBUG] About to call main()');
main();
//# sourceMappingURL=component-factory-cli.js.map