"use strict";
// ============================================================================
// TOOL #8: VALIDATE BUILD
// Run build/dev server, detect errors
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBuild = validateBuild;
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
/**
 * Validate the project builds successfully after refactoring
 */
async function validateBuild(input) {
    const { path: projectPath, buildCommand = 'npm run build' } = input;
    try {
        // Run the build command
        const { stdout, stderr } = await execAsync(buildCommand, {
            cwd: projectPath,
            timeout: 120000, // 2 minute timeout
        });
        const buildOutput = stdout + stderr;
        const errors = [];
        const warnings = [];
        // Parse TypeScript errors from output
        const tsErrorRegex = /(.+\.tsx?)\((\d+),(\d+)\):\s*error\s+(TS\d+):\s*(.+)/g;
        let match;
        while ((match = tsErrorRegex.exec(buildOutput)) !== null) {
            errors.push({
                file: match[1],
                line: parseInt(match[2]),
                column: parseInt(match[3]),
                code: match[4],
                message: match[5],
            });
        }
        // Parse TypeScript warnings
        const tsWarningRegex = /(.+\.tsx?)\((\d+),(\d+)\):\s*warning\s+(TS\d+):\s*(.+)/g;
        while ((match = tsWarningRegex.exec(buildOutput)) !== null) {
            warnings.push({
                file: match[1],
                line: parseInt(match[2]),
                column: parseInt(match[3]),
                code: match[4],
                message: match[5],
            });
        }
        // Check for module resolution errors
        const moduleErrorRegex = /Cannot find module '(.+)' or its corresponding type/g;
        while ((match = moduleErrorRegex.exec(buildOutput)) !== null) {
            errors.push({
                message: `Cannot find module: ${match[1]}`,
            });
        }
        return {
            success: errors.length === 0,
            buildOutput,
            errors,
            warnings,
        };
    }
    catch (error) {
        // Build failed
        const buildOutput = error.stdout + error.stderr || '';
        const errors = [];
        const warnings = [];
        // Parse errors from failed build
        const tsErrorRegex = /(.+\.tsx?)\((\d+),(\d+)\):\s*error\s+(TS\d+):\s*(.+)/g;
        let match;
        while ((match = tsErrorRegex.exec(buildOutput)) !== null) {
            errors.push({
                file: match[1],
                line: parseInt(match[2]),
                column: parseInt(match[3]),
                code: match[4],
                message: match[5],
            });
        }
        // Add generic error if no specific errors found
        if (errors.length === 0) {
            errors.push({
                message: error.message || 'Build failed with unknown error',
            });
        }
        return {
            success: false,
            buildOutput,
            errors,
            warnings,
        };
    }
}
//# sourceMappingURL=08-validate-build.js.map