#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ErrorCode, ListToolsRequestSchema, McpError } from '@modelcontextprotocol/sdk/types.js';
import * as fs from 'fs';
import * as path from 'path';
// ============================================================================
// AXE RULES (static analysis subset)
// ============================================================================
const AXE_RULES = [
    {
        id: 'image-alt',
        impact: 'critical',
        wcag: '1.1.1',
        check: (content, file) => {
            const issues = [];
            const lines = content.split('\n');
            for (let i = 0; i < lines.length; i++) {
                const imgMatches = lines[i].matchAll(/<img\s[^>]*>/g);
                for (const m of imgMatches) {
                    if (!m[0].includes('alt=') && !m[0].includes('aria-label=') && !m[0].includes('aria-labelledby=')) {
                        issues.push({
                            rule: 'image-alt',
                            impact: 'critical',
                            element: m[0].slice(0, 100),
                            file,
                            line: i + 1,
                            description: 'Image element missing alt attribute. Screen readers cannot describe the image.',
                            fix: 'Add alt attribute: <img src="..." alt="Descriptive text" />',
                            wcag: '1.1.1 Non-text Content (Level A)',
                        });
                    }
                }
            }
            return issues;
        },
    },
    {
        id: 'button-name',
        impact: 'critical',
        wcag: '4.1.2',
        check: (content, file) => {
            const issues = [];
            const lines = content.split('\n');
            for (let i = 0; i < lines.length; i++) {
                // Empty buttons: <button></button> or <button>   </button>
                if (lines[i].match(/<button[^>]*>\s*<\/button>/)) {
                    issues.push({
                        rule: 'button-name',
                        impact: 'critical',
                        element: lines[i].trim(),
                        file,
                        line: i + 1,
                        description: 'Button has no accessible name. Screen readers announce it as "button" with no context.',
                        fix: 'Add text content, aria-label, or aria-labelledby to the button.',
                        wcag: '4.1.2 Name, Role, Value (Level A)',
                    });
                }
                // Icon-only button without aria-label
                if (lines[i].match(/<button[^>]*>\s*<(svg|Icon|i|span)[^>]*\/?>\s*<\/button>/) && !lines[i].includes('aria-label')) {
                    issues.push({
                        rule: 'button-name',
                        impact: 'critical',
                        element: lines[i].trim().slice(0, 100),
                        file,
                        line: i + 1,
                        description: 'Icon-only button without aria-label. Screen readers cannot describe its purpose.',
                        fix: 'Add aria-label: <button aria-label="Close"><CloseIcon /></button>',
                        wcag: '4.1.2 Name, Role, Value (Level A)',
                    });
                }
            }
            return issues;
        },
    },
    {
        id: 'link-name',
        impact: 'serious',
        wcag: '4.1.2',
        check: (content, file) => {
            const issues = [];
            const lines = content.split('\n');
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].match(/<a[^>]*>\s*<\/a>/) || lines[i].match(/<a[^>]*>\s*<(svg|Icon|i)[^>]*\/?>\s*<\/a>/)) {
                    if (!lines[i].includes('aria-label') && !lines[i].includes('aria-labelledby')) {
                        issues.push({
                            rule: 'link-name',
                            impact: 'serious',
                            element: lines[i].trim().slice(0, 100),
                            file,
                            line: i + 1,
                            description: 'Link has no accessible name.',
                            fix: 'Add text content or aria-label to the link.',
                            wcag: '4.1.2 Name, Role, Value (Level A)',
                        });
                    }
                }
            }
            return issues;
        },
    },
    {
        id: 'label',
        impact: 'critical',
        wcag: '1.3.1',
        check: (content, file) => {
            const issues = [];
            const lines = content.split('\n');
            for (let i = 0; i < lines.length; i++) {
                // Input without label, aria-label, or aria-labelledby
                if (lines[i].match(/<input\s/) && !lines[i].includes('type="hidden"') && !lines[i].includes('type="submit"') && !lines[i].includes('type="button"')) {
                    const hasLabel = lines[i].includes('aria-label') || lines[i].includes('aria-labelledby') || lines[i].includes('id=');
                    if (!hasLabel) {
                        issues.push({
                            rule: 'label',
                            impact: 'critical',
                            element: lines[i].trim().slice(0, 100),
                            file,
                            line: i + 1,
                            description: 'Form input missing accessible label.',
                            fix: 'Add aria-label, aria-labelledby, or wrap with <label> element.',
                            wcag: '1.3.1 Info and Relationships (Level A)',
                        });
                    }
                }
            }
            return issues;
        },
    },
    {
        id: 'heading-order',
        impact: 'moderate',
        wcag: '1.3.1',
        check: (content, file) => {
            const issues = [];
            const lines = content.split('\n');
            let lastLevel = 0;
            for (let i = 0; i < lines.length; i++) {
                const hMatch = lines[i].match(/<h(\d)/);
                if (hMatch) {
                    const level = parseInt(hMatch[1]);
                    if (lastLevel > 0 && level > lastLevel + 1) {
                        issues.push({
                            rule: 'heading-order',
                            impact: 'moderate',
                            element: lines[i].trim().slice(0, 100),
                            file,
                            line: i + 1,
                            description: `Heading level skipped: h${lastLevel} to h${level}. Skipped heading levels confuse screen reader users.`,
                            fix: `Use sequential heading levels. After h${lastLevel}, use h${lastLevel + 1}.`,
                            wcag: '1.3.1 Info and Relationships (Level A)',
                        });
                    }
                    lastLevel = level;
                }
            }
            return issues;
        },
    },
    {
        id: 'color-contrast',
        impact: 'serious',
        wcag: '1.4.3',
        check: (content, file) => {
            const issues = [];
            const lines = content.split('\n');
            for (let i = 0; i < lines.length; i++) {
                // Detect potential low-contrast patterns
                if (lines[i].match(/color:\s*(#[0-9a-fA-F]{3,6}|rgba?\([^)]+\))/)) {
                    // Heuristic: if color is very light on white background
                    const colorMatch = lines[i].match(/color:\s*(#[0-9a-fA-F]{3,6})/);
                    if (colorMatch) {
                        const hex = colorMatch[1];
                        const r = parseInt(hex.length === 4 ? hex[1] + hex[1] : hex.slice(1, 3), 16);
                        const g = parseInt(hex.length === 4 ? hex[2] + hex[2] : hex.slice(3, 5), 16);
                        const b = parseInt(hex.length === 4 ? hex[3] + hex[3] : hex.slice(5, 7), 16);
                        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
                        if (luminance > 0.8) {
                            issues.push({
                                rule: 'color-contrast',
                                impact: 'serious',
                                element: lines[i].trim().slice(0, 100),
                                file,
                                line: i + 1,
                                description: `Very light text color (${hex}) detected. May fail WCAG contrast ratio of 4.5:1.`,
                                fix: 'Use a darker color that meets 4.5:1 contrast ratio against background.',
                                wcag: '1.4.3 Contrast (Minimum) (Level AA)',
                            });
                        }
                    }
                }
            }
            return issues;
        },
    },
    {
        id: 'tabindex',
        impact: 'serious',
        wcag: '2.4.3',
        check: (content, file) => {
            const issues = [];
            const lines = content.split('\n');
            for (let i = 0; i < lines.length; i++) {
                const tabMatch = lines[i].match(/tabindex=["'](\d+)["']/);
                if (tabMatch && parseInt(tabMatch[1]) > 0) {
                    issues.push({
                        rule: 'tabindex',
                        impact: 'serious',
                        element: lines[i].trim().slice(0, 100),
                        file,
                        line: i + 1,
                        description: `Positive tabindex (${tabMatch[1]}) disrupts natural tab order.`,
                        fix: 'Use tabindex="0" for focusable elements or tabindex="-1" for programmatic focus.',
                        wcag: '2.4.3 Focus Order (Level A)',
                    });
                }
            }
            return issues;
        },
    },
    {
        id: 'aria-roles',
        impact: 'serious',
        wcag: '4.1.2',
        check: (content, file) => {
            const issues = [];
            const lines = content.split('\n');
            const validRoles = ['alert', 'alertdialog', 'application', 'article', 'banner', 'button', 'cell', 'checkbox', 'columnheader', 'combobox', 'complementary', 'contentinfo', 'definition', 'dialog', 'directory', 'document', 'feed', 'figure', 'form', 'grid', 'gridcell', 'group', 'heading', 'img', 'link', 'list', 'listbox', 'listitem', 'log', 'main', 'marquee', 'math', 'menu', 'menubar', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'navigation', 'none', 'note', 'option', 'presentation', 'progressbar', 'radio', 'radiogroup', 'region', 'row', 'rowgroup', 'rowheader', 'scrollbar', 'search', 'searchbox', 'separator', 'slider', 'spinbutton', 'status', 'switch', 'tab', 'table', 'tablist', 'tabpanel', 'term', 'textbox', 'timer', 'toolbar', 'tooltip', 'tree', 'treegrid', 'treeitem'];
            for (let i = 0; i < lines.length; i++) {
                const roleMatch = lines[i].match(/role=["'](\w+)["']/);
                if (roleMatch && !validRoles.includes(roleMatch[1])) {
                    issues.push({
                        rule: 'aria-roles',
                        impact: 'serious',
                        element: lines[i].trim().slice(0, 100),
                        file,
                        line: i + 1,
                        description: `Invalid ARIA role "${roleMatch[1]}".`,
                        fix: `Use a valid ARIA role. See https://www.w3.org/TR/wai-aria-1.1/#role_definitions`,
                        wcag: '4.1.2 Name, Role, Value (Level A)',
                    });
                }
            }
            return issues;
        },
    },
    {
        id: 'aria-hidden-focus',
        impact: 'serious',
        wcag: '4.1.2',
        check: (content, file) => {
            const issues = [];
            const lines = content.split('\n');
            for (let i = 0; i < lines.length; i++) {
                // aria-hidden with focusable children
                if (lines[i].includes('aria-hidden="true"') && (lines[i].includes('<a ') || lines[i].includes('<button') || lines[i].includes('<input'))) {
                    issues.push({
                        rule: 'aria-hidden-focus',
                        impact: 'serious',
                        element: lines[i].trim().slice(0, 100),
                        file,
                        line: i + 1,
                        description: 'aria-hidden="true" element contains focusable elements.',
                        fix: 'Remove focusable elements from aria-hidden containers or add tabindex="-1".',
                        wcag: '4.1.2 Name, Role, Value (Level A)',
                    });
                }
            }
            return issues;
        },
    },
    {
        id: 'html-has-lang',
        impact: 'serious',
        wcag: '3.1.1',
        check: (content, file) => {
            const issues = [];
            if (content.includes('<html') && !content.includes('lang=')) {
                issues.push({
                    rule: 'html-has-lang',
                    impact: 'serious',
                    element: '<html>',
                    file,
                    line: 1,
                    description: 'html element missing lang attribute. Screen readers cannot determine page language.',
                    fix: 'Add lang attribute: <html lang="en">',
                    wcag: '3.1.1 Language of Page (Level A)',
                });
            }
            return issues;
        },
    },
];
// ============================================================================
// COMPONENT ANALYSIS
// ============================================================================
function scanDirectory(dir, exts = ['.tsx', '.jsx', '.html']) {
    const files = [];
    if (!fs.existsSync(dir))
        return files;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (['node_modules', 'build', 'dist', '.next', '__tests__'].includes(entry.name))
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
    const issues = [];
    for (const rule of AXE_RULES) {
        issues.push(...rule.check(content, filePath));
    }
    return issues;
}
// ============================================================================
// MAIN SERVER
// ============================================================================
class AccessibilityCheckerServer {
    server;
    constructor() {
        this.server = new Server({ name: 'accessibility-checker', version: '1.0.0' }, { capabilities: { tools: {} } });
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
                    name: 'check_accessibility',
                    description: 'Run axe-core rules against React components and HTML files to detect accessibility violations',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            path: { type: 'string', description: 'Path to file or directory to scan' },
                            severity: { type: 'string', enum: ['critical', 'serious', 'moderate', 'minor', 'all'], default: 'all' },
                        },
                        required: ['path'],
                    },
                },
                {
                    name: 'validate_aria',
                    description: 'Check ARIA attributes for correctness: valid roles, proper aria-hidden usage, required properties',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            path: { type: 'string', description: 'Path to scan' },
                        },
                        required: ['path'],
                    },
                },
                {
                    name: 'audit_keyboard_nav',
                    description: 'Audit keyboard navigation: tabindex usage, focus order, focusable elements in hidden containers',
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
                case 'check_accessibility':
                    return await this.handleCheckA11y(request.params.arguments);
                case 'validate_aria':
                    return await this.handleValidateAria(request.params.arguments);
                case 'audit_keyboard_nav':
                    return await this.handleKeyboardNav(request.params.arguments);
                default:
                    throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
            }
        });
    }
    async handleCheckA11y(args) {
        const { path: targetPath, severity = 'all' } = args;
        try {
            const isDir = fs.statSync(targetPath).isDirectory();
            const files = isDir ? scanDirectory(targetPath) : [targetPath];
            const impactOrder = { critical: 0, serious: 1, moderate: 2, minor: 3 };
            const minImpact = impactOrder[severity] ?? 3;
            let allIssues = [];
            for (const file of files) {
                allIssues.push(...analyzeFile(file));
            }
            allIssues = allIssues.filter(i => impactOrder[i.impact] <= minImpact);
            return {
                content: [{
                        type: 'text',
                        text: JSON.stringify({
                            success: true,
                            summary: {
                                totalIssues: allIssues.length,
                                critical: allIssues.filter(i => i.impact === 'critical').length,
                                serious: allIssues.filter(i => i.impact === 'serious').length,
                                moderate: allIssues.filter(i => i.impact === 'moderate').length,
                                minor: allIssues.filter(i => i.impact === 'minor').length,
                                filesScanned: files.length,
                            },
                            issues: allIssues,
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
    async handleValidateAria(args) {
        const { path: targetPath } = args;
        try {
            const isDir = fs.statSync(targetPath).isDirectory();
            const files = isDir ? scanDirectory(targetPath) : [targetPath];
            const ariaRules = ['aria-roles', 'aria-hidden-focus'];
            let issues = [];
            for (const file of files) {
                const fileIssues = analyzeFile(file);
                issues.push(...fileIssues.filter(i => ariaRules.includes(i.rule)));
            }
            return {
                content: [{ type: 'text', text: JSON.stringify({ success: true, ariaIssues: issues.length, issues }, null, 2) }],
            };
        }
        catch (error) {
            return {
                content: [{ type: 'text', text: JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, null, 2) }],
                isError: true,
            };
        }
    }
    async handleKeyboardNav(args) {
        const { path: targetPath } = args;
        try {
            const isDir = fs.statSync(targetPath).isDirectory();
            const files = isDir ? scanDirectory(targetPath) : [targetPath];
            const keyboardRules = ['tabindex', 'button-name', 'link-name'];
            let issues = [];
            for (const file of files) {
                const fileIssues = analyzeFile(file);
                issues.push(...fileIssues.filter(i => keyboardRules.includes(i.rule)));
            }
            return {
                content: [{ type: 'text', text: JSON.stringify({ success: true, keyboardIssues: issues.length, issues }, null, 2) }],
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
        console.error('Accessibility Checker MCP server running on stdio');
    }
}
const server = new AccessibilityCheckerServer();
server.run().catch(console.error);
//# sourceMappingURL=index.js.map