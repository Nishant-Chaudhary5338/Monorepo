import * as fs from 'fs';
import * as path from 'path';
export function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}
export function writeFile(filePath, content) {
    const dir = path.dirname(filePath);
    ensureDir(dir);
    const existed = fs.existsSync(filePath);
    fs.writeFileSync(filePath, content, 'utf-8');
    return { filePath, created: !existed };
}
export function writeModule(basePath, moduleName, files) {
    const moduleDir = path.join(basePath, moduleName);
    const results = [];
    for (const [fileName, content] of Object.entries(files)) {
        const filePath = path.join(moduleDir, fileName);
        results.push(writeFile(filePath, content));
    }
    return results;
}
export function fileExists(filePath) {
    return fs.existsSync(filePath);
}
export function readJsonFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
}
//# sourceMappingURL=file-writer.js.map