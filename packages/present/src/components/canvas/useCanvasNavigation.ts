import { useCallback, useEffect, useRef, useState } from "react";
import { clamp } from "../../core/math";
import { springSolver } from "../../core/math";
import { frameScheduler } from "../../core/scheduler";
import type { CanvasStep } from "../../types";

export interface CanvasSpringConfig {
  stiffness?: number;
  damping?: number;
  mass?: number;
}

export interface UseCanvasNavigationOptions {
  steps: CanvasStep[];
  containerRef: React.RefObject<HTMLDivElement | null>;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  spring?: CanvasSpringConfig;
  onStepChange?: (index: number) => void;
}

interface Dim1D {
  pos: number;
  vel: number;
}

const CANVAS_SPRING = { stiffness: 180, damping: 30, mass: 1 };

export function useCanvasNavigation({
  steps,
  containerRef,
  canvasRef,
  spring: springCfg,
  onStepChange,
}: UseCanvasNavigationOptions) {
  const [currentStep, setCurrentStep] = useState(0);
  const currentStepRef = useRef(0);

  const cfg = {
    stiffness: springCfg?.stiffness ?? CANVAS_SPRING.stiffness,
    damping: springCfg?.damping ?? CANVAS_SPRING.damping,
    mass: springCfg?.mass ?? CANVAS_SPRING.mass,
  };

  // Spring state lives in refs — no React re-render per frame
  const springs = useRef<Record<"x" | "y" | "zoom" | "rotation", Dim1D>>({
    x: { pos: steps[0]?.x ?? 0, vel: 0 },
    y: { pos: steps[0]?.y ?? 0, vel: 0 },
    zoom: { pos: steps[0]?.zoom ?? 1, vel: 0 },
    rotation: { pos: steps[0]?.rotation ?? 0, vel: 0 },
  });

  const targets = useRef<{ x: number; y: number; zoom: number; rotation: number }>({
    x: steps[0]?.x ?? 0,
    y: steps[0]?.y ?? 0,
    zoom: steps[0]?.zoom ?? 1,
    rotation: steps[0]?.rotation ?? 0,
  });

  // Manual offset from user drag (in canvas-space coordinates)
  const dragOffset = useRef({ x: 0, y: 0 });

  const applyTransform = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const vw = container.offsetWidth;
    const vh = container.offsetHeight;
    const { x, y, zoom, rotation } = springs.current;

    const tx = vw / 2 - (x.pos + dragOffset.current.x) * zoom.pos;
    const ty = vh / 2 - (y.pos + dragOffset.current.y) * zoom.pos;

    canvas.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${zoom.pos}) rotate(${rotation.pos}deg)`;
  }, [canvasRef, containerRef]);

  // RAF spring loop — runs every frame, applies transform directly to DOM
  useEffect(() => {
    const taskId = frameScheduler.schedule("critical", (deltaMs) => {
      const dt = Math.min(deltaMs / 1000, 0.033);
      let anyMoving = false;

      for (const key of ["x", "y", "zoom", "rotation"] as const) {
        const s = springs.current[key];
        const t = targets.current[key];
        const result = springSolver({
          current: s.pos,
          target: t,
          velocity: s.vel,
          stiffness: cfg.stiffness,
          damping: cfg.damping,
          mass: cfg.mass,
          deltaSeconds: dt,
        });
        springs.current[key] = { pos: result.position, vel: result.velocity };
        if (!result.isSettled) anyMoving = true;
      }

      if (anyMoving) applyTransform();
    });

    // Initial position snap (no animation on mount)
    applyTransform();

    return () => frameScheduler.cancel(taskId);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const goToStep = useCallback(
    (index: number) => {
      const clamped = clamp(index, 0, steps.length - 1);
      const step = steps[clamped];
      if (!step) return;

      targets.current = {
        x: step.x,
        y: step.y,
        zoom: step.zoom,
        rotation: step.rotation ?? 0,
      };
      dragOffset.current = { x: 0, y: 0 };
      currentStepRef.current = clamped;
      setCurrentStep(clamped);
      onStepChange?.(clamped);
    },
    [steps, onStepChange],
  );

  const next = useCallback(() => goToStep(currentStepRef.current + 1), [goToStep]);
  const prev = useCallback(() => goToStep(currentStepRef.current - 1), [goToStep]);

  // Manual pan — called by gesture handler with viewport-space delta
  const panBy = useCallback(
    (dvx: number, dvy: number) => {
      const zoom = springs.current.zoom.pos;
      dragOffset.current.x -= dvx / zoom;
      dragOffset.current.y -= dvy / zoom;
      applyTransform();
    },
    [applyTransform],
  );

  // Manual zoom — pinch or wheel
  const zoomTo = useCallback((newZoom: number) => {
    targets.current.zoom = clamp(newZoom, 0.1, 10);
  }, []);

  const zoomBy = useCallback(
    (factor: number) => {
      zoomTo(springs.current.zoom.pos * factor);
    },
    [zoomTo],
  );

  // Jump to overview — compute bounding box of all steps, zoom out to fit
  const overview = useCallback(
    (viewportWidth: number, viewportHeight: number) => {
      if (steps.length === 0) return;

      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (const s of steps) {
        minX = Math.min(minX, s.x);
        minY = Math.min(minY, s.y);
        maxX = Math.max(maxX, s.x);
        maxY = Math.max(maxY, s.y);
      }

      const padding = 200;
      const rangeX = maxX - minX + padding * 2;
      const rangeY = maxY - minY + padding * 2;
      const fitZoom = Math.min(viewportWidth / rangeX, viewportHeight / rangeY, 1);

      targets.current = {
        x: (minX + maxX) / 2,
        y: (minY + maxY) / 2,
        zoom: fitZoom,
        rotation: 0,
      };
      dragOffset.current = { x: 0, y: 0 };
    },
    [steps],
  );

  const snapCurrentStep = useCallback(() => {
    const step = steps[currentStepRef.current];
    if (!step) return;
    // Hard-snap springs (no animation)
    springs.current = {
      x: { pos: step.x, vel: 0 },
      y: { pos: step.y, vel: 0 },
      zoom: { pos: step.zoom, vel: 0 },
      rotation: { pos: step.rotation ?? 0, vel: 0 },
    };
    targets.current = { x: step.x, y: step.y, zoom: step.zoom, rotation: step.rotation ?? 0 };
    dragOffset.current = { x: 0, y: 0 };
    applyTransform();
  }, [steps, applyTransform]);

  return {
    currentStep,
    goToStep,
    next,
    prev,
    panBy,
    zoomTo,
    zoomBy,
    overview,
    snapCurrentStep,
    isFirst: currentStep === 0,
    isLast: currentStep === steps.length - 1,
  };
}
