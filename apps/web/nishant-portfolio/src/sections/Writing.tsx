import { useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TitleHeader from "../components/TitleHeader";
import { articleMeta, type ArticleMeta } from "../articles/index";

gsap.registerPlugin(ScrollTrigger);

/* ── Article card (secondary) ───────────────────────── */
const ArticleCard = ({
  article,
  cardRef,
}: {
  article: ArticleMeta;
  cardRef: (el: HTMLAnchorElement | null) => void;
}) => {
  const imgRef = useRef<HTMLImageElement>(null);

  return (
    <Link
      to={`/writing/${article.slug}`}
      ref={cardRef}
      style={{
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-card)",
        border: "1px solid var(--rule)",
        borderRadius: "3px",
        overflow: "hidden",
        textDecoration: "none",
        color: "inherit",
        transition: "border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease",
        opacity: 0,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border-color)";
        (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-3px)";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.08)";
        if (imgRef.current) imgRef.current.style.transform = "scale(1.04)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--rule)";
        (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
        if (imgRef.current) imgRef.current.style.transform = "scale(1)";
      }}
    >
      {/* Cover image */}
      <div style={{ position: "relative", height: "180px", overflow: "hidden", flexShrink: 0 }}>
        <img
          ref={imgRef}
          src={article.coverImage}
          alt={article.coverImageAlt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transition: "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        />
        {/* Subtle dark overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)",
          }}
        />
        {/* Reading time chip — bottom-left */}
        <div
          style={{
            position: "absolute",
            bottom: "0.65rem",
            left: "0.75rem",
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "rgba(255,255,255,0.85)",
            background: "rgba(0,0,0,0.35)",
            backdropFilter: "blur(4px)",
            padding: "0.2rem 0.5rem",
            borderRadius: "2px",
          }}
        >
          {article.readingTime}
        </div>
        {/* Demo badge — top-right */}
        {article.demoUrl && (
          <div
            style={{
              position: "absolute",
              top: "0.65rem",
              right: "0.75rem",
              fontFamily: "var(--font-mono)",
              fontSize: "0.6rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--accent-warm)",
              background: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(4px)",
              padding: "0.2rem 0.5rem",
              borderRadius: "2px",
              border: "1px solid rgba(183,65,31,0.5)",
            }}
          >
            Live demo
          </div>
        )}
      </div>

      {/* Card body */}
      <div style={{ display: "flex", flexDirection: "column", padding: "1.25rem", flexGrow: 1 }}>
        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginBottom: "0.75rem" }}>
          {article.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--text-muted)",
                border: "1px solid var(--rule)",
                padding: "0.15rem 0.45rem",
                borderRadius: "2px",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: "clamp(1rem, 1.4vw, 1.2rem)",
            lineHeight: 1.25,
            letterSpacing: "-0.015em",
            color: "var(--text-primary)",
            marginBottom: "0.6rem",
            flexGrow: 1,
          }}
        >
          {article.title}
        </h3>

        {/* Description */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.82rem",
            color: "var(--text-muted)",
            lineHeight: 1.6,
            marginBottom: "1rem",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {article.description}
        </p>

        {/* Footer — links */}
        {(article.demoUrl || article.repoUrl) && (
          <div
            style={{ display: "flex", gap: "0.5rem", marginTop: "auto" }}
            onClick={(e) => e.preventDefault()}
          >
            {article.repoUrl && (
              <a
                href={article.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.65rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--text-muted)",
                  textDecoration: "none",
                  border: "1px solid var(--rule)",
                  padding: "0.2rem 0.55rem",
                  borderRadius: "2px",
                  transition: "color 0.2s, border-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-primary)";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border-color)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--rule)";
                }}
              >
                GitHub →
              </a>
            )}
            {article.demoUrl && (
              <a
                href={article.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.65rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--accent-warm)",
                  textDecoration: "none",
                  border: "1px solid currentColor",
                  padding: "0.2rem 0.55rem",
                  borderRadius: "2px",
                  transition: "background 0.2s, color 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "var(--accent-warm)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--bg-primary)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent-warm)";
                }}
              >
                {article.demoLabel ?? "View Live →"}
              </a>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

/* ── Writing section ────────────────────────────────── */
const Writing = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useGSAP(() => {
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      gsap.fromTo(
        card,
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.65,
          delay: i * 0.06,
          ease: "power2.out",
          scrollTrigger: { trigger: gridRef.current, start: "top 85%", once: true },
        }
      );
    });
  }, []);

  return (
    <section id="writing" style={{ paddingBlock: "var(--section-py)" }}>
      <div className="site-container">
        <TitleHeader
          num="04"
          label="Writing"
          title={<>Notes from the <em>frontier.</em></>}
          className="mb-10 md:mb-12"
        />

        {/* ── Uniform 3×2 grid — all articles equal ── */}
        <div
          ref={gridRef}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1.25rem",
          }}
          className="writing-grid"
        >
          {articleMeta.map((article, index) => (
            <ArticleCard
              key={article.slug}
              article={article}
              cardRef={(el) => { cardRefs.current[index] = el; }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Writing;
