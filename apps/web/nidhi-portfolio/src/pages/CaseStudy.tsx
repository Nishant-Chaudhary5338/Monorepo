import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { projects, type CaseStudyImage, type Portal } from "../constants";

// ── Image slot with gradient fallback ────────────────────────
const ImageSlot = ({
  image,
  gradient,
  accentColor,
  objectFit = "cover",
  style: outerStyle,
}: {
  image: CaseStudyImage;
  gradient: string;
  accentColor: string;
  objectFit?: "cover" | "contain";
  style?: React.CSSProperties;
}) => {
  const [errored, setErrored] = useState(false);

  if (!errored && image.src && !image.src.includes("placeholder")) {
    return (
      <figure style={{ margin: 0, ...outerStyle }}>
        <div style={{ width: "100%", height: "100%", overflow: "hidden", background: objectFit === "contain" ? "var(--bg-surface)" : undefined }}>
          <img
            src={image.src}
            alt={image.alt}
            loading="lazy"
            decoding="async"
            onError={() => setErrored(true)}
            style={{
              width: "100%", height: "100%",
              objectFit,
              display: "block",
            }}
          />
        </div>
        {image.caption && (
          <figcaption style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.72rem",
            color: "var(--text-muted)",
            marginTop: "0.75rem",
            letterSpacing: "0.04em",
          }}>
            {image.caption}
          </figcaption>
        )}
      </figure>
    );
  }

  return (
    <div
      style={{
        background: gradient,
        border: "1px solid var(--border-default)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        minHeight: "220px",
        padding: "2rem",
        ...outerStyle,
      }}
      aria-label={image.alt}
    >
      <span style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "0.65rem",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: accentColor,
        opacity: 0.7,
        textAlign: "center",
      }}>
        {image.alt}
      </span>
      <span style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "0.55rem",
        color: "var(--text-muted)",
      }}>
        Image coming soon
      </span>
    </div>
  );
};

