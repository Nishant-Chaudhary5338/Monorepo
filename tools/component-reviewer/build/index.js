#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ErrorCode, ListToolsRequestSchema, McpError, } from '@modelcontextprotocol/sdk/types.js';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
// ============================================================================
// PATHS (ES module compatible)
// ============================================================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// ============================================================================
// REVIEW FUNCTIONS
// ============================================================================
function runTypeScriptCheck(componentDir) {
    try {
        const tsconfigPath = findTsconfig(componentDir);
        if (!tsconfigPath) {
            return { errors: ['No tsconfig.json found'], passed: false };
        }
        execSync(`npx tsc --noEmit --project ${tsconfigPath}`, {
            cwd: componentDir,
            stdio: 'pipe',
            timeout: 30000,
        });
        return { errors: [], passed: true };
    }
    catch (error) {
        const output = error.stdout?.toString() || error.stderr?.toString() || error.message;
        const errors = output.split('\n').filter((line) => line.trim().length > 0);
        return { errors, passed: false };
    }
}
function runTests(componentDir) {
    try {
        const testFile = fs.readdirSync(componentDir).find(f => f.endsWith('.test.tsx') || f.endsWith('.test.ts'));
        if (!testFile) {
            return { passed: 0, failed: 0, errors: ['No test file found'] };
        }
        const testFilePath = path.join(componentDir, testFile);
        const output = execSync(`npx vitest run ${testFilePath} --reporter=json 2>&1`, {
            cwd: path.join(componentDir, '..', '..'),
            stdio: 'pipe',
            timeout: 60000,
        }).toString();
        try {
            const result = JSON.parse(output);
            const testResult = result.testResults?.[0];
            return {
                passed: testResult?.numPassedTests || result.numPassedTests || 0,
                failed: testResult?.numFailedTests || result.numFailedTests || 0,
                errors: testResult?.message ? [testResult.message] : [],
            };
        }
        catch (parseError) {
            // If JSON parsing fails, check if tests actually passed
            if (output.includes('Tests') && output.includes('passed')) {
                return { passed: 1, failed: 0, errors: [] };
            }
            return { passed: 0, failed: 0, errors: ['Failed to parse test output'] };
        }
    }
    catch (error) {
        const output = error.stdout?.toString() || error.stderr?.toString() || error.message;
        // Check if it's actually a test failure vs execution error
        if (output.includes('FAIL') || output.includes('failed')) {
            return { passed: 0, failed: 1, errors: [output.substring(0, 500)] };
        }
        return { passed: 0, failed: 0, errors: [output.substring(0, 500)] };
    }
}
// Check for void element issues in test files
function checkVoidElementIssues(componentDir, componentName) {
    const issues = [];
    const testFile = path.join(componentDir, `${componentName}.test.tsx`);
    if (!fs.existsSync(testFile)) {
        return issues;
    }
    const testContent = fs.readFileSync(testFile, 'utf-8');
    const voidComponents = ['input', 'img', 'separator', 'divider'];
    const isVoid = voidComponents.includes(componentName.toLowerCase());
    if (isVoid) {
        // Check for children usage in void element tests
        if (testContent.includes(`>${componentName}</`) ||
            testContent.includes('>Test Content</') ||
            testContent.includes('>Test</') ||
            testContent.includes('>Click me</')) {
            issues.push(`Void element '${componentName}' should not have children in tests - use props like placeholder, value instead`);
        }
    }
    return issues;
}
function checkAccessibility(componentDir, componentName) {
    const issues = [];
    const mainFile = path.join(componentDir, `${componentName}.tsx`);
    if (!fs.existsSync(mainFile)) {
        issues.push('Component file not found');
        return issues;
    }
    const content = fs.readFileSync(mainFile, 'utf-8');
    // Check for proper semantic HTML
    if (content.includes('<div') && componentName.toLowerCase() === 'button') {
        issues.push('Button component should use <button> element, not <div>');
    }
    // Check for aria attributes
    if (!content.includes('aria-') && !content.includes('role=')) {
        issues.push('Consider adding ARIA attributes for accessibility');
    }
    // Check for focus styles
    if (!content.includes('focus-visible')) {
        issues.push('Consider adding focus-visible styles for keyboard navigation');
    }
    // Check for displayName
    if (!content.includes('displayName')) {
        issues.push('Consider adding displayName for better React DevTools debugging');
    }
    return issues;
}
function calculateQualityScore(typescriptPassed, testResults, a11yIssues) {
    const score = 100;
    if (!typescriptPassed)
        score -= 30;
    if (testResults.failed > 0)
        score -= 25;
    score -= Math.min(a11yIssues.length * 5, 20);
    return Math.max(0, score);
}
function findTsconfig(dir) {
    let current = dir;
    while (current !== '/' && current !== '.') {
        const tsconfig = path.join(current, 'tsconfig.json');
        if (fs.existsSync(tsconfig))
            return tsconfig;
        current = path.dirname(current);
    }
    return null;
}
// ============================================================================
// MAIN SERVER CLASS
// ============================================================================
class ComponentReviewerServer {
    server;
    constructor() {
        this.server = new Server({ name: 'component-reviewer', version: '1.0.0' }, { capabilities: { tools: {} } });
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
                    name: 'review',
                    description: 'Review a React component for TypeScript errors, test results, accessibility issues, and code quality',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            path: { type: 'string', description: 'Path to the component directory' },
                        },
                        required: ['path'],
                    },
                },
            ],
        }));
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            switch (request.params.name) {
                case 'review':
                    return await this.handleReview(request.params.arguments);
                default:
                    throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
            }
        });
    }
    async handleReview(args) {
        const { path: componentPath } = args;
        try {
            const resolvedPath = path.resolve(componentPath);
            if (!fs.existsSync(resolvedPath)) {
                throw new Error(`Component path does not exist: ${componentPath}`);
            }
            const componentName = path.basename(componentPath);
            // Run TypeScript check
            const tsResult = runTypeScriptCheck(componentPath);
            // Run tests
            const testResults = runTests(componentPath);
            // Check accessibility
            const a11yIssues = checkAccessibility(componentPath, componentName);
            // Calculate quality score
            const qualityScore = calculateQualityScore(tsResult.passed, testResults, a11yIssues);
            const suggestions = [];
            if (!tsResult.passed)
                suggestions.push('Fix TypeScript compilation errors');
            if (testResults.failed > 0)
                suggestions.push('Fix failing tests');
            if (a11yIssues.length > 0)
                suggestions.push('Address accessibility issues');
            if (qualityScore < 80)
                suggestions.push('Consider refactoring for better code quality');
            return {
                content: [{
                        type: 'text',
                        text: JSON.stringify({
                            success: true,
                            component: componentName,
                            typescriptErrors: tsResult.errors,
                            testResults: {
                                passed: testResults.passed,
                                failed: testResults.failed,
                                errors: testResults.errors,
                            },
                            accessibilityIssues: a11yIssues,
                            codeQualityScore: qualityScore,
                            suggestions,
                            summary: qualityScore >= 80 ? 'Good quality' : qualityScore >= 60 ? 'Needs improvement' : 'Poor quality - requires significant changes',
                        }, null, 2),
                    }],
            };
        }
        catch (error) {
            return {
                content: [{
                        type: 'text',
                        text: JSON.stringify({ success: false, error: {
                                error: true,
                                code: error instanceof Error ? error.constructor.name : 'UNKNOWN_ERROR',
                                message: error instanceof Error ? error.message : String(error),
                                suggestion: 'Check input parameters and ensure all required values are provided.',
                                timestamp: new Date().toISOString(),
                            } }, null, 2),
                    }],
                isError: true,
            };
        }
    }
    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error('Component Reviewer MCP server v1.0 running on stdio');
    }
}
const server = new ComponentReviewerServer();
server.run().catch(console.error);
//# sourceMappingURL=index.js.map