#!/usr/bin/env node
import { McpServerBase } from '../../_shared/index.js';
import * as fs from 'fs';
import * as path from 'path';
import { analyzeUI } from './orchestrator.js';
// ============================================================================
// MCP SERVER
// ============================================================================
class AnalyzeUIDesignServer extends McpServerBase {
    constructor() {
        super({ name: 'analyze-ui-design', version: '1.0.0' });
        process.on('SIGINT', async () => {
            await this.server.close();
            process.exit(0);
        });
    }
    registerTools() {
        this.addTool('analyze', 'Analyze a UI design file (image or PDF) and extract components, layout, and design tokens', {
            type: 'object',
            properties: {
                file: { type: 'string', description: 'Path to the image or PDF file to analyze' },
                platform: { type: 'string', enum: ['web', 'mobile'], description: 'Target platform', default: 'web' },
                confidenceThreshold: { type: 'number', description: 'Minimum confidence threshold for detections', default: 0.3 },
                maxImageWidth: { type: 'number', description: 'Maximum image width for processing', default: 1920 },
                outputPath: { type: 'string', description: 'Optional path to save the analysis JSON' },
            },
            required: ['file'],
        }, this.handleAnalyze.bind(this));
        this.addTool('analyze_and_save', 'Analyze a UI design file and save the blueprint to a JSON file', {
            type: 'object',
            properties: {
                file: { type: 'string', description: 'Path to the image or PDF file to analyze' },
                outputPath: { type: 'string', description: 'Path to save the analysis JSON (must end with .json)' },
                platform: { type: 'string', enum: ['web', 'mobile'], description: 'Target platform', default: 'web' },
            },
            required: ['file', 'outputPath'],
        }, this.handleAnalyzeAndSave.bind(this));
        this.addTool('get_formats', 'Get supported file formats and configuration options', { type: 'object', properties: {} }, this.handleGetFormats.bind(this));
    }
    async handleAnalyze(args) {
        const { file, platform = 'web', confidenceThreshold = 0.3, maxImageWidth = 1920, outputPath } = args;
        try {
            this.validateFilePath(file);
            const blueprint = await analyzeUI(file, {
                platform,
                confidenceThreshold,
                maxImageWidth,
            });
            if (outputPath) {
                const dir = path.dirname(outputPath);
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }
                fs.writeFileSync(outputPath, JSON.stringify(blueprint, null, 2));
            }
            return this.success({
                blueprint,
                file,
                message: `Analysis complete. ${blueprint.components.length} components detected.`,
            });
        }
        catch (error) {
            return this.error(error);
        }
    }
    async handleAnalyzeAndSave(args) {
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
            return this.success({
                file,
                outputPath,
                componentCount: blueprint.components.length,
                screenType: blueprint.meta.screenType,
                confidence: blueprint.meta.confidence,
                message: `Analysis complete. ${blueprint.components.length} components detected. Blueprint saved to ${outputPath}`,
            });
        }
        catch (error) {
            return this.error(error);
        }
    }
    async handleGetFormats() {
        return this.success({
            supportedFormats: {
                images: ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp', '.tiff'],
                documents: ['.pdf'],
            },
            maxImageWidth: 1920,
            defaultPlatform: 'web',
            platforms: ['web', 'mobile'],
        });
    }
    validateFilePath(filePath) {
        if (!filePath) {
            throw new Error('File path is required');
        }
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }
        const ext = path.extname(filePath).toLowerCase();
        const supported = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp', '.tiff', '.pdf'];
        if (!supported.includes(ext)) {
            throw new Error(`Unsupported file format: ${ext}. Supported: ${supported.join(', ')}`);
        }
    }
    validateOutputPath(outputPath) {
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
new AnalyzeUIDesignServer().run().catch(console.error);
//# sourceMappingURL=index.js.map