import { useRef, type CSSProperties, type ReactNode } from "react";

// Shared "floating glow card" shell used across every section — rounded,
// elevated, gently bobbing (CSS animation on the outer wrapper), with a
// cursor-tracking glow spotlight (paint-only, no blur) on the inner card.
// Kept as one component so every section gets the identical treatment.
export function FloatCard({ children, glow = "--accent-purple", delay = 0, style, className = "" }: {
  children: ReactNode;
  glow?: string;
  delay?: number;
  style?: CSSProperties;
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
    <div className="product-card-float" style={{ animationDelay: `${delay}s` }}>
      <div
        className={`product-card glow-card ${className}`}
        onMouseMove={onMove}
        style={{ "--card-accent": `var(${glow})`, ...style } as CSSProperties}
      >
        <div ref={spotRef} className="glow-card__spot" style={{ "--glow-color": `var(${glow})` } as CSSProperties} aria-hidden="true" />
        {children}
      </div>
    </div>
  );
}
