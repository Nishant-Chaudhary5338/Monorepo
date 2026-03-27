#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ErrorCode, ListToolsRequestSchema, McpError } from '@modelcontextprotocol/sdk/types.js';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
// ============================================================================
// LIGHTHOUSE RUNNER
// ============================================================================
function runLighthouse(url, outputPath, categories = ['performance', 'accessibility', 'best-practices', 'seo']) {
    const categoryFlags = categories.map(c => `--only-categories=${c}`).join(' ');
    const cmd = `npx lighthouse "${url}" --output=json --output-path="${outputPath}" ${categoryFlags} --chrome-flags="--headless --no-sandbox --disable-gpu" 2>&1 || true`;
    try {
        execSync(cmd, { encoding: 'utf-8', timeout: 120000, maxBuffer: 50 * 1024 * 1024 });
    }
    catch {
        // lighthouse may exit non-zero but still produce output
    }
    if (!fs.existsSync(outputPath)) {
        throw new Error(`Lighthouse did not produce output at ${outputPath}`);
    }
    const report = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
    const categories_result = report.categories || {};
    const audits = report.audits || {};
    const metrics = {
        performance: Math.round((categories_result.performance?.score || 0) * 100),
        accessibility: Math.round((categories_result.accessibility?.score || 0) * 100),
        bestPractices: Math.round((categories_result['best-practices']?.score || 0) * 100),
        seo: Math.round((categories_result.seo?.score || 0) * 100),
        pwa: Math.round((categories_result.pwa?.score || 0) * 100),
        firstContentfulPaint: audits['first-contentful-paint']?.numericValue || 0,
        largestContentfulPaint: audits['largest-contentful-paint']?.numericValue || 0,
        totalBlockingTime: audits['total-blocking-time']?.numericValue || 0,
        cumulativeLayoutShift: audits['cumulative-layout-shift']?.numericValue || 0,
        speedIndex: audits['speed-index']?.numericValue || 0,
    };
    const auditList = Object.entries(audits)
        .filter(([_, a]) => a.score !== null && a.score < 1)
        .map(([key, a]) => ({
        name: key,
        score: Math.round((a.score || 0) * 100),
        title: a.title,
        description: a.description?.slice(0, 200) || '',
    }))
        .sort((a, b) => a.score - b.score);
    return {
        url,
        metrics,
        audits: auditList,
        timestamp: new Date().toISOString(),
    };
}
function analyzeHtmlFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const issues = [];
    const score = 100;
    // Check for missing title
    if (!content.includes('<title>') || content.includes('<title></title>')) {
        issues.push('Missing or empty <title> tag');
        score -= 10;
    }
    // Check for missing meta description
    if (!content.includes('name="description"')) {
        issues.push('Missing meta description');
        score -= 5;
    }
    // Check for missing viewport
    if (!content.includes('name="viewport"')) {
        issues.push('Missing viewport meta tag');
        score -= 10;
    }
    // Check for missing lang attribute
    if (!content.includes('lang=')) {
        issues.push('Missing lang attribute on html element');
        score -= 5;
    }
    // Check for images without alt
    const imgNoAlt = content.match(/<img(?![^>]*alt=)[^>]*>/g);
    if (imgNoAlt) {
        issues.push(`${imgNoAlt.length} images without alt attribute`);
        score -= imgNoAlt.length * 5;
    }
    // Check for large inline scripts
    const scriptBlocks = content.match(/<script[^>]*>[\s\S]*?<\/script>/g) || [];
    for (const script of scriptBlocks) {
        if (script.length > 10000) {
            issues.push('Large inline script detected (>10KB). Consider external file.');
            score -= 10;
        }
    }
    // Check for render-blocking scripts
    if (content.match(/<script(?![^>]*defer)(?![^>]*async)[^>]*src=/)) {
        issues.push('Render-blocking script without defer/async attribute');
        score -= 10;
    }
    // Check for missing favicon
    if (!content.includes('rel="icon"') && !content.includes("rel='icon'")) {
        issues.push('Missing favicon link');
        score -= 3;
    }
    return { score: Math.max(0, score), issues };
}
// ============================================================================
// MAIN SERVER
// ============================================================================
class LighthouseRunnerServer {
    server;
    constructor() {
        this.server = new Server({ name: 'lighthouse-runner', version: '1.0.0' }, { capabilities: { tools: {} } });
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
                    name: 'run_lighthouse',
                    description: 'Run Lighthouse audit against a URL and return performance, accessibility, SEO, and best practices scores',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            url: { type: 'string', description: 'URL to audit (e.g., http://localhost:3000)' },
                            outputPath: { type: 'string', description: 'Path to save JSON report', default: './lighthouse-report.json' },
                            categories: { type: 'array', items: { type: 'string' }, description: 'Categories to audit', default: ['performance', 'accessibility', 'best-practices', 'seo'] },
                        },
                        required: ['url'],
                    },
                },
                {
                    name: 'collect_metrics',
                    description: 'Extract Core Web Vitals and key metrics from a Lighthouse report or run a new audit',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            url: { type: 'string', description: 'URL to audit' },
                            reportPath: { type: 'string', description: 'Path to existing Lighthouse JSON report' },
                        },
                    },
                },
                {
                    name: 'compare_audits',
                    description: 'Compare two Lighthouse reports to track performance changes',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            baselinePath: { type: 'string', description: 'Path to baseline report' },
                            currentPath: { type: 'string', description: 'Path to current report' },
                        },
                        required: ['baselinePath', 'currentPath'],
                    },
                },
                {
                    name: 'static_audit',
                    description: 'Perform a static audit of HTML files for SEO, accessibility, and performance issues without running Lighthouse',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            path: { type: 'string', description: 'Path to HTML file or directory' },
                        },
                        required: ['path'],
                    },
                },
            ],
        }));
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            switch (request.params.name) {
                case 'run_lighthouse':
                    return await this.handleRunLighthouse(request.params.arguments);
                case 'collect_metrics':
                    return await this.handleCollectMetrics(request.params.arguments);
                case 'compare_audits':
                    return await this.handleCompareAudits(request.params.arguments);
                case 'static_audit':
                    return await this.handleStaticAudit(request.params.arguments);
                default:
                    throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
            }
        });
    }
    async handleRunLighthouse(args) {
        const { url, outputPath = './lighthouse-report.json', categories } = args;
        try {
            const result = runLighthouse(url, outputPath, categories);
            return {
                content: [{ type: 'text', text: JSON.stringify({ success: true, result }, null, 2) }],
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
    async handleCollectMetrics(args) {
        const { url, reportPath } = args;
        try {
            let result;
            if (reportPath && fs.existsSync(reportPath)) {
                const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
                const cats = report.categories || {};
                const audits = report.audits || {};
                result = {
                    url: report.finalUrl || url || 'unknown',
                    metrics: {
                        performance: Math.round((cats.performance?.score || 0) * 100),
                        accessibility: Math.round((cats.accessibility?.score || 0) * 100),
                        bestPractices: Math.round((cats['best-practices']?.score || 0) * 100),
                        seo: Math.round((cats.seo?.score || 0) * 100),
                        pwa: Math.round((cats.pwa?.score || 0) * 100),
                        firstContentfulPaint: audits['first-contentful-paint']?.numericValue || 0,
                        largestContentfulPaint: audits['largest-contentful-paint']?.numericValue || 0,
                        totalBlockingTime: audits['total-blocking-time']?.numericValue || 0,
                        cumulativeLayoutShift: audits['cumulative-layout-shift']?.numericValue || 0,
                        speedIndex: audits['speed-index']?.numericValue || 0,
                    },
                    audits: [],
                    timestamp: new Date().toISOString(),
                };
            }
            else if (url) {
                result = runLighthouse(url, '/tmp/lh-metrics.json');
            }
            else {
                throw new Error('Provide either url or reportPath');
            }
            const cwv = {
                LCP: { value: result.metrics.largestContentfulPaint, target: 2500, status: result.metrics.largestContentfulPaint <= 2500 ? 'good' : result.metrics.largestContentfulPaint <= 4000 ? 'needs-improvement' : 'poor' },
                FID: { value: result.metrics.totalBlockingTime, target: 100, status: result.metrics.totalBlockingTime <= 100 ? 'good' : result.metrics.totalBlockingTime <= 300 ? 'needs-improvement' : 'poor' },
                CLS: { value: result.metrics.cumulativeLayoutShift, target: 0.1, status: result.metrics.cumulativeLayoutShift <= 0.1 ? 'good' : result.metrics.cumulativeLayoutShift <= 0.25 ? 'needs-improvement' : 'poor' },
                FCP: { value: result.metrics.firstContentfulPaint, target: 1800, status: result.metrics.firstContentfulPaint <= 1800 ? 'good' : 'needs-improvement' },
                SI: { value: result.metrics.speedIndex, target: 3400, status: result.metrics.speedIndex <= 3400 ? 'good' : 'needs-improvement' },
            };
            return {
                content: [{ type: 'text', text: JSON.stringify({ success: true, coreWebVitals: cwv, scores: result.metrics }, null, 2) }],
            };
        }
        catch (error) {
            return {
                content: [{ type: 'text', text: JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, null, 2) }],
                isError: true,
            };
        }
    }
    async handleCompareAudits(args) {
        const { baselinePath, currentPath } = args;
        try {
            const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf-8'));
            const current = JSON.parse(fs.readFileSync(currentPath, 'utf-8'));
            const bCats = baseline.categories || {};
            const cCats = current.categories || {};
            const bAudits = baseline.audits || {};
            const cAudits = current.audits || {};
            const diff = {
                performance: Math.round(((cCats.performance?.score || 0) - (bCats.performance?.score || 0)) * 100),
                accessibility: Math.round(((cCats.accessibility?.score || 0) - (bCats.accessibility?.score || 0)) * 100),
                bestPractices: Math.round(((cCats['best-practices']?.score || 0) - (bCats['best-practices']?.score || 0)) * 100),
                seo: Math.round(((cCats.seo?.score || 0) - (bCats.seo?.score || 0)) * 100),
                LCP: (cAudits['largest-contentful-paint']?.numericValue || 0) - (bAudits['largest-contentful-paint']?.numericValue || 0),
                TBT: (cAudits['total-blocking-time']?.numericValue || 0) - (bAudits['total-blocking-time']?.numericValue || 0),
                CLS: (cAudits['cumulative-layout-shift']?.numericValue || 0) - (bAudits['cumulative-layout-shift']?.numericValue || 0),
            };
            return {
                content: [{ type: 'text', text: JSON.stringify({ success: true, diff, improved: diff.performance > 0 }, null, 2) }],
            };
        }
        catch (error) {
            return {
                content: [{ type: 'text', text: JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, null, 2) }],
                isError: true,
            };
        }
    }
    async handleStaticAudit(args) {
        const { path: targetPath } = args;
        try {
            const isDir = fs.statSync(targetPath).isDirectory();
            const files = [];
            if (isDir) {
                const scan = (dir) => {
                    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
                        const full = path.join(dir, entry.name);
                        if (entry.isDirectory() && !['node_modules', 'build', 'dist'].includes(entry.name))
                            scan(full);
                        else if (entry.name.endsWith('.html'))
                            files.push(full);
                    }
                };
                scan(targetPath);
            }
            else {
                files.push(targetPath);
            }
            const results = files.map(f => ({ file: f, ...analyzeHtmlFile(f) }));
            const avgScore = results.reduce((a, r) => a + r.score, 0) / (results.length || 1);
            return {
                content: [{ type: 'text', text: JSON.stringify({ success: true, averageScore: Math.round(avgScore), results }, null, 2) }],
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
        console.error('Lighthouse Runner MCP server running on stdio');
    }
}
const server = new LighthouseRunnerServer();
server.run().catch(console.error);
//# sourceMappingURL=index.js.map