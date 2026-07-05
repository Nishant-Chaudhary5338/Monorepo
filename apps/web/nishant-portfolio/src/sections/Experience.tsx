import { useEffect, useRef } from "react";
import gsap from "gsap";
import { expCards } from "../constants";
import type { ExpCard } from "../constants/experience";
import AnimatedCounter from "../components/AnimatedCounter";
import { AnimatedTitle } from "../components/AnimatedTitle";

const ACCENTS = ["--accent-purple", "--accent-gold", "--accent-cyan", "--accent-rose", "--accent-lime"] as const;
const PILL_CLASS = ["pill-purple", "pill-gold", "pill-cyan", "pill-rose", "pill-lime"] as const;

const ExpEntry = ({ card, idx }: { card: ExpCard; idx: number }) => {
  const entryRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const accent = ACCENTS[idx % ACCENTS.length];
  const pillClass = PILL_CLASS[idx % PILL_CLASS.length];
  const isCurrent = idx === 0;

  useEffect(() => {
    const el = entryRef.current;
    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 82%" }
        }
      );
      gsap.fromTo(".exp-bullet-" + idx,
        { x: -10, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.06, duration: 0.4, ease: "power2.out",
          delay: 0.3,
          scrollTrigger: { trigger: el, start: "top 82%" }
        }
      );
    });

    // Very subtle 3D tilt — a wide, text-heavy card only wants a hint of
    // depth, not a full showcase tilt (that reads as dizzying over text).
    let cleanupTilt = () => {};
    if (el && !window.matchMedia("(prefers-reduced-motion: reduce)").matches && !window.matchMedia("(pointer: coarse)").matches) {
      gsap.set(el, { transformPerspective: 1200 });
      const rx = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power2.out" });
      const ry = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power2.out" });
      let rect = el.getBoundingClientRect();
      const onEnter = (): void => { rect = el.getBoundingClientRect(); };
      const onTiltMove = (e: PointerEvent): void => {
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        rx(-py * 1.6);
        ry(px * 1.6);
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
    <div className="product-card-float" style={{ animationDelay: `${idx * 0.8}s` }}>
    <div
      ref={entryRef}
      className="product-card glow-card"
      onMouseMove={onMove}
      style={{ "--card-accent": `var(${accent})`, padding: "1.75rem clamp(1.25rem, 3vw, 2.25rem)" } as React.CSSProperties}
    >
      <div ref={spotRef} className="glow-card__spot" style={{ "--glow-color": `var(${accent})` } as React.CSSProperties} aria-hidden="true" />
      <span className="exp-num">{String(idx + 1).padStart(2, "0")}</span>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.2rem", flexWrap: "wrap", gap: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "1.05rem", color: "var(--text-primary)" }}>
            {card.company}
          </span>
          {isCurrent && <span className="pill pill-live">Current</span>}
        </div>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: "var(--text-muted)", letterSpacing: "0.06em" }}>
          {card.date}
        </span>
      </div>

      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
        {card.title} · {card.location}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(card.metrics.length, 4)}, 1fr)`, gap: "1rem", marginBottom: "1.25rem" }}>
        {card.metrics.map((m) => (
          <div key={m.label}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 900, fontSize: "1.4rem", color: `var(${accent})`, lineHeight: 1 }}>
              <AnimatedCounter to={m.value} prefix={m.prefix} suffix={m.suffix} />
            </p>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
              {m.label}
            </p>
          </div>
        ))}
      </div>

      <ul style={{ listStyle: "none", margin: "0 0 1rem 0", padding: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {card.highlights.map((h, i) => (
          <li key={i} className={`exp-bullet-${idx}`} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
            <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: `var(${accent})`, flexShrink: 0, marginTop: "0.55rem" }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>
              {h}
            </span>
          </li>
        ))}
      </ul>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
        {card.techStack.map((tag) => (
          <span key={tag} className={`pill ${pillClass}`}>{tag}</span>
        ))}
      </div>
    </div>
    </div>
  );
};

const Experience = () => {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section id="experience" ref={sectionRef} className="section section-alt">
      <div className="section-wrap">
        <div className="section-glow" style={{ "--section-glow-color": "var(--accent-rose)", "--section-glow-color-2": "var(--accent-lime)" } as React.CSSProperties}>
          <p className="section-label">
            <span className="section-label-num">03</span> — EXPERIENCE
          </p>
          <AnimatedTitle title="Where I've worked" style={{ marginTop: "var(--space-sm)", marginBottom: "var(--space-lg)" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
          {expCards.map((card, idx) => (
            <ExpEntry key={card.company} card={card} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
