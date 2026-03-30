import type { AnalysisOptions, ComponentBlueprint } from './types/blueprint.types.js';
/**
 * Main analysis pipeline: file path → Component Blueprint JSON
 */
export declare function analyzeUI(filePath: string, options?: Partial<AnalysisOptions>): Promise<ComponentBlueprint>;
//# sourceMappingURL=orchestrator.d.ts.map