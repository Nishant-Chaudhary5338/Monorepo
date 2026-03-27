#!/usr/bin/env node
// ============================================================================
// CODE MODERNIZER MCP SERVER
// Modernize React codebases: TypeScript, types, API extraction, state optimization
// ============================================================================

import { McpServerBase } from '../../_shared/index.js';
import type { ToolResult } from '../../_shared/index.js';
import { convertToTypeScript } from './tools/01-convert-to-typescript.js';
import { addTypeDefinitions } from './tools/02-add-type-definitions.js';
import { extractApiLayer } from './tools/03-extract-api-layer.js';
import { stateOptimizer } from './tools/04-state-optimizer.js';
import { createRtkQueryServices } from './tools/05-create-rtk-query-services.js';
import { enforceDesignPatterns } from './tools/06-enforce-design-patterns.js';
import { enforceBoundaries } from './tools/07-enforce-boundaries.js';
import { optimizeComponents } from './tools/08-optimize-components.js';
import { codeModernizer } from './tools/09-code-modernizer.js';

// ============================================================================
// TOOL DEFINITIONS
// ============================================================================

const TOOLS = [
  {
    name: 'convert-to-typescript',
    description: 'Rename .js/.jsx files to .ts/.tsx, add basic type annotations, convert propTypes to TypeScript interfaces',
    inputSchema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Path to legacy app root directory' },
        includeProps: { type: 'boolean', description: 'Convert propTypes to TS interfaces (default: true)', default: true },
        dryRun: { type: 'boolean', description: 'If true, only analyze without making changes (default: false)', default: false },
        filePattern: { type: 'string', description: 'Glob pattern to filter files (e.g., "src/components/**/*")' },
      },
      required: ['path'],
    },
  },
  {
    name: 'add-type-definitions',
    description: 'Create interfaces/types for component props, API responses, and state management',
    inputSchema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Path to legacy app root directory' },
        outputDir: { type: 'string', description: 'Output directory for type files (default: "src/types")' },
        includeComponentProps: { type: 'boolean', description: 'Generate component prop interfaces (default: true)', default: true },
        includeApiTypes: { type: 'boolean', description: 'Generate API response types (default: true)', default: true },
        includeStateTypes: { type: 'boolean', description: 'Generate state management types (default: true)', default: true },
        dryRun: { type: 'boolean', description: 'If true, only analyze without making changes (default: false)', default: false },
      },
      required: ['path'],
    },
  },
  {
    name: 'extract-api-layer',
    description: 'Move scattered fetch/axios calls to centralized API services with typed responses',
    inputSchema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Path to legacy app root directory' },
        outputDir: { type: 'string', description: 'Output directory for API services (default: "src/services")' },
        httpClient: { type: 'string', enum: ['axios', 'fetch', 'auto'], description: 'HTTP client to use (default: "auto")', default: 'auto' },
        groupByDomain: { type: 'boolean', description: 'Group endpoints by domain (users, products, etc.) (default: true)', default: true },
        dryRun: { type: 'boolean', description: 'If true, only analyze without making changes (default: false)', default: false },
      },
      required: ['path'],
    },
  },
  {
    name: 'state-optimizer',
    description: 'Detect unnecessary global state, unnormalized state, derived state issues, and suggest RTK/local state',
    inputSchema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Path to legacy app root directory' },
        checkNormalized: { type: 'boolean', description: 'Check for unnormalized state (default: true)', default: true },
        checkDerivedState: { type: 'boolean', description: 'Check for derived state issues (default: true)', default: true },
        checkReselect: { type: 'boolean', description: 'Check for missing Reselect usage (default: true)', default: true },
        dryRun: { type: 'boolean', description: 'If true, only analyze without making changes (default: false)', default: false },
      },
      required: ['path'],
    },
  },
  {
    name: 'create-rtk-query-services',
    description: 'Convert fetch/axios API calls to RTK Query endpoints with automatic caching and typed hooks',
    inputSchema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Path to legacy app root directory' },
        outputDir: { type: 'string', description: 'Output directory for API slices (default: "src/store/api")' },
        baseUrl: { type: 'string', description: 'Base URL for API endpoints' },
        existingApiSlice: { type: 'string', description: 'Path to existing API slice to extend' },
        dryRun: { type: 'boolean', description: 'If true, only analyze without making changes (default: false)', default: false },
      },
      required: ['path'],
    },
  },
  {
    name: 'enforce-design-patterns',
    description: 'Apply container/presentational split, extract custom hooks, detect duplicated logic',
    inputSchema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Path to legacy app root directory' },
        splitContainerPresentational: { type: 'boolean', description: 'Split mixed components (default: true)', default: true },
        extractHooks: { type: 'boolean', description: 'Extract reusable logic to custom hooks (default: true)', default: true },
        dryRun: { type: 'boolean', description: 'If true, only analyze without making changes (default: false)', default: false },
      },
      required: ['path'],
    },
  },
  {
    name: 'enforce-boundaries',
    description: 'Prevent cross-feature imports, detect circular dependencies, generate barrel exports and ESLint rules',
    inputSchema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Path to legacy app root directory' },
        featuresDir: { type: 'string', description: 'Features directory path (default: "src/features")', default: 'src/features' },
        generateEslintRules: { type: 'boolean', description: 'Generate ESLint rules for boundaries (default: true)', default: true },
        generateBarrelExports: { type: 'boolean', description: 'Generate index.ts barrel exports (default: true)', default: true },
        dryRun: { type: 'boolean', description: 'If true, only analyze without making changes (default: false)', default: false },
      },
      required: ['path'],
    },
  },
  {
    name: 'optimize-components',
    description: 'Split large components (>300 lines), improve naming conventions, extract sub-components',
    inputSchema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Path to legacy app root directory' },
        maxLines: { type: 'number', description: 'Max lines for a component (default: 300)', default: 300 },
        splitLargeComponents: { type: 'boolean', description: 'Split components exceeding maxLines (default: true)', default: true },
        improveNaming: { type: 'boolean', description: 'Suggest better naming conventions (default: true)', default: true },
        dryRun: { type: 'boolean', description: 'If true, only analyze without making changes (default: false)', default: false },
      },
      required: ['path'],
    },
  },
  {
    name: 'code-modernizer',
    description: 'Aggregator: runs all modernization tools in optimal sequence with backup and rollback support',
    inputSchema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Path to legacy app root directory' },
        steps: {
          type: 'array',
          items: { type: 'string' },
          description: 'Specific steps to run (default: all). Options: convert-ts, add-types, extract-api, optimize-state, rtk-query, design-patterns, boundaries, optimize-components',
        },
        dryRun: { type: 'boolean', description: 'If true, only analyze without making changes (default: false)', default: false },
        skipBackup: { type: 'boolean', description: 'Skip backup creation (default: false)', default: false },
      },
      required: ['path'],
    },
  },
];

