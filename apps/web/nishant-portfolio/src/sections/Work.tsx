import { useEffect, useRef } from "react";
import gsap from "gsap";
import { products } from "../constants";
import type { Product } from "../constants/projects";
import { AnimatedTitle } from "../components/AnimatedTitle";

const ACCENTS = ["--accent-gold", "--accent-purple", "--accent-cyan", "--accent-rose", "--accent-lime"] as const;
const PILL_CLASS = ["pill-gold", "pill-purple", "pill-cyan", "pill-rose", "pill-lime"] as const;

const ProductCard = ({ project, idx }: { project: Product; idx: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const accent = ACCENTS[idx % ACCENTS.length];
  const pillClass = PILL_CLASS[idx % PILL_CLASS.length];

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 80%" }
        }
      );
    });

    // Floating drift is CSS-driven (see .product-card @keyframes); here we
    // only add the pointer-tracked 3D tilt — transform-only, rect cached
    // on enter, no-ops under reduced motion / touch.
    let cleanupTilt = () => {};
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && !window.matchMedia("(pointer: coarse)").matches) {
      gsap.set(el, { transformPerspective: 1000 });
      const rx = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power2.out" });
      const ry = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power2.out" });
      let rect = el.getBoundingClientRect();
      const onEnter = (): void => { rect = el.getBoundingClientRect(); };
      const onTiltMove = (e: PointerEvent): void => {
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        rx(-py * 4);
        ry(px * 4);
      };
      const onLeave = (): void => { rx(0); ry(0); };
      el.addEventListener("pointerenter", onEnter);
      el.addEventListener("pointermove", onTiltMove);
      el.addEventListener("pointerleave", onLeave);
      cleanupTilt = () => {
        el.removeEventListener("pointerenter", onEnter);
        el.removeEventListener("pointermove", onTiltMove);
        el.removeEventListener("pointerleave", onLeave);
      };
    }

    return () => { ctx.revert(); cleanupTilt(); };
  }, [idx]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>): void => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (!spotRef.current) return;
    spotRef.current.style.setProperty("--gx", `${e.clientX - rect.left}px`);
    spotRef.current.style.setProperty("--gy", `${e.clientY - rect.top}px`);
  };

  return (
    <div className="product-card-float" style={{ animationDelay: `${idx * 0.7}s` }}>
    <div
      ref={cardRef}
      className="product-card glow-card"
      onMouseMove={onMove}
      style={{ "--card-accent": `var(${accent})` } as React.CSSProperties}
    >
      <div ref={spotRef} className="glow-card__spot" style={{ "--glow-color": `var(${accent})` } as React.CSSProperties} aria-hidden="true" />

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: `var(${accent})` }}>
          {String(idx + 1).padStart(2, "0")} — {project.role}
        </p>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", color: "var(--text-muted)" }}>
          {project.adoption ?? "adoption — TBD"}
        </span>
      </div>

      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, fontStyle: "italic", color: "var(--text-primary)", marginBottom: "1rem", lineHeight: 1.1 }}>
        {project.name}
      </h3>

      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(1rem, 1.6vw, 1.2rem)", lineHeight: 1.6, color: "var(--text-secondary)", maxWidth: "56ch", marginBottom: "2rem" }}>
        {project.outcome}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem", marginBottom: "2rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border-subtle)" }}>
        <div>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.66rem", letterSpacing: "0.1em", textTransform: "uppercase", color: `var(${accent})`, marginBottom: "0.4rem" }}>For</p>
          <p style={{ fontSize: "0.88rem", lineHeight: 1.6, color: "var(--text-secondary)" }}>{project.users}</p>
        </div>
        <div>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.66rem", letterSpacing: "0.1em", textTransform: "uppercase", color: `var(${accent})`, marginBottom: "0.4rem" }}>Problem</p>
          <p style={{ fontSize: "0.88rem", lineHeight: 1.6, color: "var(--text-secondary)" }}>{project.problem}</p>
        </div>
        <div>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.66rem", letterSpacing: "0.1em", textTransform: "uppercase", color: `var(${accent})`, marginBottom: "0.4rem" }}>Shipped</p>
          <p style={{ fontSize: "0.88rem", lineHeight: 1.6, color: "var(--text-secondary)" }}>{project.shipped}</p>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
          {project.tags.map((tag) => (
            <span key={tag} className={`pill ${pillClass}`}>{tag}</span>
          ))}
        </div>
        <div style={{ display: "flex", gap: "1.25rem" }}>
          {project.proof.live && (
            <a href={project.proof.live} target="_blank" rel="noreferrer" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.05em", textTransform: "uppercase", color: `var(${accent})`, textDecoration: "none", borderBottom: `1px solid var(${accent})`, paddingBottom: "1px" }}>
              Live ↗
            </a>
          )}
          {project.proof.npm && (
            <a href={project.proof.npm} target="_blank" rel="noreferrer" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-secondary)", textDecoration: "none", borderBottom: "1px solid var(--border-strong-nd)", paddingBottom: "1px" }}>
              npm ↗
            </a>
          )}
          {project.proof.github && (
            <a href={project.proof.github} target="_blank" rel="noreferrer" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-secondary)", textDecoration: "none", borderBottom: "1px solid var(--border-strong-nd)", paddingBottom: "1px" }}>
              GitHub ↗
            </a>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

const Work = () => {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section id="work" ref={sectionRef} className="section">
      <div className="section-wrap">
        <div className="section-glow" style={{ marginBottom: "var(--space-lg)", "--section-glow-color": "var(--accent-purple)", "--section-glow-color-2": "var(--accent-cyan)" } as React.CSSProperties}>
          <p className="section-label">
            <span className="section-label-num">02</span> — SELECTED WORK
          </p>
          <AnimatedTitle title="Products that shipped" style={{ marginTop: "var(--space-sm)", marginBottom: "var(--space-md)" }} />
          <hr className="section-rule" style={{ margin: 0 }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          {products.map((project, idx) => (
            <ProductCard key={project.name} project={project} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Work;
