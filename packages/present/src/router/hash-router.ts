/**
 * HashRouter — Hash-based slide routing (#slide-3/fragment-2)
 *
 * Parses and builds hash URLs for slide navigation.
 * Pure logic — no React dependency.
 */

/** Parsed hash state */
export interface HashState {
  slide: number;
  fragment: number;
}

/** Parse a hash string into slide/fragment indices */
export function parseHash(hash: string): HashState {
  // Remove leading #
  const clean = hash.replace(/^#/, "");

  // Match patterns: slide-3, slide-3/fragment-2, 3, 3/2
  const slideMatch = clean.match(/(?:slide-)?(\d+)/);
  const fragmentMatch = clean.match(/(?:fragment-)?(\d+)(?!.*\d)/);

  // Find fragment specifically after a slash
  const slashIndex = clean.indexOf("/");
  let fragment = 0;
  if (slashIndex !== -1) {
    const afterSlash = clean.slice(slashIndex + 1);
    const fragNum = parseInt(afterSlash.replace("fragment-", ""), 10);
    if (!isNaN(fragNum)) {
      fragment = fragNum;
    }
  }

  const slide = slideMatch ? parseInt(slideMatch[1], 10) : 0;

  return {
    slide: Math.max(0, slide),
    fragment: Math.max(0, fragment),
  };
}

/** Build a hash string from slide/fragment indices */
export function buildHash(slide: number, fragment = 0): string {
  if (fragment > 0) {
    return `#slide-${slide}/fragment-${fragment}`;
  }
  return `#slide-${slide}`;
}

/** Listen for hash changes */
export function onHashChange(callback: (state: HashState) => void): () => void {
  const handler = () => {
    callback(parseHash(window.location.hash));
  };
  window.addEventListener("hashchange", handler);
  return () => window.removeEventListener("hashchange", handler);
}

/** Set the hash to a specific slide/fragment */
export function setHash(slide: number, fragment = 0): void {
  window.location.hash = buildHash(slide, fragment);
}

/** Get current hash state */
export function getCurrentHash(): HashState {
  return parseHash(window.location.hash);
}
