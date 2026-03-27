/**
 * cn — Class name merger (clsx wrapper)
 *
 * Conditional class name utility that merges classes efficiently.
 */

import { clsx, type ClassValue } from "clsx";

/** Merge class names conditionally */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}