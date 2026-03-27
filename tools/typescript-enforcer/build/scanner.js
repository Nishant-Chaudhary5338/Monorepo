// ============================================================================
// SCANNER - Orchestrates all rules across files
// ============================================================================
import * as fs from 'fs';
import * as path from 'path';
import { checkNoAny } from './rules/no-any.js';
import { checkGenerics } from './rules/generics.js';
import { checkUtilityTypes } from './rules/utility-types.js';
import { checkModifiers } from './rules/modifiers.js';
import { checkTypeGuards } from './rules/type-guards.js';
const RULES = {
    'no-any': checkNoAny,
    'generics': checkGenerics,
    'utility-types': checkUtilityTypes,
    'modifiers': checkModifiers,
    'type-guards': checkTypeGuards,
    'discriminated-unions': () => ({ violations: [] }), // Placeholder
    'branded-types': () => ({ violations: [] }), // Placeholder
};
// ============================================================================
// FILE SCANNING
// ============================================================================
export function scanFile(filePath, options = {}) {
    const source = fs.readFileSync(filePath, 'utf-8');
    const rulesToRun = options.rules || Object.keys(RULES);
    const minSeverity = options.severity || 'info';
    const severityOrder = { error: 0, warning: 1, info: 2 };
    const minSeverityLevel = severityOrder[minSeverity] ?? 2;
    const allViolations = [];
    for (const ruleName of rulesToRun) {
        const checker = RULES[ruleName];
        if (checker) {
            try {
                const result = checker(source, filePath);
                allViolations.push(...result.violations);
            }
            catch (err) {
                // Skip rules that fail on this file
            }
        }
    }
    // Filter by severity
    const filtered = allViolations.filter(v => severityOrder[v.severity] <= minSeverityLevel);
    // Sort by line number
    filtered.sort((a, b) => a.line - b.line);
    const errors = filtered.filter(v => v.severity === 'error').length;
    const warnings = filtered.filter(v => v.severity === 'warning').length;
    const infos = filtered.filter(v => v.severity === 'info').length;
    // Score: 10 = no violations, deduct based on severity
    let score = 10;
    score -= errors * 2;
    score -= warnings * 1;
    score -= infos * 0.25;
    score = Math.max(0, Math.round(score * 10) / 10);
    return {
        file: filePath,
        violations: filtered,
        summary: { errors, warnings, infos, total: filtered.length },
        score,
    };
}
// ============================================================================
// DIRECTORY SCANNING
// ============================================================================
function scanDirectoryRecursive(dir, options = {}) {
    const files = [];
    const ignorePatterns = options.ignore || ['node_modules', 'build', 'dist', '.next', '.git', '__tests__', '.test.', '.spec.', '.stories.'];
    if (!fs.existsSync(dir))
        return files;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        // Check ignore patterns
        if (ignorePatterns.some(pattern => entry.name.includes(pattern)))
            continue;
        if (entry.isDirectory()) {
            files.push(...scanDirectoryRecursive(fullPath, options));
        }
        else if (entry.name.match(/\.(ts|tsx|js|jsx)$/)) {
            files.push(fullPath);
        }
    }
    return files;
}
export function scanDirectory(dir, options = {}) {
    const startTime = Date.now();
    let files = scanDirectoryRecursive(dir, options);
    if (options.maxFiles && files.length > options.maxFiles) {
        files = files.slice(0, options.maxFiles);
    }
    const results = [];
    for (const file of files) {
        try {
            const result = scanFile(file, options);
            if (result.summary.total > 0 || options.severity === undefined) {
                results.push(result);
            }
        }
        catch {
            // Skip files that can't be read
        }
    }
    // Sort by score (worst first)
    results.sort((a, b) => a.score - b.score);
    const totalViolations = results.reduce((sum, r) => sum + r.summary.total, 0);
    const totalErrors = results.reduce((sum, r) => sum + r.summary.errors, 0);
    const totalWarnings = results.reduce((sum, r) => sum + r.summary.warnings, 0);
    const totalInfos = results.reduce((sum, r) => sum + r.summary.infos, 0);
    // Count by rule
    const byRule = {};
    for (const result of results) {
        for (const v of result.violations) {
            byRule[v.rule] = (byRule[v.rule] || 0) + 1;
        }
    }
    const sorted = [...results].sort((a, b) => a.score - b.score);
    return {
        directory: dir,
        filesScanned: files.length,
        totalViolations,
        results,
        worstFiles: sorted.slice(0, 10).map(r => ({ file: r.file, score: r.score, violations: r.summary.total })),
        bestFiles: sorted.slice(-5).reverse().map(r => ({ file: r.file, score: r.score, violations: r.summary.total })),
        byRule,
        summary: { errors: totalErrors, warnings: totalWarnings, infos: totalInfos },
    };
}
//# sourceMappingURL=scanner.js.map