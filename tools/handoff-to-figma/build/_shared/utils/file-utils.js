// ============================================================================
// FILE UTILITIES - Common file operations
// ============================================================================
import * as fs from 'fs';
import * as path from 'path';
/**
 * Ensure a directory exists, creating it if necessary
 */
export function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}
/**
 * Check if a path exists
 */
export function pathExists(filePath) {
    return fs.existsSync(filePath);
}
/**
 * Check if a path is a directory
 */
export function isDirectory(dirPath) {
    try {
        return fs.statSync(dirPath).isDirectory();
    }
    catch {
        return false;
    }
}
/**
 * Check if a path is a file
 */
export function isFile(filePath) {
    try {
        return fs.statSync(filePath).isFile();
    }
    catch {
        return false;
    }
}
/**
 * Read a file as UTF-8 string
 */
export function readFile(filePath) {
    return fs.readFileSync(filePath, 'utf-8');
}
/**
 * Write content to a file
 */
export function writeFile(filePath, content) {
    const dir = path.dirname(filePath);
    ensureDir(dir);
    fs.writeFileSync(filePath, content, 'utf-8');
}
/**
 * Read and parse JSON file
 */
export function readJsonFile(filePath) {
    const content = readFile(filePath);
    return JSON.parse(content);
}
/**
 * Write object to JSON file
 */
export function writeJsonFile(filePath, data, pretty = true) {
    const content = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
    writeFile(filePath, content);
}
/**
 * List files in a directory
 */
export function listFiles(dirPath, filter) {
    if (!fs.existsSync(dirPath))
        return [];
    const entries = fs.readdirSync(dirPath);
    return filter ? entries.filter(filter) : entries;
}
/**
 * List directories in a directory
 */
export function listDirs(dirPath) {
    if (!fs.existsSync(dirPath))
        return [];
    return fs.readdirSync(dirPath, { withFileTypes: true })
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name);
}
/**
 * Find files matching a pattern recursively
 */
export function findFiles(dirPath, pattern) {
    const results = [];
    if (!fs.existsSync(dirPath))
        return results;
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        if (entry.isDirectory()) {
            results.push(...findFiles(fullPath, pattern));
        }
        else if (pattern.test(entry.name)) {
            results.push(fullPath);
        }
    }
    return results;
}
/**
 * Copy a file
 */
export function copyFile(src, dest) {
    const dir = path.dirname(dest);
    ensureDir(dir);
    fs.copyFileSync(src, dest);
}
/**
 * Delete a file
 */
export function deleteFile(filePath) {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
}
/**
 * Delete a directory recursively
 */
export function deleteDir(dirPath) {
    if (fs.existsSync(dirPath)) {
        fs.rmSync(dirPath, { recursive: true, force: true });
    }
}
/**
 * Get file extension
 */
export function getExtension(filePath) {
    return path.extname(filePath).slice(1);
}
/**
 * Get file name without extension
 */
export function getBaseName(filePath) {
    return path.basename(filePath, path.extname(filePath));
}
//# sourceMappingURL=file-utils.js.map