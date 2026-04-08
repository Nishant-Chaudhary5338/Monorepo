import { freelanceProjects as creativeProjects } from "../constants";

// ── Shared link style helpers ────────────────────────────────
const linkStyle: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  fontWeight: 600,
  fontSize: "0.8rem",
  color: "var(--text-muted)",
  textDecoration: "none",
  borderBottom: "1px solid var(--border-subtle)",
  paddingBottom: "1px",
  transition: "color var(--duration-base) var(--ease-out), border-color var(--duration-base) var(--ease-out)",
};

const linkHover = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.color = "var(--accent-rose)";
  e.currentTarget.style.borderColor = "var(--accent-rose)";
};

const linkBlur = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.currentTarget.style.color = "var(--text-muted)";
  e.currentTarget.style.borderColor = "var(--border-subtle)";
};

// ── Creative card component ──────────────────────────────────
const CreativeCard = ({ project }: { project: (typeof creativeProjects)[0] }) => {
  const hasBehance = !!project.caseStudy?.links?.behance;

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget as HTMLDivElement;
    el.style.borderLeftWidth = "3px";
    el.style.borderLeftColor = "var(--accent-rose)";
    el.style.transform = "translateY(-2px)";
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget as HTMLDivElement;
    el.style.borderLeftWidth = "1px";
    el.style.borderLeftColor = "var(--border-default)";
    el.style.transform = "translateY(0)";
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-default)",
        borderRadius: "var(--radius-card)",
        overflow: "hidden",
        transition: "border var(--duration-base) var(--ease-out), transform var(--duration-base) var(--ease-out), box-shadow var(--duration-base) var(--ease-out)",
        boxShadow: "var(--shadow-card)",
        cursor: "default",
      }}
    >
      {/* Image area — 4:3 */}
      <div style={{
        aspectRatio: "4 / 3",
        background: project.gradient,
        border: "none",
        borderBottom: "1px solid var(--border-subtle)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
      }}>
        {/* Placeholder label until real images are added */}
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.65rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: project.accentColor,
          opacity: 0.7,
        }}>
          {project.id}
        </span>

        {/* Year badge top-right */}
        {project.year && (
          <span style={{
            position: "absolute",
            top: "0.75rem",
            right: "0.75rem",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.65rem",
            letterSpacing: "0.08em",
            color: "var(--text-muted)",
            background: "var(--bg-overlay)",
            padding: "0.25rem 0.5rem",
          }}>
            {project.year}
          </span>
        )}
      </div>

      {/* Card info */}
      <div style={{ padding: "1.5rem" }}>
        {/* Category — rose accent */}
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.68rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--accent-rose)",
          marginBottom: "0.5rem",
        }}>
          {project.category}
        </p>

        {/* Title */}
        <h3 style={{
          fontFamily: "'Playfair Display', serif",
          fontStyle: "italic",
          fontWeight: 900,
          fontSize: "1.25rem",
          color: "var(--text-primary)",
          lineHeight: 1.25,
          marginBottom: "0.75rem",
        }}>
          {project.title}
        </h3>

        {/* Description */}
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 400,
          fontSize: "0.875rem",
          lineHeight: 1.6,
          color: "var(--text-secondary)",
          marginBottom: "1.25rem",
        }}>
          {project.description}
        </p>

        {/* Tools tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem", marginBottom: "1rem" }}>
          {project.caseStudy?.tools.slice(0, 3).map((tool) => (
            <span
              key={tool}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                background: "var(--bg-sunken)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-pill)",
                padding: "0.2rem 0.6rem",
              }}
            >
              {tool}
            </span>
          ))}
        </div>

        {/* Link row: PDF > Behance > company label */}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {project.caseStudy?.links?.pdf && (
            <a
              href={project.caseStudy.links.pdf}
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
              onMouseEnter={linkHover}
              onMouseLeave={linkBlur}
            >
              View Brand Kit ↗
            </a>
          )}
          {hasBehance && (
            <a
              href={project.caseStudy?.links?.behance}
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
              onMouseEnter={linkHover}
              onMouseLeave={linkBlur}
            >
              Behance ↗
            </a>
          )}
          {!project.caseStudy?.links?.pdf && !hasBehance && (
            <p style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.68rem",
              color: "var(--text-muted)",
              letterSpacing: "0.06em",
            }}>
              @ {project.company}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Section ──────────────────────────────────────────────────
const Freelance = () => (
  <section
    id="freelance"
    style={{ padding: "var(--space-xl) 0", background: "var(--bg-base)" }}
  >
    <div className="section-wrap">

      {/* Section anatomy header */}
      <div style={{ marginBottom: "var(--space-lg)" }}>
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.72rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          marginBottom: "var(--space-sm)",
        }}>
          <span style={{ color: "var(--accent-gold)" }}>05</span> — FREELANCE &amp; INDEPENDENT WORK
        </p>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontStyle: "italic",
          fontWeight: 900,
          fontSize: "clamp(2.8rem, 5vw, 4.8rem)",
          color: "var(--text-primary)",
          lineHeight: 1.1,
          marginBottom: "var(--space-md)",
        }}>
          Commercial work
        </h2>
        <hr style={{
          border: "none",
          borderTop: "1px solid var(--border-subtle)",
          marginBottom: 0,
        }} />
      </div>

      {/* 4-column grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "var(--space-md)",
      }}>
        {creativeProjects.map((project) => (
          <CreativeCard key={project.id} project={project} />
        ))}
      </div>

      {/* Behance CTA */}
      <div style={{
        marginTop: "var(--space-lg)",
        paddingTop: "var(--space-md)",
        borderTop: "1px solid var(--border-subtle)",
      }}>
        <a
          href="https://www.behance.net/nidhichhim6d3d"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost"
        >
          See full creative portfolio on Behance ↗
        </a>
      </div>

    </div>
  </section>
);

export default Freelance;
