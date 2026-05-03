/**
 * PreziCanvas — Infinite spatial canvas with Prezi-style zoom navigation.
 *
 * The zoom is COUPLED to position progress: as the camera travels from frame A
 * to frame B, the zoom follows a bell curve — zooming out to show both frames
 * at the midpoint, then zooming back in to the destination. This is how Prezi
 * actually works (not two separate phases with a timer).
 *
 * Keys: → / Space = next, ← = prev, O = overview, F = fullscreen, Esc = exit overview
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useGesture } from "@use-gesture/react";
import { clamp, lerp, easeInOutCubic } from "../../core/math";
import { springSolver } from "../../core/math";
import { frameScheduler } from "../../core/scheduler";
import { computeCameraForFrame, computeOverviewCamera, type CameraTarget } from "../../core/camera";
import { FrameRegistryContext, useCreateFrameRegistry } from "./FrameRegistry";
import { useKeyboard } from "../../utils/keyboard";
import { cn } from "../../utils/classnames";

// ─── Spring configs ───────────────────────────────────────────────────────────
// Position: fluid travel — not too snappy, gives zoom time to dip
const SPRING_POS  = { stiffness: 100, damping: 20, mass: 1.0 };
// Zoom: slightly slower, lags behind position for the pull-back feel
const SPRING_ZOOM = { stiffness: 60,  damping: 14, mass: 1.0 };

// ─── Navigation state (for coupled zoom) ──────────────────────────────────────
interface NavState {
  sourceX:    number;   // spring.x.pos when nav started
  sourceY:    number;   // spring.y.pos when nav started
  totalDist:  number;   // canvas-space distance source→target centers
  sourceZoom: number;   // zoom when nav started
  targetZoom: number;   // zoom at destination
  throughZoom: number;  // minimum zoom (fits both frames + breathing room)
}

// ─── Canvas context ───────────────────────────────────────────────────────────
export interface PreziCanvasContextValue {
  activeFrameId: string | null;
  isOverview:    boolean;
  isFullscreen:  boolean;
  pathIndex:     number;
  pathLength:    number;
  next(): void;
  prev(): void;
  goToFrame(id: string): void;
  toggleOverview(): void;
  toggleFullscreen(): void;
}

export const PreziCanvasContext = createContext<PreziCanvasContextValue | null>(null);

export function usePreziCanvas(): PreziCanvasContextValue {
  const ctx = useContext(PreziCanvasContext);
  if (!ctx) throw new Error("usePreziCanvas must be used inside <PreziCanvas>");
  return ctx;
}

export function usePreziCanvasOptional(): PreziCanvasContextValue | null {
  return useContext(PreziCanvasContext);
}

// ─── Props ────────────────────────────────────────────────────────────────────
export interface PreziCanvasProps {
  path: string[];
  children: ReactNode;
  initialFrame?: string;
  onFrameChange?: (frameId: string, index: number) => void;
  background?: string;
  keyboard?: boolean;
  draggable?: boolean;
  showNav?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function PreziCanvas({
  path,
  children,
  initialFrame,
  onFrameChange,
  background,
  keyboard = true,
  draggable = true,
  showNav = true,
  className,
  style,
}: PreziCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLDivElement>(null);

  const registry = useCreateFrameRegistry();

  // Spring state — direct DOM writes, never React state
  const springs = useRef({ x: { pos: 0, vel: 0 }, y: { pos: 0, vel: 0 }, zoom: { pos: 1, vel: 0 } });
  const targets  = useRef<CameraTarget>({ x: 0, y: 0, zoom: 1 });
  const dragOff  = useRef({ x: 0, y: 0 });

  // Navigation coupling state
  const navStateRef      = useRef<NavState | null>(null);
  const sourceFrameIdRef = useRef<string | null>(null);

  // React state — only what drives JSX re-renders
  const [pathIndex, setPathIndex]   = useState(0);
  const pathIndexRef                = useRef(0);
  const [isOverview, setIsOverview] = useState(false);
  const isOverviewRef               = useRef(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const getViewport = useCallback(() => {
    const el = containerRef.current;
    return el
      ? { width: el.offsetWidth, height: el.offsetHeight }
      : { width: 1920, height: 1080 };
  }, []);

  // Apply CSS transform directly — 0 React state
  const applyTransform = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const vw = container.offsetWidth;
    const vh = container.offsetHeight;
    const { x, y, zoom } = springs.current;
    const tx = vw / 2 - (x.pos + dragOff.current.x) * zoom.pos;
    const ty = vh / 2 - (y.pos + dragOff.current.y) * zoom.pos;

    canvas.style.transform = `translate3d(${tx}px,${ty}px,0) scale(${zoom.pos})`;
    container.style.setProperty("--present-zoom", String(zoom.pos));
  }, []);

  // ── RAF spring loop — zoom is COUPLED to position progress ────────────────
  useEffect(() => {
    const taskId = frameScheduler.schedule("critical", (deltaMs) => {
      const dt = Math.min(deltaMs / 1000, 0.033);
      let anyMoving = false;

      // Step position springs
      for (const key of ["x", "y"] as const) {
        const s = springs.current[key];
        const r = springSolver({
          current: s.pos, target: targets.current[key],
          velocity: s.vel, deltaSeconds: dt, ...SPRING_POS,
        });
        springs.current[key] = { pos: r.position, vel: r.velocity };
        if (!r.isSettled) anyMoving = true;
      }

      // Dynamically update zoom target based on how far the position spring
      // has travelled toward its destination — this is what creates the
      // Prezi "zoom out between frames" effect without any setTimeout hacks.
      const nav = navStateRef.current;
      if (nav && nav.totalDist > 1) {
        const dx = springs.current.x.pos - nav.sourceX;
        const dy = springs.current.y.pos - nav.sourceY;
        const traveled = Math.sqrt(dx * dx + dy * dy);
        const t = Math.min(traveled / nav.totalDist, 1.0);

        // Bell-curve zoom: eased dip to throughZoom at midpoint
        let zoomTarget: number;
        if (t < 0.5) {
          zoomTarget = lerp(nav.sourceZoom, nav.throughZoom, easeInOutCubic(t * 2));
        } else {
          zoomTarget = lerp(nav.throughZoom, nav.targetZoom, easeInOutCubic((t - 0.5) * 2));
        }
        targets.current.zoom = zoomTarget;

        if (t >= 0.99) {
          targets.current.zoom = nav.targetZoom;
          navStateRef.current = null;
        }
        anyMoving = true; // keep loop alive during nav
      }

      // Step zoom spring
      const sz = springs.current.zoom;
      const rz = springSolver({
        current: sz.pos, target: targets.current.zoom,
        velocity: sz.vel, deltaSeconds: dt, ...SPRING_ZOOM,
      });
      springs.current.zoom = { pos: rz.position, vel: rz.velocity };
      if (!rz.isSettled) anyMoving = true;

      if (anyMoving) applyTransform();
    });

    return () => frameScheduler.cancel(taskId);
  }, [applyTransform]);

  // ── Manual wheel listener (bypasses passive-event-listener browser error) ──
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const currentZoom = springs.current.zoom.pos;

      if (e.ctrlKey || e.metaKey) {
        // Ctrl+scroll and trackpad pinch both arrive as ctrl+wheel
        const factor = Math.exp(-e.deltaY * 0.008);
        const newZoom = clamp(currentZoom * factor, 0.05, 8);
        springs.current.zoom = { pos: newZoom, vel: 0 };
        targets.current.zoom = newZoom;
        navStateRef.current = null; // cancel coupled nav when user manually zooms
      } else {
        const scale = 1 / currentZoom;
        dragOff.current.x += e.deltaX * scale * 0.8;
        dragOff.current.y += e.deltaY * scale * 0.8;
      }
      applyTransform();
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [applyTransform]);

  // ── Fullscreen state tracking ─────────────────────────────────────────────
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      el.requestFullscreen({ navigationUI: "hide" }).catch(() => {});
    }
  }, []);

  // ── Retarget (no NavState — used for resize / overview exit) ─────────────
  const retargetFrame = useCallback((frameId: string) => {
    const frame = registry.getFrame(frameId);
    if (!frame) return;
    targets.current = computeCameraForFrame(frame, getViewport());
    dragOff.current = { x: 0, y: 0 };
  }, [registry, getViewport]);

  // ── Two-way coupled navigation: position + zoom linked ───────────────────
  const navigateToFrame = useCallback((frameId: string) => {
    const targetFrame = registry.getFrame(frameId);
    if (!targetFrame) return;

    const vp          = getViewport();
    const directTarget = computeCameraForFrame(targetFrame, vp);

    const sourceId    = sourceFrameIdRef.current;
    const sourceFrame = sourceId && sourceId !== frameId
      ? registry.getFrame(sourceId) : null;

    // Compute spring-space distance (where the position spring currently is)
    const sX = springs.current.x.pos;
    const sY = springs.current.y.pos;
    const sZ = springs.current.zoom.pos;
    const dist = Math.sqrt(
      (directTarget.x - sX) ** 2 + (directTarget.y - sY) ** 2
    );

    if (sourceFrame && dist > 20) {
      const throughZoom = Math.min(
        computeOverviewCamera([sourceFrame, targetFrame], vp, 0.65).zoom,
        sZ,                  // never zoom out MORE than current (avoid jarring pull)
        directTarget.zoom,   // symmetric constraint
      );

      navStateRef.current = {
        sourceX:    sX,
        sourceY:    sY,
        totalDist:  dist,
        sourceZoom: sZ,
        targetZoom: directTarget.zoom,
        throughZoom,
      };
    } else {
      navStateRef.current = null;
    }

    targets.current          = directTarget;
    dragOff.current          = { x: 0, y: 0 };
    sourceFrameIdRef.current = frameId;
  }, [registry, getViewport]);

  // ── Hard-snap (no animation) — mount + transitions from overview ──────────
  const snapToFrame = useCallback((frameId: string) => {
    navStateRef.current = null;
    const frame = registry.getFrame(frameId);
    if (!frame) return;
    const cam = computeCameraForFrame(frame, getViewport());
    springs.current = {
      x:    { pos: cam.x,    vel: 0 },
      y:    { pos: cam.y,    vel: 0 },
      zoom: { pos: cam.zoom, vel: 0 },
    };
    targets.current          = cam;
    dragOff.current          = { x: 0, y: 0 };
    sourceFrameIdRef.current = frameId;
    applyTransform();
  }, [registry, getViewport, applyTransform]);

  // Initial snap — Frame useLayoutEffects run BEFORE parent's, so registry is ready
  useLayoutEffect(() => {
    const startId = initialFrame ?? path[0];
    if (!startId) return;
    const idx = path.indexOf(startId);
    const i   = idx >= 0 ? idx : 0;
    pathIndexRef.current = i;
    setPathIndex(i);
    snapToFrame(path[i] ?? startId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-target when viewport resizes (fullscreen change also fires this)
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (isOverviewRef.current) {
        const cam = computeOverviewCamera(registry.getAllFrames(), getViewport());
        targets.current = cam;
      } else {
        const frameId = path[pathIndexRef.current];
        if (frameId) retargetFrame(frameId);
      }
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [path, retargetFrame, registry, getViewport]);

  // ── Path navigation ───────────────────────────────────────────────────────
  const goToIndex = useCallback((i: number) => {
    const clamped = clamp(i, 0, path.length - 1);
    const frameId = path[clamped];
    if (!frameId) return;
    isOverviewRef.current = false;
    setIsOverview(false);
    pathIndexRef.current = clamped;
    setPathIndex(clamped);
    navigateToFrame(frameId);
    onFrameChange?.(frameId, clamped);
  }, [path, navigateToFrame, onFrameChange]);

  const next = useCallback(() => goToIndex(pathIndexRef.current + 1), [goToIndex]);
  const prev = useCallback(() => goToIndex(pathIndexRef.current - 1), [goToIndex]);

  const goToFrame = useCallback((id: string) => {
    const i = path.indexOf(id);
    if (i >= 0) {
      goToIndex(i);
    } else {
      isOverviewRef.current = false;
      setIsOverview(false);
      navigateToFrame(id);
    }
  }, [path, goToIndex, navigateToFrame]);

  // ── Overview ──────────────────────────────────────────────────────────────
  const toggleOverview = useCallback(() => {
    const entering = !isOverviewRef.current;
    isOverviewRef.current = entering;
    setIsOverview(entering);
    navStateRef.current = null;

    if (entering) {
      const cam = computeOverviewCamera(registry.getAllFrames(), getViewport());
      targets.current = cam;
      dragOff.current = { x: 0, y: 0 };
    } else {
      const frameId = path[pathIndexRef.current];
      if (frameId) retargetFrame(frameId);
    }
  }, [registry, getViewport, path, retargetFrame]);

  // ── Keyboard ──────────────────────────────────────────────────────────────
  useKeyboard(
    keyboard
      ? [
          { key: "ArrowRight", action: next },
          { key: "ArrowLeft",  action: prev },
          { key: " ",          action: next },
          { key: "o",          action: toggleOverview },
          { key: "Escape",     action: () => { if (isOverviewRef.current) toggleOverview(); } },
          { key: "f",          action: toggleFullscreen },
        ]
      : [],
  );

  // ── Touch/mouse drag only — wheel & pinch handled by manual listener above ─
  useGesture(
    {
      onDrag: ({ delta: [dx, dy], event }) => {
        if (!draggable) return;
        event.preventDefault();
        dragOff.current.x -= dx / springs.current.zoom.pos;
        dragOff.current.y -= dy / springs.current.zoom.pos;
        applyTransform();
      },
    },
    {
      drag:   { filterTaps: true, threshold: 5 },
      target: containerRef,
    },
  );

  // ── Context value ─────────────────────────────────────────────────────────
  const activeFrameId = path[pathIndex] ?? null;
  const ctxValue = useMemo<PreziCanvasContextValue>(
    () => ({
      activeFrameId, isOverview, isFullscreen,
      pathIndex, pathLength: path.length,
      next, prev, goToFrame, toggleOverview, toggleFullscreen,
    }),
    [activeFrameId, isOverview, isFullscreen, pathIndex, path.length,
     next, prev, goToFrame, toggleOverview, toggleFullscreen],
  );

  return (
    <FrameRegistryContext.Provider value={registry}>
      <PreziCanvasContext.Provider value={ctxValue}>
        <div
          ref={containerRef}
          className={cn(
            "present-canvas",
            isOverview   && "present-canvas--overview",
            isFullscreen && "present-canvas--fullscreen",
            className,
          )}
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            overflow: "hidden",
            touchAction: "none",
            cursor: draggable ? "grab" : "default",
            background: background ?? "var(--present-canvas-bg, #08080f)",
            ...style,
          }}
        >
          {/* Infinite-canvas dot grid — fixed to viewport, never transforms */}
          <div className="present-canvas-grid" aria-hidden />

          {/* Ambient viewport orbs — slow drift, purely decorative */}
          <div className="present-canvas-ambience" aria-hidden />

          {/* The canvas — all frames live here, only THIS element transforms */}
          <div
            ref={canvasRef}
            className="present-canvas-inner"
            style={{
              position:        "absolute",
              top:             0,
              left:            0,
              transformOrigin: "0 0",
              willChange:      "transform",
            }}
          >
            {children}
          </div>

          {showNav && (
            <CanvasNavBar
              pathIndex={pathIndex}
              pathLength={path.length}
              isOverview={isOverview}
              isFullscreen={isFullscreen}
              onPrev={prev}
              onNext={next}
              onOverview={toggleOverview}
              onFullscreen={toggleFullscreen}
            />
          )}
        </div>
      </PreziCanvasContext.Provider>
    </FrameRegistryContext.Provider>
  );
}

