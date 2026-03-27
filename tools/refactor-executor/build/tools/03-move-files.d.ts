import type { MoveFilesInput, MoveFilesOutput } from '../types.js';
/**
 * Move files according to refactor plan
 */
export declare function moveFiles(input: MoveFilesInput): Promise<MoveFilesOutput>;
/**
 * Get the mapping of moved files (for use by update-imports)
 */
export declare function getMovedFilesMap(projectPath: string, refactorPlan: {
    moves: {
        from: string;
        to: string;
    }[];
}): Record<string, string>;
//# sourceMappingURL=03-move-files.d.ts.map