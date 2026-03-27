#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
function findTsconfig(startDir) {
    // Convert to absolute path if relative
    let current = path.resolve(startDir);
    const root = path.parse(current).root;
    while (current !== root) {
        const tsconfig = path.join(current, 'tsconfig.json');
        if (fs.existsSync(tsconfig)) {
            return tsconfig;
        }
        current = path.dirname(current);
    }
    return null;
}
function runTypeScriptCheck(componentDir) {
    try {
        const tsconfigPath = findTsconfig(componentDir);
        if (!tsconfigPath) {
            return { errors: ['No tsconfig.json found in parent directories'], passed: false };
        }
        execSync(`npx tsc --noEmit --project ${tsconfigPath}`, {
            cwd: path.dirname(tsconfigPath),
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
        const output = execSync(`npx vitest run ${testFile} --reporter=json`, {
            cwd: path.join(componentDir, '..', '..'),
            stdio: 'pipe',
            timeout: 60000,
        }).toString();
        try {
            const result = JSON.parse(output);
            return {
                passed: result.numPassedTests || 0,
                failed: result.numFailedTests || 0,
                errors: result.testResults?.[0]?.message ? [result.testResults[0].message] : [],
            };
        }
        catch {
            return { passed: 1, failed: 0, errors: [] };
        }
    }
    catch (error) {
        const output = error.stdout?.toString() || error.stderr?.toString() || error.message;
        return { passed: 0, failed: 1, errors: [output] };
    }
}
function checkAccessibility(componentDir, componentName) {
    const issues = [];
    const mainFile = path.join(componentDir, `${componentName}.tsx`);
    if (!fs.existsSync(mainFile)) {
        issues.push('Component file not found');
        return issues;
    }
    const content = fs.readFileSync(mainFile, 'utf-8');
    // Check for displayName
    if (!content.includes('.displayName')) {
        issues.push('Missing displayName for React DevTools debugging');
    }
    // Check for ref forwarding (important for accessibility)
    if (!content.includes('forwardRef')) {
        issues.push('Missing ref forwarding - important for focus management');
    }
    // Check for semantic HTML
    // If component uses native <button>, <a>, <input>, etc., it's already accessible
    const hasNativeSemantic = /<button|<a[^>]*href|<input|<select|<textarea/.test(content);
    // If it uses <div> with onClick, that's a problem
    if (/<div[^>]*onClick/.test(content) && !/<button|<a[^>]*href/.test(content)) {
        issues.push('Uses <div> with onClick - should use semantic <button> element');
    }
    // Check for keyboard event handlers
    if (!content.includes('onKeyDown') && content.includes('onClick') && !hasNativeSemantic) {
        issues.push('Missing keyboard event handlers for interactive elements');
    }
    // Check for focus styles
    if (!content.includes('focus-visible') && !content.includes('focus:')) {
        issues.push('Missing focus-visible styles for keyboard navigation');
    }
    // Check for disabled state handling
    if (content.includes('disabled') && !content.includes('disabled:pointer-events-none') && !content.includes('aria-disabled')) {
        issues.push('Disabled state not properly communicated to assistive technologies');
    }
    return issues;
}
function calculateQualityScore(typescriptPassed, testResults, a11yIssues, content, componentName) {
    const score = 100;
    // TypeScript errors
    if (!typescriptPassed)
        score -= 30;
    // Test failures
    if (testResults.failed > 0)
        score -= 25;
    // Accessibility issues
    score -= Math.min(a11yIssues.length * 5, 20);
    // Bonus points for good practices
    if (content.includes('forwardRef'))
        score += 5;
    if (content.includes('.displayName'))
        score += 5;
    if (content.includes('interface') && content.includes('Props'))
        score += 5;
    if (content.includes('cn('))
        score += 3;
    if (content.includes('focus-visible'))
        score += 3;
    if (content.includes('disabled:pointer-events-none'))
        score += 2;
    return Math.max(0, Math.min(100, score));
}
function generateSuggestions(typescriptPassed, testResults, a11yIssues, content) {
    const suggestions = [];
    if (!typescriptPassed) {
        suggestions.push('Fix TypeScript compilation errors');
    }
    if (testResults.failed > 0) {
        suggestions.push('Fix failing tests');
    }
    if (a11yIssues.length > 0) {
        suggestions.push('Address accessibility issues: ' + a11yIssues.slice(0, 3).join(', '));
    }
    if (!content.includes('forwardRef')) {
        suggestions.push('Add ref forwarding for better component composition');
    }
    if (!content.includes('.displayName')) {
        suggestions.push('Add displayName for better React DevTools debugging');
    }
    if (content.includes('<div') && content.includes('onClick')) {
        suggestions.push('Consider using semantic <button> element instead of <div>');
    }
    if (!content.includes('focus-visible')) {
        suggestions.push('Add focus-visible styles for keyboard navigation');
    }
    if (suggestions.length === 0) {
        suggestions.push('Component follows best practices - no improvements needed');
    }
    return suggestions;
}
function main() {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.error('Usage: review <component-path>');
        console.error('Example: review packages/ui/components/Button');
        process.exit(1);
    }
    const componentPath = args[0];
    if (!fs.existsSync(componentPath)) {
        console.error(`Error: Component path does not exist: ${componentPath}`);
        process.exit(1);
    }
    const componentName = path.basename(componentPath);
    const mainFile = path.join(componentPath, `${componentName}.tsx`);
    try {
        // Read component content
        const content = fs.existsSync(mainFile) ? fs.readFileSync(mainFile, 'utf-8') : '';
        // Run TypeScript check
        const tsResult = runTypeScriptCheck(componentPath);
        // Run tests
        const testResults = runTests(componentPath);
        // Check accessibility
        const a11yIssues = checkAccessibility(componentPath, componentName);
        // Calculate quality score
        const qualityScore = calculateQualityScore(tsResult.passed, testResults, a11yIssues, content, componentName);
        // Generate suggestions
        const suggestions = generateSuggestions(tsResult.passed, testResults, a11yIssues, content);
        // Determine summary
        let summary;
        if (qualityScore >= 90) {
            summary = 'Excellent quality';
        }
        else if (qualityScore >= 80) {
            summary = 'Good quality';
        }
        else if (qualityScore >= 70) {
            summary = 'Acceptable quality';
        }
        else if (qualityScore >= 60) {
            summary = 'Needs improvement';
        }
        else {
            summary = 'Poor quality - requires significant changes';
        }
        console.log(JSON.stringify({
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
            summary,
            details: {
                hasForwardRef: content.includes('forwardRef'),
                hasDisplayName: content.includes('.displayName'),
                hasSemanticHtml: /<button|<a[^>]*href|<input/.test(content),
                hasFocusVisible: content.includes('focus-visible'),
                hasKeyboardHandlers: content.includes('onKeyDown'),
                hasDisabledHandling: content.includes('disabled:pointer-events-none') || content.includes('aria-disabled'),
            },
        }, null, 2));
        process.exit(0);
    }
    catch (error) {
        console.error(JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        }, null, 2));
        process.exit(1);
    }
}
main();
//# sourceMappingURL=review.js.map