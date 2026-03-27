"use strict";
// ============================================================================
// TOOL #10: APPLY REFACTOR (AGGREGATOR)
// Flow: validate → create folders → move → rename → update imports → validate build → rollback if needed
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyRefactor = applyRefactor;
const backup_manager_js_1 = require("../utils/backup-manager.js");
const _01_validate_refactor_plan_js_1 = require("./01-validate-refactor-plan.js");
const _02_create_target_structure_js_1 = require("./02-create-target-structure.js");
const _03_move_files_js_1 = require("./03-move-files.js");
const _04_update_imports_js_1 = require("./04-update-imports.js");
const _05_rename_files_js_1 = require("./05-rename-files.js");
const _06_split_modules_js_1 = require("./06-split-modules.js");
const _07_create_index_files_js_1 = require("./07-create-index-files.js");
const _08_validate_build_js_1 = require("./08-validate-build.js");
const _09_rollback_on_failure_js_1 = require("./09-rollback-on-failure.js");
/**
 * Apply full refactor pipeline with automatic rollback on failure
 */
async function applyRefactor(input) {
    const { path: projectPath, refactorPlan, dryRun = false, buildCommand } = input;
    const steps = [];
    let backupPath;
    // Step 1: Validate refactor plan
    const validationResult = await (0, _01_validate_refactor_plan_js_1.validateRefactorPlan)({
        path: projectPath,
        refactorPlan,
    });
    steps.push({
        name: 'validate-refactor-plan',
        success: validationResult.valid,
        output: validationResult,
    });
    if (!validationResult.valid) {
        return {
            success: false,
            dryRun,
            steps,
            summary: {
                filesMoved: 0,
                filesRenamed: 0,
                filesSplit: 0,
                importsUpdated: 0,
                indexFilesCreated: 0,
            },
        };
    }
    // Dry run stops here
    if (dryRun) {
        return {
            success: true,
            dryRun: true,
            steps,
            summary: {
                filesMoved: validationResult.summary.totalMoves,
                filesRenamed: validationResult.summary.totalRenames,
                filesSplit: validationResult.summary.totalSplits,
                importsUpdated: 0,
                indexFilesCreated: 0,
            },
        };
    }
    // Step 2: Create backup
    try {
        backupPath = await (0, backup_manager_js_1.createFullBackup)(projectPath);
        steps.push({
            name: 'create-backup',
            success: true,
            output: { backupPath },
        });
    }
    catch (error) {
        steps.push({
            name: 'create-backup',
            success: false,
            output: { error: error instanceof Error ? error.message : 'Unknown error' },
        });
        return {
            success: false,
            dryRun: false,
            steps,
            summary: {
                filesMoved: 0,
                filesRenamed: 0,
                filesSplit: 0,
                importsUpdated: 0,
                indexFilesCreated: 0,
            },
        };
    }
    // Step 3: Create target structure
    const structureResult = await (0, _02_create_target_structure_js_1.createTargetStructure)({
        path: projectPath,
        refactorPlan,
        backupPath,
    });
    steps.push({
        name: 'create-target-structure',
        success: structureResult.success,
        output: structureResult,
    });
    if (!structureResult.success) {
        await (0, _09_rollback_on_failure_js_1.rollbackOnFailure)({ path: projectPath, backupPath });
        return {
            success: false,
            dryRun: false,
            steps,
            backupPath,
            rollbackPerformed: true,
            summary: {
                filesMoved: 0,
                filesRenamed: 0,
                filesSplit: 0,
                importsUpdated: 0,
                indexFilesCreated: 0,
            },
        };
    }
    // Step 4: Move files
    const moveResult = await (0, _03_move_files_js_1.moveFiles)({
        path: projectPath,
        refactorPlan,
        backupPath,
    });
    steps.push({
        name: 'move-files',
        success: moveResult.success,
        output: moveResult,
    });
    // Step 5: Rename files
    const renameResult = await (0, _05_rename_files_js_1.renameFiles)({
        path: projectPath,
        refactorPlan,
        backupPath,
    });
    steps.push({
        name: 'rename-files',
        success: renameResult.success,
        output: renameResult,
    });
    // Step 6: Split modules
    const splitResult = await (0, _06_split_modules_js_1.splitModules)({
        path: projectPath,
        refactorPlan,
        backupPath,
    });
    steps.push({
        name: 'split-modules',
        success: splitResult.success,
        output: splitResult,
    });
    // Step 7: Update imports (CRITICAL)
    const importResult = await (0, _04_update_imports_js_1.updateImports)({
        path: projectPath,
        refactorPlan,
    });
    steps.push({
        name: 'update-imports',
        success: importResult.success,
        output: importResult,
    });
    // Step 8: Create index files
    const indexResult = await (0, _07_create_index_files_js_1.createIndexFiles)({
        path: projectPath,
        refactorPlan,
    });
    steps.push({
        name: 'create-index-files',
        success: indexResult.success,
        output: indexResult,
    });
    // Step 9: Validate build
    const buildResult = await (0, _08_validate_build_js_1.validateBuild)({
        path: projectPath,
        buildCommand,
    });
    steps.push({
        name: 'validate-build',
        success: buildResult.success,
        output: buildResult,
    });
    // If build fails, rollback
    if (!buildResult.success) {
        const rollbackResult = await (0, _09_rollback_on_failure_js_1.rollbackOnFailure)({
            path: projectPath,
            backupPath,
        });
        steps.push({
            name: 'rollback-on-failure',
            success: rollbackResult.success,
            output: rollbackResult,
        });
        return {
            success: false,
            dryRun: false,
            steps,
            backupPath,
            buildValidation: buildResult,
            rollbackPerformed: true,
            summary: {
                filesMoved: moveResult.movedFiles.filter((m) => m.success).length,
                filesRenamed: renameResult.renamedFiles.filter((r) => r.success).length,
                filesSplit: splitResult.splitOperations.filter((s) => s.success).length,
                importsUpdated: importResult.updatedFiles.length,
                indexFilesCreated: indexResult.createdIndexFiles.length,
            },
        };
    }
    // Success!
    return {
        success: true,
        dryRun: false,
        steps,
        backupPath,
        buildValidation: buildResult,
        rollbackPerformed: false,
        summary: {
            filesMoved: moveResult.movedFiles.filter((m) => m.success).length,
            filesRenamed: renameResult.renamedFiles.filter((r) => r.success).length,
            filesSplit: splitResult.splitOperations.filter((s) => s.success).length,
            importsUpdated: importResult.updatedFiles.length,
            indexFilesCreated: indexResult.createdIndexFiles.length,
        },
    };
}
//# sourceMappingURL=10-apply-refactor.js.map