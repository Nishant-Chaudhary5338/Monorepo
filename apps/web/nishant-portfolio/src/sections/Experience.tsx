import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { expCards } from "../constants";
import type { ExpCard } from "../constants/experience";
import AnimatedCounter from "../components/AnimatedCounter";
import { AnimatedTitle } from "../components/AnimatedTitle";
import { useTilt3D } from "../hooks/useTilt3D";
import { prefersReducedMotion, proofDrift } from "../motion";
import "../styles/home-extras.css";

// Career reads in the proof accent; the current role's node is the one
// place availability lime appears in this section.
const ACCENT = "--accent-proof";

const ExpEntry = ({ card, idx }: { card: ExpCard; idx: number }) => {
  const entryRef = useTilt3D<HTMLDivElement>(0.8);
  const isCurrent = Boolean(card.current);

  const onMove = (e: React.MouseEvent<HTMLDivElement>): void => {
    const rect = e.currentTarget.getBoundingClientRect();
    const spot = e.currentTarget.querySelector<HTMLDivElement>(".glow-card__spot");
    if (!spot) return;
    spot.style.setProperty("--gx", `${e.clientX - rect.left}px`);
    spot.style.setProperty("--gy", `${e.clientY - rect.top}px`);
  };

  return (
    <li className="exp-timeline__item">
      <div className="product-card-float" style={{ animationDelay: `${idx * 0.8}s` }}>
        <span className={`exp-node${isCurrent ? " exp-node--current" : ""}`} aria-hidden="true" />
        <div
          ref={entryRef}
          className="product-card glow-card exp-card"
          onMouseMove={onMove}
          style={{ "--card-accent": `var(${ACCENT})`, padding: "1.75rem clamp(1.25rem, 3vw, 2.25rem)" } as React.CSSProperties}
        >
          <div className="glow-card__spot" style={{ "--glow-color": `var(${ACCENT})` } as React.CSSProperties} aria-hidden="true" />
          <span className="exp-num">{String(idx + 1).padStart(2, "0")}</span>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.2rem", flexWrap: "wrap", gap: "0.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", flexWrap: "wrap" }}>
              <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "var(--text-primary)" }}>
                {card.company}
              </h3>
              {isCurrent && <span className="pill pill-lime">Current</span>}
            </div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.74rem", color: "var(--text-muted)", letterSpacing: "0.06em" }}>
              {card.date}
            </span>
          </div>

          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
            {card.title} · {card.location}
          </p>

          <div className="exp-metrics" style={{ "--metric-count": Math.min(card.metrics.length, 4) } as React.CSSProperties}>
            {card.metrics.map((m) => (
              <div key={m.label}>
                <p className="exp-metric__value"><AnimatedCounter to={m.value} prefix={m.prefix} suffix={m.suffix} /></p>
                <p className="exp-metric__label">{m.label}</p>
              </div>
            ))}
          </div>

          <ul style={{ listStyle: "none", margin: "0 0 1rem 0", padding: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {card.highlights.map((h) => (
              <li key={h} className="exp-bullet" style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
                <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: `var(${ACCENT})`, flexShrink: 0, marginTop: "0.6rem" }} />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>
                  {h}
                </span>
              </li>
            ))}
          </ul>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
            {card.techStack.map((tag) => (
              <span key={tag} className="pill pill-purple">{tag}</span>
            ))}
          </div>

          {card.links && (
            <div className="exp-links">
              {card.links.map((l) => (
                <Link key={l.href} to={l.href} className="exp-link">{l.label} <span aria-hidden="true">→</span></Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </li>
  );
};

const Experience = () => {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const ctx = gsap.context(() => {
      // The spine draws itself as the timeline scrolls past (transform only)
      if (!prefersReducedMotion()) {
        gsap.fromTo(".exp-timeline__line", { scaleY: 0 }, {
          scaleY: 1, ease: "none",
          scrollTrigger: { trigger: list, start: "top 75%", end: "bottom 60%", scrub: 0.6 },
        });
      }
      gsap.utils.toArray<HTMLElement>(".exp-timeline__item").forEach((item) => {
        proofDrift(item.querySelector(".exp-card"), { trigger: item });
        proofDrift(item.querySelectorAll(".exp-bullet"), { trigger: item, stagger: 0.06, delay: 0.25 });
      });
    }, list);
    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" className="section section-alt">
      <div className="section-wrap">
        <div className="section-glow" style={{ "--section-glow-color": "var(--accent-proof)", "--section-glow-color-2": "var(--accent-live)" } as React.CSSProperties}>
          <p className="section-label">
            <span className="section-label-num">03</span> — EXPERIENCE
          </p>
          <AnimatedTitle title="Where I've worked" style={{ marginTop: "var(--space-sm)", marginBottom: "var(--space-lg)" }} />
        </div>

        <div ref={listRef} className="exp-timeline">
          <span className="exp-timeline__line" aria-hidden="true" />
          <ol className="exp-timeline__list">
            {expCards.map((card, idx) => (
              <ExpEntry key={card.company} card={card} idx={idx} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default Experience;
