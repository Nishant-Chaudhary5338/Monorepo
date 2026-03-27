import type { DetectedComponent, LayoutStructure, ComponentBlueprint, BlueprintMeta, ColorPalette, TypographyHints, SpacingHints, AnalysisOptions } from '../types/blueprint.types.js';
/**
 * Build the final Component Blueprint from all intermediate results
 */
export declare function buildBlueprint(meta: BlueprintMeta, components: DetectedComponent[], layout: LayoutStructure, palette: ColorPalette, typography: TypographyHints, spacing: SpacingHints, options: AnalysisOptions): ComponentBlueprint;
//# sourceMappingURL=blueprintBuilder.d.ts.map