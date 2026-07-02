import { useState, useCallback, useEffect, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface SlideEngineProps {
  children: ReactNode[];
}

export default function SlideEngine({ children }: SlideEngineProps) {
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);
  const total = children.length;

  const go = useCallback(
    (next: number) => {
      if (next < 0 || next >= total) return;
      setDir(next > current ? 1 : -1);
      setCurrent(next);
    },
    [current, total],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") go(current + 1);
      if (e.key === "ArrowLeft") go(current - 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [current, go]);

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    /* Fixed frame — no fullscreen API, no scroll lock */
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "var(--bg)",
        overflow: "hidden",
      }}
    >
      <AnimatePresence custom={dir} mode="wait">
        <motion.div
          key={current}
          custom={dir}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: [0.32, 0, 0.67, 0] }}
          style={{ position: "absolute", inset: 0 }}
        >
          {children[current]}
        </motion.div>
      </AnimatePresence>

      {/* ← arrow */}
      {current > 0 && (
        <button
          onClick={() => go(current - 1)}
          style={{
            position: "fixed", left: 16, top: "50%", transform: "translateY(-50%)",
            zIndex: 9999, width: 36, height: 36, borderRadius: "50%",
            background: "rgba(7,7,15,0.85)", border: "1px solid rgba(249,115,22,0.2)",
            color: "rgba(249,115,22,0.7)", cursor: "pointer", fontSize: 18,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          ‹
        </button>
      )}

      {/* → arrow */}
      {current < total - 1 && (
        <button
          onClick={() => go(current + 1)}
          style={{
            position: "fixed", right: 16, top: "50%", transform: "translateY(-50%)",
            zIndex: 9999, width: 36, height: 36, borderRadius: "50%",
            background: "rgba(7,7,15,0.85)", border: "1px solid rgba(249,115,22,0.2)",
            color: "rgba(249,115,22,0.7)", cursor: "pointer", fontSize: 18,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          ›
        </button>
      )}

      {/* Dot nav */}
      <div
        style={{
          position: "fixed", bottom: 18, left: "50%", transform: "translateX(-50%)",
          zIndex: 9999, display: "flex", gap: 6, alignItems: "center",
        }}
      >
        {children.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            style={{
              width: i === current ? 20 : 6, height: 6,
              borderRadius: 99, border: "none", cursor: "pointer",
              background: i === current
                ? "linear-gradient(90deg, #f97316, #fbbf24)"
                : "rgba(255,255,255,0.15)",
              transition: "all 0.25s",
              boxShadow: i === current ? "0 0 8px rgba(249,115,22,0.4)" : "none",
            }}
          />
        ))}
      </div>

      {/* Counter */}
      <div
        style={{
          position: "fixed", bottom: 14, right: 18,
          zIndex: 9999, fontSize: 11, fontFamily: "JetBrains Mono, monospace",
          color: "rgba(100,116,139,0.7)", letterSpacing: "0.05em",
        }}
      >
        {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>

      {/* Progress bar */}
      <div
        style={{
          position: "fixed", bottom: 0, left: 0, height: 2,
          width: `${((current + 1) / total) * 100}%`,
          zIndex: 9999, transition: "width 0.3s ease",
          background: "linear-gradient(90deg, #f97316, #fbbf24)",
          boxShadow: "0 0 8px rgba(249,115,22,0.35)",
        }}
      />
    </div>
  );
}