// ── Image gallery — three-tier layout ─────────────────────────
const ImageGallery = ({
  images,
  gradient,
  accentColor,
}: {
  images: CaseStudyImage[];
  gradient: string;
  accentColor: string;
}) => {
  const fullImages    = images.filter((img) => img.full);
  const mobileImages  = images.filter((img) => img.mobile);
  const desktopImages = images.filter((img) => !img.full && !img.mobile);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Tier 1 — landscape banners (full: true) — side-by-side, objectFit: contain */}
      {fullImages.length > 0 && (
        <div style={{
          display: "grid",
          gridTemplateColumns: fullImages.length === 1 ? "1fr" : "1fr 1fr",
          gap: "1rem",
        }}>
          {fullImages.map((img, i) => (
            <ImageSlot
              key={i}
              image={img}
              gradient={gradient}
              accentColor={accentColor}
              objectFit="contain"
              style={{ height: 360, border: "1px solid var(--border-subtle)", borderRadius: 8, overflow: "hidden" }}
            />
          ))}
        </div>
      )}
      {/* Tier 2 — mobile portrait screenshots (mobile: true) — horizontal scrollable strip */}
      {mobileImages.length > 0 && (
        <div style={{
          display: "flex",
          gap: "1rem",
          overflowX: "auto",
          scrollbarWidth: "none",
          paddingBottom: "0.5rem",
        }}>
          {mobileImages.map((img, i) => (
            <ImageSlot
              key={i}
              image={img}
              gradient={gradient}
              accentColor={accentColor}
              objectFit="cover"
              style={{ flex: "0 0 auto", width: 210, height: 400, borderRadius: 12, border: "1px solid var(--border-subtle)", overflow: "hidden" }}
            />
          ))}
        </div>
      )}
      {/* Tier 3 — desktop screenshots (no flag) — responsive grid, objectFit: contain */}
      {desktopImages.length > 0 && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
          gap: "1rem",
        }}>
          {desktopImages.map((img, i) => (
            <ImageSlot
              key={i}
              image={img}
              gradient={gradient}
              accentColor={accentColor}
              objectFit="contain"
              style={{ height: 300, border: "1px solid var(--border-subtle)", borderRadius: 8, overflow: "hidden" }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ── Portal sub-section ───────────────────────────────────────
const PortalSection = ({
  portal,
  index,
  gradient,
  accentColor,
}: {
  portal: Portal;
  index: number;
  gradient: string;
  accentColor: string;
}) => (
  <section className="portal-section">
    {/* Portal header */}
    <div className="portal-header">
      <span className="portal-badge" style={{ color: accentColor, borderColor: accentColor }}>
        Portal {String(index + 1).padStart(2, "0")}
      </span>
      <h2 className="portal-title">{portal.title}</h2>
      <p className="portal-subtitle">{portal.subtitle}</p>
      <p className="portal-context">{portal.context}</p>
    </div>

    {/* Portal challenge */}
    <div className="portal-body">
      <div style={{ marginBottom: "2.5rem" }}>
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.65rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          marginBottom: "0.75rem",
        }}>
          The Challenge
        </p>
        <p style={{ fontSize: "0.95rem", lineHeight: 1.75, color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
          {portal.problem}
        </p>
        <ul style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {portal.painPoints.map((point, i) => (
            <li key={i} style={{
              display: "flex",
              gap: "1rem",
              alignItems: "flex-start",
              paddingBottom: "0.6rem",
              borderBottom: "1px solid var(--border-subtle)",
            }}>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.65rem",
                color: accentColor,
                flexShrink: 0,
                marginTop: "0.2rem",
                opacity: 0.8,
              }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span style={{ fontSize: "0.9rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>
                {point}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* What we built */}
      <div style={{ marginBottom: "2.5rem" }}>
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.65rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          marginBottom: "0.75rem",
        }}>
          What We Built
        </p>
        <ul style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {portal.solutionHighlights.map((item, i) => (
            <li key={i} style={{
              display: "flex",
              gap: "1rem",
              alignItems: "flex-start",
              padding: "0.9rem 0",
              borderBottom: "1px solid var(--border-subtle)",
            }}>
              <span style={{
                width: "5px", height: "5px",
                borderRadius: "50%",
                background: accentColor,
                flexShrink: 0,
                marginTop: "0.55rem",
              }} />
              <span style={{ fontSize: "0.9rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Portal screens */}
      {portal.images.length > 0 && (
        <div style={{ marginBottom: "2.5rem" }}>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.65rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            marginBottom: "1rem",
          }}>
            Screens
          </p>
          <ImageGallery images={portal.images} gradient={gradient} accentColor={accentColor} />
        </div>
      )}

      {/* Portal outcomes */}
      <div className="stats-row" style={{ paddingTop: "0.5rem" }}>
        {portal.outcomes.map((outcome, i) => (
          <div key={i} className="stat-item">
            <p className="stat-value" style={{ color: accentColor }}>{outcome.metric}</p>
            <p className="stat-label">{outcome.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── Not found ─────────────────────────────────────────────────
const NotFound = () => (
  <main style={{
    minHeight: "100svh",
    background: "var(--bg-base)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1.5rem",
    padding: "2rem",
  }}>
    <p style={{
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: "0.72rem",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "var(--text-muted)",
    }}>
      404 — Project not found
    </p>
    <Link to="/" className="btn-outline">← Back to Portfolio</Link>
  </main>
);

// ── Main page ─────────────────────────────────────────────────
const CaseStudy = () => {
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [id]);

  const project = projects.find((p) => p.id === id);

  if (!project || !project.caseStudy) return <NotFound />;

  const cs = project.caseStudy;
  const nextProject = projects[(projects.indexOf(project) + 1) % projects.length];

  return (
    <div style={{ background: "var(--bg-base)", minHeight: "100svh" }}>

      {/* ── Disclaimer (Samsung projects) ── */}
      {cs.disclaimer && (
        <div style={{
          background: "var(--accent-gold-light)",
          borderBottom: "1px solid var(--accent-gold)",
          padding: "0.75rem clamp(1.5rem, 4vw, 3.5rem)",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}>
          <span style={{ fontSize: "0.85rem", color: "var(--accent-gold)" }}>⚠</span>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.72rem",
            letterSpacing: "0.04em",
            color: "var(--text-secondary)",
          }}>
            {cs.disclaimer}
          </p>
        </div>
      )}

      {/* ── Hero ── */}
      <div style={{
        background: project.gradient,
        paddingTop: "clamp(7rem, 12vw, 10rem)",
        paddingBottom: "clamp(3rem, 6vw, 5rem)",
        paddingLeft: "clamp(1.5rem, 4vw, 3.5rem)",
        paddingRight: "clamp(1.5rem, 4vw, 3.5rem)",
        borderBottom: "1px solid var(--border-subtle)",
      }}>
        <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
          {/* Back link */}
          <Link to="/#work" style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.72rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "2rem",
            transition: "color 150ms",
          }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent-purple)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
          >
            ← Back to Portfolio
          </Link>

          {/* Category */}
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.72rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: project.accentColor,
            marginBottom: "1rem",
            opacity: 0.9,
          }}>
            {project.category}
          </p>

          {/* Title */}
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2.5rem, 6vw, 5rem)",
            fontWeight: 900,
            fontStyle: "italic",
            lineHeight: 1.1,
            color: "#F4F3EF",
            marginBottom: "1.25rem",
            maxWidth: "800px",
          }}>
            {project.title}
          </h1>

          {/* Description */}
          <p style={{
            fontSize: "1.05rem",
            lineHeight: 1.75,
            color: "rgba(244,243,239,0.75)",
            maxWidth: "600px",
          }}>
            {project.description}
          </p>

          {/* Badge */}
          {project.badge && (
            <div style={{ marginTop: "1.5rem" }}>
              <span className="pill pill-live">{project.badge}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Overview strip ── */}
      <div style={{
        borderBottom: "1px solid var(--border-subtle)",
        background: "var(--bg-surface)",
      }}>
        <div style={{
          maxWidth: "1320px",
          margin: "0 auto",
          padding: "0 clamp(1.5rem, 4vw, 3.5rem)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "0",
        }}>
          {[
            { label: "My Role", value: cs.myRole },
            { label: "Timeline", value: cs.timeline },
            { label: "Company", value: project.company },
            ...(cs.teamNote ? [{ label: "Team", value: cs.teamNote }] : []),
          ].map((item, i) => (
            <div key={i} style={{
              padding: "1.75rem 0",
              paddingRight: "2rem",
              borderRight: "1px solid var(--border-subtle)",
              paddingLeft: i > 0 ? "2rem" : "0",
            }}>
              <p style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                marginBottom: "0.4rem",
              }}>
                {item.label}
              </p>
              <p style={{
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "var(--text-primary)",
                lineHeight: 1.4,
              }}>
                {item.value}
              </p>
            </div>
          ))}

          {/* Tools */}
          <div style={{
            padding: "1.75rem 0",
            paddingLeft: "2rem",
          }}>
            <p style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.65rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              marginBottom: "0.6rem",
            }}>
              Tools
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
              {cs.tools.map((tool) => (
                <span key={tool} className="pill">{tool}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{
        maxWidth: "1320px",
        margin: "0 auto",
        padding: "0 clamp(1.5rem, 4vw, 3.5rem)",
      }}>

        {/* ── Problem ── */}
        <section style={{ padding: "var(--space-xl) 0", borderBottom: "1px solid var(--border-subtle)" }}>
          <div style={{ maxWidth: "760px" }}>
            <p className="section-label" style={{ marginBottom: "1rem" }}>
              <span className="section-label-num">01 —</span> The Challenge
            </p>
            <h2 className="section-title" style={{ marginBottom: "1.5rem" }}>
              What was broken
            </h2>
            <p className="section-body" style={{ marginBottom: "2rem" }}>
              {cs.problem}
            </p>
            <ul style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {cs.painPoints.map((point, i) => (
                <li key={i} style={{
                  display: "flex",
                  gap: "1rem",
                  alignItems: "flex-start",
                  paddingBottom: "0.75rem",
                  borderBottom: "1px solid var(--border-subtle)",
                }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.72rem",
                    color: "var(--accent-gold)",
                    flexShrink: 0,
                    marginTop: "0.15rem",
                  }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span style={{ fontSize: "0.95rem", lineHeight: 1.7, color: "var(--text-secondary)" }}>
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Process ── */}
        <section style={{ padding: "var(--space-xl) 0", borderBottom: "1px solid var(--border-subtle)" }}>
          <p className="section-label" style={{ marginBottom: "1rem" }}>
            <span className="section-label-num">02 —</span> Process
          </p>
          <h2 className="section-title" style={{ marginBottom: "2rem" }}>
            How I worked through it
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1px",
            border: "1px solid var(--border-subtle)",
          }}>
            {cs.processHighlights.map((step, i) => (
              <div key={i} className="process-step">
                <p className="process-step-num">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="process-step-title">{step.phase}</h3>
                <p className="process-step-body">{step.what}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Solution (shown only when no portals) ── */}
        {!cs.portals && cs.solutionHighlights.length > 0 && (
          <section style={{ padding: "var(--space-xl) 0", borderBottom: "1px solid var(--border-subtle)" }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "clamp(2rem, 5vw, 5rem)",
              alignItems: "start",
            }}>
              <div>
                <p className="section-label" style={{ marginBottom: "1rem" }}>
                  <span className="section-label-num">03 —</span> Solution
                </p>
                <h2 className="section-title" style={{ marginBottom: "1.5rem" }}>
                  Key design decisions
                </h2>
              </div>
              <ul style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {cs.solutionHighlights.map((item, i) => (
                  <li key={i} style={{
                    display: "flex",
                    gap: "1.25rem",
                    alignItems: "flex-start",
                    padding: "1.25rem 0",
                    borderBottom: "1px solid var(--border-subtle)",
                  }}>
                    <span style={{
                      width: "6px", height: "6px",
                      borderRadius: "50%",
                      background: project.accentColor,
                      flexShrink: 0,
                      marginTop: "0.55rem",
                    }} />
                    <span style={{ fontSize: "0.95rem", lineHeight: 1.7, color: "var(--text-secondary)" }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* ── Portal sub-sections (replaces Solution + Images when portals present) ── */}
        {cs.portals && cs.portals.length > 0 && (
          <div>
            <p className="section-label" style={{ marginBottom: "0", padding: "var(--space-xl) 0 1rem" }}>
              <span className="section-label-num">03 —</span> The Portals
            </p>
            {cs.portals.map((portal, i) => (
              <PortalSection
                key={portal.id}
                portal={portal}
                index={i}
                gradient={project.gradient}
                accentColor={project.accentColor}
              />
            ))}
          </div>
        )}

        {/* ── Images (shown only when no portals) ── */}
        {!cs.portals && cs.images.length > 0 && (
          <section style={{ padding: "var(--space-xl) 0", borderBottom: "1px solid var(--border-subtle)" }}>
            <p className="section-label" style={{ marginBottom: "2rem" }}>
              <span className="section-label-num">04 —</span> Screens & Artifacts
            </p>
            <ImageGallery
              images={cs.images}
              gradient={project.gradient}
              accentColor={project.accentColor}
            />
          </section>
        )}

        {/* ── Outcomes ── */}
        <section style={{ padding: "var(--space-xl) 0", borderBottom: "1px solid var(--border-subtle)" }}>
          <p className="section-label" style={{ marginBottom: "1rem" }}>
            <span className="section-label-num">05 —</span> Outcomes
          </p>
          <h2 className="section-title" style={{ marginBottom: "2rem" }}>
            Results & impact
          </h2>
          <div className="stats-row">
            {cs.outcomes.map((outcome, i) => (
              <div key={i} className="stat-item">
                <p className="stat-value">{outcome.metric}</p>
                <p className="stat-label">{outcome.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Links ── */}
        {Object.keys(cs.links).length > 0 && (
          <section style={{ padding: "var(--space-lg) 0", borderBottom: "1px solid var(--border-subtle)", display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            {cs.links.playStore && (
              <a href={cs.links.playStore} target="_blank" rel="noopener noreferrer" className="btn-outline">
                View on Play Store ↗
              </a>
            )}
            {cs.links.appStore && (
              <a href={cs.links.appStore} target="_blank" rel="noopener noreferrer" className="btn-outline">
                View on App Store ↗
              </a>
            )}
            {cs.links.storybook && cs.links.storybook.length > 0 && (
              <a href={cs.links.storybook} target="_blank" rel="noopener noreferrer" className="btn-primary">
                <span>View Live Storybook</span>
                <span>↗</span>
              </a>
            )}
            {cs.links.behance && (
              <a href={cs.links.behance} target="_blank" rel="noopener noreferrer" className="btn-outline">
                View on Behance ↗
              </a>
            )}
            {cs.links.sites && cs.links.sites.length > 0 && (
              <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", margin: 0 }}>
                  Live Sites
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {cs.links.sites.map((site) => (
                    <a key={site.url} href={site.url} target="_blank" rel="noopener noreferrer" style={{
                      display: "inline-flex", alignItems: "center", gap: "0.35rem",
                      padding: "0.35rem 0.85rem", borderRadius: "999px",
                      border: "1px solid var(--border-subtle)",
                      fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem",
                      color: "var(--text-secondary)", textDecoration: "none",
                      transition: "border-color 150ms, color 150ms",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--accent)"; (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border-subtle)"; (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-secondary)"; }}
                    >
                      {site.label} ↗
                    </a>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* ── Next project ── */}
        <section style={{ padding: "var(--space-xl) 0" }}>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.72rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            marginBottom: "1.5rem",
          }}>
            Next project
          </p>
          <Link
            to={`/work/${nextProject.id}`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "2rem",
              padding: "2rem",
              background: "var(--bg-surface)",
              border: "1px solid var(--border-default)",
              textDecoration: "none",
              transition: "border-color 220ms, background 220ms",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent-purple)";
              e.currentTarget.style.background = "var(--accent-purple-light)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border-default)";
              e.currentTarget.style.background = "var(--bg-surface)";
            }}
          >
            <div>
              <p style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.68rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: nextProject.accentColor,
                marginBottom: "0.5rem",
              }}>
                {nextProject.category}
              </p>
              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.6rem",
                fontWeight: 900,
                fontStyle: "italic",
                color: "var(--text-primary)",
              }}>
                {nextProject.title}
              </h3>
            </div>
            <span style={{
              fontSize: "1.5rem",
              color: "var(--text-muted)",
              transition: "color 220ms, transform 220ms",
              flexShrink: 0,
            }}>
              →
            </span>
          </Link>
        </section>

      </div>
    </div>
  );
};

export default CaseStudy;
