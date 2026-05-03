import { useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TitleHeader from "../components/TitleHeader";
import { articleMeta } from "../articles/index";

gsap.registerPlugin(ScrollTrigger);

const Writing = () => {
  const featuredRef = useRef<HTMLAnchorElement>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useGSAP(() => {
    if (featuredRef.current) {
      gsap.fromTo(
        featuredRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
          scrollTrigger: { trigger: featuredRef.current, start: "top 85%", once: true } }
      );
    }

    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      gsap.fromTo(
        card,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.65,
          delay: i * 0.08,
          ease: "power2.out",
          scrollTrigger: { trigger: card, start: "top 88%", once: true },
        }
      );
    });
  }, []);

  const [featured, ...secondary] = articleMeta;

  return (
    <section id="writing" style={{ paddingBlock: "var(--section-py)" }}>
      <div className="site-container">
        <TitleHeader
          num="04"
          label="Writing"
          title={<>Notes from the <em>frontier.</em></>}
          className="mb-10 md:mb-12"
        />

        {/* Featured article — full-width with cover image */}
        <Link
          to={`/writing/${featured.slug}`}
          ref={featuredRef}
          style={{
            display: "block",
            position: "relative",
            overflow: "hidden",
            textDecoration: "none",
            color: "inherit",
            marginBottom: "1.5rem",
            borderRadius: "2px",
          }}
          onMouseEnter={(e) => {
            const img = (e.currentTarget as HTMLElement).querySelector(".cover-img") as HTMLElement | null;
            if (img) img.style.transform = "scale(1.03)";
          }}
          onMouseLeave={(e) => {
            const img = (e.currentTarget as HTMLElement).querySelector(".cover-img") as HTMLElement | null;
            if (img) img.style.transform = "scale(1)";
          }}
        >
          {/* Cover image */}
          <div style={{ position: "relative", height: "clamp(260px, 40vw, 480px)", overflow: "hidden" }}>
            <img
              className="cover-img"
              src={featured.coverImage}
              alt={featured.coverImageAlt}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                transition: "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              }}
            />
            {/* Dark overlay gradient */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.05) 100%)",
              }}
            />
            {/* Content over image */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "clamp(1.5rem, 4vw, 3rem)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.7rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  color: "var(--accent-warm)",
                  marginBottom: "0.75rem",
                }}
              >
                Featured · {featured.readingTime}
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 400,
                  fontSize: "clamp(1.4rem, 3.5vw, 2.4rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.025em",
                  color: "#ffffff",
                  maxWidth: "56ch",
                  marginBottom: "0.75rem",
                }}
              >
                {featured.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.92rem",
                  color: "rgba(255,255,255,0.7)",
                  lineHeight: 1.6,
                  maxWidth: "72ch",
                  marginBottom: "1rem",
                }}
              >
                {featured.description}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {featured.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.68rem",
                      padding: "0.2rem 0.5rem",
                      border: "1px solid rgba(255,255,255,0.25)",
                      color: "rgba(255,255,255,0.7)",
                      borderRadius: "2px",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Link>

        {/* Secondary articles — 2-col list */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))", gap: "0" }}>
          {secondary.map((article, index) => (
            <Link
              key={article.slug}
              to={`/writing/${article.slug}`}
              ref={(el) => { cardRefs.current[index] = el; }}
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "1.75rem 0",
                borderBottom: "1px solid var(--rule)",
                borderRight: index % 2 === 0 && index < secondary.length - 1 ? "1px solid var(--rule)" : "none",
                paddingRight: index % 2 === 0 ? "clamp(1rem, 3vw, 2.5rem)" : 0,
                paddingLeft: index % 2 === 1 ? "clamp(1rem, 3vw, 2.5rem)" : 0,
                textDecoration: "none",
                color: "inherit",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "var(--bg-secondary)";
                (e.currentTarget as HTMLAnchorElement).style.paddingInline = "1rem";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                const isOdd = index % 2 === 1;
                (e.currentTarget as HTMLAnchorElement).style.paddingLeft = isOdd ? "clamp(1rem, 3vw, 2.5rem)" : "0";
                (e.currentTarget as HTMLAnchorElement).style.paddingRight = !isOdd ? "clamp(1rem, 3vw, 2.5rem)" : "0";
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.68rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "var(--accent-warm)",
                  marginBottom: "0.6rem",
                }}
              >
                {article.readingTime}
              </div>

              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 400,
                  fontSize: "clamp(1.05rem, 1.6vw, 1.3rem)",
                  lineHeight: 1.2,
                  letterSpacing: "-0.015em",
                  color: "var(--text-primary)",
                  marginBottom: "0.65rem",
                  flexGrow: 1,
                }}
              >
                {article.title}
              </h3>

              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.85rem",
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

              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "auto" }}>
                {article.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="editorial-tag" style={{ fontSize: "0.65rem" }}>{tag}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Writing;
