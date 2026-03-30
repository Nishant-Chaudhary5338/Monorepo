#!/usr/bin/env node
import { McpServerBase } from '../../_shared/index.js';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
function readFileContent(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf-8');
    }
    catch {
        return null;
    }
}
function writeFileContent(filePath, content) {
    fs.writeFileSync(filePath, content, 'utf-8');
}
function findComponentFile(componentDir, componentName) {
    const extensions = ['.tsx', '.ts', '.jsx', '.js'];
    for (const ext of extensions) {
        const filePath = path.join(componentDir, `${componentName}${ext}`);
        if (fs.existsSync(filePath))
            return filePath;
    }
    return null;
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
        const err = error;
        const output = err.stdout?.toString() || err.stderr?.toString() || err.message;
        const errors = output.split('\n').filter((line) => line.trim().length > 0);
        return { errors: errors.slice(0, 20), passed: false };
    }
}
// ============================================================================
// FIX ENGINE - Line-based transformations
// ============================================================================
class FixEngine {
    content;
    filePath;
    lines;
    modified = false;
    fixes = [];
    constructor(content, filePath) {
        this.content = content;
        this.filePath = filePath;
        this.lines = content.split('\n');
    }
    hasModifications() {
        return this.modified;
    }
    getFixes() {
        return this.fixes;
    }
    getResult() {
        return this.lines.join('\n');
    }
    // Apply a fix for a specific issue
    applyFix(issue) {
        if (!issue.fixable || !issue.fixType) {
            this.fixes.push({
                issueId: issue.id,
                category: issue.category,
                line: issue.line,
                message: issue.message,
                applied: false,
                detail: 'Issue is not fixable or missing fixType',
            });
            return;
        }
        try {
            switch (issue.fixType) {
                case 'remove':
                    this.applyRemove(issue);
                    break;
                case 'replace':
                    this.applyReplace(issue);
                    break;
                case 'add':
                    this.applyAdd(issue);
                    break;
                case 'refactor':
                    this.applyRefactor(issue);
                    break;
                default:
                    this.fixes.push({
                        issueId: issue.id,
                        category: issue.category,
                        line: issue.line,
                        message: issue.message,
                        applied: false,
                        detail: `Unknown fixType: ${issue.fixType}`,
                    });
            }
        }
        catch (error) {
            this.fixes.push({
                issueId: issue.id,
                category: issue.category,
                line: issue.line,
                message: issue.message,
                applied: false,
                detail: `Error: ${error instanceof Error ? error.message : String(error)}`,
            });
        }
    }
    // ============================================================================
    // REMOVE FIXES
    // ============================================================================
    applyRemove(issue) {
        // Console statements
        if (issue.category === 'code-quality' && issue.message.includes('Console statement')) {
            if (issue.line && issue.line > 0) {
                const lineIdx = issue.line - 1;
                const line = this.lines[lineIdx];
                if (line.match(/console\.(log|debug|info)\(/)) {
                    this.lines.splice(lineIdx, 1);
                    this.modified = true;
                    this.fixes.push({
                        issueId: issue.id,
                        category: issue.category,
                        line: issue.line,
                        message: issue.message,
                        applied: true,
                        detail: `Removed console statement at line ${issue.line}`,
                    });
                    return;
                }
            }
        }
        this.fixes.push({
            issueId: issue.id,
            category: issue.category,
            line: issue.line,
            message: issue.message,
            applied: false,
            detail: 'Remove fix not implemented for this issue type',
        });
    }
    // ============================================================================
    // REPLACE FIXES
    // ============================================================================
    applyReplace(issue) {
        const lineIdx = issue.line ? issue.line - 1 : -1;
        // TypeScript: Replace 'any' type
        if (issue.category === 'type-safety' && issue.message.includes("'any' type")) {
            if (lineIdx >= 0 && lineIdx < this.lines.length) {
                let line = this.lines[lineIdx];
                // Replace `: any` with `: unknown`
                line = line.replace(/:\s*any\b/g, ': unknown');
                // Replace `<any>` with `<unknown>`
                line = line.replace(/<any>/g, '<unknown>');
                // Replace `as any` with `as unknown`
                line = line.replace(/\bas\s+any\b/g, 'as unknown');
                this.lines[lineIdx] = line;
                this.modified = true;
                this.fixes.push({
                    issueId: issue.id,
                    category: issue.category,
                    line: issue.line,
                    message: issue.message,
                    applied: true,
                    detail: `Replaced 'any' with 'unknown' at line ${issue.line}`,
                });
                return;
            }
        }
        // TypeScript: Replace non-null assertion with optional chaining
        if (issue.category === 'type-safety' && issue.message.includes('Non-null assertion')) {
            if (lineIdx >= 0 && lineIdx < this.lines.length) {
                let line = this.lines[lineIdx];
                // Replace `obj!.prop` with `obj?.prop`
                line = line.replace(/(\w+)!\./g, '$1?.');
                this.lines[lineIdx] = line;
                this.modified = true;
                this.fixes.push({
                    issueId: issue.id,
                    category: issue.category,
                    line: issue.line,
                    message: issue.message,
                    applied: true,
                    detail: `Replaced non-null assertion with optional chaining at line ${issue.line}`,
                });
                return;
            }
        }
        // Accessibility: Replace positive tabIndex
        if (issue.category === 'accessibility' && issue.message.includes('positive tabIndex')) {
            if (lineIdx >= 0 && lineIdx < this.lines.length) {
                let line = this.lines[lineIdx];
                line = line.replace(/tabIndex=["'][1-9]\d*["']/g, 'tabIndex={0}');
                this.lines[lineIdx] = line;
                this.modified = true;
                this.fixes.push({
                    issueId: issue.id,
                    category: issue.category,
                    line: issue.line,
                    message: issue.message,
                    applied: true,
                    detail: `Replaced positive tabIndex with 0 at line ${issue.line}`,
                });
                return;
            }
        }
        // Accessibility: Fix heading hierarchy
        if (issue.category === 'accessibility' && issue.message.includes('Heading level skipped')) {
            if (lineIdx >= 0 && lineIdx < this.lines.length) {
                const match = issue.message.match(/to h(\d)/);
                if (match) {
                    const correctLevel = parseInt(match[1]) - 1;
                    let line = this.lines[lineIdx];
                    line = line.replace(/<h\d/, `<h${correctLevel}`);
                    line = line.replace(/<\/h\d>/, `</h${correctLevel}>`);
                    this.lines[lineIdx] = line;
                    this.modified = true;
                    this.fixes.push({
                        issueId: issue.id,
                        category: issue.category,
                        line: issue.line,
                        message: issue.message,
                        applied: true,
                        detail: `Fixed heading hierarchy to h${correctLevel} at line ${issue.line}`,
                    });
                    return;
                }
            }
        }
        // Accessibility: Replace autoplay media
        if (issue.category === 'accessibility' && issue.message.includes('Autoplay media')) {
            if (lineIdx >= 0 && lineIdx < this.lines.length) {
                let line = this.lines[lineIdx];
                line = line.replace(/\s*autoPlay/, ' controls muted');
                this.lines[lineIdx] = line;
                this.modified = true;
                this.fixes.push({
                    issueId: issue.id,
                    category: issue.category,
                    line: issue.line,
                    message: issue.message,
                    applied: true,
                    detail: `Replaced autoplay with controls muted at line ${issue.line}`,
                });
                return;
            }
        }
        // Styling: Replace hardcoded colors with CSS variable suggestion
        if (issue.category === 'styling' && issue.message.includes('Hardcoded color')) {
            if (lineIdx >= 0 && lineIdx < this.lines.length) {
                this.fixes.push({
                    issueId: issue.id,
                    category: issue.category,
                    line: issue.line,
                    message: issue.message,
                    applied: false,
                    detail: 'Hardcoded color replacement requires design token mapping - flagged for manual review',
                });
                return;
            }
        }
        this.fixes.push({
            issueId: issue.id,
            category: issue.category,
            line: issue.line,
            message: issue.message,
            applied: false,
            detail: 'Replace fix not implemented for this issue type',
        });
    }
    // ============================================================================
    // ADD FIXES
    // ============================================================================
    applyAdd(issue) {
        // React: Add displayName
        if (issue.category === 'react-patterns' && issue.message.includes('displayName')) {
            const componentNameMatch = issue.suggestion.match(/(\w+)\.displayName/);
            const componentName = componentNameMatch ? componentNameMatch[1] : null;
            if (componentName) {
                // Find the last export statement or end of file
                let insertIdx = this.lines.length;
                for (let i = this.lines.length - 1; i >= 0; i--) {
                    if (this.lines[i].match(/export\s*\{/) || this.lines[i].match(/export\s+default/)) {
                        insertIdx = i;
                        break;
                    }
                }
                // Insert displayName before export
                this.lines.splice(insertIdx, 0, '', `${componentName}.displayName = '${componentName}';`);
                this.modified = true;
                this.fixes.push({
                    issueId: issue.id,
                    category: issue.category,
                    line: issue.line,
                    message: issue.message,
                    applied: true,
                    detail: `Added displayName = '${componentName}'`,
                });
                return;
            }
        }
        const lineIdx = issue.line ? issue.line - 1 : -1;
        // Accessibility: Add alt to images
        if (issue.category === 'accessibility' && issue.message.includes('Image missing alt')) {
            if (lineIdx >= 0 && lineIdx < this.lines.length) {
                let line = this.lines[lineIdx];
                // Add alt="" before /> or > in img tags
                if (line.match(/<img\s[^/]*\/?\s*>/)) {
                    line = line.replace(/<img\s/, '<img alt="" ');
                    line = line.replace(/<img\s([^>]*[^/])\s*>/, '<img $1 />');
                    if (!line.includes('/>')) {
                        line = line.replace(/>$/, ' />');
                    }
                    this.lines[lineIdx] = line;
                    this.modified = true;
                    this.fixes.push({
                        issueId: issue.id,
                        category: issue.category,
                        line: issue.line,
                        message: issue.message,
                        applied: true,
                        detail: `Added alt="" to image at line ${issue.line}`,
                    });
                    return;
                }
            }
        }
        // Accessibility: Add label to form inputs
        if (issue.category === 'accessibility' && issue.message.includes('Form input missing')) {
            if (lineIdx >= 0 && lineIdx < this.lines.length) {
                let line = this.lines[lineIdx];
                // Add aria-label if no id exists
                if (!line.includes('aria-label') && !line.includes('aria-labelledby')) {
                    const inputTypeMatch = line.match(/type=["'](\w+)["']/);
                    const placeholder = inputTypeMatch ? inputTypeMatch[1] : 'input';
                    line = line.replace(/<input\s/, `<input aria-label="${placeholder}" `);
                    this.lines[lineIdx] = line;
                    this.modified = true;
                    this.fixes.push({
                        issueId: issue.id,
                        category: issue.category,
                        line: issue.line,
                        message: issue.message,
                        applied: true,
                        detail: `Added aria-label to input at line ${issue.line}`,
                    });
                    return;
                }
            }
        }
        // Accessibility: Add role/tabIndex to clickable divs
        if (issue.category === 'accessibility' && issue.message.includes('Clickable div missing')) {
            if (lineIdx >= 0 && lineIdx < this.lines.length) {
                let line = this.lines[lineIdx];
                if (line.includes('onClick') && !line.includes('role=')) {
                    line = line.replace(/<div/, '<div role="button" tabIndex={0}');
                    this.lines[lineIdx] = line;
                    this.modified = true;
                    this.fixes.push({
                        issueId: issue.id,
                        category: issue.category,
                        line: issue.line,
                        message: issue.message,
                        applied: true,
                        detail: `Added role="button" and tabIndex={0} to clickable div at line ${issue.line}`,
                    });
                    return;
                }
            }
        }
        // Accessibility: Add aria-label to icon buttons
        if (issue.category === 'accessibility' && issue.message.includes('Icon button missing')) {
            if (lineIdx >= 0 && lineIdx < this.lines.length) {
                let line = this.lines[lineIdx];
                if ((line.includes('<button') || line.includes('<a')) && !line.includes('aria-label')) {
                    line = line.replace(/<(button|a)/, '<$1 aria-label="Button action"');
                    this.lines[lineIdx] = line;
                    this.modified = true;
                    this.fixes.push({
                        issueId: issue.id,
                        category: issue.category,
                        line: issue.line,
                        message: issue.message,
                        applied: true,
                        detail: `Added aria-label to icon button at line ${issue.line}`,
                    });
                    return;
                }
            }
        }
        // Accessibility: Add href to links
        if (issue.category === 'accessibility' && issue.message.includes('Link element missing href')) {
            if (lineIdx >= 0 && lineIdx < this.lines.length) {
                let line = this.lines[lineIdx];
                if (line.match(/<a\s[^>]*>/) && !line.includes('href=')) {
                    line = line.replace(/<a\s/, '<a href="#" ');
                    this.lines[lineIdx] = line;
                    this.modified = true;
                    this.fixes.push({
                        issueId: issue.id,
                        category: issue.category,
                        line: issue.line,
                        message: issue.message,
                        applied: true,
                        detail: `Added href="#" to link at line ${issue.line} (update with actual URL)`,
                    });
                    return;
                }
            }
        }
        // Accessibility: Add focus styles comment
        if (issue.category === 'accessibility' && issue.message.includes('focus styles')) {
            // Add comment at end of file suggesting focus styles
            this.lines.push('');
            this.lines.push('/* TODO: Add focus styles for interactive elements:');
            this.lines.push('   :focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }');
            this.lines.push('*/');
            this.modified = true;
            this.fixes.push({
                issueId: issue.id,
                category: issue.category,
                line: issue.line,
                message: issue.message,
                applied: true,
                detail: 'Added TODO comment for focus styles',
            });
            return;
        }
        // React: Add key prop to map
        if (issue.category === 'react-patterns' && issue.message.includes('Missing key prop')) {
            this.fixes.push({
                issueId: issue.id,
                category: issue.category,
                line: issue.line,
                message: issue.message,
                applied: false,
                detail: 'Missing key prop requires understanding the data structure - flagged for manual review',
            });
            return;
        }
        // React: Add useEffect cleanup
        if (issue.category === 'react-patterns' && issue.message.includes('cleanup')) {
            this.fixes.push({
                issueId: issue.id,
                category: issue.category,
                line: issue.line,
                message: issue.message,
                applied: false,
                detail: 'useEffect cleanup requires understanding the effect logic - flagged for manual review',
            });
            return;
        }
        this.fixes.push({
            issueId: issue.id,
            category: issue.category,
            line: issue.line,
            message: issue.message,
            applied: false,
            detail: 'Add fix not implemented for this issue type',
        });
    }
    // ============================================================================
    // REFACTOR FIXES
    // ============================================================================
    applyRefactor(issue) {
        const lineIdx = issue.line ? issue.line - 1 : -1;
        // Performance: Extract inline arrow function from JSX
        if (issue.category === 'performance' && issue.message.includes('Inline arrow function')) {
            if (lineIdx >= 0 && lineIdx < this.lines.length) {
                const line = this.lines[lineIdx];
                const handlerMatch = line.match(/(onClick|onChange|onSubmit|onFocus|onBlur)=\{([^}]+=>[^}]+)\}/);
                if (handlerMatch) {
                    const eventName = handlerMatch[1];
                    const handlerBody = handlerMatch[2];
                    const handlerName = `handle${eventName.charAt(2).toUpperCase() + eventName.slice(3)}`;
                    // Replace inline handler with named reference
                    this.lines[lineIdx] = line.replace(new RegExp(`${eventName}=\\{[^}]+=>[^}]+\\}`), `${eventName}={${handlerName}}`);
                    // Add TODO comment about extracting the handler
                    this.lines.splice(lineIdx, 0, `// TODO: Extract ${handlerName} = ${handlerBody} as a named function or useCallback`);
                    this.modified = true;
                    this.fixes.push({
                        issueId: issue.id,
                        category: issue.category,
                        line: issue.line,
                        message: issue.message,
                        applied: true,
                        detail: `Replaced inline ${eventName} handler with reference at line ${issue.line}`,
                    });
                    return;
                }
            }
        }
        // Performance: Extract inline object literal from JSX
        if (issue.category === 'performance' && issue.message.includes('Inline object literal')) {
            if (lineIdx >= 0 && lineIdx < this.lines.length) {
                const line = this.lines[lineIdx];
                const styleMatch = line.match(/style=\{\{([^}]+)\}\}/);
                if (styleMatch) {
                    // Replace with TODO comment
                    this.lines[lineIdx] = line.replace(/style=\{\{[^}]+\}\}/, 'style={styles} // TODO: Extract to constant or useMemo');
                    this.modified = true;
                    this.fixes.push({
                        issueId: issue.id,
                        category: issue.category,
                        line: issue.line,
                        message: issue.message,
                        applied: true,
                        detail: `Replaced inline style object with reference at line ${issue.line}`,
                    });
                    return;
                }
            }
        }
        // Performance: Lazy useState initialization
        if (issue.category === 'performance' && issue.message.includes('Complex initial state')) {
            this.fixes.push({
                issueId: issue.id,
                category: issue.category,
                line: issue.line,
                message: issue.message,
                applied: false,
                detail: 'Lazy useState initialization requires understanding the initial value - flagged for manual review',
            });
            return;
        }
        // Code quality: Magic numbers - skip (adding TODO comments creates more issues)
        if (issue.category === 'code-quality' && issue.message.includes('Magic number')) {
            this.fixes.push({
                issueId: issue.id,
                category: issue.category,
                line: issue.line,
                message: issue.message,
                applied: false,
                detail: 'Skipped - magic number fixes require manual refactoring to named constants',
            });
            return;
        }
        // Security: Refactor innerHTML
        if (issue.category === 'security' && issue.message.includes('innerHTML')) {
            if (lineIdx >= 0 && lineIdx < this.lines.length) {
                this.lines[lineIdx] = this.lines[lineIdx] + ' // TODO: Replace innerHTML with React declarative rendering';
                this.modified = true;
                this.fixes.push({
                    issueId: issue.id,
                    category: issue.category,
                    line: issue.line,
                    message: issue.message,
                    applied: true,
                    detail: `Added TODO comment for innerHTML usage at line ${issue.line}`,
                });
                return;
            }
        }
        // Security: Refactor hardcoded secrets
        if (issue.category === 'security' && issue.message.includes('hardcoded secret')) {
            if (lineIdx >= 0 && lineIdx < this.lines.length) {
                let line = this.lines[lineIdx];
                line = line.replace(/(["'][^"']*(?:api[_-]?key|secret|password|token)[^"']*["'])\s*[:=]\s*["'][^"']+["']/gi, '$1: process.env.REACT_APP_SECRET || ""');
                this.lines[lineIdx] = line;
                this.modified = true;
                this.fixes.push({
                    issueId: issue.id,
                    category: issue.category,
                    line: issue.line,
                    message: issue.message,
                    applied: true,
                    detail: `Replaced hardcoded secret with env variable at line ${issue.line}`,
                });
                return;
            }
        }
        // Styling: Refactor !important
        if (issue.category === 'styling' && issue.message.includes('!important')) {
            this.fixes.push({
                issueId: issue.id,
                category: issue.category,
                line: issue.line,
                message: issue.message,
                applied: false,
                detail: '!important removal requires CSS restructuring - flagged for manual review',
            });
            return;
        }
        this.fixes.push({
            issueId: issue.id,
            category: issue.category,
            line: issue.line,
            message: issue.message,
            applied: false,
            detail: 'Refactor fix not implemented for this issue type',
        });
    }
}
// ============================================================================
// MAIN FIX HANDLER
// ============================================================================
function fixFromReview(componentDir, componentName, reviewResult) {
    const componentFile = findComponentFile(componentDir, componentName);
    if (!componentFile) {
        return {
            success: false,
            component: componentName,
            file: '',
            summary: { totalFixable: 0, applied: 0, skipped: 0, failed: 0 },
            fixes: [],
            remainingIssues: [],
            typescriptCheck: { passed: false, errors: ['Component file not found'] },
        };
    }
    const content = readFileContent(componentFile);
    if (!content) {
        return {
            success: false,
            component: componentName,
            file: componentFile,
            summary: { totalFixable: 0, applied: 0, skipped: 0, failed: 0 },
            fixes: [],
            remainingIssues: [],
            typescriptCheck: { passed: false, errors: ['Could not read component file'] },
        };
    }
    // Get fixable issues
    const fixableIssues = reviewResult.issues.filter(i => i.fixable);
    const scoreBefore = reviewResult.summary.overallScore;
    const gradeBefore = reviewResult.summary.grade;
    // Run fix engine
    const engine = new FixEngine(content, componentFile);
    for (const issue of fixableIssues) {
        engine.applyFix(issue);
    }
    // Write modified content if changes were made
    if (engine.hasModifications()) {
        writeFileContent(componentFile, engine.getResult());
    }
    // Run TypeScript check after fixes
    const tsResult = runTypeScriptCheck(componentDir);
    // Count results
    const fixes = engine.getFixes();
    const applied = fixes.filter(f => f.applied).length;
    const skipped = fixes.filter(f => !f.applied && !f.detail.includes('Error')).length;
    const failed = fixes.filter(f => !f.applied && f.detail.includes('Error')).length;
    // Get remaining non-fixable issues
    const remainingIssues = reviewResult.issues.filter(i => !i.fixable);
    return {
        success: true,
        component: componentName,
        file: path.relative(process.cwd(), componentFile),
        summary: {
            totalFixable: fixableIssues.length,
            applied,
            skipped,
            failed,
            scoreBefore,
            gradeBefore,
        },
        fixes,
        remainingIssues,
        typescriptCheck: tsResult,
    };
}
// ============================================================================
// MCP SERVER
// ============================================================================
class ComponentFixerServer extends McpServerBase {
    constructor() {
        super({ name: 'component-fixer', version: '3.0.0' });
    }
    registerTools() {
        this.addTool('fix', 'Comprehensive React component fixer - applies fixes from review JSON output for type-safety, accessibility, performance, security, code quality, and more', {
            type: 'object',
            properties: {
                path: {
                    type: 'string',
                    description: 'Path to the component directory',
                },
                reviewResult: {
                    type: 'object',
                    description: 'Review result JSON from component-reviewer (optional - if not provided, will run reviewer internally)',
                },
            },
            required: ['path'],
        }, this.handleFix.bind(this));
        this.addTool('fix_from_review', 'Fix component issues from a pre-computed review JSON. Pass the exact output from component-reviewer.', {
            type: 'object',
            properties: {
                path: {
                    type: 'string',
                    description: 'Path to the component directory',
                },
                reviewJson: {
                    type: 'string',
                    description: 'JSON string from component-reviewer output',
                },
            },
            required: ['path', 'reviewJson'],
        }, this.handleFixFromReview.bind(this));
    }
    async handleFix(args) {
        const { path: componentPath, reviewResult } = args;
        try {
            const resolvedPath = path.resolve(componentPath);
            if (!fs.existsSync(resolvedPath)) {
                throw new Error(`Component path does not exist: ${componentPath}`);
            }
            // Handle both file and directory paths
            let componentDir;
            let componentName;
            const stat = fs.statSync(resolvedPath);
            if (stat.isFile()) {
                componentDir = path.dirname(resolvedPath);
                componentName = path.basename(resolvedPath, path.extname(resolvedPath));
            }
            else {
                componentDir = resolvedPath;
                componentName = path.basename(resolvedPath);
            }
            // If no review result provided, we need to run the reviewer first
            // For MCP tool usage, the caller should provide the review result
            // This is handled by the review-and-fix CLI
            if (!reviewResult) {
                return {
                    content: [{
                            type: 'text',
                            text: JSON.stringify({
                                success: false,
                                error: {
                                    code: 'MISSING_REVIEW',
                                    message: 'No reviewResult provided. Use fix_from_review with reviewJson, or use the review-and-fix CLI.',
                                    suggestion: 'component-reviewer packages/ui/components/MyComponent | component-fixer --stdin',
                                },
                            }, null, 2),
                        }],
                    isError: true,
                };
            }
            const result = fixFromReview(componentDir, componentName, reviewResult);
            return {
                content: [{
                        type: 'text',
                        text: JSON.stringify(result, null, 2),
                    }],
            };
        }
        catch (error) {
            return {
                content: [{
                        type: 'text',
                        text: JSON.stringify({
                            success: false,
                            error: {
                                code: error instanceof Error ? error.constructor.name : 'UNKNOWN_ERROR',
                                message: error instanceof Error ? error.message : String(error),
                                suggestion: 'Check input parameters and ensure the component path is valid.',
                                timestamp: new Date().toISOString(),
                            },
                        }, null, 2),
                    }],
                isError: true,
            };
        }
    }
    async handleFixFromReview(args) {
        const { path: componentPath, reviewJson } = args;
        try {
            const reviewResult = JSON.parse(reviewJson);
            const resolvedPath = path.resolve(componentPath);
            let componentDir;
            let componentName;
            const stat = fs.statSync(resolvedPath);
            if (stat.isFile()) {
                componentDir = path.dirname(resolvedPath);
                componentName = path.basename(resolvedPath, path.extname(resolvedPath));
            }
            else {
                componentDir = resolvedPath;
                componentName = path.basename(resolvedPath);
            }
            const result = fixFromReview(componentDir, componentName, reviewResult);
            return {
                content: [{
                        type: 'text',
                        text: JSON.stringify(result, null, 2),
                    }],
            };
        }
        catch (error) {
            return {
                content: [{
                        type: 'text',
                        text: JSON.stringify({
                            success: false,
                            error: {
                                code: error instanceof Error ? error.constructor.name : 'UNKNOWN_ERROR',
                                message: error instanceof Error ? error.message : String(error),
                                suggestion: 'Ensure reviewJson is valid JSON from component-reviewer.',
                                timestamp: new Date().toISOString(),
                            },
                        }, null, 2),
                    }],
                isError: true,
            };
        }
    }
}
new ComponentFixerServer().run().catch(console.error);
//# sourceMappingURL=index.js.map