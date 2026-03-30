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
function findMonorepoRoot(startDir: string): string {
  let current = startDir;
  while (current !== '/' && current !== '.') {
    if (existsSync(join(current, 'pnpm-workspace.yaml'))) {
      return current;
    }
    current = dirname(current);
  }
  return resolve(startDir, '..', '..');
}

interface CommandOptions {
  command: string;
  moduleName?: string;
  hookName?: string;
  utilityName?: string;
  outputPath?: string;
  packagePath?: string;
}

function printUsage(): void {
  console.error('Usage: utils-scaffolder <command> [options]');
  console.error('');
  console.error('Commands:');
  console.error('  generate_module <moduleName> [outputPath]      Generate a specific utility module');
  console.error('  generate_all_modules [outputPath]              Generate ALL 21 modules');
  console.error('  generate_hook <hookName> [outputPath]          Generate a React hook');
  console.error('  generate_utility <name> <module> [outputPath]  Generate a utility function');
  console.error('  validate_package [packagePath]                 Validate the utils package');
  console.error('');
  console.error('Examples:');
  console.error('  utils-scaffolder generate_module string');
  console.error('  utils-scaffolder generate_module api packages/utils/src');
  console.error('  utils-scaffolder generate_all_modules');
  console.error('  utils-scaffolder generate_hook useDebounce');
  console.error('  utils-scaffolder generate_utility formatDate date');
  console.error('  utils-scaffolder validate_package');
}

function parseArgs(): CommandOptions {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    printUsage();
    process.exit(1);
  }

  const command = args[0];
  const options: CommandOptions = { command };

  switch (command) {
    case 'generate_module':
      if (args.length < 2) {
        console.error('Error: Module name is required');
        console.error('Usage: utils-scaffolder generate_module <moduleName> [outputPath]');
        process.exit(1);
      }
      options.moduleName = args[1];
      if (args[2] && !args[2].startsWith('--')) {
        options.outputPath = args[2];
      }
      break;

    case 'generate_all_modules':
      if (args[1] && !args[1].startsWith('--')) {
        options.outputPath = args[1];
      }
      break;

    case 'generate_hook':
      if (args.length < 2) {
        console.error('Error: Hook name is required');
        console.error('Usage: utils-scaffolder generate_hook <hookName> [outputPath]');
        process.exit(1);
      }
      options.hookName = args[1];
      if (args[2] && !args[2].startsWith('--')) {
        options.outputPath = args[2];
      }
      break;

    case 'generate_utility':
      if (args.length < 3) {
        console.error('Error: Utility name and module name are required');
        console.error('Usage: utils-scaffolder generate_utility <utilityName> <moduleName> [outputPath]');
        process.exit(1);
      }
      options.utilityName = args[1];
      options.moduleName = args[2];
      if (args[3] && !args[3].startsWith('--')) {
        options.outputPath = args[3];
      }
      break;

    case 'validate_package':
      if (args[1] && !args[1].startsWith('--')) {
        options.packagePath = args[1];
      }
      break;

    default:
      console.error(`Error: Unknown command "${command}"`);
      printUsage();
      process.exit(1);
  }

  return options;
}

async function main() {
  const options = parseArgs();
  const monorepoRoot = findMonorepoRoot(process.cwd());

  const serverPath = join(__dirname, '..', '..', 'utils-scaffolder', 'build', 'utils-scaffolder', 'src', 'index.js');
  const client = new MCPClient(serverPath);

  try {
    let toolName: string;
    let toolArgs: Record<string, unknown> = {};

    switch (options.command) {
      case 'generate_module':
        toolName = 'generate_module';
        toolArgs = {
          moduleName: options.moduleName,
          ...(options.outputPath && { outputPath: resolve(monorepoRoot, options.outputPath) }),
        };
        break;

      case 'generate_all_modules':
        toolName = 'generate_all_modules';
        toolArgs = {
          ...(options.outputPath && { outputPath: resolve(monorepoRoot, options.outputPath) }),
        };
        break;

      case 'generate_hook':
        toolName = 'generate_hook';
        toolArgs = {
          hookName: options.hookName,
          ...(options.outputPath && { outputPath: resolve(monorepoRoot, options.outputPath) }),
        };
        break;

      case 'generate_utility':
        toolName = 'generate_utility';
        toolArgs = {
          utilityName: options.utilityName,
          moduleName: options.moduleName,
          ...(options.outputPath && { outputPath: resolve(monorepoRoot, options.outputPath) }),
        };
        break;

      case 'validate_package':
        toolName = 'validate_package';
        toolArgs = {
          ...(options.packagePath && { packagePath: resolve(monorepoRoot, options.packagePath) }),
        };
        break;

      default:
        throw new Error(`Unknown command: ${options.command}`);
    }

    const result = await client.callTool(toolName, toolArgs);

    if (result.success) {
      console.log(JSON.stringify(result, null, 2));
      process.exit(0);
    } else {
      console.error(JSON.stringify(result, null, 2));
      process.exit(1);
    }
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();