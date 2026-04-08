import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { enterpriseProjects as projects } from "../constants";

gsap.registerPlugin(ScrollTrigger);

// ── Image / placeholder ──────────────────────────────────────
const ImageSlot = ({
  src, alt, gradient, accentColor, projectId,
}: {
  src?: string; alt: string; gradient: string; accentColor: string; projectId: string;
}) => {
  const hasImage = src && !src.startsWith("/images/");
  if (hasImage) {
    return <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  }
  return (
    <div style={{ background: gradient, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }} aria-label={alt}>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: accentColor, opacity: 0.6, padding: "1rem", textAlign: "center" }}>
        {projectId}
      </span>
    </div>
  );
};

// ── Project card ─────────────────────────────────────────────
const ProjectCard = ({ project, featured = false }: { project: (typeof projects)[0]; featured?: boolean }) => {
  const arrowRef = useRef<HTMLSpanElement>(null);
  const firstOutcome = project.caseStudy?.outcomes?.[0];
  const hasLive = !!project.caseStudy?.links?.live;

  const handleArrowEnter = () => {
    if (arrowRef.current) gsap.to(arrowRef.current, { rotate: 45, x: 3, duration: 0.2, ease: "power2.out" });
  };
  const handleArrowLeave = () => {
    if (arrowRef.current) gsap.to(arrowRef.current, { rotate: 0, x: 0, duration: 0.2, ease: "power2.out" });
  };

  return (
    <div
      className={`work-card ${featured ? "work-featured" : ""}`}
      onMouseEnter={handleArrowEnter}
      onMouseLeave={handleArrowLeave}
    >
      <div className={featured ? "work-card-inner" : ""}>

        {/* Visual with clip-path wipe wrapper */}
        <div className="work-card-visual">
          <div className="work-card-wipe" style={{ width: "100%", height: "100%" }}>
            <ImageSlot
              src={project.caseStudy?.images?.[0]?.src}
              alt={project.title}
              gradient={project.gradient}
              accentColor={project.accentColor}
              projectId={project.id}
            />
          </div>

          {/* Hover overlay */}
          <div className="work-card-overlay">
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

        {/* Info */}
        <div className="work-card-info">
          {/* Top row: category + year + arrow */}
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
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 900, fontStyle: "italic", color: "var(--text-primary)", marginBottom: "0.5rem", lineHeight: 1.2 }}>
            {project.title}
          </h3>

          {/* Description — always visible, 2-line clamp on non-featured */}
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.875rem",
            lineHeight: 1.65,
            color: "var(--text-secondary)",
            marginBottom: "0.75rem",
            display: "-webkit-box",
            WebkitLineClamp: featured ? undefined : 2,
            WebkitBoxOrient: featured ? undefined : "vertical" as const,
            overflow: featured ? undefined : "hidden",
          }}>
            {project.description}
          </p>

          {/* Outcome metric — featured shows 2, others show 1 */}
          {firstOutcome && (
            <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "0.75rem" }}>
              {(featured ? project.caseStudy?.outcomes?.slice(0, 2) : [firstOutcome])?.map((o) => (
                <div key={o.label}>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 900, fontSize: "1.3rem", color: "var(--accent-gold)", lineHeight: 1 }}>
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
            {project.tags.slice(0, featured ? 4 : 3).map((tag) => (
              <span key={tag} className="pill">{tag}</span>
            ))}
          </div>

          {/* Company */}
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "0.875rem", letterSpacing: "0.06em" }}>
            @ {project.company}
          </p>
        </div>
      </div>
    </div>
  );
};

// ── Section ──────────────────────────────────────────────────
const Work = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [featured, ...rest] = projects;

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Featured card enters first
      gsap.fromTo(".work-featured",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" }
        }
      );

      // Rest stagger in after featured
      gsap.fromTo(".work-card:not(.work-featured)",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.12, duration: 0.8, ease: "power3.out",
          delay: 0.3,
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" }
        }
      );

      // Clip-path image wipe on each card
      gsap.utils.toArray<Element>(".work-card-wipe").forEach((el) => {
        gsap.fromTo(el,
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: 0.9, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 80%" }
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

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

        {/* Grid */}
        <div className="work-grid">
          <ProjectCard project={featured} featured />
          {rest.map((proj) => (
            <ProjectCard key={proj.id} project={proj} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Work;
