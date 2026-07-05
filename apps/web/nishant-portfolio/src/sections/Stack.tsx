import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { AnimatedTitle } from "../components/AnimatedTitle";

const ACCENTS = ["--accent-purple", "--accent-gold", "--accent-cyan", "--accent-rose"] as const;
const PILL_CLASS = ["pill-purple", "pill-gold", "pill-cyan", "pill-rose", "pill-lime"] as const;

interface StackGroup {
  category: string;
  blurb: string;
  items: string[];
}

const stackGroups: StackGroup[] = [
  { category: "React & TypeScript", blurb: "The daily-driver layer — product UI, forms, and state.", items: [
    "React 19", "TypeScript (strict)", "Next.js (App Router)", "Vite",
    "React Hook Form + Zod", "RTK Query", "Zustand", "React Router",
  ] },
  { category: "Interface & UX", blurb: "Where craft shows — accessible, motion-considered, on-brand.", items: [
    "Accessibility (WCAG 2.1 AA)", "Design Systems", "Storybook", "Radix UI",
    "Tailwind CSS v4", "GSAP / Motion", "Three.js / R3F", "Figma Handoff",
  ] },
  { category: "Architecture", blurb: "How the platform scales past one team, one app.", items: [
    "Micro-frontends", "Module Federation", "Turborepo", "pnpm Workspaces",
    "Node.js / Express", "CI/CD Pipelines",
  ] },
  { category: "AI & Tooling", blurb: "The differentiator — automating the 60–70% that's repetitive.", items: [
    "Claude", "MCP Servers", "Code Indexing (AST)", "AI-assisted Dev",
    "Agentic Workflows", "Custom CLI Tooling", "Claude Code", "Cline",
  ] },
];

// Shared, stable handler — finds the spot element via currentTarget rather
// than a ref, so it can be reused across cards without passing refs through
// functions at render time.
const onGlowMove = (e: React.MouseEvent<HTMLDivElement>): void => {
  const rect = e.currentTarget.getBoundingClientRect();
  const spot = e.currentTarget.querySelector<HTMLDivElement>(".glow-card__spot");
  if (!spot) return;
  spot.style.setProperty("--gx", `${e.clientX - rect.left}px`);
  spot.style.setProperty("--gy", `${e.clientY - rect.top}px`);
};

const Stack = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".skills-tab",
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.06, duration: 0.5, ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Fade the tile panel out on tab change, then bring the new pills in
  // with a per-pill stagger (transform/opacity only) rather than one flat
  // fade — guarded so a fast double-click can't stack overlapping tweens.
  const onSelect = (i: number): void => {
    if (i === active || !panelRef.current) { setActive(i); return; }
    const panel = panelRef.current;
    gsap.to(panel, {
      opacity: 0, y: 6, duration: 0.15, ease: "power2.in",
      onComplete: () => {
        setActive(i);
        requestAnimationFrame(() => {
          gsap.set(panel, { opacity: 1, y: 0 });
          gsap.fromTo(panel.querySelectorAll(".skill-pill"),
            { opacity: 0, y: 10, scale: 0.9 },
            { opacity: 1, y: 0, scale: 1, stagger: 0.035, duration: 0.35, ease: "power2.out" }
          );
        });
      },
    });
  };

  const activeGroup = stackGroups[active];
  const activeAccent = ACCENTS[active % ACCENTS.length];

  return (
    <section id="skills" ref={sectionRef} className="section">
      <div className="section-wrap">
        <div className="section-glow" style={{ "--section-glow-color": "var(--accent-gold)", "--section-glow-color-2": "var(--accent-purple)" } as React.CSSProperties}>
          <p className="section-label">
            <span className="section-label-num">04</span> — STACK
          </p>
          <AnimatedTitle title="What I build with" style={{ marginTop: "var(--space-sm)", marginBottom: "var(--space-lg)" }} />
        </div>

        <div
          className="product-card glow-card"
          onMouseMove={onGlowMove}
          style={{ "--card-accent": `var(${activeAccent})` } as React.CSSProperties}
        >
          <div className="glow-card__spot" style={{ "--glow-color": `var(${activeAccent})` } as React.CSSProperties} aria-hidden="true" />

          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "2.5rem", alignItems: "start" }}>
            <span className="stack-count" style={{ color: `var(${activeAccent})` }}>
              {String(activeGroup.items.length).padStart(2, "0")}
            </span>

            <div>
              <div className="skills-tabs" role="tablist" aria-label="Stack categories">
                {stackGroups.map((group, i) => {
                  const accent = ACCENTS[i % ACCENTS.length];
                  const isActive = i === active;
                  return (
                    <button
                      key={group.category}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      className={`skills-tab${isActive ? " active" : ""}`}
                      onClick={() => onSelect(i)}
                      style={isActive ? { background: `var(${accent})`, borderColor: `var(${accent})` } : undefined}
                    >
                      {group.category}
                    </button>
                  );
                })}
              </div>

              <div ref={panelRef}>
                <p className="stack-blurb" style={{ color: `var(${activeAccent})` }}>{activeGroup.blurb}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
                  {activeGroup.items.map((item, i) => (
                    <span key={item} className={`skill-pill ${PILL_CLASS[i % PILL_CLASS.length]}`}>
                      <span className="skill-pill__dot" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stack;
