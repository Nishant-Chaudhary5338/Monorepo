"use strict";
// ============================================================================
// TOOL #2: CREATE TARGET STRUCTURE
// Create folders if not present, ensure idempotency
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
exports.createTargetStructure = createTargetStructure;
const path = __importStar(require("path"));
const file_ops_js_1 = require("../utils/file-ops.js");
const backup_manager_js_1 = require("../utils/backup-manager.js");
/**
 * Create target directory structure for refactoring
 */
async function createTargetStructure(input) {
    const { path: projectPath, refactorPlan, backupPath } = input;
    const createdDirectories = [];
    const errors = [];
    // Collect all target paths
    const targetPaths = [];
    // From moves
    for (const move of refactorPlan.moves) {
        targetPaths.push(path.resolve(projectPath, move.to));
    }
    // From renames
    for (const rename of refactorPlan.renames) {
        targetPaths.push(path.resolve(projectPath, rename.to));
    }
    // From splits
    for (const split of refactorPlan.splits) {
        for (const proposed of split.proposedFiles) {
            targetPaths.push(path.resolve(projectPath, proposed));
        }
    }
    // Get required directories
    const requiredDirs = (0, file_ops_js_1.getRequiredDirectories)(targetPaths);
    // Create directories (idempotent)
    for (const dir of requiredDirs) {
        try {
            const exists = await (0, file_ops_js_1.pathExists)(dir);
            const success = await (0, file_ops_js_1.createDirectory)(dir);
            if (success && !exists) {
                createdDirectories.push(path.relative(projectPath, dir));
                // Record in backup if provided
                if (backupPath) {
                    await (0, backup_manager_js_1.recordOperation)(backupPath, {
                        type: 'create-dir',
                        originalPath: dir,
                        newPath: dir,
                    });
                }
            }
        }
        catch (error) {
            errors.push(`Failed to create directory ${dir}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    return {
        success: errors.length === 0,
        createdDirectories,
        errors,
    };
}
//# sourceMappingURL=02-create-target-structure.js.map