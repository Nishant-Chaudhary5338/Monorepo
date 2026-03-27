/**
 * useRouter — React hook for hash-based slide routing
 *
 * Syncs deck state with URL hash for shareable slide links.
 */

import { useCallback, useEffect, useState } from "react";
import { parseHash, buildHash, onHashChange, type HashState } from "./hash-router";

/** Router state and actions */
export interface RouterState {
  /** Current slide index from URL */
  slide: number;
  /** Current fragment index from URL */
  fragment: number;
  /** Navigate to a specific slide/fragment — updates URL hash */
  navigate: (slide: number, fragment?: number) => void;
}

/** Configuration for useRouter */
export interface RouterConfig {
  /** Whether to sync URL hash with deck state (default: true) */
  enabled?: boolean;
  /** Called when hash changes externally */
  onHashChange?: (state: HashState) => void;
}

/**
 * useRouter — Sync deck navigation with URL hash
 *
 * @param config — Optional configuration
 * @returns Router state with slide, fragment, and navigate function
 */
export function useRouter(config: RouterConfig = {}): RouterState {
  const { enabled = true, onHashChange: onHashChangeCallback } = config;
  const [hashState, setHashState] = useState<HashState>(() =>
    typeof window !== "undefined" ? parseHash(window.location.hash) : { slide: 0, fragment: 0 },
  );

  // Listen for hash changes
  useEffect(() => {
    if (!enabled) return;

    const unsubscribe = onHashChange((state) => {
      setHashState(state);
      onHashChangeCallback?.(state);
    });

    return unsubscribe;
  }, [enabled, onHashChangeCallback]);

  // Navigate by updating the hash
  const navigate = useCallback((slide: number, fragment = 0) => {
    if (typeof window !== "undefined") {
      window.location.hash = buildHash(slide, fragment);
    }
  }, []);

  return {
    slide: hashState.slide,
    fragment: hashState.fragment,
    navigate,
  };
}