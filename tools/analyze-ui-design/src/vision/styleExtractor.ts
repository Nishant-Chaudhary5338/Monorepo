import sharp from 'sharp';
import type { ParsedImage, ColorInfo, ColorPalette, TypographyHints, SpacingHints } from '../types/blueprint.types.js';
import { extractRegion } from '../parsers/imageParser.js';

/**
 * Extract dominant colors and style information from an image
 */
export async function extractStyles(image: ParsedImage): Promise<{
  globalColors: ColorInfo;
  palette: ColorPalette;
  typography: TypographyHints;
  spacing: SpacingHints;
}> {
  // 1. Get global color statistics
  const globalColors = await extractGlobalColors(image);

  // 2. Build a color palette from the image
  const palette = await extractColorPalette(image);

  // 3. Analyze typography hints
  const typography = analyzeTypography(image);

  // 4. Analyze spacing patterns
  const spacing = analyzeSpacing(image);

  return { globalColors, palette, typography, spacing };
}

/**
 * Extract dominant and average colors from the full image
 */
async function extractGlobalColors(image: ParsedImage): Promise<ColorInfo> {
  try {
    const stats = await sharp(image.buffer).stats();
    const dominant = stats.dominant;

    // Calculate average from channels
    const avgR = Math.round(stats.channels[0].mean);
    const avgG = Math.round(stats.channels[1].mean);
    const avgB = Math.round(stats.channels[2].mean);

    return {
      dominant: rgbToHex(dominant.r, dominant.g, dominant.b),
      average: rgbToHex(avgR, avgG, avgB),
      hasBorder: false,
    };
  } catch {
    return {
      dominant: '#808080',
      average: '#808080',
      hasBorder: false,
    };
  }
}

/**
 * Extract a color palette from sampled regions
 */
async function extractColorPalette(image: ParsedImage): Promise<ColorPalette> {
  const { width, height, buffer, channels } = image;
  const samples: { r: number; g: number; b: number }[] = [];

  // Sample colors from different regions of the image
  const samplePoints = [
    { x: 0, y: 0 },                           // top-left
    { x: width - 1, y: 0 },                    // top-right
    { x: 0, y: height - 1 },                   // bottom-left
    { x: width - 1, y: height - 1 },           // bottom-right
    { x: Math.floor(width / 2), y: 0 },        // top-center
    { x: Math.floor(width / 2), y: height - 1 }, // bottom-center
    { x: 0, y: Math.floor(height / 2) },       // middle-left
    { x: width - 1, y: Math.floor(height / 2) }, // middle-right
    { x: Math.floor(width / 2), y: Math.floor(height / 2) }, // center
  ];

  // Sample from 3x3 grid for better coverage
  const gridSize = 3;
  for (const gy = 0; gy < gridSize; gy++) {
    for (const gx = 0; gx < gridSize; gx++) {
      const x = Math.floor((gx + 0.5) * width / gridSize);
      const y = Math.floor((gy + 0.5) * height / gridSize);
      const idx = (y * width + x) * channels;

      if (idx + 2 < buffer.length) {
        samples.push({
          r: buffer[idx],
          g: buffer[idx + 1],
          b: buffer[idx + 2],
        });
      }
    }
  }

  // Also sample from edges for border/background detection
  for (let i = 0; i < Math.min(width, 100); i += 10) {
    const topIdx = i * channels;
    const bottomIdx = ((height - 1) * width + i) * channels;

    if (topIdx + 2 < buffer.length) {
      samples.push({ r: buffer[topIdx], g: buffer[topIdx + 1], b: buffer[topIdx + 2] });
    }
    if (bottomIdx + 2 < buffer.length) {
      samples.push({ r: buffer[bottomIdx], g: buffer[bottomIdx + 1], b: buffer[bottomIdx + 2] });
    }
  }

  // Cluster colors by similarity
  const clusters = clusterColors(samples, 8);

  // Assign colors to palette roles based on brightness and frequency
  const palette: ColorPalette = {};

  const sortedByBrightness = [...clusters].sort((a, b) => {
    const brightnessA = (a.r * 0.299 + a.g * 0.587 + a.b * 0.114);
    const brightnessB = (b.r * 0.299 + b.g * 0.587 + b.b * 0.114);
    return brightnessA - brightnessB;
  });

  // Darkest → foreground
  if (sortedByBrightness.length > 0) {
    palette.foreground = rgbToHex(sortedByBrightness[0].r, sortedByBrightness[0].g, sortedByBrightness[0].b);
  }

  // Lightest → background
  if (sortedByBrightness.length > 1) {
    palette.background = rgbToHex(
      sortedByBrightness[sortedByBrightness.length - 1].r,
      sortedByBrightness[sortedByBrightness.length - 1].g,
      sortedByBrightness[sortedByBrightness.length - 1].b,
    );
  }

  // Most saturated → primary/accent
  const sortedBySaturation = [...clusters].sort((a, b) => saturation(b) - saturation(a));
  if (sortedBySaturation.length > 0) {
    const sat = saturation(sortedBySaturation[0]);
    if (sat > 0.2) {
      palette.primary = rgbToHex(sortedBySaturation[0].r, sortedBySaturation[0].g, sortedBySaturation[0].b);
    }
  }
  if (sortedBySaturation.length > 1) {
    const sat = saturation(sortedBySaturation[1]);
    if (sat > 0.2) {
      palette.accent = rgbToHex(sortedBySaturation[1].r, sortedBySaturation[1].g, sortedBySaturation[1].b);
    }
  }

  // Check for red-ish colors → destructive
  const redColors = clusters.filter(c => c.r > 150 && c.g < 100 && c.b < 100);
  if (redColors.length > 0) {
    palette.destructive = rgbToHex(redColors[0].r, redColors[0].g, redColors[0].b);
  }

  // Mid-brightness → muted/border
  if (sortedByBrightness.length > 3) {
    const midIdx = Math.floor(sortedByBrightness.length / 2);
    palette.muted = rgbToHex(sortedByBrightness[midIdx].r, sortedByBrightness[midIdx].g, sortedByBrightness[midIdx].b);
    palette.border = palette.muted;
  }

  return palette;
}

