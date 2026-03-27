import type { BoundingBox, Point } from '../types/blueprint.types.js';
/**
 * Calculate the area of a bounding box
 */
export declare function bboxArea(bbox: BoundingBox): number;
/**
 * Get the center point of a bounding box
 */
export declare function bboxCenter(bbox: BoundingBox): Point;
/**
 * Get the bottom-right corner of a bounding box
 */
export declare function bboxBottomRight(bbox: BoundingBox): Point;
/**
 * Check if bbox A is fully contained within bbox B
 */
export declare function isInside(inner: BoundingBox, outer: BoundingBox): boolean;
/**
 * Check if two bounding boxes overlap
 */
export declare function overlaps(a: BoundingBox, b: BoundingBox): boolean;
/**
 * Calculate the intersection area between two bboxes
 */
export declare function intersectionArea(a: BoundingBox, b: BoundingBox): number;
/**
 * Calculate IoU (Intersection over Union) between two bboxes
 */
export declare function iou(a: BoundingBox, b: BoundingBox): number;
/**
 * Calculate Euclidean distance between two points
 */
export declare function distance(a: Point, b: Point): number;
/**
 * Calculate the horizontal gap between two bboxes (0 if overlapping)
 */
export declare function horizontalGap(a: BoundingBox, b: BoundingBox): number;
/**
 * Calculate the vertical gap between two bboxes (0 if overlapping)
 */
export declare function verticalGap(a: BoundingBox, b: BoundingBox): number;
/**
 * Check if two bboxes are horizontally aligned (centers on similar Y)
 */
export declare function isHorizontallyAligned(a: BoundingBox, b: BoundingBox, tolerance?: number): boolean;
/**
 * Check if two bboxes are vertically aligned (centers on similar X)
 */
export declare function isVerticallyAligned(a: BoundingBox, b: BoundingBox, tolerance?: number): boolean;
/**
 * Expand a bounding box by a padding amount
 */
export declare function expandBbox(bbox: BoundingBox, padding: number): BoundingBox;
/**
 * Merge two bounding boxes into one that contains both
 */
export declare function mergeBboxes(a: BoundingBox, b: BoundingBox): BoundingBox;
/**
 * Sort bounding boxes top-left to bottom-right (row-major order)
 */
export declare function sortTopLeft<T extends {
    bbox: BoundingBox;
}>(items: T[]): T[];
/**
 * Sort bounding boxes by vertical position first, then horizontal
 */
export declare function sortByPosition<T extends {
    bbox: BoundingBox;
}>(items: T[]): T[];
/**
 * Calculate the aspect ratio of a bounding box
 */
export declare function aspectRatio(bbox: BoundingBox): number;
/**
 * Check if a bbox is roughly square-shaped
 */
export declare function isSquare(bbox: BoundingBox, tolerance?: number): boolean;
/**
 * Check if a bbox is wide (landscape)
 */
export declare function isWide(bbox: BoundingBox, threshold?: number): boolean;
/**
 * Check if a bbox is tall (portrait)
 */
export declare function isTall(bbox: BoundingBox, threshold?: number): boolean;
//# sourceMappingURL=bbox.d.ts.map