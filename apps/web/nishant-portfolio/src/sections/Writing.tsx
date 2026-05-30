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
  return (
    <Link
      to={`/writing/${article.slug}`}
      ref={cardRef}
      style={{
        display: "flex",
        flexDirection: "column",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "3px",
        overflow: "hidden",
        textDecoration: "none",
        color: "inherit",
        transition: "border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease",
        opacity: 0,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--accent-line)";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 24px -10px var(--accent-glow)";
        (e.currentTarget as HTMLAnchorElement).style.background = "var(--surface-2)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border)";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
        (e.currentTarget as HTMLAnchorElement).style.background = "var(--surface)";
      }}
    >
      {/* Cover image */}
      <div style={{ position: "relative", height: "180px", overflow: "hidden", flexShrink: 0 }}>
        <img
          src={article.coverImage}
          alt={article.coverImageAlt}
          width={600}
          height={315}
          loading="lazy"
          decoding="async"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
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
              color: "var(--accent)",
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
                color: "var(--fg-muted)",
                border: "1px solid var(--border)",
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
            color: "var(--fg)",
            marginBottom: "0.6rem",
            flexGrow: 1,
          }}
        >
          {article.title}
        </h3>

        {/* Description */}
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.82rem",
            color: "var(--fg-muted)",
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
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "auto" }}>
            {article.repoUrl && (
              <button
                onClick={(e) => { e.preventDefault(); window.open(article.repoUrl, "_blank", "noopener,noreferrer"); }}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.65rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--fg-muted)",
                  background: "transparent",
                  border: "1px solid var(--border)",
                  padding: "0.2rem 0.55rem",
                  cursor: "pointer",
                  transition: "color 0.2s, border-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--fg)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-strong)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--fg-muted)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
                }}
              >
                GitHub →
              </button>
            )}
            {article.demoUrl && (
              <button
                onClick={(e) => { e.preventDefault(); window.open(article.demoUrl, "_blank", "noopener,noreferrer"); }}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.65rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--accent)",
                  background: "transparent",
                  border: "1px solid var(--accent)",
                  padding: "0.2rem 0.55rem",
                  cursor: "pointer",
                  transition: "background 0.2s, color 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "var(--accent)";
                  (e.currentTarget as HTMLButtonElement).style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)";
                }}
              >
                {article.demoLabel ?? "View Live →"}
              </button>
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
