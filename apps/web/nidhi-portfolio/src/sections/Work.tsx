import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { enterpriseProjects as projects } from "../constants";


// ── Image / placeholder ──────────────────────────────────────
const ImageSlot = ({
  src, alt, gradient, accentColor, projectId,
}: {
  src?: string; alt: string; gradient: string; accentColor: string; projectId: string;
}) => {
  const hasImage = src && !src.startsWith("/images/");
  if (hasImage) {
    return <img src={src} alt={alt} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  }
  return (
    <div style={{ background: gradient, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }} aria-label={alt}>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: accentColor, opacity: 0.6, padding: "1rem", textAlign: "center" }}>
        {projectId}
      </span>
    </div>
  );
};

// ── Single alternating row ────────────────────────────────────
const ProjectRow = ({ project, reverse = false, rowIdx }: {
  project: (typeof projects)[0];
  reverse?: boolean;
  rowIdx: number;
}) => {
  const arrowRef = useRef<HTMLSpanElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const firstOutcome = project.caseStudy?.outcomes?.[0];
  const hasLive = !!project.caseStudy?.links?.live;

  const handleArrowEnter = () => {
    if (arrowRef.current) gsap.to(arrowRef.current, { rotate: 45, x: 3, duration: 0.2, ease: "power2.out" });
  };
  const handleArrowLeave = () => {
    if (arrowRef.current) gsap.to(arrowRef.current, { rotate: 0, x: 0, duration: 0.2, ease: "power2.out" });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Row fades up on scroll
      gsap.fromTo(rowRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: rowRef.current, start: "top 78%" }
        }
      );
      // Image wipe in
      gsap.fromTo(`.work-row-wipe-${rowIdx}`,
        { clipPath: "inset(0 100% 0 0)" },
        { clipPath: "inset(0 0% 0 0)", duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: rowRef.current, start: "top 78%" }
        }
      );
    });
    return () => ctx.revert();
  }, [rowIdx]);

  const imagePanel = (
    <div className="work-row-visual">
      <div className={`work-row-wipe-${rowIdx}`} style={{ width: "100%", height: "100%" }}>
        <ImageSlot
          src={project.caseStudy?.images?.[0]?.src}
          alt={project.title}
          gradient={project.gradient}
          accentColor={project.accentColor}
          projectId={project.id}
        />
      </div>
      {/* Hover overlay */}
      <div className="work-row-overlay">
        <Link
          to={project.caseStudy ? `/work/${project.id}` : "#"}
          className="btn-primary"
          style={{ fontSize: "0.85rem", padding: "0.6rem 1.4rem" }}
          onClick={project.caseStudy ? undefined : (e) => e.preventDefault()}
        >
          <span>View Case Study</span>
        </Link>
        {hasLive && (
          <a
            href={project.caseStudy?.links?.live}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              marginTop: "0.5rem",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.68rem",
              letterSpacing: "0.08em",
              color: "var(--text-inverse)",
              opacity: 0.75,
              textDecoration: "none",
              borderBottom: "1px solid rgba(255,255,255,0.3)",
              paddingBottom: "1px",
            }}
          >
            Visit Live Site ↗
          </a>
        )}
      </div>
    </div>
  );

  const infoPanel = (
    <div className="work-row-info" onMouseEnter={handleArrowEnter} onMouseLeave={handleArrowLeave}>
      {/* Category + year + arrow */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem", marginBottom: "0.5rem" }}>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", color: project.accentColor }}>
          {project.category}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
          {project.year && (
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "var(--text-muted)", letterSpacing: "0.06em" }}>
              {project.year}
            </span>
          )}
          <span ref={arrowRef} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", color: "var(--text-muted)", display: "inline-block" }} aria-hidden="true">↗</span>
        </div>
      </div>

      {/* Title */}
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)", fontWeight: 900, fontStyle: "italic", color: "var(--text-primary)", marginBottom: "0.75rem", lineHeight: 1.15 }}>
        {project.title}
      </h3>

      {/* Description */}
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "0.9rem",
        lineHeight: 1.7,
        color: "var(--text-secondary)",
        marginBottom: "1.25rem",
      }}>
        {project.description}
      </p>

      {/* Outcome metrics — show up to 2 */}
      {firstOutcome && (
        <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "1.25rem" }}>
          {project.caseStudy?.outcomes?.slice(0, 2).map((o) => (
            <div key={o.label}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 900, fontSize: "1.4rem", color: "var(--accent-gold)", lineHeight: 1 }}>
                {o.metric}
              </p>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.06em", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                {o.label}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Tags + badge */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.375rem", marginTop: "0.25rem" }}>
        {project.badge && <span className="pill pill-live">{project.badge}</span>}
        {project.tags.slice(0, 4).map((tag) => (
          <span key={tag} className="pill">{tag}</span>
        ))}
      </div>

      {/* Company */}
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "1rem", letterSpacing: "0.06em" }}>
        @ {project.company}
      </p>
    </div>
  );

  return (
    <div ref={rowRef} className="work-row" style={{ borderTop: "1px solid var(--border-subtle)" }}>
      {reverse ? (
        <>
          {infoPanel}
          {imagePanel}
        </>
      ) : (
        <>
          {imagePanel}
          {infoPanel}
        </>
      )}
    </div>
  );
};

// ── Section ──────────────────────────────────────────────────
const Work = () => {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section id="work" ref={sectionRef} style={{ padding: "var(--space-xl) 0", background: "var(--bg-base)" }}>
      <div className="section-wrap">

        {/* v3 header */}
        <div style={{ marginBottom: "var(--space-lg)" }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "var(--space-sm)" }}>
            <span style={{ color: "var(--accent-gold)" }}>03</span> — SELECTED WORK
          </p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 900, fontSize: "clamp(2.8rem, 5vw, 4.8rem)", color: "var(--text-primary)", lineHeight: 1.1, marginBottom: "var(--space-md)" }}>
            Projects that shipped
          </h2>
          <hr style={{ border: "none", borderTop: "1px solid var(--border-subtle)" }} />
        </div>

        {/* Alternating rows */}
        <div className="work-rows">
          {projects.map((proj, idx) => (
            <ProjectRow
              key={proj.id}
              project={proj}
              reverse={idx % 2 !== 0}
              rowIdx={idx}
            />
          ))}
          {/* Closing rule */}
          <div style={{ borderTop: "1px solid var(--border-subtle)" }} />
        </div>

      </div>
    </section>
  );
};

export default Work;
