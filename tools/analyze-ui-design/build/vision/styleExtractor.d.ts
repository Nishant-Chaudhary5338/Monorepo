import type { ParsedImage, ColorInfo, ColorPalette, TypographyHints, SpacingHints } from '../types/blueprint.types.js';
/**
 * Extract dominant colors and style information from an image
 */
export declare function extractStyles(image: ParsedImage): Promise<{
    globalColors: ColorInfo;
    palette: ColorPalette;
    typography: TypographyHints;
    spacing: SpacingHints;
}>;
/**
 * Extract color info from a specific region
 */
export declare function extractRegionColors(image: ParsedImage, x: number, y: number, width: number, height: number): Promise<ColorInfo>;
//# sourceMappingURL=styleExtractor.d.ts.map