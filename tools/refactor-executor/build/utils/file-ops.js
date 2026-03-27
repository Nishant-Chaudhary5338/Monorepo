"use strict";
// ============================================================================
// FILE OPERATIONS - Safe file manipulation with backup support
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
exports.createBackup = createBackup;
exports.updateBackupMetadata = updateBackupMetadata;
exports.moveFile = moveFile;
exports.renameFile = renameFile;
exports.createDirectory = createDirectory;
exports.getRequiredDirectories = getRequiredDirectories;
exports.readFile = readFile;
exports.writeFile = writeFile;
exports.pathExists = pathExists;
exports.listFiles = listFiles;
exports.getRelativePath = getRelativePath;
exports.resolvePath = resolvePath;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
/**
 * Create a timestamped backup of the project directory
 */
async function createBackup(projectPath) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = `${projectPath}.backup-${timestamp}`;
    await fs.copy(projectPath, backupPath, {
        filter: (src) => {
            // Skip node_modules and .git
            const relative = path.relative(projectPath, src);
            return !relative.includes('node_modules') && !relative.includes('.git');
        },
    });
    // Create metadata file
    const metadata = {
        timestamp,
        originalPath: projectPath,
        backupPath,
        operations: [],
    };
    await fs.writeJson(path.join(backupPath, '.backup-metadata.json'), metadata, { spaces: 2 });
    return backupPath;
}
/**
 * Update backup metadata with an operation
 */
async function updateBackupMetadata(backupPath, operation) {
    const metadataPath = path.join(backupPath, '.backup-metadata.json');
    if (await fs.pathExists(metadataPath)) {
        const metadata = await fs.readJson(metadataPath);
        metadata.operations.push(operation);
        await fs.writeJson(metadataPath, metadata, { spaces: 2 });
    }
}
/**
 * Move a file from source to destination
 */
async function moveFile(source, destination, backupPath) {
    try {
        // Ensure source exists
        if (!(await fs.pathExists(source))) {
            return {
                source,
                destination,
                success: false,
                error: `Source file does not exist: ${source}`,
            };
        }
        // Create destination directory if needed
        const destDir = path.dirname(destination);
        await fs.ensureDir(destDir);
        // If backup path provided, save original content
        if (backupPath) {
            const backupDestDir = path.join(backupPath, 'originals', path.dirname(source));
            await fs.ensureDir(backupDestDir);
            await fs.copy(source, path.join(backupDestDir, path.basename(source)));
            await updateBackupMetadata(backupPath, {
                type: 'move',
                originalPath: source,
                newPath: destination,
            });
        }
        // Move the file
        await fs.move(source, destination, { overwrite: true });
        return { source, destination, success: true };
    }
    catch (error) {
        return {
            source,
            destination,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}
/**
 * Rename a file
 */
async function renameFile(oldPath, newPath, backupPath) {
    try {
        if (!(await fs.pathExists(oldPath))) {
            return {
                oldPath,
                newPath,
                success: false,
                error: `File does not exist: ${oldPath}`,
            };
        }
        // Backup original
        if (backupPath) {
            const backupDestDir = path.join(backupPath, 'originals', path.dirname(oldPath));
            await fs.ensureDir(backupDestDir);
            await fs.copy(oldPath, path.join(backupDestDir, path.basename(oldPath)));
            await updateBackupMetadata(backupPath, {
                type: 'rename',
                originalPath: oldPath,
                newPath,
            });
        }
        await fs.rename(oldPath, newPath);
        return { oldPath, newPath, success: true };
    }
    catch (error) {
        return {
            oldPath,
            newPath,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}
/**
 * Create directory structure
 */
async function createDirectory(dirPath) {
    try {
        await fs.ensureDir(dirPath);
        return true;
    }
    catch {
        return false;
    }
}
/**
 * Get all directories that need to be created for a list of target paths
 */
function getRequiredDirectories(targetPaths) {
    const dirs = new Set();
    for (const targetPath of targetPaths) {
        let current = path.dirname(targetPath);
        while (current && current !== '.' && current !== '/') {
            dirs.add(current);
            current = path.dirname(current);
        }
    }
    return Array.from(dirs).sort((a, b) => a.length - b.length);
}
/**
 * Read file content
 */
async function readFile(filePath) {
    try {
        return await fs.readFile(filePath, 'utf-8');
    }
    catch {
        return null;
    }
}
/**
 * Write file content
 */
async function writeFile(filePath, content) {
    try {
        await fs.ensureDir(path.dirname(filePath));
        await fs.writeFile(filePath, content, 'utf-8');
        return true;
    }
    catch {
        return false;
    }
}
/**
 * Check if path exists
 */
async function pathExists(filePath) {
    return fs.pathExists(filePath);
}
/**
 * List all files in directory recursively
 */
async function listFiles(dirPath, extensions) {
    try {
        const files = [];
        async function walk(currentPath) {
            const entries = await fs.readdir(currentPath, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path.join(currentPath, entry.name);
                if (entry.isDirectory()) {
                    // Skip node_modules and .git
                    if (entry.name !== 'node_modules' && entry.name !== '.git') {
                        await walk(fullPath);
                    }
                }
                else if (entry.isFile()) {
                    if (!extensions || extensions.some((ext) => entry.name.endsWith(ext))) {
                        files.push(fullPath);
                    }
                }
            }
        }
        await walk(dirPath);
        return files;
    }
    catch {
        return [];
    }
}
/**
 * Get relative path from project root
 */
function getRelativePath(projectPath, filePath) {
    return path.relative(projectPath, filePath);
}
/**
 * Resolve path relative to project root
 */
function resolvePath(projectPath, relativePath) {
    return path.resolve(projectPath, relativePath);
}
//# sourceMappingURL=file-ops.js.map