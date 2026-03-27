import type { BoundingBox } from '../types/blueprint.types.js';
import { bboxCenter, isVerticallyAligned, isHorizontallyAligned, verticalGap, horizontalGap } from './bbox.js';

interface HasBbox {
  readonly id: string;
  bbox: BoundingBox;
}

/**
 * Group items by vertical proximity (same row detection)
 * Items within the same Y band are considered in the same row
 */
export function groupByRow<T extends HasBbox>(items: T[], tolerance = 20): T[][] {
  if (items.length === 0) return [];

  const sorted = [...items].sort((a, b) => a.bbox.y - b.bbox.y);
  const groups: T[][] = [];
  let currentGroup: T[] = [sorted[0]];
  let currentY = sorted[0].bbox.y;

  for (let i = 1; i < sorted.length; i++) {
    if (Math.abs(sorted[i].bbox.y - currentY) <= tolerance) {
      currentGroup.push(sorted[i]);
    } else {
      groups.push(currentGroup);
      currentGroup = [sorted[i]];
      currentY = sorted[i].bbox.y;
    }
  }
  groups.push(currentGroup);

  return groups;
}

/**
 * Group items by horizontal proximity (same column detection)
 */
export function groupByColumn<T extends HasBbox>(items: T[], tolerance = 20): T[][] {
  if (items.length === 0) return [];

  const sorted = [...items].sort((a, b) => a.bbox.x - b.bbox.x);
  const groups: T[][] = [];
  let currentGroup: T[] = [sorted[0]];
  let currentX = sorted[0].bbox.x;

  for (let i = 1; i < sorted.length; i++) {
    if (Math.abs(sorted[i].bbox.x - currentX) <= tolerance) {
      currentGroup.push(sorted[i]);
    } else {
      groups.push(currentGroup);
      currentGroup = [sorted[i]];
      currentX = sorted[i].bbox.x;
    }
  }
  groups.push(currentGroup);

  return groups;
}

/**
 * Group items by spatial proximity using a simple clustering algorithm
 * Items within `maxDistance` pixels of each other are grouped together
 */
export function groupByProximity<T extends HasBbox>(items: T[], maxDistance = 100): T[][] {
  if (items.length === 0) return [];

  const visited = new Set<string>();
  const groups: T[][] = [];

  for (const item of items) {
    if (visited.has(item.id)) continue;

    const group: T[] = [item];
    visited.add(item.id);

    // BFS to find all nearby items
    const queue = [item] as const;
    while (queue.length > 0) {
      const current = queue.shift()!;
      const center = bboxCenter(current.bbox);

      for (const candidate of items) {
        if (visited.has(candidate.id)) continue;
        const candidateCenter = bboxCenter(candidate.bbox);
        const dist = Math.sqrt((center.x - candidateCenter.x) ** 2 + (center.y - candidateCenter.y) ** 2);

        if (dist <= maxDistance) {
          visited.add(candidate.id);
          group.push(candidate);
          queue.push(candidate);
        }
      }
    }

    groups.push(group);
  }

  return groups;
}

/**
 * Group items by horizontal alignment (items sharing the same horizontal center line)
 */
export function groupByHorizontalAlignment<T extends HasBbox>(items: T[], tolerance = 0.15): T[][] {
  if (items.length === 0) return [];

  const groups: T[][] = [];
  const assigned = new Set<string>();

  for (const item of items) {
    if (assigned.has(item.id)) continue;

    const group: T[] = [item];
    assigned.add(item.id);

    for (const candidate of items) {
      if (assigned.has(candidate.id)) continue;
      if (isHorizontallyAligned(item.bbox, candidate.bbox, tolerance)) {
        group.push(candidate);
        assigned.add(candidate.id);
      }
    }

    groups.push(group);
  }

  return groups;
}

/**
 * Group items by vertical alignment (items sharing the same vertical center line)
 */
