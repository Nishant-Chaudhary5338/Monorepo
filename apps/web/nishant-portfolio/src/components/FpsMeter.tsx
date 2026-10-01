import { useEffect, useRef, type ReactElement } from "react";

const IDLE_AFTER_MS = 1500;
const SAMPLE_MS = 250;

const hasRunningAnimation = (): boolean =>
  document.getAnimations().some((a) => a.playState === "running");

// A live FPS readout, pinned to the left edge — a small, honest flex given
// this whole build was about keeping scroll smooth. Cheap by construction:
// the rAF loop just increments a counter and reads performance.now(), and
// the DOM is only touched ~4x/sec (direct writes, no React state). When
// nothing has moved for a moment and no animation is running, the loop
// stops entirely and the last value is shown dimmed as "idle"; scroll,
// pointer or key activity wakes it again.
export function FpsMeter(): ReactElement {
  const rootRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);
  const unitRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frames = 0;
    let lastSample = performance.now();
    let lastActive = lastSample;
    let rafId = 0;
    let running = false;

    const setIdle = (idle: boolean): void => {
      rootRef.current?.classList.toggle("fps-meter--idle", idle);
      if (unitRef.current) unitRef.current.textContent = idle ? "idle" : "fps";
    };

    const tick = (now: number): void => {
      frames++;
      const elapsed = now - lastSample;
      if (elapsed >= SAMPLE_MS) {
        const fps = Math.round((frames * 1000) / elapsed);
        frames = 0;
        lastSample = now;
        if (valueRef.current) valueRef.current.textContent = String(fps);
        if (barRef.current) {
          const ratio = Math.max(0, Math.min(1, fps / 60));
          barRef.current.style.transform = `scaleY(${ratio})`;
          barRef.current.style.background = fps >= 55 ? "var(--accent-lime, #6b9a1e)" : fps >= 40 ? "var(--accent-gold)" : "var(--accent-rose)";
        }
        if (now - lastActive > IDLE_AFTER_MS && !hasRunningAnimation()) {
          running = false;
          setIdle(true);
          return;
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    const wake = (): void => {
      lastActive = performance.now();
      if (running) return;
      running = true;
      frames = 0;
      lastSample = lastActive;
      setIdle(false);
      rafId = requestAnimationFrame(tick);
    };

    const events = ["scroll", "pointermove", "keydown"] as const;
    events.forEach((name) => window.addEventListener(name, wake, { passive: true }));
    wake();

    return () => {
      events.forEach((name) => window.removeEventListener(name, wake));
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={rootRef} className="fps-meter" aria-hidden="true">
      <div className="fps-meter__track">
        <div ref={barRef} className="fps-meter__bar" />
      </div>
      <span className="fps-meter__label">
        <span ref={valueRef}>60</span> <span ref={unitRef}>fps</span>
      </span>
    </div>
  );
}
