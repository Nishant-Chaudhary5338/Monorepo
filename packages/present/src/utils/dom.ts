/**
 * DOM utilities — fullscreen, slide element helpers
 * Pure DOM utilities — no React dependency
 */

/** Request fullscreen on an element */
export async function requestFullscreen(element: HTMLElement): Promise<void> {
  if (element.requestFullscreen) {
    await element.requestFullscreen();
  } else if ("webkitRequestFullscreen" in element) {
    await (element as HTMLElement & { webkitRequestFullscreen(): Promise<void> }).webkitRequestFullscreen();
  }
}

/** Exit fullscreen */
export async function exitFullscreen(): Promise<void> {
  if (document.exitFullscreen) {
    await document.exitFullscreen();
  } else if ("webkitExitFullscreen" in document) {
    await (document as Document & { webkitExitFullscreen(): Promise<void> }).webkitExitFullscreen();
  }
}

/** Check if currently in fullscreen */
export function isFullscreen(): boolean {
  return !!(
    document.fullscreenElement ||
    ("webkitFullscreenElement" in document &&
      (document as Document & { webkitFullscreenElement: Element | null }).webkitFullscreenElement)
  );
}

/** Toggle fullscreen on an element */
export async function toggleFullscreen(element: HTMLElement): Promise<void> {
  if (isFullscreen()) {
    await exitFullscreen();
  } else {
    await requestFullscreen(element);
  }
}

/** Get all slide elements within a deck container */
export function getSlideElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>("[data-slide]"));
}

/** Get a specific slide element by index */
export function getSlideElement(container: HTMLElement, index: number): HTMLElement | null {
  return container.querySelector<HTMLElement>(`[data-slide="${index}"]`);
}

/** Scroll an element into view smoothly */
export function scrollIntoView(element: HTMLElement, options?: ScrollIntoViewOptions): void {
  element.scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "center",
    ...options,
  });
}