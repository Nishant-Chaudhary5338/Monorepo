import * as fs from 'fs';
import * as path from 'path';

export interface WriteResult {
  filePath: string;
  created: boolean;
}

export function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function writeFile(filePath: string, content: string): WriteResult {
  const dir = path.dirname(filePath);
  ensureDir(dir);
  const existed = fs.existsSync(filePath);
  fs.writeFileSync(filePath, content, 'utf-8');
  return { filePath, created: !existed };
}

export function writeModule(
  basePath: string,
  moduleName: string,
  files: Record<string, string>
): WriteResult[] {
  const moduleDir = path.join(basePath, moduleName);
  const results: WriteResult[] = [];

  for (const [fileName, content] of Object.entries(files)) {
    const filePath = path.join(moduleDir, fileName);
    results.push(writeFile(filePath, content));
  }

  return results;
}

export function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

export function readJsonFile<T = unknown>(filePath: string): T {
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content) as T;
}