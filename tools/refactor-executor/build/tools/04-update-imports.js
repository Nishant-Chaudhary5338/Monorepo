"use strict";
// ============================================================================
// TOOL #4: UPDATE IMPORTS (CRITICAL)
// Update relative imports using AST (no regex)
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
exports.updateImports = updateImports;
const path = __importStar(require("path"));
const file_ops_js_1 = require("../utils/file-ops.js");
const ast_transform_js_1 = require("../utils/ast-transform.js");
/**
 * Update all imports after file moves using AST-based transformation
 */
async function updateImports(input) {
    const { path: projectPath, refactorPlan, movedFiles = {} } = input;
    const updatedFiles = [];
    const allUpdates = [];
    const errors = [];
    // Build moved files map from refactor plan if not provided
    const filesMap = { ...movedFiles };
    if (Object.keys(filesMap).length === 0) {
        for (const move of refactorPlan.moves) {
            const sourcePath = path.resolve(projectPath, move.from);
            const destPath = path.resolve(projectPath, move.to);
            filesMap[sourcePath] = destPath;
        }
        // Also add renames
        for (const rename of refactorPlan.renames) {
            const oldPath = path.resolve(projectPath, rename.from);
            const newPath = path.resolve(projectPath, rename.to);
            filesMap[oldPath] = newPath;
        }
    }
    if (Object.keys(filesMap).length === 0) {
        return {
            success: true,
            updatedFiles: [],
            importUpdates: [],
            errors: [],
        };
    }
    // Get all source files in the project
    const allFiles = await (0, file_ops_js_1.listFiles)(projectPath, ['.ts', '.tsx', '.js', '.jsx']);
    // Process each file to update its imports
    for (const filePath of allFiles) {
        // Skip files that were moved (they're already at their new location)
        if (Object.keys(filesMap).includes(filePath)) {
            continue;
        }
        const content = await (0, file_ops_js_1.readFile)(filePath);
        if (!content)
            continue;
        try {
            const { newContent, updates } = (0, ast_transform_js_1.rewriteImports)(filePath, content, filesMap, projectPath);
            if (updates.length > 0) {
                // Write the updated content
                const writeSuccess = await (0, file_ops_js_1.writeFile)(filePath, newContent);
                if (writeSuccess) {
                    updatedFiles.push(path.relative(projectPath, filePath));
                    allUpdates.push(...updates);
                }
                else {
                    errors.push(`Failed to write updated file: ${filePath}`);
                }
            }
        }
        catch (error) {
            errors.push(`Error processing ${filePath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    // Also update imports within moved files
    for (const [oldPath, newPath] of Object.entries(filesMap)) {
        if (Object.values(filesMap).includes(newPath)) {
            const content = await (0, file_ops_js_1.readFile)(newPath);
            if (!content)
                continue;
            try {
                const { newContent, updates } = (0, ast_transform_js_1.rewriteImports)(newPath, content, filesMap, projectPath);
                if (updates.length > 0) {
                    const writeSuccess = await (0, file_ops_js_1.writeFile)(newPath, newContent);
                    if (writeSuccess) {
                        if (!updatedFiles.includes(path.relative(projectPath, newPath))) {
                            updatedFiles.push(path.relative(projectPath, newPath));
                        }
                        allUpdates.push(...updates);
                    }
                }
            }
            catch (error) {
                errors.push(`Error updating imports in moved file ${newPath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
    }
    return {
        success: errors.length === 0,
        updatedFiles,
        importUpdates: allUpdates,
        errors,
    };
}
//# sourceMappingURL=04-update-imports.js.map