/**
 * Simple k-means-like color clustering
 */
function clusterColors(
  colors: { r: number; g: number; b: number }[],
  k: number,
): { r: number; g: number; b: number }[] {
  if (colors.length === 0) return [];
  if (colors.length <= k) return colors;

  // Initialize centroids from random samples
  const centroids: { r: number; g: number; b: number }[] = [];
  const step = Math.max(1, Math.floor(colors.length / k));
  for (let i = 0; i < k && i * step < colors.length; i++) {
    centroids.push({ ...colors[i * step] });
  }

  // Run a few iterations of k-means
  for (const iter = 0; iter < 5; iter++) {
    const clusters: { r: number; g: number; b: number }[][] = Array.from({ length: centroids.length }, () => []);

    // Assign each color to nearest centroid
    for (const color of colors) {
      let minDist = Infinity;
      let minIdx = 0;
      for (let i = 0; i < centroids.length; i++) {
        const dist = colorDistance(color, centroids[i]);
        if (dist < minDist) {
          minDist = dist;
          minIdx = i;
        }
      }
      clusters[minIdx].push(color);
    }

    // Update centroids
    for (const i = 0; i < centroids.length; i++) {
      if (clusters[i].length === 0) continue;
      centroids[i] = {
        r: Math.round(clusters[i].reduce((s, c) => s + c.r, 0) / clusters[i].length),
        g: Math.round(clusters[i].reduce((s, c) => s + c.g, 0) / clusters[i].length),
        b: Math.round(clusters[i].reduce((s, c) => s + c.b, 0) / clusters[i].length),
      };
    }
  }

  return centroids;
}

function colorDistance(a: { r: number; g: number; b: number }, b: { r: number; g: number; b: number }): number {
  return Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2);
}

function saturation(color: { r: number; g: number; b: number }): number {
  const max = Math.max(color.r, color.g, color.b);
  const min = Math.min(color.r, color.g, color.b);
  return max === 0 ? 0 : (max - min) / max;
}

/**
 * Analyze typography hints from the image
 * This is a heuristic based on image structure
 */
function analyzeTypography(_image: ParsedImage): TypographyHints {
  // Without OCR text data, we provide reasonable defaults
  // The actual typography analysis happens in textExtractor.ts
  return {
    headingSizes: ['large', 'heading'],
    bodySizes: ['medium', 'small'],
    fontFamilies: ['system-ui', 'sans-serif'],
  };
}

/**
 * Analyze spacing patterns from the image
 */
function analyzeSpacing(image: ParsedImage): SpacingHints {
  // Analyze whitespace patterns by looking at the image structure
  const { width, height, buffer, channels } = image;

  // Count vertical whitespace runs (gaps between content)
  const verticalGaps: number[] = [];
  const currentGap = 0;
  const threshold = 240; // near-white threshold

  // Sample columns
  const sampleColumns = [Math.floor(width * 0.25), Math.floor(width * 0.5), Math.floor(width * 0.75)];

  for (const col of sampleColumns) {
    let rowGap = 0;
    for (const y = 0; y < height; y++) {
      const idx = (y * width + col) * channels;
      const isLight = buffer[idx] > threshold && buffer[idx + 1] > threshold && buffer[idx + 2] > threshold;

      if (isLight) {
        rowGap++;
      } else {
        if (rowGap > 5) verticalGaps.push(rowGap);
        rowGap = 0;
      }
    }
  }

  // Analyze gap consistency
  let gapPattern: 'small' | 'medium' | 'large' | 'mixed' = 'mixed';
  if (verticalGaps.length > 0) {
    const avgGap = verticalGaps.reduce((a, b) => a + b, 0) / verticalGaps.length;
    if (avgGap < 15) gapPattern = 'small';
    else if (avgGap < 40) gapPattern = 'medium';
    else gapPattern = 'large';
  }

  return {
    consistentSpacing: verticalGaps.length > 2,
    gapPattern,
    paddingPattern: 'normal',
  };
}

/**
 * Extract color info from a specific region
 */
export async function extractRegionColors(
  image: ParsedImage,
  x: number,
  y: number,
  width: number,
  height: number,
): Promise<ColorInfo> {
  try {
    const regionBuffer = await extractRegion(image, x, y, width, height);
    const stats = await sharp(regionBuffer).stats();
    const dominant = stats.dominant;

    return {
      dominant: rgbToHex(dominant.r, dominant.g, dominant.b),
      average: rgbToHex(
        Math.round(stats.channels[0].mean),
        Math.round(stats.channels[1].mean),
        Math.round(stats.channels[2].mean),
      ),
      hasBorder: false,
    };
  } catch {
    return {
      dominant: '#808080',
      average: '#808080',
      hasBorder: false,
    };
  }
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(c => Math.round(c).toString(16).padStart(2, '0')).join('');
}