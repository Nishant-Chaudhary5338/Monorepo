// ============================================================================
// FILE SCANNER - File discovery utilities using glob patterns
// ============================================================================
import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';
/**
 * Find all JS/JSX/TS/TSX files in a directory
 */
export async function findSourceFiles(rootDir) {
    const patterns = ['**/*.{js,jsx,ts,tsx}'];
    const ignore = [
        '**/node_modules/**',
        '**/build/**',
        '**/dist/**',
        '**/.git/**',
        '**/coverage/**',
        '**/*.test.{js,jsx,ts,tsx}',
        '**/*.spec.{js,jsx,ts,tsx}',
        '**/*.stories.{js,jsx,ts,tsx}',
        '**/*.d.ts',
    ];
    const files = await glob(patterns, {
        cwd: rootDir,
        ignore,
        absolute: true,
    });
    return files.sort();
}
/**
 * Find component files (files that likely export React components)
 */
export async function findComponentFiles(rootDir) {
    const allFiles = await findSourceFiles(rootDir);
    return allFiles.filter((f) => {
        const basename = path.basename(f, path.extname(f));
        // Components typically start with uppercase
        return /^[A-Z]/.test(basename);
    });
}
/**
 * Find CSS/SCSS/Less/style files
 */
export async function findStyleFiles(rootDir) {
    const patterns = ['**/*.{css,scss,less,sass,module.css,module.scss}'];
    const ignore = ['**/node_modules/**', '**/build/**', '**/dist/**'];
    return glob(patterns, {
        cwd: rootDir,
        ignore,
        absolute: true,
    });
}
/**
 * Find asset files (images, videos, fonts)
 */
export async function findAssetFiles(rootDir) {
    const patterns = [
        '**/*.{png,jpg,jpeg,gif,svg,webp,ico,bmp}',
        '**/*.{mp4,webm,ogg,avi,mov}',
        '**/*.{woff,woff2,ttf,eot,otf}',
    ];
    const ignore = ['**/node_modules/**', '**/build/**', '**/dist/**'];
    return glob(patterns, {
        cwd: rootDir,
        ignore,
        absolute: true,
    });
}
/**
 * Get file size in bytes
 */
export function getFileSize(filePath) {
    try {
        const stats = fs.statSync(filePath);
        return stats.size;
    }
    catch {
        return 0;
    }
}
/**
 * Read file content safely
 */
export function readFileContent(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf-8');
    }
    catch {
        return null;
    }
}
/**
 * Check if a file exists
 */
export function fileExists(filePath) {
    return fs.existsSync(filePath);
}
/**
 * Get all directories at a specific depth from root
 */
export function getDirectoriesAtDepth(rootDir, maxDepth = 10) {
    const dirs = [];
    function walk(currentDir, depth) {
        if (depth > maxDepth)
            return;
        try {
            const entries = fs.readdirSync(currentDir, { withFileTypes: true });
            for (const entry of entries) {
                if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.git') {
                    const fullPath = path.join(currentDir, entry.name);
                    const relativePath = path.relative(rootDir, fullPath);
                    dirs.push(relativePath);
                    walk(fullPath, depth + 1);
                }
            }
        }
        catch {
            // Skip unreadable directories
        }
    }
    walk(rootDir, 1);
    return dirs;
}
/**
 * Calculate directory nesting depth
 */
export function calculateMaxDepth(rootDir) {
    const dirs = getDirectoriesAtDepth(rootDir, 20);
    if (dirs.length === 0)
        return 0;
    return Math.max(...dirs.map((d) => d.split(path.sep).length));
}
/**
 * Read package.json from a directory
 */
export function readPackageJson(rootDir) {
    const pkgPath = path.join(rootDir, 'package.json');
    const content = readFileContent(pkgPath);
    if (!content)
        return null;
    try {
        return JSON.parse(content);
    }
    catch {
        return null;
    }
}
/**
 * Check if directory contains specific config files
 */
export function hasConfigFile(rootDir, filenames) {
    return filenames.some((f) => fileExists(path.join(rootDir, f)));
}
//# sourceMappingURL=file-scanner.js.map