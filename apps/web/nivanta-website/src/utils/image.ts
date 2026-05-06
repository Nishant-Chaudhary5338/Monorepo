/**
 * Resize a Pexels CDN image URL to a given width.
 * Pexels supports w= parameter directly; WebP format preserved via fm=webp.
 * Use this to serve appropriately-sized images for each context.
 */
export function pxResize(url: string, width: number): string {
  return url.replace(/w=\d+/, `w=${width}`);
}

/**
 * Generate a srcset string for a Pexels image at common breakpoints.
 * Usage: <img srcSet={pxSrcSet(url)} sizes="(max-width: 640px) 100vw, 50vw" />
 */
export function pxSrcSet(url: string, widths = [400, 800, 1200]): string {
  return widths.map((w) => `${pxResize(url, w)} ${w}w`).join(", ");
}

/**
 * Generate a srcset string for an Unsplash image.
 */
export function unSrcSet(url: string, widths = [400, 800, 1200, 1920]): string {
  return widths
    .map((w) => `${url.replace(/w=\d+/, `w=${w}`)} ${w}w`)
    .join(", ");
}
