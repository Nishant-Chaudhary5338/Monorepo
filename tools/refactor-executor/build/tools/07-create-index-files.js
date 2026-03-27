"use strict";
// ============================================================================
// TOOL #7: CREATE INDEX FILES
// Generate barrel exports, simplify imports
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
exports.createIndexFiles = createIndexFiles;
const path = __importStar(require("path"));
const file_ops_js_1 = require("../utils/file-ops.js");
const ast_transform_js_1 = require("../utils/ast-transform.js");
/**
 * Create index.ts barrel export files for directories
 */
async function createIndexFiles(input) {
    const { path: projectPath, refactorPlan } = input;
    const createdIndexFiles = [];
    const errors = [];
    // Collect all directories that should have index files
    const targetDirs = new Set();
    // From moves
    for (const move of refactorPlan.moves) {
        const destDir = path.dirname(path.resolve(projectPath, move.to));
        targetDirs.add(destDir);
    }
    // From splits
    for (const split of refactorPlan.splits) {
        for (const proposed of split.proposedFiles) {
            const dir = path.dirname(path.resolve(projectPath, proposed));
            targetDirs.add(dir);
        }
    }
    // Create index files for each directory
    for (const dir of targetDirs) {
        try {
            // Get all TypeScript/JavaScript files in directory
            const files = await (0, file_ops_js_1.listFiles)(dir, ['.ts', '.tsx', '.js', '.jsx']);
            const dirFiles = files.filter((f) => path.dirname(f) === dir);
            if (dirFiles.length === 0)
                continue;
            // Skip if index file already exists
            const indexPath = path.join(dir, 'index.ts');
            if (await (0, file_ops_js_1.pathExists)(indexPath))
                continue;
            // Generate exports
            const exports = [];
            for (const file of dirFiles) {
                const fileName = path.basename(file, path.extname(file));
                if (fileName === 'index')
                    continue;
                const content = await (0, file_ops_js_1.readFile)(file);
                if (!content)
                    continue;
                const parsed = (0, ast_transform_js_1.parseFile)(file, content);
                if (!parsed)
                    continue;
                // Re-export everything from the file
                exports.push(`export * from './${fileName}';`);
            }
            if (exports.length > 0) {
                const indexContent = `// Auto-generated barrel export\n${exports.join('\n')}\n`;
                const writeSuccess = await (0, file_ops_js_1.writeFile)(indexPath, indexContent);
                if (writeSuccess) {
                    const relPath = path.relative(projectPath, indexPath);
                    createdIndexFiles.push({
                        path: relPath,
                        exports,
                    });
                }
                else {
                    errors.push(`Failed to write index file: ${indexPath}`);
                }
            }
        }
        catch (error) {
            errors.push(`Error creating index for ${dir}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    return {
        success: errors.length === 0,
        createdIndexFiles,
        errors,
    };
}
//# sourceMappingURL=07-create-index-files.js.map