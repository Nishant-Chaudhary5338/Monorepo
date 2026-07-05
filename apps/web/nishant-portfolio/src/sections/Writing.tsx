import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { articleMeta, type ArticleMeta } from "../articles";
import { AnimatedTitle } from "../components/AnimatedTitle";

const ACCENTS = ["--accent-purple", "--accent-gold", "--accent-cyan"] as const;

interface WritingCategory {
  label: string;
  slugs: string[];
}

// Grouped from each article's own tags — AI/MCP work, platform &
// build-system architecture, and React/design-system craft.
const CATEGORIES: WritingCategory[] = [
  { label: "AI & Tooling", slugs: ["on-device-ax-platform-modular-web-development", "one-protocol-two-surfaces", "ai-dev-platform-mfe-adoption"] },
  { label: "Architecture & Platform", slugs: ["plugin-onboarding-vite-module-federation", "turborepo-cache-invalidation-patterns"] },
  { label: "React & Design Systems", slugs: ["production-grade-ui-library-react-monorepo", "headless-dashboard-library"] },
];

const byCategory = CATEGORIES.map((cat) => ({
  ...cat,
  articles: cat.slugs
    .map((slug) => articleMeta.find((a) => a.slug === slug))
    .filter((a): a is ArticleMeta => Boolean(a)),
}));

const onGlowMove = (e: React.MouseEvent<HTMLDivElement>): void => {
  const rect = e.currentTarget.getBoundingClientRect();
  const spot = e.currentTarget.querySelector<HTMLDivElement>(".glow-card__spot");
  if (!spot) return;
  spot.style.setProperty("--gx", `${e.clientX - rect.left}px`);
  spot.style.setProperty("--gy", `${e.clientY - rect.top}px`);
};

const Writing = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".writing-tab",
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.06, duration: 0.5, ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%" }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const onSelect = (i: number): void => {
    if (i === active || !panelRef.current) { setActive(i); return; }
    const panel = panelRef.current;
    gsap.to(panel, {
      opacity: 0, y: 6, duration: 0.15, ease: "power2.in",
      onComplete: () => {
        setActive(i);
        requestAnimationFrame(() => {
          gsap.fromTo(panel, { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" });
        });
      },
    });
  };

  const activeCategory = byCategory[active];
  const activeAccent = ACCENTS[active % ACCENTS.length];

  return (
    <section id="writing" ref={sectionRef} className="section">
      <div className="section-wrap">
        <div className="section-glow" style={{ "--section-glow-color": "var(--accent-purple)", "--section-glow-color-2": "var(--accent-cyan)" } as React.CSSProperties}>
          <p className="section-label">
            <span className="section-label-num">06</span> — WRITING
          </p>
          <AnimatedTitle title="Notes on building" style={{ marginTop: "var(--space-sm)", marginBottom: "var(--space-lg)" }} />
        </div>

        <div
          className="product-card glow-card"
          onMouseMove={onGlowMove}
          style={{ "--card-accent": `var(${activeAccent})` } as React.CSSProperties}
        >
          <div className="glow-card__spot" style={{ "--glow-color": `var(${activeAccent})` } as React.CSSProperties} aria-hidden="true" />

          <div className="skills-tabs" role="tablist" aria-label="Writing categories">
            {byCategory.map((cat, i) => {
              const accent = ACCENTS[i % ACCENTS.length];
              const isActive = i === active;
              return (
                <button
                  key={cat.label}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`skills-tab writing-tab${isActive ? " active" : ""}`}
                  onClick={() => onSelect(i)}
                  style={isActive ? { background: `var(${accent})`, borderColor: `var(${accent})` } : undefined}
                >
                  {cat.label}
                  <span className="writing-tab__count">{cat.articles.length}</span>
                </button>
              );
            })}
          </div>

          <div ref={panelRef} style={{ marginTop: "1.5rem" }}>
            {activeCategory.articles.map((article, i) => (
              <Link
                key={article.slug}
                to={`/writing/${article.slug}`}
                className="writing-compact-row"
                style={i === 0 ? { borderTop: "1px solid var(--border-subtle)" } : undefined}
              >
                <span className="writing-compact-row__num" style={{ color: `var(${activeAccent})` }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="writing-compact-row__body">
                  <span className="writing-compact-row__title">{article.title}</span>
                  <span className="writing-compact-row__teaser">{article.description}</span>
                </span>
                <span className="writing-compact-row__meta">{article.date} · {article.readingTime}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Writing;
