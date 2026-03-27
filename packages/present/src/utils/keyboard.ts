/**
 * Keyboard utilities — shortcut mapping and hook
 * Handles keyboard navigation for presentations
 */

import { useEffect, useCallback, useRef } from "react";

/** Keyboard shortcut definition */
export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  action: () => void;
  description?: string;
}

/** Default presentation keyboard shortcuts */
export const defaultShortcuts: Omit<KeyboardShortcut, "action">[] = [
  { key: "ArrowRight", description: "Next slide" },
  { key: "ArrowLeft", description: "Previous slide" },
  { key: "ArrowDown", description: "Next fragment" },
  { key: "ArrowUp", description: "Previous fragment" },
  { key: " ", description: "Next slide" },
  { key: "Home", description: "First slide" },
  { key: "End", description: "Last slide" },
  { key: "f", description: "Toggle fullscreen" },
  { key: "o", description: "Toggle overview" },
  { key: "p", description: "Toggle presenter mode" },
  { key: "Escape", description: "Exit mode" },
];

/** Check if a keyboard event matches a shortcut */
export function matchesShortcut(event: KeyboardEvent, shortcut: Omit<KeyboardShortcut, "action">): boolean {
  if (event.key !== shortcut.key) return false;
  if (shortcut.ctrl && !event.ctrlKey) return false;
  if (shortcut.shift && !event.shiftKey) return false;
  if (shortcut.alt && !event.altKey) return false;
  if (shortcut.meta && !event.metaKey) return false;

  // Check that required modifiers aren't pressed when not specified
  if (!shortcut.ctrl && event.ctrlKey) return false;
  if (!shortcut.shift && event.shiftKey) return false;
  if (!shortcut.alt && event.altKey) return false;
  if (!shortcut.meta && event.metaKey) return false;

  return true;
}

/**
 * useKeyboard — Hook for keyboard shortcut handling
 *
 * @param shortcuts — Array of keyboard shortcuts with actions
 * @param enabled — Whether shortcuts are active (default: true)
 */
export function useKeyboard(
  shortcuts: KeyboardShortcut[],
  enabled = true,
): void {
  const shortcutsRef = useRef(shortcuts);

  useEffect(() => {
    shortcutsRef.current = shortcuts;
  }, [shortcuts]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // Ignore if typing in an input
    const target = event.target as HTMLElement;
    if (
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.isContentEditable
    ) {
      return;
    }

    for (const shortcut of shortcutsRef.current) {
      if (matchesShortcut(event, shortcut)) {
        event.preventDefault();
        shortcut.action();
        return;
      }
    }
  }, [enabled]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}