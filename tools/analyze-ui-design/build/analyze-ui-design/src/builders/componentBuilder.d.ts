import type { RawDetection, DetectedComponent, ExtractedText } from '../types/blueprint.types.js';
/**
 * Convert raw detections into normalized, structured components
 */
export declare function buildComponents(rawDetections: RawDetection[], texts: ExtractedText[], imageHeight: number, sectionMap: Map<string, string>, pageNumber?: number): DetectedComponent[];
//# sourceMappingURL=componentBuilder.d.ts.map