import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';
import type { ParsedImage } from '../types/blueprint.types.js';

const DEFAULT_MAX_WIDTH = 1920;
const SUPPORTED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp', '.tiff'] as const;

/**
 * Parse an image file and normalize it for analysis
 */
export async function parseImage(
  filePath: string,
  maxWidth: number = DEFAULT_MAX_WIDTH,
): Promise<ParsedImage> {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Image file not found: ${filePath}`);
  }

  const ext = path.extname(filePath).toLowerCase();
  if (!SUPPORTED_EXTENSIONS.includes(ext)) {
    throw new Error(
      `Unsupported image format: ${ext}. Supported: ${SUPPORTED_EXTENSIONS.join(', ')}`,
    );
  }

  const inputBuffer = fs.readFileSync(filePath);
  return parseImageBuffer(inputBuffer, maxWidth);
}

/**
 * Parse an image from a raw buffer
 */
export async function parseImageBuffer(
  buffer: Buffer,
  maxWidth: number = DEFAULT_MAX_WIDTH,
): Promise<ParsedImage> {
  const metadata = await sharp(buffer).metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error('Unable to determine image dimensions');
  }

  let pipeline = sharp(buffer);

  // Resize if wider than maxWidth (maintain aspect ratio)
  if (metadata.width > maxWidth) {
    pipeline = pipeline.resize(maxWidth, null, {
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  // Ensure we have a consistent format (RGB)
  pipeline = pipeline.removeAlpha().toColorspace('srgb');

  const processedBuffer = await pipeline.toBuffer();
  const processedMeta = await sharp(processedBuffer).metadata();

  return {
    width: processedMeta.width!,
    height: processedMeta.height!,
    channels: processedMeta.channels || 3,
    buffer: processedBuffer,
    metadata: {
      originalWidth: metadata.width,
      originalHeight: metadata.height,
      format: metadata.format,
      space: metadata.space,
      hasAlpha: metadata.hasAlpha,
      resized: metadata.width > maxWidth,
    },
  };
}

/**
 * Extract pixel data from a specific region of an image
 */
export async function extractRegion(
  image: ParsedImage,
  x: number,
  y: number,
  width: number,
  height: number,
): Promise<Buffer> {
  // Clamp to image bounds
  const clampedX = Math.max(0, Math.round(x));
  const clampedY = Math.max(0, Math.round(y));
  const clampedW = Math.min(Math.round(width), image.width - clampedX);
  const clampedH = Math.min(Math.round(height), image.height - clampedY);

  if (clampedW <= 0 || clampedH <= 0) {
    throw new Error('Invalid region dimensions');
  }

  return sharp(image.buffer)
    .extract({
      left: clampedX,
      top: clampedY,
      width: clampedW,
      height: clampedH,
    })
    .toBuffer();
}

/**
 * Get the dominant color of an image or region
 */
export async function getDominantColor(buffer: Buffer): Promise<{ r: number; g: number; b: number }> {
  const { dominant } = await sharp(buffer).stats();
  return { r: dominant.r, g: dominant.g, b: dominant.b };
}

/**
 * Convert RGB to hex string
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('');
}

/**
 * Check if the file is a supported image format
 */
export function isImageFile(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();
  return SUPPORTED_EXTENSIONS.includes(ext);
}