import { useRef, type ReactNode, type CSSProperties } from "react";

// Cursor-following spotlight — a radial-gradient overlay whose center
// tracks the pointer via CSS custom properties written directly to the
// DOM node (no React state, no re-render per mousemove). Paint-only cost,
// scoped to a handful of cards; no blur/backdrop-filter involved.
export function GlowCard({ children, glow = "--accent-purple", className = "" }: {
  children: ReactNode;
  glow?: string;
  className?: string;
}) {
  const spotRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>): void => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (!spotRef.current) return;
    spotRef.current.style.setProperty("--gx", `${e.clientX - rect.left}px`);
    spotRef.current.style.setProperty("--gy", `${e.clientY - rect.top}px`);
  };

  return (
    <div className={`glow-card ${className}`} onMouseMove={onMove}>
      <div ref={spotRef} className="glow-card__spot" style={{ "--glow-color": `var(${glow})` } as CSSProperties} aria-hidden="true" />
      {children}
    </div>
  );
}
