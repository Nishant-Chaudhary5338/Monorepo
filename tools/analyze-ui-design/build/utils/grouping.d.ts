import type { BoundingBox } from '../types/blueprint.types.js';
interface HasBbox {
    readonly id: string;
    bbox: BoundingBox;
}
/**
 * Group items by vertical proximity (same row detection)
 * Items within the same Y band are considered in the same row
 */
export declare function groupByRow<T extends HasBbox>(items: T[], tolerance?: number): T[][];
/**
 * Group items by horizontal proximity (same column detection)
 */
export declare function groupByColumn<T extends HasBbox>(items: T[], tolerance?: number): T[][];
/**
 * Group items by spatial proximity using a simple clustering algorithm
 * Items within `maxDistance` pixels of each other are grouped together
 */
export declare function groupByProximity<T extends HasBbox>(items: T[], maxDistance?: number): T[][];
/**
 * Group items by horizontal alignment (items sharing the same horizontal center line)
 */
export declare function groupByHorizontalAlignment<T extends HasBbox>(items: T[], tolerance?: number): T[][];
/**
 * Group items by vertical alignment (items sharing the same vertical center line)
 */
export declare function groupByVerticalAlignment<T extends HasBbox>(items: T[], tolerance?: number): T[][];
/**
 * Detect if a group of items forms a vertical stack (form-like layout)
 * Returns true if items are stacked vertically with consistent spacing
 */
export declare function isVerticalStack<T extends HasBbox>(items: T[]): boolean;
/**
 * Detect if a group of items forms a horizontal row (nav bar, button group)
 */
export declare function isHorizontalRow<T extends HasBbox>(items: T[]): boolean;
/**
 * Calculate consistent spacing between items in a sorted group
 * Returns the average gap or -1 if spacing is inconsistent
 */
export declare function getConsistentSpacing<T extends HasBbox>(items: T[], direction: 'horizontal' | 'vertical', tolerance?: number): {
    consistent: boolean;
    averageGap: number;
};
/**
 * Merge overlapping groups (deduplicate items across groups)
 */
export declare function mergeOverlappingGroups<T extends HasBbox>(groups: T[][]): T[][];
/**
 * Sort items within groups by position (top-left to bottom-right)
 */
export declare function sortGroupsByPosition<T extends HasBbox>(groups: T[][]): T[][];
export {};
//# sourceMappingURL=grouping.d.ts.map