export function groupByVerticalAlignment<T extends HasBbox>(items: T[], tolerance = 0.15): T[][] {
  if (items.length === 0) return [];

  const groups: T[][] = [];
  const assigned = new Set<string>();

  for (const item of items) {
    if (assigned.has(item.id)) continue;

    const group: T[] = [item];
    assigned.add(item.id);

    for (const candidate of items) {
      if (assigned.has(candidate.id)) continue;
      if (isVerticallyAligned(item.bbox, candidate.bbox, tolerance)) {
        group.push(candidate);
        assigned.add(candidate.id);
      }
    }

    groups.push(group);
  }

  return groups;
}

/**
 * Detect if a group of items forms a vertical stack (form-like layout)
 * Returns true if items are stacked vertically with consistent spacing
 */
export function isVerticalStack<T extends HasBbox>(items: T[]): boolean {
  if (items.length < 2) return false;

  const sorted = [...items].sort((a, b) => a.bbox.y - b.bbox.y);

  // Check that items are roughly vertically aligned
  const firstCenter = bboxCenter(sorted[0].bbox);
  let alignedCount = 0;
  const maxDeviation = Math.max(...items.map(i => i.bbox.width)) * 0.3;

  for (let i = 1; i < sorted.length; i++) {
    const center = bboxCenter(sorted[i].bbox);
    if (Math.abs(center.x - firstCenter.x) <= maxDeviation) {
      alignedCount++;
    }
  }

  return alignedCount >= sorted.length * 0.6;
}

/**
 * Detect if a group of items forms a horizontal row (nav bar, button group)
 */
export function isHorizontalRow<T extends HasBbox>(items: T[]): boolean {
  if (items.length < 2) return false;

  const sorted = [...items].sort((a, b) => a.bbox.x - b.bbox.x);
  const firstCenter = bboxCenter(sorted[0].bbox);
  const alignedCount = 0;
  const maxDeviation = Math.max(...items.map(i => i.bbox.height)) * 0.3;

  for (let i = 1; i < sorted.length; i++) {
    const center = bboxCenter(sorted[i].bbox);
    if (Math.abs(center.y - firstCenter.y) <= maxDeviation) {
      alignedCount++;
    }
  }

  return alignedCount >= sorted.length * 0.6;
}

/**
 * Calculate consistent spacing between items in a sorted group
 * Returns the average gap or -1 if spacing is inconsistent
 */
export function getConsistentSpacing<T extends HasBbox>(
  items: T[],
  direction: 'horizontal' | 'vertical',
  tolerance = 0.3,
): { consistent: boolean; averageGap: number } {
  if (items.length < 2) return { consistent: true, averageGap: 0 };

  const sorted = direction === 'horizontal'
    ? [...items].sort((a, b) => a.bbox.x - b.bbox.x)
    : [...items].sort((a, b) => a.bbox.y - b.bbox.y);

  const gaps: number[] = [];
  for (const i = 0; i < sorted.length - 1; i++) {
    const gap = direction === 'horizontal'
      ? horizontalGap(sorted[i].bbox, sorted[i + 1].bbox)
      : verticalGap(sorted[i].bbox, sorted[i + 1].bbox);
    gaps.push(gap);
  }

  const averageGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
  const maxDeviation = averageGap * tolerance;
  const consistent = gaps.every(g => Math.abs(g - averageGap) <= maxDeviation);

  return { consistent, averageGap };
}

/**
 * Merge overlapping groups (deduplicate items across groups)
 */
export function mergeOverlappingGroups<T extends HasBbox>(groups: T[][]): T[][] {
  const merged: T[][] = [];
  const usedIds = new Set<string>();

  for (const group of groups) {
    const newGroup = group.filter(item => !usedIds.has(item.id));
    if (newGroup.length > 0) {
      newGroup.forEach(item => usedIds.add(item.id));
      merged.push(newGroup);
    }
  }

  return merged;
}

/**
 * Sort items within groups by position (top-left to bottom-right)
 */
export function sortGroupsByPosition<T extends HasBbox>(groups: T[][]): T[][] {
  return groups.map(group =>
    [...group].sort((a, b) => {
      if (Math.abs(a.bbox.y - b.bbox.y) < 15) return a.bbox.x - b.bbox.x;
      return a.bbox.y - b.bbox.y;
    }),
  );
}