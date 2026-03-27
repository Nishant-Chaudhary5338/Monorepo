"use strict";
// ============================================================================
// TOOL #3: MOVE FILES
// Move files based on plan, preserve content, track moved files
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
exports.moveFiles = moveFiles;
exports.getMovedFilesMap = getMovedFilesMap;
const path = __importStar(require("path"));
const file_ops_js_1 = require("../utils/file-ops.js");
/**
 * Move files according to refactor plan
 */
async function moveFiles(input) {
    const { path: projectPath, refactorPlan, backupPath } = input;
    const movedFiles = [];
    const errors = [];
    const movedFilesMap = {}; // old path -> new path
    for (const move of refactorPlan.moves) {
        const sourcePath = path.resolve(projectPath, move.from);
        const destPath = path.resolve(projectPath, move.to);
        // Verify source exists
        if (!(await (0, file_ops_js_1.pathExists)(sourcePath))) {
            errors.push(`Source file does not exist: ${move.from}`);
            movedFiles.push({
                source: move.from,
                destination: move.to,
                success: false,
                error: 'Source file does not exist',
            });
            continue;
        }
        // Perform the move
        const result = await (0, file_ops_js_1.moveFile)(sourcePath, destPath, backupPath);
        movedFiles.push({
            source: move.from,
            destination: move.to,
            success: result.success,
            error: result.error,
        });
        if (result.success) {
            movedFilesMap[sourcePath] = destPath;
        }
        else {
            errors.push(`Failed to move ${move.from}: ${result.error}`);
        }
    }
    return {
        success: errors.length === 0,
        movedFiles,
        errors,
    };
}
/**
 * Get the mapping of moved files (for use by update-imports)
 */
function getMovedFilesMap(projectPath, refactorPlan) {
    const map = {};
    for (const move of refactorPlan.moves) {
        const sourcePath = path.resolve(projectPath, move.from);
        const destPath = path.resolve(projectPath, move.to);
        map[sourcePath] = destPath;
    }
    return map;
}
//# sourceMappingURL=03-move-files.js.map