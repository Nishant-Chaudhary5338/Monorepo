#!/usr/bin/env node
import { McpServerBase } from '../../_shared/index.js';
import type { ToolResult } from '../../_shared/index.js';
import * as fs from 'fs';
import * as path from 'path';
import { analyzeUI } from './orchestrator.js';

// ============================================================================
// MCP SERVER
// ============================================================================

class AnalyzeUIDesignServer extends McpServerBase {

  constructor() {
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  protected registerTools(): void {
    

    
  }

  private async handleAnalyze(args: unknown) {
    const { file, platform = 'web', confidenceThreshold = 0.3, maxImageWidth = 1920, outputPath } = args;

    try {
      this.validateFilePath(file);

      const blueprint = await analyzeUI(file, {
        platform,
        confidenceThreshold,
        maxImageWidth,
      });

      // Optionally save to file
      if (outputPath) {
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(outputPath, JSON.stringify(blueprint, null, 2));
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(blueprint, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              error: {
          error: true,
          code: error instanceof Error ? error.constructor.name : 'UNKNOWN_ERROR',
          message: error instanceof Error ? error.message : String(error),
          suggestion: 'Check input parameters and ensure all required values are provided.',
          timestamp: new Date().toISOString(),
        },
              file,
            }),
          },
        ],
        isError: true,
      };
    }
  }

  private async handleAnalyzeAndSave(args: unknown) {
    const { file, outputPath, platform = 'web' } = args;

    try {
      this.validateFilePath(file);
      this.validateOutputPath(outputPath);

      const blueprint = await analyzeUI(file, { platform });

      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(outputPath, JSON.stringify(blueprint, null, 2));

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              file,
              outputPath,
              componentCount: blueprint.components.length,
              screenType: blueprint.meta.screenType,
              confidence: blueprint.meta.confidence,
              message: `Analysis complete. ${blueprint.components.length} components detected. Blueprint saved to ${outputPath}`,
            }),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              error: error instanceof Error ? error.message : 'Unknown error',
              file,
              outputPath,
            }),
          },
        ],
        isError: true,
      };
    }
  }

  private async handleGetFormats() {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            supportedFormats: {
              images: ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp', '.tiff'],
              documents: ['.pdf'],
            },
            maxImageWidth: 1920,
            defaultPlatform: 'web',
            platforms: ['web', 'mobile'],
          }),
        },
      ],
    };
  }

  private validateFilePath(filePath: string): void {
    if (!filePath) {
      throw new Error('File path is required');
    }
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    const ext = path.extname(filePath).toLowerCase();
    const supported = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp', '.tiff', '.pdf'] as const;
    if (!supported.includes(ext)) {
      throw new Error(
        `Unsupported file format: ${ext}. Supported: ${supported.join(', ')}`,
      );
    }
  }

  private validateOutputPath(outputPath: string): void {
    if (!outputPath) {
      throw new Error('Output path is required');
    }
    if (!outputPath.endsWith('.json')) {
      throw new Error('Output path must end with .json');
    }
  }
}

// ============================================================================
// ENTRY POINT
// ============================================================================

// ============================================================================
// ENTRY POINT
// ============================================================================

new AnalyzeUIDesignServer().run().catch(console.error);