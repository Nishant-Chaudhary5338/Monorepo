/**
 * Find all JS/JSX/TS/TSX files in a directory
 */
export declare function findSourceFiles(rootDir: string): Promise<string[]>;
/**
 * Find component files (files that likely export React components)
 */
export declare function findComponentFiles(rootDir: string): Promise<string[]>;
/**
 * Find CSS/SCSS/Less/style files
 */
export declare function findStyleFiles(rootDir: string): Promise<string[]>;
/**
 * Find asset files (images, videos, fonts)
 */
export declare function findAssetFiles(rootDir: string): Promise<string[]>;
/**
 * Get file size in bytes
 */
export declare function getFileSize(filePath: string): number;
/**
 * Read file content safely
 */
export declare function readFileContent(filePath: string): string | null;
/**
 * Check if a file exists
 */
export declare function fileExists(filePath: string): boolean;
/**
 * Get all directories at a specific depth from root
 */
export declare function getDirectoriesAtDepth(rootDir: string, maxDepth?: number): string[];
/**
 * Calculate directory nesting depth
 */
export declare function calculateMaxDepth(rootDir: string): number;
/**
 * Read package.json from a directory
 */
export declare function readPackageJson(rootDir: string): Record<string, unknown> | null;
/**
 * Check if directory contains specific config files
 */
export declare function hasConfigFile(rootDir: string, filenames: string[]): boolean;
//# sourceMappingURL=file-scanner.d.ts.map