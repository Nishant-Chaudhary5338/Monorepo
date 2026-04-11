#!/usr/bin/env node
// ============================================================================
// BATCH FIXER - Auto-fix TypeScript violations from scan results
// ============================================================================
import * as fs from 'fs';
import * as path from 'path';
import { scanFile, scanDirectory } from './scanner.js';
const FIX_PATTERNS = [
    // no-any: simple `: any` → `: unknown`
    {
        name: 'any-to-unknown-annotation',
        rule: 'no-any',
        detect: (v, line) => {
            return v.current === ': any' && !line.includes('as any');
        },
        fix: (line) => line.replace(/:\s*any\b/, ': unknown'),
    },
    // no-any: Promise<any> → Promise<unknown>
    {
        name: 'promise-any-to-unknown',
        rule: 'no-any',
        detect: (v) => v.current === 'Promise<unknown>',
        fix: (line) => line.replace(/Promise<unknown>/g, 'Promise<unknown>'),
    },
    // no-any: Array<any> → unknown[]
    {
        name: 'array-any-to-unknown',
        rule: 'no-any',
        detect: (v) => v.current === 'unknown[]',
        fix: (line) => line.replace(/unknown[]/g, 'unknown[]'),
    },
    // no-any: any[] → unknown[]
    {
        name: 'any-array-to-unknown',
        rule: 'no-any',
        detect: (v) => v.current === 'unknown[]',
        fix: (line) => line.replace(/any\[\]/g, 'unknown[]'),
    },
    // no-any: Record<string, any> → Record<string, unknown>
    {
        name: 'record-any-to-unknown',
        rule: 'no-any',
        detect: (v) => v.current === 'Record<string, unknown>',
        fix: (line) => line.replace(/Record<string,\s*any>/g, 'Record<string, unknown>'),
    },
    // modifiers: let → const (when never reassigned)
    {
        name: 'let-to-const',
        rule: 'modifiers',
        detect: (v, line) => {
            return v.current.startsWith('let ') && v.suggestion.startsWith('const');
        },
        fix: (line) => line.replace(/\blet\b/, 'const'),
    },
    // modifiers: add `as const` to arrays
    {
        name: 'as-const-array',
        rule: 'modifiers',
        detect: (v, line) => {
            return v.current.includes('[...]') && v.suggestion.includes('as const') && line.includes('= [');
        },
        fix: (line) => {
            if (line.includes('as const'))
                return line;
            // Find the closing bracket and add `as const` before the semicolon or end of line
            return line.replace(/(\[[^\]]*\])\s*;?$/, '$1 as const;');
        },
    },
    // modifiers: add `as const` to simple objects
    {
        name: 'as-const-object',
        rule: 'modifiers',
        detect: (v, line) => {
            return v.current.includes('{ ... }') && v.suggestion.includes('as const') && line.includes('= {');
        },
        fix: (line) => {
            if (line.includes('as const'))
                return line;
            return line.replace(/(\})\s*;?$/, '$1 as const;');
        },
    },
    // modifiers: add `readonly` to ID properties
    {
        name: 'readonly-id-property',
        rule: 'modifiers',
        detect: (v, line) => {
            return v.suggestion.startsWith('readonly') && (v.current.toLowerCase().includes('id') || v.current.includes('Id'));
        },
        fix: (line) => {
            if (line.includes('readonly'))
                return line;
            const match = line.match(/^(\s+)(\w+)/);
            if (match) {
                return line.replace(/^(\s+)(\w+)/, '$1readonly $2');
            }
            return line;
        },
    },
    // modifiers: add `as const` to enum-like string constants
    {
        name: 'as-const-enum-like',
        rule: 'modifiers',
        detect: (v, line) => {
            return v.current.includes('as const') === false && v.suggestion.includes('as const') && /'[^']+'/.test(line);
        },
        fix: (line) => {
            if (line.includes('as const'))
                return line;
            return line.replace(/'([^']+)'\s*;?$/, "'$1' as const;");
        },
    },
];
// ============================================================================
// FIX ENGINE
// ============================================================================
function applyFix(line, violation) {
    for (const pattern of FIX_PATTERNS) {
        if (pattern.rule === violation.rule && pattern.detect(violation, line)) {
            const fixedLine = pattern.fix(line, violation);
            if (fixedLine !== line) {
                return { fixed: fixedLine, status: 'fixed' };
            }
        }
    }
    // Check if it's a comment-based suggestion (needs manual review)
    if (violation.fix.startsWith('//')) {
        return {
            fixed: line,
            status: 'manual',
            reason: violation.fix.replace(/^\/\/\s*/, ''),
        };
    }
    return {
        fixed: line,
        status: 'skipped',
        reason: 'No auto-fix pattern matched',
    };
}
function fixFile(fileResult, options) {
    const results = [];
    const filePath = fileResult.file;
    if (!fs.existsSync(filePath)) {
        return results;
    }
    const source = fs.readFileSync(filePath, 'utf-8');
    const lines = source.split('\n');
    // Group violations by line (process from bottom to top to preserve line numbers)
    const violationsByLine = new Map();
    for (const v of fileResult.violations) {
        const lineNum = v.line;
        if (!violationsByLine.has(lineNum)) {
            violationsByLine.set(lineNum, []);
        }
        violationsByLine.get(lineNum).push(v);
    }
    // Sort line numbers in descending order (bottom to top)
    const sortedLines = Array.from(violationsByLine.keys()).sort((a, b) => b - a);
    for (const lineNum of sortedLines) {
        const violations = violationsByLine.get(lineNum);
        const lineIndex = lineNum - 1;
        let currentLine = lines[lineIndex];
        for (const violation of violations) {
            const result = applyFix(currentLine, violation);
            results.push({
                file: filePath,
                lineNumber: lineNum,
                rule: violation.rule,
                original: currentLine,
                fixed: result.fixed,
                status: result.status,
                reason: result.reason,
            });
            if (result.status === 'fixed') {
                currentLine = result.fixed;
            }
        }
        lines[lineIndex] = currentLine;
    }
    // Write fixed content if not dry-run and there were fixes
    const hasFixes = results.some((r) => r.status === 'fixed');
    if (!options.dryRun && hasFixes) {
        // Create backup
        if (options.backup) {
            const backupPath = `${filePath}.bak`;
            fs.copyFileSync(filePath, backupPath);
        }
        // Write fixed content
        fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
    }
    return results;
}
// ============================================================================
// CLI PARSER
// ============================================================================
function parseArgs(args) {
    const options = {
        path: '',
        dryRun: false,
        backup: true,
    };
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        switch (arg) {
            case '--path':
            case '-p':
                options.path = args[++i] || '';
                break;
            case '--rule':
            case '-r':
                options.rules = (args[++i] || '').split(',');
                break;
            case '--severity':
            case '-s':
                options.severity = args[++i];
                break;
            case '--dry-run':
            case '-d':
                options.dryRun = true;
                break;
            case '--no-backup':
                options.backup = false;
                break;
            case '--ignore':
                options.ignore = (args[++i] || '').split(',');
                break;
            case '--help':
            case '-h':
                printHelp();
                process.exit(0);
        }
    }
    if (!options.path) {
        console.error('Error: --path is required');
        printHelp();
        process.exit(1);
    }
    return options;
}
function printHelp() {
    console.log(`
TypeScript Enforcer Batch Fixer
Auto-fix TypeScript violations from scan results

Usage:
  pnpm exec tsx src/batch-fixer.ts --path <dir> [options]

Options:
  --path, -p <dir>        Target directory or file to scan and fix (required)
  --rule, -r <rules>      Comma-separated rules to fix (e.g., "no-any,modifiers")
  --severity, -s <level>  Minimum severity: error, warning, info (default: info)
  --dry-run, -d           Preview changes without writing files
  --no-backup             Skip creating .bak backup files
  --ignore <patterns>     Comma-separated patterns to ignore
  --help, -h              Show this help

Examples:
  # Fix all violations in apps/web
  pnpm exec tsx src/batch-fixer.ts --path apps/web/

  # Dry run - preview only
  pnpm exec tsx src/batch-fixer.ts --path packages/ui/ --dry-run

  # Fix only no-any errors
  pnpm exec tsx src/batch-fixer.ts --path src/ --rule no-any --severity error

  # Skip backups
  pnpm exec tsx src/batch-fixer.ts --path src/ --no-backup
`);
}
// ============================================================================
// REPORT
// ============================================================================
function printReport(report, dryRun) {
    console.log('\n' + '='.repeat(60));
    console.log(`  BATCH FIXER ${dryRun ? '(DRY RUN)' : 'REPORT'}`);
    console.log('='.repeat(60));
    console.log(`\nFiles scanned:     ${report.filesScanned}`);
    console.log(`Total violations:  ${report.totalViolations}`);
    console.log(`Fixed:             ${report.fixed}`);
    console.log(`Skipped:           ${report.skipped}`);
    console.log(`Manual review:     ${report.manualReview}`);
    if (report.errors.length > 0) {
        console.log(`\nErrors:            ${report.errors.length}`);
        for (const err of report.errors) {
            console.log(`  - ${err}`);
        }
    }
    // Fixed violations
    const fixed = report.results.filter((r) => r.status === 'fixed');
    if (fixed.length > 0) {
        console.log('\n' + '-'.repeat(60));
        console.log('  FIXED VIOLATIONS');
        console.log('-'.repeat(60));
        // Group by file
        const byFile = new Map();
        for (const r of fixed) {
            if (!byFile.has(r.file))
                byFile.set(r.file, []);
            byFile.get(r.file).push(r);
        }
        for (const [file, results] of byFile) {
            console.log(`\n📄 ${path.relative(process.cwd(), file)}`);
            for (const r of results) {
                console.log(`  Line ${r.lineNumber}: [${r.rule}]`);
                console.log(`    - ${r.original.trim()}`);
                console.log(`    + ${r.fixed.trim()}`);
            }
        }
    }
    // Manual review needed
    const manual = report.results.filter((r) => r.status === 'manual');
    if (manual.length > 0) {
        console.log('\n' + '-'.repeat(60));
        console.log('  MANUAL REVIEW NEEDED');
        console.log('-'.repeat(60));
        const byFile = new Map();
        for (const r of manual) {
            if (!byFile.has(r.file))
                byFile.set(r.file, []);
            byFile.get(r.file).push(r);
        }
        for (const [file, results] of byFile) {
            console.log(`\n📄 ${path.relative(process.cwd(), file)}`);
            for (const r of results) {
                console.log(`  Line ${r.lineNumber}: [${r.rule}]`);
                console.log(`    Code: ${r.original.trim()}`);
                console.log(`    Fix:  ${r.reason}`);
            }
        }
    }
    console.log('\n' + '='.repeat(60));
    if (dryRun && fixed.length > 0) {
        console.log('  Run without --dry-run to apply fixes');
    }
    else if (fixed.length > 0) {
        console.log('  Fixes applied! Backup files created with .bak extension');
    }
    console.log('='.repeat(60) + '\n');
}
// ============================================================================
// MAIN
// ============================================================================
async function main() {
    const args = process.argv.slice(2);
    const options = parseArgs(args);
    const targetPath = path.resolve(options.path);
    if (!fs.existsSync(targetPath)) {
        console.error(`Error: Path not found: ${targetPath}`);
        process.exit(1);
    }
    console.log(`\n🔍 Scanning: ${targetPath}`);
    if (options.dryRun)
        console.log('  Mode: DRY RUN (no files will be modified)');
    if (options.rules)
        console.log(`  Rules: ${options.rules.join(', ')}`);
    if (options.severity)
        console.log(`  Severity: >= ${options.severity}`);
    // Run scan
    const scanOptions = {
        rules: options.rules,
        severity: options.severity || 'info',
        ignore: options.ignore,
    };
    let fileResults;
    if (fs.statSync(targetPath).isDirectory()) {
        const dirResult = scanDirectory(targetPath, scanOptions);
        fileResults = dirResult.results;
        console.log(`  Found ${dirResult.totalViolations} violations in ${dirResult.filesScanned} files`);
    }
    else {
        const fileResult = scanFile(targetPath, scanOptions);
        fileResults = fileResult.summary.total > 0 ? [fileResult] : [];
        console.log(`  Found ${fileResult.summary.total} violations`);
    }
    // Apply fixes
    const report = {
        filesScanned: fileResults.length,
        totalViolations: fileResults.reduce((sum, r) => sum + r.summary.total, 0),
        fixed: 0,
        skipped: 0,
        manualReview: 0,
        results: [],
        errors: [],
    };
    console.log('\n🔧 Applying fixes...');
    for (const fileResult of fileResults) {
        try {
            const fixResults = fixFile(fileResult, options);
            report.results.push(...fixResults);
        }
        catch (err) {
            report.errors.push(`${fileResult.file}: ${err instanceof Error ? err.message : String(err)}`);
        }
    }
    report.fixed = report.results.filter((r) => r.status === 'fixed').length;
    report.skipped = report.results.filter((r) => r.status === 'skipped').length;
    report.manualReview = report.results.filter((r) => r.status === 'manual').length;
    printReport(report, options.dryRun);
}
main().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
});
//# sourceMappingURL=batch-fixer.js.map