#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ErrorCode, ListToolsRequestSchema, McpError, } from '@modelcontextprotocol/sdk/types.js';
import * as fs from 'fs';
import * as path from 'path';
// ============================================================================
// SOURCE ANALYSIS
// ============================================================================
function scanDirectory(dir) {
    const files = [];
    if (!fs.existsSync(dir))
        return files;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (['node_modules', 'build', 'dist', '.next', '__tests__'].includes(entry.name))
                continue;
            files.push(...scanDirectory(fullPath));
        }
        else if (entry.name.match(/\.(tsx|jsx)$/)) {
            if (entry.name.includes('.test.') || entry.name.includes('.spec.') || entry.name.includes('.stories.'))
                continue;
            files.push(fullPath);
        }
    }
    return files;
}
function extractComponents(content) {
    const components = [];
    // function ComponentName
    const fnRegex = /(?:export\s+(?:default\s+)?)?(?:const|function)\s+([A-Z]\w+)/g;
    let match;
    while ((match = fnRegex.exec(content)) !== null) {
        if (!components.includes(match[1]))
            components.push(match[1]);
    }
    return components;
}
function analyzeComponent(content, componentName, filePath) {
    const lines = content.split('\n');
    const issues = [];
    const hasMemo = content.includes(`memo(${componentName})`) || content.includes('React.memo');
    const hasUseMemo = content.includes('useMemo');
    const hasUseCallback = content.includes('useCallback');
    const inlineObjects = 0;
    const inlineFunctions = 0;
    let propsCount = 0;
    // Find component body
    const compStart = content.indexOf(componentName);
    if (compStart === -1) {
        return { name: componentName, file: filePath, hasMemo, hasUseMemo, hasUseCallback, propsCount, inlineObjects, inlineFunctions, issues };
    }
    // Extract component function body (rough)
    const returnIndex = content.indexOf('return', compStart);
    if (returnIndex === -1) {
        return { name: componentName, file: filePath, hasMemo, hasUseMemo, hasUseCallback, propsCount, inlineObjects, inlineFunctions, issues };
    }
    const componentBody = content.slice(compStart);
    const bodyLines = componentBody.split('\n');
    for (let i = 0; i < bodyLines.length; i++) {
        const line = bodyLines[i];
        const lineNum = content.slice(0, compStart).split('\n').length + i;
        // Inline object literals as props: style={{...}}
        const inlineObjMatches = line.match(/\{\{[^}]+\}\}/g);
        if (inlineObjMatches) {
            inlineObjects += inlineObjMatches.length;
            for (const _m of inlineObjMatches) {
                issues.push({
                    type: 'inline-object',
                    component: componentName,
                    file: filePath,
                    line: lineNum,
                    description: `Inline object literal creates a new reference on every render, causing child re-renders.`,
                    severity: 'medium',
                    fix: `Extract to a const outside the component or wrap with useMemo:\nconst style = useMemo(() => ({ /* styles */ }), []);`,
                });
            }
        }
        // Inline array literals as props: items={[...]}
        const inlineArrMatches = line.match(/=\s*\[[^\]]*\]/g);
        if (inlineArrMatches && line.includes('<')) {
            inlineObjects += inlineArrMatches.length;
            for (const _m of inlineArrMatches) {
                issues.push({
                    type: 'inline-array',
                    component: componentName,
                    file: filePath,
                    line: lineNum,
                    description: `Inline array literal creates a new reference on every render.`,
                    severity: 'medium',
                    fix: `Extract to useMemo:\nconst items = useMemo(() => [...], [deps]);`,
                });
            }
        }
        // Inline arrow functions as props: onClick={() => ...} onClick={e => ...}
        const inlineFnMatches = line.match(/on\w+=\{(?:\([^)]*\)\s*=>|[\w]+\s*=>)/g);
        if (inlineFnMatches) {
            inlineFunctions += inlineFnMatches.length;
            for (const _m of inlineFnMatches) {
                issues.push({
                    type: 'inline-function',
                    component: componentName,
                    file: filePath,
                    line: lineNum,
                    description: `Inline function creates a new reference on every render. Use useCallback to memoize.`,
                    severity: 'medium',
                    fix: `const handler = useCallback((e) => { /* handler logic */ }, [deps]);`,
                });
            }
        }
        // Count props (rough: count { destructured } in component params)
        const propsMatch = line.match(/\(\s*\{\s*([^}]+)\s*\}/);
        if (propsMatch) {
            propsCount = propsMatch[1].split(',').length;
        }
        // Detect new Date(), new Object(), etc inside component
        if (line.match(/new\s+(Date|Object|Array|Map|Set|RegExp)\(/)) {
            issues.push({
                type: 'new-object-prop',
                component: componentName,
                file: filePath,
                line: lineNum,
                description: `Creating new object instance on every render. Move outside component or memoize.`,
                severity: 'low',
                fix: `const obj = useMemo(() => new Date(), []);`,
            });
        }
        // Detect context value without useMemo
        if (line.includes('value=') && line.includes('{') && !hasUseMemo) {
            issues.push({
                type: 'context-value',
                component: componentName,
                file: filePath,
                line: lineNum,
                description: `Context value object is recreated on every render. Wrap with useMemo.`,
                severity: 'high',
                fix: `const contextValue = useMemo(() => ({ prop1, prop2 }), [prop1, prop2]);`,
            });
        }
    }
    // Missing memo check
    if (!hasMemo && !content.includes('export default memo(')) {
        issues.push({
            type: 'missing-memo',
            component: componentName,
            file: filePath,
            line: 1,
            description: `Component is not wrapped with React.memo. It will re-render whenever parent re-renders, even if props haven't changed.`,
            severity: 'medium',
            fix: `export default memo(${componentName});`,
        });
    }
    return {
        name: componentName,
        file: filePath,
        hasMemo,
        hasUseMemo,
        hasUseCallback,
        propsCount,
        inlineObjects,
        inlineFunctions,
        issues,
    };
}
// ============================================================================
// MAIN SERVER
// ============================================================================
class RenderAnalyzerServer {
    server;
    constructor() {
        this.server = new Server({ name: 'render-analyzer', version: '1.0.0' }, { capabilities: { tools: {} } });
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
                    name: 'detect_unnecessary_rerenders',
                    description: 'Scan React components for patterns that cause unnecessary re-renders: inline objects, arrays, functions, missing memo',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            path: { type: 'string', description: 'Path to component file or directory to scan' },
                            severity: { type: 'string', enum: ['high', 'medium', 'low', 'all'], description: 'Minimum severity to report', default: 'all' },
                        },
                        required: ['path'],
                    },
                },
                {
                    name: 'check_memo_usage',
                    description: 'Analyze memo, useMemo, and useCallback usage across components',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            path: { type: 'string', description: 'Path to scan for React components' },
                        },
                        required: ['path'],
                    },
                },
                {
                    name: 'analyze_props_changes',
                    description: 'Detect props patterns that cause unnecessary child re-renders',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            path: { type: 'string', description: 'Path to scan for React components' },
                        },
                        required: ['path'],
                    },
                },
            ],
        }));
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            switch (request.params.name) {
                case 'detect_unnecessary_rerenders':
                    return await this.handleDetectRerenders(request.params.arguments);
                case 'check_memo_usage':
                    return await this.handleCheckMemo(request.params.arguments);
                case 'analyze_props_changes':
                    return await this.handleAnalyzeProps(request.params.arguments);
                default:
                    throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
            }
        });
    }
    async handleDetectRerenders(args) {
        const { path: targetPath, severity = 'all' } = args;
        try {
            const files = fs.statSync(targetPath).isDirectory()
                ? scanDirectory(targetPath)
                : [targetPath];
            const severityOrder = { high: 0, medium: 1, low: 2 };
            const minSeverity = severityOrder[severity] ?? 2;
            const profiles = [];
            const totalIssues = 0;
            for (const file of files) {
                const content = fs.readFileSync(file, 'utf-8');
                const components = extractComponents(content);
                for (const comp of components) {
                    const profile = analyzeComponent(content, comp, file);
                    const filteredIssues = profile.issues.filter(i => severityOrder[i.severity] <= minSeverity);
                    profile.issues = filteredIssues;
                    totalIssues += filteredIssues.length;
                    profiles.push(profile);
                }
            }
            return {
                content: [{
                        type: 'text',
                        text: JSON.stringify({
                            success: true,
                            summary: {
                                totalComponents: profiles.length,
                                totalIssues,
                                componentsWithIssues: profiles.filter(p => p.issues.length > 0).length,
                            },
                            profiles: profiles.filter(p => p.issues.length > 0),
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
    async handleCheckMemo(args) {
        const { path: targetPath } = args;
        try {
            const files = fs.statSync(targetPath).isDirectory()
                ? scanDirectory(targetPath)
                : [targetPath];
            const results = [];
            const totalComponents = 0;
            const memoizedCount = 0;
            const useMemoCount = 0;
            const useCallbackCount = 0;
            for (const file of files) {
                const content = fs.readFileSync(file, 'utf-8');
                const components = extractComponents(content);
                for (const comp of components) {
                    totalComponents++;
                    const profile = analyzeComponent(content, comp, file);
                    if (profile.hasMemo)
                        memoizedCount++;
                    if (profile.hasUseMemo)
                        useMemoCount++;
                    if (profile.hasUseCallback)
                        useCallbackCount++;
                    results.push({
                        component: comp,
                        file,
                        hasMemo: profile.hasMemo,
                        hasUseMemo: profile.hasUseMemo,
                        hasUseCallback: profile.hasUseCallback,
                        propsCount: profile.propsCount,
                    });
                }
            }
            return {
                content: [{
                        type: 'text',
                        text: JSON.stringify({
                            success: true,
                            summary: {
                                totalComponents,
                                memoized: memoizedCount,
                                notMemoized: totalComponents - memoizedCount,
                                useMemoUsage: useMemoCount,
                                useCallbackUsage: useCallbackCount,
                            },
                            components: results,
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
    async handleAnalyzeProps(args) {
        const { path: targetPath } = args;
        try {
            const files = fs.statSync(targetPath).isDirectory()
                ? scanDirectory(targetPath)
                : [targetPath];
            const results = [];
            for (const file of files) {
                const content = fs.readFileSync(file, 'utf-8');
                const components = extractComponents(content);
                for (const comp of components) {
                    const profile = analyzeComponent(content, comp, file);
                    if (profile.inlineObjects > 0 || profile.inlineFunctions > 0) {
                        results.push({
                            component: comp,
                            file,
                            inlineObjects: profile.inlineObjects,
                            inlineFunctions: profile.inlineFunctions,
                            propsCount: profile.propsCount,
                            issues: profile.issues.filter(i => ['inline-object', 'inline-array', 'inline-function'].includes(i.type)),
                        });
                    }
                }
            }
            return {
                content: [{
                        type: 'text',
                        text: JSON.stringify({
                            success: true,
                            componentsWithPropIssues: results.length,
                            results,
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
        console.error('Render Analyzer MCP server running on stdio');
    }
}
const server = new RenderAnalyzerServer();
server.run().catch(console.error);
//# sourceMappingURL=index.js.map