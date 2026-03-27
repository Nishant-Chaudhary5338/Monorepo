"use strict";
// ============================================================================
// TOOL #1: VALIDATE REFACTOR PLAN
// Ensure paths exist, no duplicate destinations, no conflicting moves
// ============================================================================
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRefactorPlan = validateRefactorPlan;
const path = __importStar(require("path"));
const file_ops_js_1 = require("../utils/file-ops.js");
/**
 * Validate refactor plan before execution
 */
async function validateRefactorPlan(input) {
    const { path: projectPath, refactorPlan } = input;
    const errors = [];
    const warnings = [];
    // Check project path exists
    if (!(await (0, file_ops_js_1.pathExists)(projectPath))) {
        errors.push({
            type: 'invalid-path',
            message: `Project path does not exist: ${projectPath}`,
            files: [projectPath],
        });
        return {
            valid: false,
            errors,
            warnings,
            summary: {
                totalMoves: 0,
                totalRenames: 0,
                totalSplits: 0,
                affectedFiles: 0,
            },
        };
    }
    // Get all files in project
    const allFiles = await (0, file_ops_js_1.listFiles)(projectPath);
    const allFilesSet = new Set(allFiles);
    // Validate moves
    await validateMoves(refactorPlan.moves, projectPath, allFilesSet, errors, warnings);
    // Validate renames
    await validateRenames(refactorPlan.renames, projectPath, allFilesSet, errors, warnings);
    // Validate splits
    await validateSplits(refactorPlan.splits, projectPath, allFilesSet, errors, warnings);
    // Check for conflicts between moves and renames
    checkMoveRenameConflicts(refactorPlan, errors);
    // Calculate affected files
    const affectedFiles = new Set();
    for (const move of refactorPlan.moves) {
        affectedFiles.add(move.from);
    }
    for (const rename of refactorPlan.renames) {
        affectedFiles.add(rename.from);
    }
    for (const split of refactorPlan.splits) {
        affectedFiles.add(split.file);
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings,
        summary: {
            totalMoves: refactorPlan.moves.length,
            totalRenames: refactorPlan.renames.length,
            totalSplits: refactorPlan.splits.length,
            affectedFiles: affectedFiles.size,
        },
    };
}
/**
 * Validate file moves
 */
async function validateMoves(moves, projectPath, allFiles, errors, warnings) {
    const destinations = new Map(); // dest -> sources
    for (const move of moves) {
        const sourcePath = path.resolve(projectPath, move.from);
        const destPath = path.resolve(projectPath, move.to);
        // Check source exists
        if (!allFiles.has(sourcePath)) {
            errors.push({
                type: 'missing-source',
                message: `Source file does not exist: ${move.from}`,
                files: [move.from],
            });
        }
        // Track destinations for duplicate check
        if (!destinations.has(destPath)) {
            destinations.set(destPath, []);
        }
        destinations.get(destPath).push(move.from);
        // Warn if destination already exists
        if (allFiles.has(destPath)) {
            warnings.push({
                type: 'destination-exists',
                message: `Destination file already exists and will be overwritten: ${move.to}`,
                files: [move.to],
            });
        }
    }
    // Check for duplicate destinations
    for (const [dest, sources] of destinations) {
        if (sources.length > 1) {
            errors.push({
                type: 'duplicate-destination',
                message: `Multiple files moving to the same destination: ${dest}`,
                files: sources,
            });
        }
    }
}
/**
 * Validate file renames
 */
async function validateRenames(renames, projectPath, allFiles, errors, warnings) {
    const newNames = new Map(); // new path -> old paths
    for (const rename of renames) {
        const oldPath = path.resolve(projectPath, rename.from);
        const newPath = path.resolve(projectPath, rename.to);
        // Check source exists
        if (!allFiles.has(oldPath)) {
            errors.push({
                type: 'missing-source',
                message: `File to rename does not exist: ${rename.from}`,
                files: [rename.from],
            });
        }
        // Track new names for duplicate check
        if (!newNames.has(newPath)) {
            newNames.set(newPath, []);
        }
        newNames.get(newPath).push(rename.from);
        // Warn if target name already exists
        if (allFiles.has(newPath) && newPath !== oldPath) {
            warnings.push({
                type: 'rename-target-exists',
                message: `Rename target already exists: ${rename.to}`,
                files: [rename.to],
            });
        }
    }
    // Check for duplicate new names
    for (const [newPath, oldPaths] of newNames) {
        if (oldPaths.length > 1) {
            errors.push({
                type: 'duplicate-destination',
                message: `Multiple files being renamed to: ${path.relative(projectPath, newPath)}`,
                files: oldPaths,
            });
        }
    }
}
/**
 * Validate module splits
 */
async function validateSplits(splits, projectPath, allFiles, errors, warnings) {
    for (const split of splits) {
        const filePath = path.resolve(projectPath, split.file);
        // Check source file exists
        if (!allFiles.has(filePath)) {
            errors.push({
                type: 'missing-source',
                message: `File to split does not exist: ${split.file}`,
                files: [split.file],
            });
        }
        // Check proposed files don't conflict
        for (const proposed of split.proposedFiles) {
            const proposedPath = path.resolve(projectPath, proposed);
            if (allFiles.has(proposedPath)) {
                warnings.push({
                    type: 'split-target-exists',
                    message: `Proposed split file already exists: ${proposed}`,
                    files: [proposed],
                });
            }
        }
    }
}
/**
 * Check for conflicts between moves and renames
 */
function checkMoveRenameConflicts(plan, errors) {
    const moveSources = new Set(plan.moves.map((m) => m.from));
    const renameSources = new Set(plan.renames.map((r) => r.from));
    // Check if same file is both moved and renamed
    for (const source of moveSources) {
        if (renameSources.has(source)) {
            errors.push({
                type: 'conflicting-move',
                message: `File is both moved and renamed: ${source}`,
                files: [source],
            });
        }
    }
    // Check move chains (A->B, B->C)
    const moveMap = new Map(plan.moves.map((m) => [m.from, m.to]));
    for (const [from, to] of moveMap) {
        if (moveMap.has(to)) {
            errors.push({
                type: 'conflicting-move',
                message: `Move chain detected: ${from} -> ${to} -> ${moveMap.get(to)}`,
                files: [from, to],
            });
        }
    }
}
//# sourceMappingURL=01-validate-refactor-plan.js.map