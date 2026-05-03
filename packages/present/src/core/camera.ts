/**
 * Camera math — pure functions for Prezi-style zoom navigation.
 *
 * The canvas camera is described by { x, y, zoom } where:
 *   x, y  — canvas-space center point the camera focuses on
 *   zoom  — scale factor applied to the canvas
 *
 * Transform applied: translate3d(vw/2 - x*zoom, vh/2 - y*zoom, 0) scale(zoom)
 */

export interface FrameBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CameraTarget {
  x: number;
  y: number;
  zoom: number;
}

export interface Viewport {
  width: number;
  height: number;
}

/**
 * Compute the camera target that fills the viewport with the given frame.
 * padding = 0.88 means the frame occupies 88% of the smaller viewport dimension.
 */
export function computeCameraForFrame(
  frame: FrameBounds,
  viewport: Viewport,
  padding = 0.88,
): CameraTarget {
  const scaleX = (viewport.width * padding) / frame.width;
  const scaleY = (viewport.height * padding) / frame.height;
  const zoom = Math.min(scaleX, scaleY);
  return {
    x: frame.x + frame.width / 2,
    y: frame.y + frame.height / 2,
    zoom,
  };
}

/**
 * Compute the camera target that fits ALL frames in the viewport (overview mode).
 */
export function computeOverviewCamera(
  frames: FrameBounds[],
  viewport: Viewport,
  padding = 0.82,
): CameraTarget {
  if (frames.length === 0) return { x: 0, y: 0, zoom: 1 };

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const f of frames) {
    minX = Math.min(minX, f.x);
    minY = Math.min(minY, f.y);
    maxX = Math.max(maxX, f.x + f.width);
    maxY = Math.max(maxY, f.y + f.height);
  }

  const boundsW = maxX - minX;
  const boundsH = maxY - minY;

  if (boundsW === 0 || boundsH === 0) return { x: (minX + maxX) / 2, y: (minY + maxY) / 2, zoom: 1 };

  return computeCameraForFrame(
    { x: minX, y: minY, width: boundsW, height: boundsH },
    viewport,
    padding,
  );
}

/**
 * Compute viewport translation from camera state.
 */
export function cameraToTransform(
  camera: CameraTarget,
  viewport: Viewport,
  dragOffset: { x: number; y: number } = { x: 0, y: 0 },
): { tx: number; ty: number } {
  return {
    tx: viewport.width / 2 - (camera.x + dragOffset.x) * camera.zoom,
    ty: viewport.height / 2 - (camera.y + dragOffset.y) * camera.zoom,
  };
}

/**
 * Compute planet layout positions for N subtopics orbiting a center.
 * Returns canvas-space offsets relative to the topic center.
 */
export function computePlanetLayout(
  count: number,
  orbitRadius: number,
  startAngle = -Math.PI / 2,
): Array<{ dx: number; dy: number }> {
  if (count === 0) return [];
  return Array.from({ length: count }, (_, i) => {
    const angle = startAngle + (2 * Math.PI * i) / count;
    return {
      dx: Math.cos(angle) * orbitRadius,
      dy: Math.sin(angle) * orbitRadius,
    };
  });
}

/**
 * Compute page layout positions for N subtopics in a linear row.
 */
export function computePageLayout(
  count: number,
  itemWidth: number,
  itemHeight: number,
  gap = 80,
  direction: "horizontal" | "vertical" = "horizontal",
): Array<{ dx: number; dy: number }> {
  if (count === 0) return [];
  return Array.from({ length: count }, (_, i) => {
    if (direction === "horizontal") {
      const totalW = count * itemWidth + (count - 1) * gap;
      return { dx: -totalW / 2 + i * (itemWidth + gap) + itemWidth / 2, dy: 0 };
    }
    const totalH = count * itemHeight + (count - 1) * gap;
    return { dx: 0, dy: -totalH / 2 + i * (itemHeight + gap) + itemHeight / 2 };
  });
}
