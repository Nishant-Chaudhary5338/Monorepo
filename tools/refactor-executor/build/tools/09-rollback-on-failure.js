"use strict";
// ============================================================================
// TOOL #9: ROLLBACK ON FAILURE
// Revert all changes if build fails
// ============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.rollbackOnFailure = rollbackOnFailure;
const backup_manager_js_1 = require("../utils/backup-manager.js");
/**
 * Rollback all changes from backup
 */
async function rollbackOnFailure(input) {
    const { path: projectPath, backupPath } = input;
    try {
        // Perform the rollback
        const result = await (0, backup_manager_js_1.rollbackFromBackup)(backupPath);
        // Optionally cleanup backup after successful rollback
        if (result.success) {
            await (0, backup_manager_js_1.cleanupBackup)(backupPath);
        }
        return result;
    }
    catch (error) {
        return {
            success: false,
            operations: [],
            errors: [
                `Rollback failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            ],
        };
    }
}
//# sourceMappingURL=09-rollback-on-failure.js.map