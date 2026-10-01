import { useEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { products } from "../constants";
import type { Product } from "../constants/projects";
import { AnimatedTitle } from "../components/AnimatedTitle";
import AnimatedCounter from "../components/AnimatedCounter";
import { useTilt3D } from "../hooks/useTilt3D";
import { proofDrift } from "../motion";
import "../styles/home-extras.css";

// Every product here is developer tooling, so every card carries the
// tooling accent; the proof numbers carry the proof accent (see index.css).
const ACCENT = "--accent-tool";

const labelStyle: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.1em",
  textTransform: "uppercase", color: `var(${ACCENT}-ink)`, marginBottom: "0.4rem",
};
const bodyStyle: React.CSSProperties = { fontSize: "0.9rem", lineHeight: 1.6, color: "var(--text-secondary)" };

const RAIL_LINKS: Array<{ key: keyof Product["proof"]; label: string }> = [
  { key: "live", label: "Live demo" },
  { key: "npm", label: "npm" },
  { key: "github", label: "GitHub" },
];

const ProofRail = ({ project }: { project: Product }) => {
  const links = RAIL_LINKS.filter((l) => project.proof[l.key]);
  return (
    <aside className="proof-rail" aria-label={`${project.name} in numbers`}>
      <div>
        <p className="proof-rail__value"><AnimatedCounter to={project.downloads} /></p>
        <p className="proof-rail__label">npm downloads, past year</p>
      </div>
      <p className="proof-rail__fact">{project.fact}</p>
      <div className="proof-rail__links">
        {links.map((l, i) => (
          <a
            key={l.key}
            href={project.proof[l.key]}
            target="_blank"
            rel="noreferrer"
            className={`proof-rail__link${i === 0 ? " proof-rail__link--primary" : ""}`}
          >
            {l.label} <span aria-hidden="true">↗</span>
          </a>
        ))}
        {project.caseStudy && (
          <Link to={project.caseStudy} className="proof-rail__link">
            Case study <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>
    </aside>
  );
};

const ProductCard = ({ project, idx }: { project: Product; idx: number }) => {
  const cardRef = useTilt3D<HTMLDivElement>(2);

  const onMove = (e: React.MouseEvent<HTMLDivElement>): void => {
    const rect = e.currentTarget.getBoundingClientRect();
    const spot = e.currentTarget.querySelector<HTMLDivElement>(".glow-card__spot");
    if (!spot) return;
    spot.style.setProperty("--gx", `${e.clientX - rect.left}px`);
    spot.style.setProperty("--gy", `${e.clientY - rect.top}px`);
  };

  return (
    <div className="product-card-float" style={{ animationDelay: `${idx * 0.7}s` }}>
      <div
        ref={cardRef}
        className="product-card glow-card work-card"
        onMouseMove={onMove}
        style={{ "--card-accent": `var(${ACCENT})`, "--card-accent-ink": `var(${ACCENT}-ink)` } as React.CSSProperties}
      >
        <div className="glow-card__spot" style={{ "--glow-color": `var(${ACCENT})` } as React.CSSProperties} aria-hidden="true" />

        <div className="product-card__layout">
          <div>
            <p style={{ ...labelStyle, fontSize: "0.74rem", marginBottom: "1.25rem" }}>
              {String(idx + 1).padStart(2, "0")} — {project.role}
            </p>

            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, fontStyle: "italic", color: "var(--text-primary)", marginBottom: "1rem", lineHeight: 1.1, overflowWrap: "anywhere" }}>
              {project.name}
            </h3>

            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(1rem, 1.6vw, 1.2rem)", lineHeight: 1.6, color: "var(--text-secondary)", maxWidth: "56ch", marginBottom: "2rem" }}>
              {project.outcome}
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", marginBottom: "2rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border-subtle)" }}>
              <div><p style={labelStyle}>For</p><p style={bodyStyle}>{project.users}</p></div>
              <div><p style={labelStyle}>Problem</p><p style={bodyStyle}>{project.problem}</p></div>
              <div><p style={labelStyle}>Shipped</p><p style={bodyStyle}>{project.shipped}</p></div>
            </div>

            <div className="work-card__tags" style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
              {project.tags.map((tag) => (
                <span key={tag} className="pill pill-cyan">{tag}</span>
              ))}
            </div>
          </div>

          <ProofRail project={project} />
        </div>

      </div>
    </div>
  );
};

const Work = () => {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".work-card").forEach((card) => proofDrift(card, { trigger: card, start: "top 80%" }));
    });
    return () => ctx.revert();
  }, []);

  return (
    <section id="work" className="section">
      <div className="section-wrap">
        <div className="section-glow" style={{ marginBottom: "var(--space-lg)", "--section-glow-color": "var(--accent-tool)", "--section-glow-color-2": "var(--accent-proof)" } as React.CSSProperties}>
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
