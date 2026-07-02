/**
 * Ensure a directory exists, creating it if necessary
 */
export declare function ensureDir(dirPath: string): void;
/**
 * Check if a path exists
 */
export declare function pathExists(filePath: string): boolean;
/**
 * Check if a path is a directory
 */
export declare function isDirectory(dirPath: string): boolean;
/**
 * Check if a path is a file
 */
export declare function isFile(filePath: string): boolean;
/**
 * Read a file as UTF-8 string
 */
export declare function readFile(filePath: string): string;
/**
 * Write content to a file
 */
export declare function writeFile(filePath: string, content: string): void;
/**
 * Read and parse JSON file
 */
export declare function readJsonFile<T = unknown>(filePath: string): T;
/**
 * Write object to JSON file
 */
export declare function writeJsonFile(filePath: string, data: unknown, pretty?: boolean): void;
/**
 * List files in a directory
 */
export declare function listFiles(dirPath: string, filter?: (name: string) => boolean): string[];
/**
 * List directories in a directory
 */
export declare function listDirs(dirPath: string): string[];
/**
 * Find files matching a pattern recursively
 */
export declare function findFiles(dirPath: string, pattern: RegExp): string[];
/**
 * Copy a file
 */
export declare function copyFile(src: string, dest: string): void;
/**
 * Delete a file
 */
export declare function deleteFile(filePath: string): void;
/**
 * Delete a directory recursively
 */
export declare function deleteDir(dirPath: string): void;
/**
 * Get file extension
 */
export declare function getExtension(filePath: string): string;
/**
 * Get file name without extension
 */
export declare function getBaseName(filePath: string): string;
//# sourceMappingURL=file-utils.d.ts.map