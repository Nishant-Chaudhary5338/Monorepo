import type { BackupMetadata, RollbackOutput } from '../types.js';
/**
 * Create a full backup of the project
 */
export declare function createFullBackup(projectPath: string): Promise<string>;
/**
 * Load backup metadata
 */
export declare function loadBackupMetadata(backupDir: string): Promise<BackupMetadata | null>;
/**
 * Save backup metadata
 */
export declare function saveBackupMetadata(backupDir: string, metadata: BackupMetadata): Promise<void>;
/**
 * Record an operation in backup metadata
 */
export declare function recordOperation(backupDir: string, operation: BackupMetadata['operations'][0]): Promise<void>;
/**
 * Rollback all changes from backup
 */
export declare function rollbackFromBackup(backupDir: string): Promise<RollbackOutput>;
/**
 * Clean up backup directory
 */
export declare function cleanupBackup(backupDir: string): Promise<void>;
/**
 * List all backups for a project
 */
export declare function listBackups(projectPath: string): Promise<string[]>;
/**
 * Get backup size in MB
 */
export declare function getBackupSize(backupDir: string): Promise<number>;
//# sourceMappingURL=backup-manager.d.ts.map