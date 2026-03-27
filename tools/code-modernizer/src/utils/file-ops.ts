// ============================================================================
// FILE OPERATIONS - Safe file manipulation with backup support
// ============================================================================

import * as fs from 'fs-extra';
import * as path from 'path';
import type { BackupMetadata } from '../types.js';

/**
 * Create a timestamped backup of the project directory
 */
export async function createBackup(projectPath: string): Promise<string> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = `${projectPath}.backup-${timestamp}`;

  await fs.copy(projectPath, backupPath, {
    filter: (src) => {
      const relative = path.relative(projectPath, src);
      return !relative.includes('node_modules') && !relative.includes('.git');
    },
  });

  const metadata: BackupMetadata = {
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
export async function updateBackupMetadata(
  backupPath: string,
  operation: BackupMetadata['operations'][0]
): Promise<void> {
  const metadataPath = path.join(backupPath, '.backup-metadata.json');

  if (await fs.pathExists(metadataPath)) {
    const metadata: BackupMetadata = await fs.readJson(metadataPath);
    metadata.operations.push(operation);
    await fs.writeJson(metadataPath, metadata, { spaces: 2 });
  }
}

/**
 * Read file content safely
 */
export async function readFile(filePath: string): Promise<string | null> {
  try {
    return await fs.readFile(filePath, 'utf-8');
  } catch {
    return null;
  }
}

/**
 * Write file content
 */
export async function writeFile(filePath: string, content: string): Promise<boolean> {
  try {
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, content, 'utf-8');
    return true;
  } catch {
    return false;
  }
}

/**
 * Rename a file
 */
export async function renameFile(
  oldPath: string,
  newPath: string,
  backupPath?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!(await fs.pathExists(oldPath))) {
      return { success: false, error: `File does not exist: ${oldPath}` };
    }

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
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check if path exists
 */
export async function pathExists(filePath: string): Promise<boolean> {
  return fs.pathExists(filePath);
}

/**
 * List all files in directory recursively
 */
export async function listFiles(dirPath: string, extensions?: string[]): Promise<string[]> {
  try {
    const files: string[] = [];

    async function walk(currentPath: string) {
      const entries = await fs.readdir(currentPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);

        if (entry.isDirectory()) {
          if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'build' && entry.name !== 'dist') {
            await walk(fullPath);
          }
        } else if (entry.isFile()) {
          if (!extensions || extensions.some((ext) => entry.name.endsWith(ext))) {
            files.push(fullPath);
          }
        }
      }
    }

    await walk(dirPath);
    return files;
  } catch {
    return [];
  }
}

/**
 * Get relative path from project root
 */
export function getRelativePath(projectPath: string, filePath: string): string {
  return path.relative(projectPath, filePath);
}

/**
 * Resolve path relative to project root
 */
export function resolvePath(projectPath: string, relativePath: string): string {
  return path.resolve(projectPath, relativePath);
}

/**
 * Ensure directory exists
 */
export async function ensureDir(dirPath: string): Promise<void> {
  await fs.ensureDir(dirPath);
}