// ─── Navigation bar ───────────────────────────────────────────────────────────
interface CanvasNavBarProps {
  pathIndex:    number;
  pathLength:   number;
  isOverview:   boolean;
  isFullscreen: boolean;
  onPrev():     void;
  onNext():     void;
  onOverview(): void;
  onFullscreen(): void;
}

function CanvasNavBar({
  pathIndex, pathLength, isOverview, isFullscreen,
  onPrev, onNext, onOverview, onFullscreen,
}: CanvasNavBarProps) {
  return (
    <nav className="present-canvas-nav" aria-label="Presentation navigation">
      {/* Prev */}
      <button
        className="present-canvas-nav-btn"
        onClick={onPrev}
        disabled={pathIndex === 0 && !isOverview}
        aria-label="Previous frame"
        title="Previous (←)"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Progress dots */}
      <div className="present-canvas-nav-dots" aria-hidden>
        {Array.from({ length: pathLength }, (_, i) => (
          <span
            key={i}
            className={cn(
              "present-canvas-nav-dot",
              i === pathIndex && !isOverview && "present-canvas-nav-dot--active",
            )}
          />
        ))}
      </div>

      {/* Counter */}
      <span className="present-canvas-nav-counter" aria-live="polite" aria-atomic>
        {isOverview ? "Overview" : `${pathIndex + 1} / ${pathLength}`}
      </span>

      {/* Next */}
      <button
        className="present-canvas-nav-btn"
        onClick={onNext}
        disabled={pathIndex === pathLength - 1 && !isOverview}
        aria-label="Next frame"
        title="Next (→)"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      <div className="present-canvas-nav-divider" aria-hidden />

      {/* Overview */}
      <button
        className={cn("present-canvas-nav-btn", isOverview && "present-canvas-nav-btn--active")}
        onClick={onOverview}
        aria-label={isOverview ? "Exit overview" : "Overview"}
        title="Overview (O)"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3"   width="7" height="7" rx="1.5" />
          <rect x="14" y="3"  width="7" height="7" rx="1.5" />
          <rect x="3" y="14"  width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      </button>

      {/* Fullscreen — video-player style expand/compress icon */}
      <button
        className={cn("present-canvas-nav-btn", isFullscreen && "present-canvas-nav-btn--active")}
        onClick={onFullscreen}
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        title="Fullscreen (F)"
      >
        {isFullscreen ? (
          /* Compress icon */
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 14 10 14 10 20" />
            <polyline points="20 10 14 10 14 4" />
            <line x1="10" y1="14" x2="3" y2="21" />
            <line x1="21" y1="3" x2="14" y2="10" />
          </svg>
        ) : (
          /* Expand icon */
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3"  y1="21" x2="10" y2="14" />
          </svg>
        )}
      </button>
    </nav>
  );
}
