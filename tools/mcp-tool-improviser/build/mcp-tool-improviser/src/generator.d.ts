import type { ProposedDiff, ApplyResult } from './types.js';
export declare function applyDiffs(diffs: ProposedDiff[]): ApplyResult[];
export declare function applyDiffToSingleFile(filePath: string, diffs: ProposedDiff[]): ApplyResult;
export declare function rollbackFromBackup(backupPath: string, originalPath: string): boolean;
//# sourceMappingURL=generator.d.ts.map