// ============================================================================
// SERVER
// ============================================================================

class CodeModernizerServer extends McpServerBase {

  constructor() {
    this.server = new Server(
      { name: 'code-modernizer', version: '1.0.0' },
      { capabilities: { tools: {} } }
    );

    this.setupHandlers();
    this.server.onerror = (error) => console.error('[Code Modernizer Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: TOOLS,
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      if (!args) throw new McpError(ErrorCode.InvalidParams, 'Missing arguments');

      const appPath = args.path as string;

      try {
        let result: unknown;

        switch (name) {
          case 'convert-to-typescript':
            result = await convertToTypeScript({
              path: appPath,
              includeProps: args.includeProps as boolean,
              dryRun: args.dryRun as boolean,
              filePattern: args.filePattern as string,
            });
            break;

          case 'add-type-definitions':
            result = await addTypeDefinitions({
              path: appPath,
              outputDir: args.outputDir as string,
              includeComponentProps: args.includeComponentProps as boolean,
              includeApiTypes: args.includeApiTypes as boolean,
              includeStateTypes: args.includeStateTypes as boolean,
              dryRun: args.dryRun as boolean,
            });
            break;

          case 'extract-api-layer':
            result = await extractApiLayer({
              path: appPath,
              outputDir: args.outputDir as string,
              httpClient: args.httpClient as 'axios' | 'fetch' | 'auto',
              groupByDomain: args.groupByDomain as boolean,
              dryRun: args.dryRun as boolean,
            });
            break;

          case 'state-optimizer':
            result = await stateOptimizer({
              path: appPath,
              checkNormalized: args.checkNormalized as boolean,
              checkDerivedState: args.checkDerivedState as boolean,
              checkReselect: args.checkReselect as boolean,
              dryRun: args.dryRun as boolean,
            });
            break;

          case 'create-rtk-query-services':
            result = await createRtkQueryServices({
              path: appPath,
              outputDir: args.outputDir as string,
              baseUrl: args.baseUrl as string,
              existingApiSlice: args.existingApiSlice as string,
              dryRun: args.dryRun as boolean,
            });
            break;

          case 'enforce-design-patterns':
            result = await enforceDesignPatterns({
              path: appPath,
              splitContainerPresentational: args.splitContainerPresentational as boolean,
              extractHooks: args.extractHooks as boolean,
              dryRun: args.dryRun as boolean,
            });
            break;

          case 'enforce-boundaries':
            result = await enforceBoundaries({
              path: appPath,
              featuresDir: args.featuresDir as string,
              generateEslintRules: args.generateEslintRules as boolean,
              generateBarrelExports: args.generateBarrelExports as boolean,
              dryRun: args.dryRun as boolean,
            });
            break;

          case 'optimize-components':
            result = await optimizeComponents({
              path: appPath,
              maxLines: args.maxLines as number,
              splitLargeComponents: args.splitLargeComponents as boolean,
              improveNaming: args.improveNaming as boolean,
              dryRun: args.dryRun as boolean,
            });
            break;

          case 'code-modernizer':
            result = await codeModernizer({
              path: appPath,
              steps: args.steps as string[],
              dryRun: args.dryRun as boolean,
              skipBackup: args.skipBackup as boolean,
            });
            break;

          default:
            throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
        }

        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  error: true,
                  message: error instanceof Error ? error.message : 'Unknown error',
                  tool: name,
                },
                null,
                2
              ),
            },
          ],
          isError: true,
        };
      }
    });
  }
}

// ============================================================================
// ENTRY POINT
// ============================================================================

new CodeModernizerServer().run().catch(console.error);