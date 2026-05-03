#!/usr/bin/env node
import { McpServerBase } from '../../_shared/index.js';
import type { ToolResult } from '../../_shared/index.js';
import * as fs from 'fs';
import * as path from 'path';
import { readDesignFile, getPdfPageCount } from './fileReader.js';
import { getUICatalog, formatCatalogForPrompt } from './uiCatalog.js';

class IXDGeneratorServer extends McpServerBase {
  constructor() {
    super({ name: 'ixd-generator', version: '1.0.0' });
    process.on('SIGINT', async () => { await this.server.close(); process.exit(0); });
  }

  protected registerTools(): void {
    // ── Tool 1: Read design file (PDF page or image) → returns image to Claude/Cline for vision ──
    this.addTool(
      'read_design_file',
      'Read a PDF page or image file and return it as an image for Claude/Cline to analyze visually. Use this first, then describe what you see and generate layout code.',
      {
        type: 'object',
        properties: {
          file_path: { type: 'string', description: 'Absolute path to the PDF or image file' },
          page: { type: 'number', description: 'Page number to read (PDF only, 1-based). Defaults to 1.', default: 1 },
        },
        required: ['file_path'],
      },
      this.handleReadDesignFile.bind(this)
    );

    // ── Tool 2: Get @repo/ui component catalog ──
    this.addTool(
      'get_ui_catalog',
      'Scan a @repo/ui (or any shared-ui) components directory and return a full catalog of available components with their props. Use this to know which components are available before generating layout code.',
      {
        type: 'object',
        properties: {
          components_dir: {
            type: 'string',
            description: 'Absolute path to the components directory (e.g. /path/to/packages/ui/components)',
          },
          package_name: {
            type: 'string',
            description: 'The npm package name to use in import statements (e.g. @repo/ui)',
            default: '@repo/ui',
          },
        },
        required: ['components_dir'],
      },
      this.handleGetUICatalog.bind(this)
    );

    // ── Tool 3: Write generated layout to a file ──
    this.addTool(
      'write_layout',
      'Write the AI-generated React layout code to a file in the target app. Creates parent directories if needed.',
      {
        type: 'object',
        properties: {
          output_path: { type: 'string', description: 'Absolute path where the .tsx file should be written' },
          code: { type: 'string', description: 'The React TSX layout code to write' },
          overwrite: { type: 'boolean', description: 'Overwrite if file exists (default: false)', default: false },
        },
        required: ['output_path', 'code'],
      },
      this.handleWriteLayout.bind(this)
    );

    // ── Tool 4: List PDF pages ──
    this.addTool(
      'list_pdf_pages',
      'Get the total number of pages in a PDF file.',
      {
        type: 'object',
        properties: {
          file_path: { type: 'string', description: 'Absolute path to the PDF file' },
        },
        required: ['file_path'],
      },
      this.handleListPdfPages.bind(this)
    );
  }

  private async handleReadDesignFile(args: unknown): Promise<ToolResult> {
    const { file_path, page = 1 } = args as { file_path: string; page?: number };

    try {
      const result = await readDesignFile(file_path, page);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              file: file_path,
              page: result.page,
              totalPages: result.totalPages,
              width: result.width,
              height: result.height,
              source: result.source,
              instruction: 'Image is included below. Analyze the layout, identify UI patterns, then call get_ui_catalog and generate React code using available components.',
            }, null, 2),
          },
          {
            type: 'image',
            data: result.base64,
            mimeType: result.mimeType,
          },
        ],
      };
    } catch (error) {
      return this.error(error);
    }
  }

  private async handleGetUICatalog(args: unknown): Promise<ToolResult> {
    const { components_dir, package_name = '@repo/ui' } = args as {
      components_dir: string;
      package_name?: string;
    };

    try {
      const catalog = getUICatalog(components_dir, package_name);
      const formatted = formatCatalogForPrompt(catalog);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              totalComponents: catalog.totalCount,
              catalog: formatted,
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      return this.error(error);
    }
  }

  private async handleWriteLayout(args: unknown): Promise<ToolResult> {
    const { output_path, code, overwrite = false } = args as {
      output_path: string;
      code: string;
      overwrite?: boolean;
    };

    try {
      if (!output_path.endsWith('.tsx') && !output_path.endsWith('.ts') && !output_path.endsWith('.jsx')) {
        throw new Error('output_path must end with .tsx, .jsx, or .ts');
      }

      if (fs.existsSync(output_path) && !overwrite) {
        throw new Error(`File already exists: ${output_path}. Set overwrite: true to replace it.`);
      }

      const dir = path.dirname(output_path);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      fs.writeFileSync(output_path, code, 'utf-8');

      return this.success({
        output_path,
        bytes: Buffer.byteLength(code, 'utf-8'),
        message: `Layout written to ${output_path}`,
      });
    } catch (error) {
      return this.error(error);
    }
  }

  private async handleListPdfPages(args: unknown): Promise<ToolResult> {
    const { file_path } = args as { file_path: string };

    try {
      const totalPages = await getPdfPageCount(file_path);
      return this.success({ file: file_path, totalPages });
    } catch (error) {
      return this.error(error);
    }
  }
}

new IXDGeneratorServer().run().catch(console.error);
