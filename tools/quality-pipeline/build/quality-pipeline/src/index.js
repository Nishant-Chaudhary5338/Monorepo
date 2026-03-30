#!/usr/bin/env node
import { McpServerBase } from '../../_shared/index.js';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
// ============================================================================
// STAGE RUNNERS
// ============================================================================
function runTestStage(projectRoot) {
    const start = Date.now();
    try {
        const runner = fs.existsSync(path.join(projectRoot, 'vitest.config.ts')) ? 'vitest' : 'jest';
        const cmd = runner === 'vitest'
            ? `npx vitest run --reporter=json 2>&1 || true`
            : `npx jest --json 2>&1 || true`;
        const output = execSync(cmd, { cwd: projectRoot, encoding: 'utf-8', timeout: 120000, maxBuffer: 10 * 1024 * 1024 });
        let passed = 0, failed = 0;
        try {
            const jsonMatch = output.match(/\{[\s\S]*"numPassedTests"[\s\S]*\}/);
            if (jsonMatch) {
                const data = JSON.parse(jsonMatch[0]);
                passed = data.numPassedTests || 0;
                failed = data.numFailedTests || 0;
            }
        }
        catch {
            const passMatch = output.match(/(\d+)\s+passed/);
            const failMatch = output.match(/(\d+)\s+failed/);
            if (passMatch)
                passed = parseInt(passMatch[1]);
            if (failMatch)
                failed = parseInt(failMatch[1]);
        }
        return {
            name: 'Tests',
            status: failed > 0 ? 'fail' : 'pass',
            duration: Date.now() - start,
            summary: `${passed} passed, ${failed} failed`,
            details: { passed, failed, runner },
        };
    }
    catch (error) {
        return {
            name: 'Tests',
            status: 'fail',
            duration: Date.now() - start,
            summary: `Test execution failed: ${{
                error: true,
                code: error instanceof Error ? error.constructor.name : 'UNKNOWN_ERROR',
                message: error instanceof Error ? error.message : String(error),
                suggestion: 'Check input parameters and ensure all required values are provided.',
                timestamp: new Date().toISOString(),
            }}`,
            details: { error: true },
        };
    }
}
function runPerformanceStage(projectRoot) {
    const start = Date.now();
    try {
        const files = scanDirectory(projectRoot, ['.ts', '.tsx', '.js', '.jsx']);
        const issues = [];
        for (const file of files) {
            const content = fs.readFileSync(file, 'utf-8');
            const lines = content.split('\n');
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                // Heavy imports
                for (const lib of ['moment', 'lodash', 'jquery']) {
                    if (line.includes(`from '${lib}'`) || line.includes(`from "${lib}"`)) {
                        issues.push({ file, line: i + 1, type: 'heavy-import', lib });
                    }
                }
                // Memory leaks
                if (line.includes('useEffect(')) {
                    const block = lines.slice(i, Math.min(i + 15, lines.length)).join('\n');
                    if (block.includes('addEventListener') && !block.includes('removeEventListener')) {
                        issues.push({ file, line: i + 1, type: 'memory-leak' });
                    }
                    if (block.includes('setInterval') && !block.includes('clearInterval')) {
                        issues.push({ file, line: i + 1, type: 'memory-leak' });
                    }
                }
                // Console.log
                if (line.match(/console\.(log|debug)\(/) && !file.includes('.test.')) {
                    issues.push({ file, line: i + 1, type: 'console-log' });
                }
            }
        }
        const high = issues.filter(i => ['heavy-import', 'memory-leak'].includes(i.type)).length;
        const low = issues.filter(i => i.type === 'console-log').length;
        return {
            name: 'Performance',
            status: high > 0 ? 'fail' : low > 3 ? 'warn' : 'pass',
            duration: Date.now() - start,
            summary: `${issues.length} issues found (${high} critical)`,
            details: { totalIssues: issues.length, critical: high, minor: low, issues: issues.slice(0, 20) },
        };
    }
    catch (error) {
        return {
            name: 'Performance',
            status: 'warn',
            duration: Date.now() - start,
            summary: 'Performance analysis failed',
            details: { error: true },
        };
    }
}
function runAccessibilityStage(projectRoot) {
    const start = Date.now();
    try {
        const files = scanDirectory(projectRoot, ['.tsx', '.jsx', '.html']);
        const issues = [];
        for (const file of files) {
            const content = fs.readFileSync(file, 'utf-8');
            const lines = content.split('\n');
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                // Missing alt on images
                if (line.match(/<img\s/) && !line.includes('alt=') && !line.includes('aria-label=')) {
                    issues.push({ file, line: i + 1, rule: 'image-alt', impact: 'critical' });
                }
                // Empty buttons
                if (line.match(/<button[^>]*>\s*<\/button>/)) {
                    issues.push({ file, line: i + 1, rule: 'button-name', impact: 'critical' });
                }
                // Positive tabindex
                if (line.match(/tabindex=["'][1-9]/)) {
                    issues.push({ file, line: i + 1, rule: 'tabindex', impact: 'serious' });
                }
                // Missing label on input
                if (line.match(/<input\s/) && !line.includes('type="hidden"') && !line.includes('aria-label') && !line.includes('aria-labelledby')) {
                    issues.push({ file, line: i + 1, rule: 'label', impact: 'critical' });
                }
            }
        }
        const critical = issues.filter(i => i.impact === 'critical').length;
        const serious = issues.filter(i => i.impact === 'serious').length;
        return {
            name: 'Accessibility',
            status: critical > 0 ? 'fail' : serious > 0 ? 'warn' : 'pass',
            duration: Date.now() - start,
            summary: `${issues.length} issues (${critical} critical, ${serious} serious)`,
            details: { totalIssues: issues.length, critical, serious, issues: issues.slice(0, 20) },
        };
    }
    catch (error) {
        return {
            name: 'Accessibility',
            status: 'warn',
            duration: Date.now() - start,
            summary: 'Accessibility analysis failed',
            details: { error: true },
        };
    }
}
function runDesignTokensStage(projectRoot) {
    const start = Date.now();
    try {
        const files = scanDirectory(projectRoot, ['.ts', '.tsx', '.js', '.jsx', '.css']);
        const violations = [];
        const knownColors = ['#ffffff', '#fff', '#000000', '#000', '#f5f5f5', '#e5e5e5', '#3b82f6', '#22c55e', '#ef4444', '#eab308'];
        const knownSpacing = ['4px', '8px', '12px', '16px', '24px', '32px', '48px'];
        const knownFontSizes = ['12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px', '48px'];
        for (const file of files) {
            const content = fs.readFileSync(file, 'utf-8');
            const lines = content.split('\n');
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (line.trim().startsWith('import ') || line.trim().startsWith('//'))
                    continue;
                // Hardcoded colors
                const hexMatch = line.matchAll(/#[0-9a-fA-F]{3,6}\b/g);
                for (const m of hexMatch) {
                    if (!line.includes('--color-') && !line.includes('tokens')) {
                        violations.push({ file, line: i + 1, type: 'color', value: m[0] });
                    }
                }
                // Hardcoded spacing
                for (const s of knownSpacing) {
                    if (line.includes(s) && !line.includes('--spacing-') && !line.includes('tokens')) {
                        violations.push({ file, line: i + 1, type: 'spacing', value: s });
                    }
                }
                // Hardcoded font sizes
                for (const f of knownFontSizes) {
                    if (line.includes(f) && !line.includes('--font-size-') && !line.includes('tokens')) {
                        violations.push({ file, line: i + 1, type: 'font-size', value: f });
                    }
                }
            }
        }
        return {
            name: 'Design Tokens',
            status: violations.length > 20 ? 'fail' : violations.length > 5 ? 'warn' : 'pass',
            duration: Date.now() - start,
            summary: `${violations.length} hardcoded values found`,
            details: {
                totalViolations: violations.length,
                colors: violations.filter(v => v.type === 'color').length,
                spacing: violations.filter(v => v.type === 'spacing').length,
                fontSizes: violations.filter(v => v.type === 'font-size').length,
            },
        };
    }
    catch (error) {
        return {
            name: 'Design Tokens',
            status: 'warn',
            duration: Date.now() - start,
            summary: 'Design token analysis failed',
            details: { error: true },
        };
    }
}
// ============================================================================
// HELPERS
// ============================================================================
function scanDirectory(dir, exts) {
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
function calculateGrade(stages) {
    const fails = stages.filter(s => s.status === 'fail').length;
    const warns = stages.filter(s => s.status === 'warn').length;
    if (fails === 0 && warns === 0)
        return 'A';
    if (fails === 0 && warns <= 1)
        return 'B';
    if (fails === 0)
        return 'C';
    if (fails <= 1)
        return 'D';
    return 'F';
}
// ============================================================================
// MAIN SERVER
// ============================================================================
class QualityPipelineServer extends McpServerBase {
    constructor() {
        super({ name: 'quality-pipeline', version: '1.0.0' });
        process.on('SIGINT', async () => {
            await this.server.close();
            process.exit(0);
        });
    }
    registerTools() {
        this.addTool('run_full_pipeline', 'Run the complete quality pipeline (tests, performance, accessibility, design tokens)', {
            type: 'object',
            properties: {
                projectRoot: { type: 'string', description: 'Root directory of the project to analyze' },
                skipStages: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Stages to skip (tests, performance, accessibility, design)',
                    default: []
                },
            },
            required: ['projectRoot'],
        }, this.handleFullPipeline.bind(this));
        this.addTool('run_partial_pipeline', 'Run specific stages of the quality pipeline', {
            type: 'object',
            properties: {
                projectRoot: { type: 'string', description: 'Root directory of the project to analyze' },
                stages: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Stages to run (tests, performance, accessibility, design)'
                },
            },
            required: ['projectRoot', 'stages'],
        }, this.handlePartialPipeline.bind(this));
    }
    async handleFullPipeline(args) {
        const { projectRoot, skipStages = [] } = args;
        try {
            const stages = [];
            const totalStart = Date.now();
            if (!skipStages.includes('tests')) {
                stages.push(runTestStage(projectRoot));
            }
            else {
                stages.push({ name: 'Tests', status: 'skip', duration: 0, summary: 'Skipped', details: {} });
            }
            if (!skipStages.includes('performance')) {
                stages.push(runPerformanceStage(projectRoot));
            }
            else {
                stages.push({ name: 'Performance', status: 'skip', duration: 0, summary: 'Skipped', details: {} });
            }
            if (!skipStages.includes('accessibility')) {
                stages.push(runAccessibilityStage(projectRoot));
            }
            else {
                stages.push({ name: 'Accessibility', status: 'skip', duration: 0, summary: 'Skipped', details: {} });
            }
            if (!skipStages.includes('design')) {
                stages.push(runDesignTokensStage(projectRoot));
            }
            else {
                stages.push({ name: 'Design Tokens', status: 'skip', duration: 0, summary: 'Skipped', details: {} });
            }
            const activeStages = stages.filter(s => s.status !== 'skip');
            const hasFail = activeStages.some(s => s.status === 'fail');
            const hasWarn = activeStages.some(s => s.status === 'warn');
            const result = {
                overallStatus: hasFail ? 'fail' : hasWarn ? 'warn' : 'pass',
                grade: calculateGrade(activeStages),
                totalDuration: Date.now() - totalStart,
                stages,
                timestamp: new Date().toISOString(),
            };
            return this.success({ result });
        }
        catch (error) {
            return this.error(error);
        }
    }
    async handlePartialPipeline(args) {
        const { projectRoot, stages: stageNames } = args;
        try {
            const stages = [];
            const totalStart = Date.now();
            for (const stageName of stageNames) {
                switch (stageName) {
                    case 'tests':
                        stages.push(runTestStage(projectRoot));
                        break;
                    case 'performance':
                        stages.push(runPerformanceStage(projectRoot));
                        break;
                    case 'accessibility':
                        stages.push(runAccessibilityStage(projectRoot));
                        break;
                    case 'design':
                        stages.push(runDesignTokensStage(projectRoot));
                        break;
                    default:
                        stages.push({ name: stageName, status: 'skip', duration: 0, summary: 'Unknown stage', details: {} });
                }
            }
            const activeStages = stages.filter(s => s.status !== 'skip');
            const hasFail = activeStages.some(s => s.status === 'fail');
            const hasWarn = activeStages.some(s => s.status === 'warn');
            const result = {
                overallStatus: hasFail ? 'fail' : hasWarn ? 'warn' : 'pass',
                grade: calculateGrade(activeStages),
                totalDuration: Date.now() - totalStart,
                stages,
                timestamp: new Date().toISOString(),
            };
            return this.success({ result });
        }
        catch (error) {
            return this.error(error);
        }
    }
}
// ============================================================================
// ENTRY POINT
// ============================================================================
new QualityPipelineServer().run().catch(console.error);
//# sourceMappingURL=index.js.map