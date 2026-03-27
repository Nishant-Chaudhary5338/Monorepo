"use strict";
// ============================================================================
// TOOL #6: SPLIT MODULES
// Split large utility files into multiple smaller modules
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
exports.splitModules = splitModules;
const path = __importStar(require("path"));
const file_ops_js_1 = require("../utils/file-ops.js");
const ast_transform_js_1 = require("../utils/ast-transform.js");
const backup_manager_js_1 = require("../utils/backup-manager.js");
/**
 * Split large files into smaller modules based on split plan
 */
async function splitModules(input) {
    const { path: projectPath, refactorPlan, backupPath } = input;
    const splitOperations = [];
    const errors = [];
    for (const split of refactorPlan.splits) {
        const filePath = path.resolve(projectPath, split.file);
        // Read the original file
        const content = await (0, file_ops_js_1.readFile)(filePath);
        if (!content) {
            errors.push(`Cannot read file to split: ${split.file}`);
            splitOperations.push({
                originalFile: split.file,
                createdFiles: [],
                success: false,
                error: 'Cannot read file',
            });
            continue;
        }
        try {
            // Parse the file to understand its structure
            const parsed = (0, ast_transform_js_1.parseFile)(filePath, content);
            if (!parsed) {
                throw new Error('Failed to parse file');
            }
            // Create the split files
            const createdFiles = [];
            for (const proposedFile of split.proposedFiles) {
                const proposedPath = path.resolve(projectPath, proposedFile);
                // Determine what goes into this file based on naming
                // Generate the split file content based on proposed file name
                const splitContent = '';
                // Add imports from original file
                const imports = (0, ast_transform_js_1.extractImports)(parsed.ast);
                for (const imp of imports) {
                    if (imp.isDefault) {
                        splitContent += `import ${imp.specifiers[0]} from '${imp.source}';\n`;
                    }
                    else {
                        splitContent += `import { ${imp.specifiers.join(', ')} } from '${imp.source}';\n`;
                    }
                }
                splitContent += '\n';
                // Add a placeholder export for the split file
                const basename = path.basename(proposedFile, path.extname(proposedFile));
                splitContent += `// ${basename} module\n`;
                splitContent += `// TODO: Add exports from ${split.file}\n`;
                splitContent += `export {};\n`;
                // Write the split file
                const writeSuccess = await (0, file_ops_js_1.writeFile)(proposedPath, splitContent);
                if (writeSuccess) {
                    createdFiles.push(proposedFile);
                }
                else {
                    throw new Error(`Failed to write split file: ${proposedFile}`);
                }
            }
            // Backup original file if needed
            if (backupPath) {
                await (0, backup_manager_js_1.recordOperation)(backupPath, {
                    type: 'split',
                    originalPath: filePath,
                    newPath: createdFiles.map((f) => path.resolve(projectPath, f)).join('|'),
                });
            }
            splitOperations.push({
                originalFile: split.file,
                createdFiles,
                success: true,
            });
        }
        catch (error) {
            errors.push(`Failed to split ${split.file}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            splitOperations.push({
                originalFile: split.file,
                createdFiles: [],
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
    return {
        success: errors.length === 0,
        splitOperations,
        errors,
    };
}
//# sourceMappingURL=06-split-modules.js.map