"use strict";
// ============================================================================
// TOOL #5: RENAME FILES
// Apply naming improvements, update all references
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
exports.renameFiles = renameFiles;
const path = __importStar(require("path"));
const file_ops_js_1 = require("../utils/file-ops.js");
/**
 * Rename files according to naming standardization plan
 */
async function renameFiles(input) {
    const { path: projectPath, refactorPlan, backupPath } = input;
    const renamedFiles = [];
    const errors = [];
    for (const rename of refactorPlan.renames) {
        const oldPath = path.resolve(projectPath, rename.from);
        const newPath = path.resolve(projectPath, rename.to);
        // Verify source exists
        if (!(await (0, file_ops_js_1.pathExists)(oldPath))) {
            errors.push(`File to rename does not exist: ${rename.from}`);
            renamedFiles.push({
                oldPath: rename.from,
                newPath: rename.to,
                success: false,
                error: 'File does not exist',
            });
            continue;
        }
        // Skip if same path (no-op)
        if (oldPath === newPath) {
            renamedFiles.push({
                oldPath: rename.from,
                newPath: rename.to,
                success: true,
            });
            continue;
        }
        // Perform the rename
        const result = await (0, file_ops_js_1.renameFile)(oldPath, newPath, backupPath);
        renamedFiles.push({
            oldPath: rename.from,
            newPath: rename.to,
            success: result.success,
            error: result.error,
        });
        if (!result.success) {
            errors.push(`Failed to rename ${rename.from}: ${result.error}`);
        }
    }
    return {
        success: errors.length === 0,
        renamedFiles,
        errors,
    };
}
//# sourceMappingURL=05-rename-files.js.map