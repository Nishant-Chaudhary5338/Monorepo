export interface WriteResult {
    filePath: string;
    created: boolean;
}
export declare function ensureDir(dirPath: string): void;
export declare function writeFile(filePath: string, content: string): WriteResult;
export declare function writeModule(basePath: string, moduleName: string, files: Record<string, string>): WriteResult[];
export declare function fileExists(filePath: string): boolean;
export declare function readJsonFile<T = unknown>(filePath: string): T;
//# sourceMappingURL=file-writer.d.ts.map