import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { AnimatedTitle } from "../components/AnimatedTitle";
import { useIsMobile } from "../hooks/useIsMobile";
import { proofDrift } from "../motion";

type Topic = "purple" | "rose" | "lime" | "cyan" | "gold";

interface StackGroup {
  category: string;
  blurb: string;
  topic: Topic; // topic colours are shared with the Writing categories
  items: string[];
}

const stackGroups: StackGroup[] = [
  { category: "React & TypeScript", topic: "purple", blurb: "The daily-driver layer: product UI, forms and state.", items: [
    "React 19", "TypeScript (strict)", "Next.js (App Router)", "Vite",
    "React Hook Form + Zod", "RTK Query", "Zustand", "React Router",
  ] },
  { category: "Interface & UX", topic: "rose", blurb: "Where craft shows: accessible, motion-considered, on-brand.", items: [
    "Accessibility (WCAG 2.2 AA)", "Design Systems", "Storybook", "Radix UI",
    "Tailwind CSS v4", "GSAP / Motion", "Three.js / R3F", "Figma Handoff",
  ] },
  { category: "Architecture", topic: "lime", blurb: "How the platform scales past one team and one app.", items: [
    "Micro-frontends", "Module Federation", "Turborepo", "pnpm Workspaces",
    "Node.js / Express", "CI/CD Pipelines",
  ] },
  { category: "AI & Tooling", topic: "cyan", blurb: "Automating the 60 to 70% of frontend work that's repetitive.", items: [
    "Claude", "MCP Servers", "Code Indexing (AST)", "AI-assisted Dev",
    "Agentic Workflows", "Custom CLI Tooling", "Claude Code", "LLM Evaluation",
  ] },
  { category: "AI Evaluation", topic: "gold", blurb: "Tasks, rubrics and verifiers that tell you what a frontier model can really do.", items: [
    "Benchmark Task Authoring", "Rubric & Grader Design", "Verifier Hardening", "Reward-hack Testing",
    "pass@k Analysis", "Trajectory Failure Analysis", "Red-teaming", "Python · pytest · Docker",
  ] },
];

const onGlowMove = (e: React.MouseEvent<HTMLDivElement>): void => {
  const rect = e.currentTarget.getBoundingClientRect();
  const spot = e.currentTarget.querySelector<HTMLDivElement>(".glow-card__spot");
  if (!spot) return;
  spot.style.setProperty("--gx", `${e.clientX - rect.left}px`);
  spot.style.setProperty("--gy", `${e.clientY - rect.top}px`);
};

const BandHead = ({ group }: { group: StackGroup }) => (
  <>
    <span className="stack-band__name"><span className="stack-band__dot" />{group.category}</span>
    <span className="stack-band__blurb">{group.blurb}</span>
  </>
);

const Pills = ({ group, id }: { group: StackGroup; id?: string }) => (
  <div id={id} className="stack-band__pills">
    {group.items.map((item) => (
      <span key={item} className={`skill-pill pill-${group.topic}`}>
        <span className="skill-pill__dot" />
        {item}
      </span>
    ))}
  </div>
);

const Stack = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  const [open, setOpen] = useState<string>(stackGroups[0].category);

  useEffect(() => {
    const ctx = gsap.context(() => {
      proofDrift(".stack-band", { trigger: ".stack-bands", stagger: 0.1 });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="skills" ref={sectionRef} className="section">
      <div className="section-wrap">
        <div className="section-glow" style={{ "--section-glow-color": "var(--accent-purple)", "--section-glow-color-2": "var(--accent-cyan)" } as React.CSSProperties}>
          <p className="section-label">
            <span className="section-label-num">04</span> — STACK
          </p>
          <AnimatedTitle title="What I build with" style={{ marginTop: "var(--space-sm)", marginBottom: "var(--space-lg)" }} />
        </div>

        <div className="product-card glow-card" onMouseMove={onGlowMove} style={{ "--card-accent": "var(--accent-ui)" } as React.CSSProperties}>
          <div className="glow-card__spot" style={{ "--glow-color": "var(--accent-ui)" } as React.CSSProperties} aria-hidden="true" />
          <div className="stack-bands" style={{ position: "relative", zIndex: 2 }}>
            {stackGroups.map((group) => {
              const style = { "--band-accent": `var(--accent-${group.topic})` } as React.CSSProperties;
              if (!isMobile) {
                return (
                  <div key={group.category} className="stack-band" style={style}>
                    <div><BandHead group={group} /></div>
                    <Pills group={group} />
                  </div>
                );
              }
              const expanded = open === group.category;
              const panelId = `stack-${group.topic}`;
              return (
                <div key={group.category} className="stack-band" style={style}>
                  <button type="button" className="stack-band__toggle" aria-expanded={expanded} aria-controls={panelId}
                    onClick={() => setOpen(expanded ? "" : group.category)}>
                    <span><BandHead group={group} /></span>
                    <span className="stack-band__chevron" aria-hidden="true">+</span>
                  </button>
                  {expanded && <Pills group={group} id={panelId} />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stack;
