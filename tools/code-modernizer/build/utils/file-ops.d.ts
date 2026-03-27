import type { BackupMetadata } from '../types.js';
/**
 * Create a timestamped backup of the project directory
 */
export declare function createBackup(projectPath: string): Promise<string>;
/**
 * Update backup metadata with an operation
 */
export declare function updateBackupMetadata(backupPath: string, operation: BackupMetadata['operations'][0]): Promise<void>;
/**
 * Read file content safely
 */
export declare function readFile(filePath: string): Promise<string | null>;
/**
 * Write file content
 */
export declare function writeFile(filePath: string, content: string): Promise<boolean>;
/**
 * Rename a file
 */
export declare function renameFile(oldPath: string, newPath: string, backupPath?: string): Promise<{
    success: boolean;
    error?: string;
}>;
/**
 * Check if path exists
 */
export declare function pathExists(filePath: string): Promise<boolean>;
/**
 * List all files in directory recursively
 */
export declare function listFiles(dirPath: string, extensions?: string[]): Promise<string[]>;
/**
 * Get relative path from project root
 */
export declare function getRelativePath(projectPath: string, filePath: string): string;
/**
 * Resolve path relative to project root
 */
export declare function resolvePath(projectPath: string, relativePath: string): string;
/**
 * Ensure directory exists
 */
export declare function ensureDir(dirPath: string): Promise<void>;
//# sourceMappingURL=file-ops.d.ts.map