import type { ParsedPage } from '../types/blueprint.types.js';
/**
 * Check if a file is a PDF
 */
export declare function isPdfFile(filePath: string): boolean;
/**
 * Convert a PDF file to an array of page images
 * Uses pdfjs-dist to render PDF pages to images
 */
export declare function parsePdf(filePath: string, maxWidth?: number): Promise<ParsedPage[]>;
/**
 * Convert a PDF buffer to an array of page images
 */
export declare function parsePdfBuffer(buffer: Buffer, maxWidth?: number): Promise<ParsedPage[]>;
//# sourceMappingURL=pdfParser.d.ts.map