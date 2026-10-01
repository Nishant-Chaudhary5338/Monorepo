import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { articleMeta, type ArticleMeta } from "../articles";
import { AnimatedTitle } from "../components/AnimatedTitle";
import { proofDrift } from "../motion";

interface WritingCategory {
  label: string;
  accent: string; // topic colour, shared with the Stack bands
  slugs: string[];
}

const VISIBLE_PER_GROUP = 2;

const CATEGORIES: WritingCategory[] = [
  { label: "AI Evaluation", accent: "--accent-gold", slugs: ["how-i-write-tasks-frontier-coding-agents-fail", "grading-the-grader-rubrics-and-verifiers"] },
  { label: "AI & Tooling", accent: "--accent-cyan", slugs: ["on-device-ax-platform-modular-web-development", "one-protocol-two-surfaces", "ai-dev-platform-mfe-adoption"] },
  { label: "Architecture & Platform", accent: "--accent-lime", slugs: ["plugin-onboarding-vite-module-federation", "turborepo-cache-invalidation-patterns"] },
  { label: "React & Design Systems", accent: "--accent-purple", slugs: ["production-grade-ui-library-react-monorepo", "headless-dashboard-library"] },
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

const WritingGroup = ({ group }: { group: (typeof byCategory)[number] }) => {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? group.articles : group.articles.slice(0, VISIBLE_PER_GROUP);
  const hidden = group.articles.length - VISIBLE_PER_GROUP;

  return (
    <div className="writing-group" style={{ "--group-accent": `var(${group.accent})`, "--group-accent-ink": `var(${group.accent}-ink)`, "--card-accent": `var(${group.accent})` } as React.CSSProperties}>
      <h3 className="writing-group__head">
        <span className="stack-band__dot" style={{ "--band-accent": `var(${group.accent})` } as React.CSSProperties} />
        {group.label}
        <span className="writing-group__count">{group.articles.length}</span>
      </h3>
      {visible.map((article, i) => (
        <Link key={article.slug} to={`/writing/${article.slug}`} className="writing-compact-row">
          <span className="writing-compact-row__num" style={{ color: `var(${group.accent}-ink)` }}>
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="writing-compact-row__body">
            <span className="writing-compact-row__title">{article.title}</span>
            <span className="writing-compact-row__teaser">{article.description}</span>
          </span>
          <span className="writing-compact-row__meta">{article.date} · {article.readingTime}</span>
        </Link>
      ))}
      {hidden > 0 && (
        <button type="button" className="writing-group__more" aria-expanded={showAll} onClick={() => setShowAll((v) => !v)}>
          {showAll ? "Show fewer" : `View all ${group.articles.length} →`}
        </button>
      )}
    </div>
  );
};

const Writing = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      proofDrift(".writing-group", { trigger: ".writing-groups", stagger: 0.12 });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="writing" ref={sectionRef} className="section">
      <div className="section-wrap">
        <div className="section-glow" style={{ "--section-glow-color": "var(--accent-writing)", "--section-glow-color-2": "var(--accent-purple)" } as React.CSSProperties}>
          <p className="section-label">
            <span className="section-label-num">06</span> — WRITING
          </p>
          <AnimatedTitle title="Notes on building" style={{ marginTop: "var(--space-sm)", marginBottom: "var(--space-lg)" }} />
        </div>

        <div className="product-card glow-card" onMouseMove={onGlowMove} style={{ "--card-accent": "var(--accent-writing)" } as React.CSSProperties}>
          <div className="glow-card__spot" style={{ "--glow-color": "var(--accent-writing)" } as React.CSSProperties} aria-hidden="true" />
          <div className="writing-groups" style={{ position: "relative", zIndex: 2 }}>
            {byCategory.map((group) => <WritingGroup key={group.label} group={group} />)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Writing;
