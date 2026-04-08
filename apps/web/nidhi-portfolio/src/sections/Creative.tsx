import { useState } from "react";
import { creativeProjects } from "../constants";

type Project = (typeof creativeProjects)[0];

const mainProjects  = creativeProjects.filter((p) => !p.id.startsWith("brand-"));
const brandProjects = creativeProjects.filter((p) =>  p.id.startsWith("brand-"));

// ─────────────────────────────────────────────────────────────
// Image placeholder
// ─────────────────────────────────────────────────────────────
const ImgPlaceholder = ({
  project,
  style,
}: {
  project: Project;
  style?: React.CSSProperties;
}) => (
  <div
    style={{
      background: project.gradient,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      position: "relative",
      flexShrink: 0,
      ...style,
    }}
  >
    <span style={{
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: "0.6rem",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: project.accentColor,
      opacity: 0.6,
    }}>
      {project.id}
    </span>
    {project.year && (
      <span style={{
        position: "absolute",
        top: "0.6rem",
        right: "0.6rem",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "0.6rem",
        color: "var(--text-muted)",
        background: "var(--bg-overlay)",
        padding: "0.2rem 0.4rem",
      }}>
        {project.year}
      </span>
    )}
  </div>
);

// ─────────────────────────────────────────────────────────────
// Bento card — image fills card, info overlay at bottom
// ─────────────────────────────────────────────────────────────
const BentoCard = ({ project, aspectRatio }: { project: Project; aspectRatio: string }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        borderRadius: "var(--radius-card)",
        overflow: "hidden",
        border: `1px solid ${hovered ? "var(--accent-rose)" : "var(--border-default)"}`,
        boxShadow: hovered ? "var(--shadow-elevated)" : "var(--shadow-card)",
        transition: "border-color var(--duration-base) var(--ease-out), box-shadow var(--duration-base) var(--ease-out)",
        cursor: "default",
      }}
    >
      <ImgPlaceholder
        project={project}
        style={{
          aspectRatio,
          width: "100%",
          transform: hovered ? "scale(1.03)" : "scale(1)",
          transition: "transform var(--duration-slow) var(--ease-out)",
        }}
      />

      {/* Always-visible bottom strip */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: "1.5rem",
        background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 70%, transparent 100%)",
      }}>
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.6rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.5)",
          marginBottom: "0.3rem",
        }}>
          {project.category}
        </p>
        <h3 style={{
          fontFamily: "'Playfair Display', serif",
          fontStyle: "italic",
          fontWeight: 900,
          fontSize: "1.25rem",
          color: "#fff",
          lineHeight: 1.2,
        }}>
          {project.title}
        </h3>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Full-width branding tile
// ─────────────────────────────────────────────────────────────
const BrandTile = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        border: `1px solid ${hovered ? "var(--accent-rose)" : "var(--border-default)"}`,
        borderRadius: "var(--radius-card)",
        overflow: "hidden",
        boxShadow: hovered ? "var(--shadow-elevated)" : "var(--shadow-card)",
        transition: "border-color var(--duration-base) var(--ease-out), box-shadow var(--duration-base) var(--ease-out)",
        cursor: "default",
        background: "var(--bg-surface)",
      }}
    >
      {/* Left: 3-panel collage */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
        {brandProjects.map((p, i) => (
          <div
            key={p.id}
            style={{
              background: p.gradient,
              aspectRatio: "3 / 4",
              borderRight: i < brandProjects.length - 1 ? "1px solid var(--border-subtle)" : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.55rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: p.accentColor,
              opacity: 0.55,
            }}>
              {p.id}
            </span>
          </div>
        ))}
      </div>

      {/* Right: info */}
      <div style={{
        padding: "2.5rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        borderLeft: "1px solid var(--border-subtle)",
      }}>
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.68rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--accent-rose)",
          marginBottom: "0.75rem",
        }}>
          Brand Identity · Packaging
        </p>

        <h3 style={{
          fontFamily: "'Playfair Display', serif",
          fontStyle: "italic",
          fontWeight: 900,
          fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)",
          color: "var(--text-primary)",
          lineHeight: 1.2,
          marginBottom: "var(--space-sm)",
        }}>
          Brand &amp; Packaging
        </h3>

        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 400,
          fontSize: "0.9rem",
          lineHeight: 1.7,
          color: "var(--text-secondary)",
          marginBottom: "var(--space-md)",
          maxWidth: "38ch",
        }}>
          Logo suites, visual identity systems, brand guidelines, and packaging design
          for {brandProjects.length} freelance clients — from concept through to print-ready delivery.
        </p>

        {/* Per-client PDF links */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {brandProjects.map((p) => p.caseStudy?.links?.pdf && (
            <a
              key={p.id}
              href={p.caseStudy.links.pdf}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.68rem",
                letterSpacing: "0.06em",
                color: "var(--text-muted)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                transition: "color 180ms var(--ease-out)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--accent-rose)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; }}
            >
              ↗ {p.title.replace("Brand Identity — ", "")} — Brand Kit
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Section
// ─────────────────────────────────────────────────────────────
const Creative = () => (
  <section
    id="creative"
    style={{ padding: "var(--space-xl) 0", background: "var(--bg-base)" }}
  >
    <div className="section-wrap">

      {/* Section header */}
      <p style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "0.72rem",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "var(--text-muted)",
        marginBottom: "var(--space-sm)",
      }}>
        <span style={{ color: "var(--accent-gold)" }}>04</span> — CREATIVE PRACTICE
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
        Art &amp; craft
      </h2>
      <hr style={{ border: "none", borderTop: "1px solid var(--border-subtle)", marginBottom: "var(--space-lg)" }} />

      {/* Mosaic grid */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>

        {/* Row 1: Tarot (tall portrait) + ALMA + Mural stacked */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 3fr", gap: "var(--space-md)" }}>
          <BentoCard project={mainProjects[0]} aspectRatio="3 / 4" />
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            <BentoCard project={mainProjects[1]} aspectRatio="16 / 9" />
            <BentoCard project={mainProjects[2]} aspectRatio="16 / 9" />
          </div>
        </div>

        {/* Full-width branding tile */}
        <BrandTile />

      </div>
    </div>
  </section>
);

export default Creative;
