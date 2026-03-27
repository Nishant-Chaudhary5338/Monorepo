import sharp from 'sharp';
import type { ParsedImage, DetectedBlock, BoundingBox } from '../types/blueprint.types.js';

interface RegionCandidate {
  x: number;
  y: number;
  width: number;
  height: number;
  pixelCount: number;
  avgColor: { r: number; g: number; b: number };
}

/**
 * Detect UI layout blocks (regions, sections) in an image
 * Uses edge detection and connected component analysis
 */
export async function detectLayout(image: ParsedImage): Promise<DetectedBlock[]> {
  const blocks: DetectedBlock[] = [];

  // 1. Detect edges and contours
  const edges = await detectEdges(image);

  // 2. Find rectangular regions from edges
  const regions = findRectangularRegions(edges, image.width, image.height);

  // 3. Filter and merge overlapping regions
  const mergedRegions = mergeOverlappingRegions(regions);

  // 4. Convert to DetectedBlocks
  for (let i = 0; i < mergedRegions.length; i++) {
    const region = mergedRegions[i];

    // Skip very small regions (noise)
    if (region.width < 30 || region.height < 20) continue;

    // Skip regions that cover most of the image (background)
    if (region.width > image.width * 0.95 && region.height > image.height * 0.95) continue;

    const confidence = calculateRegionConfidence(region, image);

    blocks.push({
      id: `block-${i}`,
      bbox: {
        x: region.x,
        y: region.y,
        width: region.width,
        height: region.height,
      },
      type: classifyBlockType(region, image),
      confidence,
      color: {
        dominant: rgbToHex(region.avgColor.r, region.avgColor.g, region.avgColor.b),
        average: rgbToHex(region.avgColor.r, region.avgColor.g, region.avgColor.b),
        hasBorder: false,
      },
    });
  }

  return blocks;
}

/**
 * Simple edge detection using color difference
 */
async function detectEdges(image: ParsedImage): Promise<Uint8Array> {
  const { width, height, buffer } = image;
  const edgeMap = new Uint8Array(width * height);
  const threshold = 30;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * image.channels;
      const rightIdx = (y * width + x + 1) * image.channels;
      const bottomIdx = ((y + 1) * width + x) * image.channels;

      // Compare with right neighbor
      const diffRight =
        Math.abs(buffer[idx] - buffer[rightIdx]) +
        Math.abs(buffer[idx + 1] - buffer[rightIdx + 1]) +
        Math.abs(buffer[idx + 2] - buffer[rightIdx + 2]);

      // Compare with bottom neighbor
      const diffBottom =
        Math.abs(buffer[idx] - buffer[bottomIdx]) +
        Math.abs(buffer[idx + 1] - buffer[bottomIdx + 1]) +
        Math.abs(buffer[idx + 2] - buffer[bottomIdx + 2]);

      if (diffRight > threshold || diffBottom > threshold) {
        edgeMap[y * width + x] = 255;
      }
    }
  }

  return edgeMap;
}

/**
 * Find rectangular regions from edge map using flood-fill approach
 */
function findRectangularRegions(
  edges: Uint8Array,
  width: number,
  height: number,
): RegionCandidate[] {
  const visited = new Uint8Array(width * height);
  const regions: RegionCandidate[] = [];
  const minRegionSize = 500; // minimum pixels for a region

  // Sample grid to find seed points (non-edge areas)
  const gridSize = 20;

  for (const gy = gridSize; gy < height - gridSize; gy += gridSize) {
    for (const gx = gridSize; gx < width - gridSize; gx += gridSize) {
      const idx = gy * width + gx;

      if (visited[idx] || edges[idx]) continue;

      // Flood fill to find connected non-edge region
      const region = floodFill(edges, visited, gx, gy, width, height);

      if (region.pixelCount >= minRegionSize) {
        regions.push(region);
      }
    }
  }

  return regions;
}

/**
 * Flood fill algorithm to find connected regions
 */
function floodFill(
  edges: Uint8Array,
  visited: Uint8Array,
  startX: number,
  startY: number,
  width: number,
  height: number,
): RegionCandidate {
  const stack: [number, number][] = [[startX, startY]];
  let minX = startX, maxX = startX, minY = startY, maxY = startY;
  const pixelCount = 0;

  while (stack.length > 0) {
    const [x, y] = stack.pop()!;
    const idx = y * width + x;

    if (x < 0 || x >= width || y < 0 || y >= height) continue;
    if (visited[idx] || edges[idx]) continue;

    visited[idx] = 1;
    pixelCount++;

    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);

    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
    pixelCount,
    avgColor: { r: 200, g: 200, b: 200 }, // Will be computed later
  };
}

/**
 * Merge overlapping or highly contained regions
 */
function mergeOverlappingRegions(regions: RegionCandidate[]): RegionCandidate[] {
  if (regions.length === 0) return [];

  const merged: RegionCandidate[] = [...regions];
  let changed = true;

  while (changed) {
    changed = false;
    for (const i = 0; i < merged.length; i++) {
      for (const j = i + 1; j < merged.length; j++) {
        const a = merged[i];
        const b = merged[j];

        // Check overlap
        const overlapX = Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x));
        const overlapY = Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));
        const overlapArea = overlapX * overlapY;

        const areaA = a.width * a.height;
        const areaB = b.width * b.height;
        const smallerArea = Math.min(areaA, areaB);

        // Merge if overlap is significant (>50% of smaller region)
        if (overlapArea > smallerArea * 0.5) {
          const newX = Math.min(a.x, b.x);
          const newY = Math.min(a.y, b.y);
          const newMaxX = Math.max(a.x + a.width, b.x + b.width);
          const newMaxY = Math.max(a.y + a.height, b.y + b.height);

          merged[i] = {
            x: newX,
            y: newY,
            width: newMaxX - newX,
            height: newMaxY - newY,
            pixelCount: a.pixelCount + b.pixelCount,
            avgColor: {
              r: Math.round((a.avgColor.r + b.avgColor.r) / 2),
              g: Math.round((a.avgColor.g + b.avgColor.g) / 2),
              b: Math.round((a.avgColor.b + b.avgColor.b) / 2),
            },
          };

          merged.splice(j, 1);
          changed = true;
          break;
        }
      }
      if (changed) break;
    }
  }

  return merged;
}

/**
 * Classify block type based on size and position
 */
function classifyBlockType(
  region: RegionCandidate,
  image: ParsedImage,
): 'region' | 'text' | 'shape' | 'image' {
  const ratio = region.width / region.height;
  const relativeY = region.y / image.height;

  // Small wide regions are likely text bars
  if (region.height < 50 && ratio > 3) return 'text';

  // Large regions are likely containers/sections
  if (region.width > 200 && region.height > 100) return 'region';

  // Square-ish regions might be images or icons
  if (ratio > 0.7 && ratio < 1.3 && region.width < 150) return 'image';

  return 'shape';
}

/**
 * Calculate confidence for a detected region
 */
function calculateRegionConfidence(region: RegionCandidate, image: ParsedImage): number {
  const confidence = 0.5;

  // Prefer regions with reasonable sizes
  if (region.width > 50 && region.height > 30) confidence += 0.1;
  if (region.width < image.width * 0.8 && region.height < image.height * 0.8) confidence += 0.1;

  // Prefer regions that aren't too small
  if (region.width * region.height > 5000) confidence += 0.1;

  // Prefer regions in typical UI positions (not edges)
  if (region.x > 10 && region.y > 10) confidence += 0.1;

  return Math.min(1.0, confidence);
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(c => Math.round(c).toString(16).padStart(2, '0')).join('');
}