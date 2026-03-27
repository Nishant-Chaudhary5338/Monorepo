#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ErrorCode, ListToolsRequestSchema, McpError } from '@modelcontextprotocol/sdk/types.js';
import * as fs from 'fs';
import * as path from 'path';
// ============================================================================
// DESIGN TOKEN MAPPINGS
// ============================================================================
const COLOR_TOKENS = {
    '#ffffff': 'var(--color-white) or bg-white',
    '#fff': 'var(--color-white) or bg-white',
    '#000000': 'var(--color-black) or bg-black',
    '#000': 'var(--color-black) or bg-black',
    '#f5f5f5': 'var(--color-gray-50) or bg-gray-50',
    '#e5e5e5': 'var(--color-gray-200) or bg-gray-200',
    '#d4d4d4': 'var(--color-gray-300) or bg-gray-300',
    '#a3a3a3': 'var(--color-gray-400) or bg-gray-400',
    '#737373': 'var(--color-gray-500) or bg-gray-500',
    '#525252': 'var(--color-gray-600) or bg-gray-600',
    '#404040': 'var(--color-gray-700) or bg-gray-700',
    '#262626': 'var(--color-gray-800) or bg-gray-800',
    '#171717': 'var(--color-gray-900) or bg-gray-900',
    '#ef4444': 'var(--color-red-500) or text-red-500',
    '#dc2626': 'var(--color-red-600) or text-red-600',
    '#f97316': 'var(--color-orange-500) or text-orange-500',
    '#eab308': 'var(--color-yellow-500) or text-yellow-500',
    '#22c55e': 'var(--color-green-500) or text-green-500',
    '#16a34a': 'var(--color-green-600) or text-green-600',
    '#3b82f6': 'var(--color-blue-500) or text-blue-500',
    '#2563eb': 'var(--color-blue-600) or text-blue-600',
    '#8b5cf6': 'var(--color-violet-500) or text-violet-500',
    '#a855f7': 'var(--color-purple-500) or text-purple-500',
    '#ec4899': 'var(--color-pink-500) or text-pink-500',
};
const SPACING_TOKENS = {
    '4px': 'var(--spacing-1) or p-1 / gap-1',
    '8px': 'var(--spacing-2) or p-2 / gap-2',
    '12px': 'var(--spacing-3) or p-3 / gap-3',
    '16px': 'var(--spacing-4) or p-4 / gap-4',
    '20px': 'var(--spacing-5) or p-5 / gap-5',
    '24px': 'var(--spacing-6) or p-6 / gap-6',
    '32px': 'var(--spacing-8) or p-8 / gap-8',
    '40px': 'var(--spacing-10) or p-10 / gap-10',
    '48px': 'var(--spacing-12) or p-12 / gap-12',
    '64px': 'var(--spacing-16) or p-16 / gap-16',
};
const FONT_SIZE_TOKENS = {
    '12px': 'var(--font-size-xs) or text-xs',
    '14px': 'var(--font-size-sm) or text-sm',
    '16px': 'var(--font-size-base) or text-base',
    '18px': 'var(--font-size-lg) or text-lg',
    '20px': 'var(--font-size-xl) or text-xl',
    '24px': 'var(--font-size-2xl) or text-2xl',
    '30px': 'var(--font-size-3xl) or text-3xl',
    '36px': 'var(--font-size-4xl) or text-4xl',
    '48px': 'var(--font-size-5xl) or text-5xl',
    '0.75rem': 'var(--font-size-xs) or text-xs',
    '0.875rem': 'var(--font-size-sm) or text-sm',
    '1rem': 'var(--font-size-base) or text-base',
    '1.125rem': 'var(--font-size-lg) or text-lg',
    '1.25rem': 'var(--font-size-xl) or text-xl',
    '1.5rem': 'var(--font-size-2xl) or text-2xl',
    '1.875rem': 'var(--font-size-3xl) or text-3xl',
    '2.25rem': 'var(--font-size-4xl) or text-4xl',
    '3rem': 'var(--font-size-5xl) or text-5xl',
};
const BORDER_RADIUS_TOKENS = {
    '2px': 'var(--radius-sm) or rounded-sm',
    '4px': 'var(--radius) or rounded',
    '6px': 'var(--radius-md) or rounded-md',
    '8px': 'var(--radius-lg) or rounded-lg',
    '12px': 'var(--radius-xl) or rounded-xl',
    '16px': 'var(--radius-2xl) or rounded-2xl',
    '9999px': 'var(--radius-full) or rounded-full',
};
// ============================================================================
// SCANNER
// ============================================================================
function scanDirectory(dir, exts = ['.ts', '.tsx', '.js', '.jsx', '.css']) {
    const files = [];
    if (!fs.existsSync(dir))
        return files;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (['node_modules', 'build', 'dist', '.next', '__tests__', 'tokens'].includes(entry.name))
                continue;
            files.push(...scanDirectory(fullPath, exts));
        }
        else if (exts.some(e => entry.name.endsWith(e))) {
            if (entry.name.includes('.test.') || entry.name.includes('.spec.') || entry.name.includes('.stories.'))
                continue;
            files.push(fullPath);
        }
    }
    return files;
}
function analyzeFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const violations = [];
    for (const i = 0; i < lines.length; i++) {
        const line = lines[i];
        // Skip imports and comments
        if (line.trim().startsWith('import ') || line.trim().startsWith('//') || line.trim().startsWith('/*'))
            continue;
        // Hardcoded colors
        const hexColors = line.matchAll(/#[0-9a-fA-F]{3,8}\b/g);
        for (const match of hexColors) {
            const hex = match[0].toLowerCase();
            // Skip if inside a comment or token definition
            if (line.includes(`tokens`) || line.includes(`--color-`))
                continue;
            const token = COLOR_TOKENS[hex];
            if (token) {
                violations.push({
                    type: 'hardcoded-color',
                    file: filePath,
                    line: i + 1,
                    value: match[0],
                    tokenSuggestion: token,
                    severity: 'high',
                });
            }
            else if (hex.length >= 6) {
                violations.push({
                    type: 'hardcoded-color',
                    file: filePath,
                    line: i + 1,
                    value: match[0],
                    tokenSuggestion: `Define a design token for ${match[0]} instead of using raw hex`,
                    severity: 'medium',
                });
            }
        }
        // rgb/rgba colors
        const rgbColors = line.matchAll(/rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+/g);
        for (const match of rgbColors) {
            if (!line.includes('--color-') && !line.includes('tokens')) {
                violations.push({
                    type: 'hardcoded-color',
                    file: filePath,
                    line: i + 1,
                    value: match[0] + '...)',
                    tokenSuggestion: 'Use a design token or CSS variable instead of raw rgb/rgba',
                    severity: 'medium',
                });
            }
        }
        // Hardcoded spacing
        for (const [value, token] of Object.entries(SPACING_TOKENS)) {
            const regex = new RegExp(`(?<!\\d)${value.replace('+', '\\+')}(?!\\d)`, 'g');
            let spacingMatch;
            while ((spacingMatch = regex.exec(line)) !== null) {
                if (line.includes('--spacing-') || line.includes('tokens'))
                    continue;
                violations.push({
                    type: 'hardcoded-spacing',
                    file: filePath,
                    line: i + 1,
                    value: value,
                    tokenSuggestion: token,
                    severity: 'medium',
                });
            }
        }
        // Hardcoded font sizes
        for (const [value, token] of Object.entries(FONT_SIZE_TOKENS)) {
            const regex = new RegExp(`(?<!\\w)${value.replace('+', '\\+')}(?!\\w)`, 'g');
            let fontMatch;
            while ((fontMatch = regex.exec(line)) !== null) {
                if (line.includes('--font-size-') || line.includes('tokens') || line.includes('font-size:')) {
                    if (line.includes('var(--'))
                        continue;
                }
                violations.push({
                    type: 'hardcoded-font-size',
                    file: filePath,
                    line: i + 1,
                    value: value,
                    tokenSuggestion: token,
                    severity: 'medium',
                });
            }
        }
        // Hardcoded border radius
        for (const [value, token] of Object.entries(BORDER_RADIUS_TOKENS)) {
            if (line.includes(value) && !line.includes('--radius') && !line.includes('tokens')) {
                violations.push({
                    type: 'hardcoded-border-radius',
                    file: filePath,
                    line: i + 1,
                    value: value,
                    tokenSuggestion: token,
                    severity: 'medium',
                });
            }
        }
        // Hardcoded font families
        if (line.match(/font-family:\s*['"]/) && !line.includes('var(--')) {
            violations.push({
                type: 'hardcoded-font-family',
                file: filePath,
                line: i + 1,
                value: line.match(/font-family:\s*([^;]+)/)?.[1]?.trim() || 'unknown',
                tokenSuggestion: 'Use var(--font-family-sans) or font-sans token',
                severity: 'high',
            });
        }
        // Magic numbers (z-index)
        if (line.match(/z-index:\s*\d+/) && !line.includes('var(--z')) {
            const zMatch = line.match(/z-index:\s*(\d+)/);
            violations.push({
                type: 'hardcoded-z-index',
                file: filePath,
                line: i + 1,
                value: zMatch?.[1] || 'unknown',
                tokenSuggestion: 'Use z-index tokens: z-0, z-10, z-20, z-30, z-40, z-50',
                severity: 'medium',
            });
        }
        // Magic numbers (box-shadow)
        if (line.match(/box-shadow:\s*\d/) && !line.includes('var(--shadow')) {
            violations.push({
                type: 'hardcoded-shadow',
                file: filePath,
                line: i + 1,
                value: line.match(/box-shadow:\s*([^;]+)/)?.[1]?.trim().slice(0, 50) || 'unknown',
                tokenSuggestion: 'Use shadow tokens: shadow-sm, shadow, shadow-md, shadow-lg, shadow-xl',
                severity: 'medium',
            });
        }
    }
    return violations;
}
// ============================================================================
// MAIN SERVER
// ============================================================================
class EnforceDesignTokensServer {
    server;
    constructor() {
        this.server = new Server({ name: 'enforce-design-tokens', version: '1.0.0' }, { capabilities: { tools: {} } });
        this.setupToolHandlers();
        this.server.onerror = (error) => console.error('[MCP Error]', error);
        process.on('SIGINT', async () => {
            await this.server.close();
            process.exit(0);
        });
    }
    setupToolHandlers() {
        this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools: [
                {
                    name: 'scan_hardcoded_styles',
                    description: 'Scan code for hardcoded colors, spacing, font sizes, and other style values that should use design tokens',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            path: { type: 'string', description: 'Path to file or directory to scan' },
                            severity: { type: 'string', enum: ['high', 'medium', 'low', 'all'], default: 'all' },
                        },
                        required: ['path'],
                    },
                },
                {
                    name: 'suggest_tokens',
                    description: 'For each hardcoded value found, suggest the appropriate design token replacement',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            path: { type: 'string', description: 'Path to scan' },
                        },
                        required: ['path'],
                    },
                },
                {
                    name: 'enforce_tokens',
                    description: 'Run full enforcement check and return a report of all token violations with auto-fix suggestions',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            path: { type: 'string', description: 'Path to scan' },
                        },
                        required: ['path'],
                    },
                },
            ],
        }));
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            switch (request.params.name) {
                case 'scan_hardcoded_styles':
                    return await this.handleScan(request.params.arguments);
                case 'suggest_tokens':
                    return await this.handleSuggest(request.params.arguments);
                case 'enforce_tokens':
                    return await this.handleEnforce(request.params.arguments);
                default:
                    throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
            }
        });
    }
    async handleScan(args) {
        const { path: targetPath, severity = 'all' } = args;
        try {
            const isDir = fs.statSync(targetPath).isDirectory();
            const files = isDir ? scanDirectory(targetPath) : [targetPath];
            const sevOrder = { high: 0, medium: 1, low: 2 };
            const minSev = sevOrder[severity] ?? 2;
            let violations = [];
            for (const file of files) {
                violations.push(...analyzeFile(file));
            }
            violations = violations.filter(v => sevOrder[v.severity] <= minSev);
            return {
                content: [{
                        type: 'text',
                        text: JSON.stringify({
                            success: true,
                            summary: {
                                totalViolations: violations.length,
                                high: violations.filter(v => v.severity === 'high').length,
                                medium: violations.filter(v => v.severity === 'medium').length,
                                low: violations.filter(v => v.severity === 'low').length,
                                byType: {
                                    hardcodedColor: violations.filter(v => v.type === 'hardcoded-color').length,
                                    hardcodedSpacing: violations.filter(v => v.type === 'hardcoded-spacing').length,
                                    hardcodedFontSize: violations.filter(v => v.type === 'hardcoded-font-size').length,
                                    hardcodedBorderRadius: violations.filter(v => v.type === 'hardcoded-border-radius').length,
                                    hardcodedShadow: violations.filter(v => v.type === 'hardcoded-shadow').length,
                                    hardcodedZIndex: violations.filter(v => v.type === 'hardcoded-z-index').length,
                                },
                            },
                            violations,
                        }, null, 2),
                    }],
            };
        }
        catch (error) {
            return {
                content: [{ type: 'text', text: JSON.stringify({ success: false, error: {
                                error: true,
                                code: error instanceof Error ? error.constructor.name : 'UNKNOWN_ERROR',
                                message: error instanceof Error ? error.message : String(error),
                                suggestion: 'Check input parameters and ensure all required values are provided.',
                                timestamp: new Date().toISOString(),
                            } }, null, 2) }],
                isError: true,
            };
        }
    }
    async handleSuggest(args) {
        const { path: targetPath } = args;
        try {
            const isDir = fs.statSync(targetPath).isDirectory();
            const files = isDir ? scanDirectory(targetPath) : [targetPath];
            let violations = [];
            for (const file of files) {
                violations.push(...analyzeFile(file));
            }
            const suggestions = violations.map(v => ({
                file: v.file,
                line: v.line,
                replace: v.value,
                with: v.tokenSuggestion,
                type: v.type,
            }));
            return {
                content: [{ type: 'text', text: JSON.stringify({ success: true, suggestions }, null, 2) }],
            };
        }
        catch (error) {
            return {
                content: [{ type: 'text', text: JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, null, 2) }],
                isError: true,
            };
        }
    }
    async handleEnforce(args) {
        const { path: targetPath } = args;
        try {
            const isDir = fs.statSync(targetPath).isDirectory();
            const files = isDir ? scanDirectory(targetPath) : [targetPath];
            let violations = [];
            for (const file of files) {
                violations.push(...analyzeFile(file));
            }
            // Group by file
            const byFile = {};
            for (const v of violations) {
                if (!byFile[v.file])
                    byFile[v.file] = [];
                byFile[v.file].push(v);
            }
            const grade = violations.length === 0 ? 'A' : violations.length <= 5 ? 'B' : violations.length <= 15 ? 'C' : violations.length <= 30 ? 'D' : 'F';
            return {
                content: [{
                        type: 'text',
                        text: JSON.stringify({
                            success: true,
                            grade,
                            totalViolations: violations.length,
                            filesAffected: Object.keys(byFile).length,
                            byFile,
                        }, null, 2),
                    }],
            };
        }
        catch (error) {
            return {
                content: [{ type: 'text', text: JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, null, 2) }],
                isError: true,
            };
        }
    }
    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error('Enforce Design Tokens MCP server running on stdio');
    }
}
const server = new EnforceDesignTokensServer();
server.run().catch(console.error);
//# sourceMappingURL=index.js.map