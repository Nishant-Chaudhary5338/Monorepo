import type { ParsedImage, ExtractedText, BoundingBox } from '../types/blueprint.types.js';
/**
 * Extract text from an image using OCR (Tesseract.js)
 */
export declare function extractText(image: ParsedImage): Promise<ExtractedText[]>;
/**
 * Extract text from a specific region of an image
 */
export declare function extractTextFromRegion(image: ParsedImage, bbox: BoundingBox): Promise<ExtractedText[]>;
/**
 * Quick text extraction for small regions (faster, less accurate)
 */
export declare function quickExtract(image: ParsedImage): Promise<string>;
//# sourceMappingURL=textExtractor.d.ts.map