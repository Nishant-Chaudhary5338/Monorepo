import type { ParsedImage } from '../types/blueprint.types.js';
/**
 * Parse an image file and normalize it for analysis
 */
export declare function parseImage(filePath: string, maxWidth?: number): Promise<ParsedImage>;
/**
 * Parse an image from a raw buffer
 */
export declare function parseImageBuffer(buffer: Buffer, maxWidth?: number): Promise<ParsedImage>;
/**
 * Extract pixel data from a specific region of an image
 */
export declare function extractRegion(image: ParsedImage, x: number, y: number, width: number, height: number): Promise<Buffer>;
/**
 * Get the dominant color of an image or region
 */
export declare function getDominantColor(buffer: Buffer): Promise<{
    r: number;
    g: number;
    b: number;
}>;
/**
 * Convert RGB to hex string
 */
export declare function rgbToHex(r: number, g: number, b: number): string;
/**
 * Check if the file is a supported image format
 */
export declare function isImageFile(filePath: string): boolean;
//# sourceMappingURL=imageParser.d.ts.map