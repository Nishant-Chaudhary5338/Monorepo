import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';
import type { ParsedImage, ParsedPage } from '../types/blueprint.types.js';
import { parseImageBuffer } from './imageParser.js';

/**
 * Check if a file is a PDF
 */
export function isPdfFile(filePath: string): boolean {
  return path.extname(filePath).toLowerCase() === '.pdf';
}

/**
 * Convert a PDF file to an array of page images
 * Uses pdfjs-dist to render PDF pages to images
 */
export async function parsePdf(
  filePath: string,
  maxWidth = 1920,
): Promise<ParsedPage[]> {
  if (!fs.existsSync(filePath)) {
    throw new Error(`PDF file not found: ${filePath}`);
  }

  const pdfBuffer = fs.readFileSync(filePath);
  return parsePdfBuffer(pdfBuffer, maxWidth);
}

/**
 * Convert a PDF buffer to an array of page images
 */
export async function parsePdfBuffer(
  buffer: Buffer,
  maxWidth = 1920,
): Promise<ParsedPage[]> {
  // Dynamic import to handle pdfjs-dist ESM compatibility
  let pdfjsLib: typeof import('pdfjs-dist');
  try {
    pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
  } catch {
    try {
      pdfjsLib = await import('pdfjs-dist');
    } catch (err) {
      throw new Error(
        'pdfjs-dist is required for PDF parsing. Install it with: pnpm add pdfjs-dist',
      );
    }
  }

  // Disable worker for Node.js environment
  pdfjsLib.GlobalWorkerOptions.workerSrc = '';

  const pdfDoc = await pdfjsLib.getDocument({
    data: new Uint8Array(buffer),
    useSystemFonts: true,
    disableFontFace: true,
  }).promise;

  const pages: ParsedPage[] = [];
  const numPages = pdfDoc.numPages;

  for (const pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.0 });

    // Calculate scale to fit within maxWidth
    let scale = 1.0;
    if (viewport.width > maxWidth) {
      scale = maxWidth / viewport.width;
    }

    const scaledViewport = page.getViewport({ scale });

    // Render page to canvas-like structure
    // Since we're in Node.js, we render to an image buffer directly
    const canvasWidth = Math.floor(scaledViewport.width);
    const canvasHeight = Math.floor(scaledViewport.height);

    // Use a higher scale for better quality, then resize
    const renderScale = Math.min(2.0, scale * 2);
    const renderViewport = page.getViewport({ scale: renderScale });

    const renderWidth = Math.floor(renderViewport.width);
    const renderHeight = Math.floor(renderViewport.height);

    // Create a raw pixel buffer for the canvas
    const pixelData = new Uint8ClampedArray(renderWidth * renderHeight * 4);

    // Render the page
    await page.render({
      canvasContext: createCanvasContext(pixelData, renderWidth, renderHeight),
      viewport: renderViewport,
    } as any).promise;

    // Convert raw pixels to PNG buffer using sharp
    const imageBuffer = await sharp(Buffer.from(pixelData), {
      raw: {
        width: renderWidth,
        height: renderHeight,
        channels: 4,
      },
    })
      .resize(maxWidth, null, { fit: 'inside', withoutEnlargement: true })
      .removeAlpha()
      .toColorspace('srgb')
      .png()
      .toBuffer();

    const parsedImage = await parseImageBuffer(imageBuffer, maxWidth);

    pages.push({
      pageNumber: pageNum,
      image: parsedImage,
    });

    // Clean up
    page.cleanup();
  }

  // Clean up the document
  pdfDoc.cleanup();

  return pages;
}

/**
 * Create a minimal canvas context-like object for pdfjs-dist rendering
 * This is a shim for Node.js environments that don't have a real canvas
 */
function createCanvasContext(
  pixelData: Uint8ClampedArray,
  width: number,
  height: number,
): unknown {
  // Create an ImageData-like structure
  const imageData = {
    data: pixelData,
    width,
    height,
  };

  return {
    canvas: { width, height },
    getContext: () => null,
    save: () => {},
    restore: () => {},
    scale: () => {},
    rotate: () => {},
    translate: () => {},
    transform: () => {},
    setTransform: () => {},
    resetTransform: () => {},
    clip: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    closePath: () => {},
    fill: () => {},
    stroke: () => {},
    fillRect: () => {},
    strokeRect: () => {},
    clearRect: (x: number, y: number, w: number, h: number) => {
      const startX = Math.max(0, Math.floor(x));
      const startY = Math.max(0, Math.floor(y));
      const endX = Math.min(width, Math.ceil(x + w));
      const endY = Math.min(height, Math.ceil(y + h));
      for (const py = startY; py < endY; py++) {
        for (const px = startX; px < endX; px++) {
          const idx = (py * width + px) * 4;
          pixelData[idx] = 255;
          pixelData[idx + 1] = 255;
          pixelData[idx + 2] = 255;
          pixelData[idx + 3] = 255;
        }
      }
    },
    fillText: () => {},
    strokeText: () => {},
    measureText: () => ({ width: 0 }),
    drawImage: () => {},
    createImageData: (w: number, h: number) => ({
      data: new Uint8ClampedArray(w * h * 4),
      width: w,
      height: h,
    }),
    getImageData: (sx: number, sy: number, sw: number, sh: number) => {
      const data = new Uint8ClampedArray(sw * sh * 4);
      const srcX = Math.max(0, Math.floor(sx));
      const srcY = Math.max(0, Math.floor(sy));
      for (let y = 0; y < sh; y++) {
        for (let x = 0; x < sw; x++) {
          const srcIdx = ((srcY + y) * width + (srcX + x)) * 4;
          const dstIdx = (y * sw + x) * 4;
          if (srcIdx < pixelData.length - 3) {
            data[dstIdx] = pixelData[srcIdx];
            data[dstIdx + 1] = pixelData[srcIdx + 1];
            data[dstIdx + 2] = pixelData[srcIdx + 2];
            data[dstIdx + 3] = pixelData[srcIdx + 3];
          }
        }
      }
      return { data, width: sw, height: sh };
    },
    putImageData: (
      imgData: { data: Uint8ClampedArray; width: number; height: number },
      dx: number,
      dy: number,
    ) => {
      const destX = Math.max(0, Math.floor(dx));
      const destY = Math.max(0, Math.floor(dy));
      for (const y = 0; y < imgData.height; y++) {
        for (let x = 0; x < imgData.width; x++) {
          const srcIdx = (y * imgData.width + x) * 4;
          const dstIdx = ((destY + y) * width + (destX + x)) * 4;
          if (dstIdx < pixelData.length - 3 && srcIdx < imgData.data.length - 3) {
            pixelData[dstIdx] = imgData.data[srcIdx];
            pixelData[dstIdx + 1] = imgData.data[srcIdx + 1];
            pixelData[dstIdx + 2] = imgData.data[srcIdx + 2];
            pixelData[dstIdx + 3] = imgData.data[srcIdx + 3];
          }
        }
      }
    },
    setLineDash: () => {},
    getLineDash: () => [],
    lineDashOffset: 0,
    globalAlpha: 1,
    globalCompositeOperation: 'source-over',
    lineWidth: 1,
    lineCap: 'butt',
    lineJoin: 'miter',
    miterLimit: 10,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowBlur: 0,
    shadowColor: 'rgba(0, 0, 0, 0)',
    fillStyle: '#000000',
    strokeStyle: '#000000',
    font: '10px sans-serif',
    textAlign: 'start',
    textBaseline: 'alphabetic',
    direction: 'ltr',
    imageSmoothingEnabled: true,
    imageSmoothingQuality: 'low' as any,
  };
}