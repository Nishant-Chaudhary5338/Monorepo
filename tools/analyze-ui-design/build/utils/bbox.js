/**
 * Calculate the area of a bounding box
 */
export function bboxArea(bbox) {
    return bbox.width * bbox.height;
}
/**
 * Get the center point of a bounding box
 */
export function bboxCenter(bbox) {
    return {
        x: bbox.x + bbox.width / 2,
        y: bbox.y + bbox.height / 2,
    };
}
/**
 * Get the bottom-right corner of a bounding box
 */
export function bboxBottomRight(bbox) {
    return {
        x: bbox.x + bbox.width,
        y: bbox.y + bbox.height,
    };
}
/**
 * Check if bbox A is fully contained within bbox B
 */
export function isInside(inner, outer) {
    return (inner.x >= outer.x &&
        inner.y >= outer.y &&
        inner.x + inner.width <= outer.x + outer.width &&
        inner.y + inner.height <= outer.y + outer.height);
}
/**
 * Check if two bounding boxes overlap
 */
export function overlaps(a, b) {
    return !(a.x + a.width <= b.x ||
        b.x + b.width <= a.x ||
        a.y + a.height <= b.y ||
        b.y + b.height <= a.y);
}
/**
 * Calculate the intersection area between two bboxes
 */
export function intersectionArea(a, b) {
    if (!overlaps(a, b))
        return 0;
    const xOverlap = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x);
    const yOverlap = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y);
    return xOverlap * yOverlap;
}
/**
 * Calculate IoU (Intersection over Union) between two bboxes
 */
export function iou(a, b) {
    const intersection = intersectionArea(a, b);
    const union = bboxArea(a) + bboxArea(b) - intersection;
    return union === 0 ? 0 : intersection / union;
}
/**
 * Calculate Euclidean distance between two points
 */
export function distance(a, b) {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}
/**
 * Calculate the horizontal gap between two bboxes (0 if overlapping)
 */
export function horizontalGap(a, b) {
    if (overlaps(a, b))
        return 0;
    const left = a.x < b.x ? a : b;
    const right = a.x < b.x ? b : a;
    return right.x - (left.x + left.width);
}
/**
 * Calculate the vertical gap between two bboxes (0 if overlapping)
 */
export function verticalGap(a, b) {
    if (overlaps(a, b))
        return 0;
    const top = a.y < b.y ? a : b;
    const bottom = a.y < b.y ? b : a;
    return bottom.y - (top.y + top.height);
}
/**
 * Check if two bboxes are horizontally aligned (centers on similar Y)
 */
export function isHorizontallyAligned(a, b, tolerance = 0.2) {
    const centerA = bboxCenter(a);
    const centerB = bboxCenter(b);
    const maxH = Math.max(a.height, b.height);
    return Math.abs(centerA.y - centerB.y) <= maxH * tolerance;
}
/**
 * Check if two bboxes are vertically aligned (centers on similar X)
 */
export function isVerticallyAligned(a, b, tolerance = 0.2) {
    const centerA = bboxCenter(a);
    const centerB = bboxCenter(b);
    const maxW = Math.max(a.width, b.width);
    return Math.abs(centerA.x - centerB.x) <= maxW * tolerance;
}
/**
 * Expand a bounding box by a padding amount
 */
export function expandBbox(bbox, padding) {
    return {
        x: bbox.x - padding,
        y: bbox.y - padding,
        width: bbox.width + padding * 2,
        height: bbox.height + padding * 2,
    };
}
/**
 * Merge two bounding boxes into one that contains both
 */
export function mergeBboxes(a, b) {
    const x = Math.min(a.x, b.x);
    const y = Math.min(a.y, b.y);
    return {
        x,
        y,
        width: Math.max(a.x + a.width, b.x + b.width) - x,
        height: Math.max(a.y + a.height, b.y + b.height) - y,
    };
}
/**
 * Sort bounding boxes top-left to bottom-right (row-major order)
 */
export function sortTopLeft(items) {
    return [...items].sort((a, b) => {
        const yDiff = a.bbox.y - b.bbox.y;
        if (Math.abs(yDiff) < 10)
            return a.bbox.x - b.bbox.x;
        return yDiff;
    });
}
/**
 * Sort bounding boxes by vertical position first, then horizontal
 */
export function sortByPosition(items) {
    return [...items].sort((a, b) => {
        // Group by vertical position (within 15px considered same row)
        if (Math.abs(a.bbox.y - b.bbox.y) < 15) {
            return a.bbox.x - b.bbox.x;
        }
        return a.bbox.y - b.bbox.y;
    });
}
/**
 * Calculate the aspect ratio of a bounding box
 */
export function aspectRatio(bbox) {
    return bbox.height === 0 ? 0 : bbox.width / bbox.height;
}
/**
 * Check if a bbox is roughly square-shaped
 */
export function isSquare(bbox, tolerance = 0.2) {
    const ratio = aspectRatio(bbox);
    return ratio >= 1 - tolerance && ratio <= 1 + tolerance;
}
/**
 * Check if a bbox is wide (landscape)
 */
export function isWide(bbox, threshold = 2) {
    return aspectRatio(bbox) >= threshold;
}
/**
 * Check if a bbox is tall (portrait)
 */
export function isTall(bbox, threshold = 2) {
    return aspectRatio(bbox) <= 1 / threshold;
}
//# sourceMappingURL=bbox.js.map