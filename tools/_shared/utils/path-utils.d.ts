/**
 * Get the directory name of the current module (ES module compatible)
 */
export declare function getDirname(importMetaUrl: string): string;
/**
 * Find a file by walking up the directory tree
 * @param startDir - Directory to start searching from
 * @param fileName - Name of the file to find
 * @returns Absolute path to the file, or null if not found
 */
export declare function findUp(startDir: string, fileName: string): string | null;
/**
 * Find the monorepo root by looking for pnpm-workspace.yaml or package.json with workspaces
 */
export declare function findWorkspaceRoot(startDir?: string): string;
/**
 * Get the tools directory path
 */
export declare function getToolsDir(startDir?: string): string;
/**
 * Resolve a path relative to the workspace root
 */
export declare function resolveFromRoot(relativePath: string, startDir?: string): string;
/**
 * Resolve a path relative to the tools directory
 */
export declare function resolveFromToolsDir(relativePath: string, startDir?: string): string;
/**
 * Get all tool directories in the tools/ folder
 */
export declare function getToolDirectories(startDir?: string): string[];
/**
 * Check if a path is inside the tools directory
 */
export declare function isInsideToolsDir(targetPath: string, startDir?: string): boolean;
/**
 * Get relative path from workspace root
 */
export declare function getRelativeFromRoot(targetPath: string, startDir?: string): string;
//# sourceMappingURL=path-utils.d.ts.map