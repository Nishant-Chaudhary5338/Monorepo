import type { ParsedImage, DetectedBlock } from '../types/blueprint.types.js';
/**
 * Detect UI layout blocks (regions, sections) in an image
 * Uses edge detection and connected component analysis
 */
export declare function detectLayout(image: ParsedImage): Promise<DetectedBlock[]>;
//# sourceMappingURL=layoutDetector.d.ts.map