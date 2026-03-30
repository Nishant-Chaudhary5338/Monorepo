import type { DetectedComponent, LayoutStructure } from '../types/blueprint.types.js';
/**
 * Build the layout structure from detected components
 */
export declare function buildLayout(components: DetectedComponent[], imageWidth: number, imageHeight: number): {
    layout: LayoutStructure;
    sectionMap: Map<string, string>;
};
//# sourceMappingURL=layoutBuilder.d.ts.map