"use strict";
// ============================================================================
// CONVERT TO TYPESCRIPT
// Rename .js/.jsx to .ts/.tsx, add basic type annotations
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
exports.convertToTypeScript = convertToTypeScript;
const path = __importStar(require("path"));
const ast_parser_js_1 = require("../utils/ast-parser.js");
const file_ops_js_1 = require("../utils/file-ops.js");
const type_generator_js_1 = require("../utils/type-generator.js");
/**
 * Convert JavaScript files to TypeScript
 */
async function convertToTypeScript(input) {
    const { path: projectPath, includeProps = true, dryRun = false, filePattern } = input;
    const convertedFiles = [];
    const skippedFiles = [];
    const errors = [];
    // Get all JS/JSX files
    const allFiles = await (0, file_ops_js_1.listFiles)(projectPath, ['.js', '.jsx']);
    const jsFiles = allFiles.filter((f) => {
        // Skip node_modules, build, test files
        const relative = path.relative(projectPath, f);
        if (relative.includes('node_modules') || relative.includes('build/') || relative.includes('dist/')) {
            return false;
        }
        // Skip config files
        const basename = path.basename(f);
        if (basename.includes('.config.') || basename.includes('.test.') || basename.includes('.spec.')) {
            return false;
        }
        // Apply file pattern if provided
        if (filePattern) {
            const minimatch = require('minimatch');
            return minimatch(relative, filePattern);
        }
        return true;
    });
    for (const filePath of jsFiles) {
        try {
            const relativePath = path.relative(projectPath, filePath);
            const parsed = (0, ast_parser_js_1.parseFile)(filePath);
            if (!parsed) {
                skippedFiles.push(relativePath);
                continue;
            }
            const { content, ast } = parsed;
            const containsJSX = (0, ast_parser_js_1.hasJSX)(ast);
            // Determine new extension
            const ext = path.extname(filePath);
            let newExt;
            if (ext === '.jsx') {
                newExt = '.tsx';
            }
            else if (ext === '.js' && containsJSX) {
                newExt = '.tsx';
            }
            else {
                newExt = '.ts';
            }
            const newPath = filePath.replace(ext, newExt);
            // Extract functions to add type annotations
            const functions = (0, ast_parser_js_1.extractFunctions)(ast);
            const addedTypes = [];
            const issues = [];
            // Generate props interface for components
            if (includeProps) {
                for (const fn of functions) {
                    if (fn.isComponent && fn.params.length > 0 && fn.params[0] !== '{...}') {
                        const propsInterface = (0, type_generator_js_1.generatePropsInterface)(fn.name, fn.params);
                        addedTypes.push(propsInterface);
                    }
                }
            }
            // Add type annotations to parameters
            let newContent = content;
            for (const fn of functions) {
                for (const param of fn.params) {
                    if (param !== '{...}' && param !== '[...]' && param !== '...') {
                        const type = (0, type_generator_js_1.generateParamType)(param);
                        if (type !== 'unknown') {
                            addedTypes.push(`${fn.name}(${param}: ${type})`);
                        }
                    }
                }
            }
            if (!dryRun) {
                // Rename file
                const renameResult = await (0, file_ops_js_1.renameFile)(filePath, newPath);
                if (!renameResult.success) {
                    errors.push(`Failed to rename ${relativePath}: ${renameResult.error}`);
                    continue;
                }
                // Add type annotations to content if needed
                if (addedTypes.length > 0) {
                    // Add props interface at the top of component files
                    const propsInterfaces = addedTypes.filter((t) => t.includes('interface'));
                    if (propsInterfaces.length > 0) {
                        const header = (0, type_generator_js_1.generateFileHeader)('convert-to-typescript');
                        const imports = newContent.match(/^import.*$/gm) || [];
                        const lastImportIndex = imports.length > 0
                            ? newContent.lastIndexOf(imports[imports.length - 1]) + imports[imports.length - 1].length
                            : 0;
                        const beforeImports = newContent.slice(0, lastImportIndex);
                        const afterImports = newContent.slice(lastImportIndex);
                        newContent = beforeImports + '\n\n' + propsInterfaces.join('\n\n') + '\n' + afterImports;
                    }
                    await (0, file_ops_js_1.writeFile)(newPath, newContent);
                }
            }
            convertedFiles.push({
                originalPath: relativePath,
                newPath: path.relative(projectPath, newPath),
                addedTypes,
                issues,
            });
        }
        catch (error) {
            errors.push(`Error processing ${path.relative(projectPath, filePath)}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    return {
        success: errors.length === 0,
        convertedFiles,
        skippedFiles: skippedFiles.map((f) => path.relative(projectPath, f)),
        errors,
        summary: {
            totalFiles: jsFiles.length,
            convertedCount: convertedFiles.length,
            skippedCount: skippedFiles.length,
            errorCount: errors.length,
        },
    };
}
//# sourceMappingURL=01-convert-to-typescript.js.map