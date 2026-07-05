import { useEffect, useRef } from "react";

// A live FPS readout, pinned to the left edge — a small, honest flex given
// this whole build was about keeping scroll smooth. Cheap by construction:
// the rAF loop just increments a counter and reads performance.now(), and
// the DOM is only touched ~4x/sec (direct textContent write, no React
// state/re-render) rather than on every one of the 60 frames it's measuring.
export function FpsMeter() {
  const valueRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frames = 0;
    let lastSample = performance.now();
    let rafId = 0;

    const tick = (now: number): void => {
      frames++;
      const elapsed = now - lastSample;
      if (elapsed >= 250) {
        const fps = Math.round((frames * 1000) / elapsed);
        frames = 0;
        lastSample = now;
        if (valueRef.current) valueRef.current.textContent = String(fps);
        if (barRef.current) {
          const pct = Math.max(0, Math.min(100, (fps / 60) * 100));
          barRef.current.style.height = `${pct}%`;
          barRef.current.style.background = fps >= 55 ? "var(--accent-lime, #6b9a1e)" : fps >= 40 ? "var(--accent-gold)" : "var(--accent-rose)";
        }
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div className="fps-meter" aria-hidden="true">
      <div className="fps-meter__track">
        <div ref={barRef} className="fps-meter__bar" />
      </div>
      <span className="fps-meter__label">
        <span ref={valueRef}>60</span> fps
      </span>
    </div>
  );
}
