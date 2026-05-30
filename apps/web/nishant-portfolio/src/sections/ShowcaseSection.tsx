import { useState, useRef } from "react";
import gsap from "gsap";
import { Link } from "react-router-dom";

interface Project {
  num: string;
  shortTitle: string;
  meta: string;
  titleHTML: string;
  description: string;
  metrics: Array<{ v: string; l: string }>;
  tags: string[];
  liveLink?: string;
  liveLinkLabel?: string;
  caseStudyLink?: string;
}

const PROJECTS: Project[] = [
  {
    num: "01",
    shortTitle: "Shared UI Library",
    meta: "2024 — Present · Samsung Electronics",
    titleHTML: "Shared <em>UI Library</em> — 45 components, zero forks",
    description:
      "45-component React library on Radix UI + Tailwind CSS v4 serving ~12 product teams. Custom 12-step design token system, type-safe variants via CVA, TanStack Table v8, dual ESM/CJS output. 79 test files, 47 Storybook stories, auto-doc from JSDoc.",
    metrics: [
      { v: "45",  l: "components shipped" },
      { v: "79",  l: "test files" },
      { v: "47",  l: "Storybook stories" },
      { v: "~12", l: "teams · 0 forks" },
    ],
    tags: ["React 19", "Radix UI", "Tailwind CSS v4", "CVA", "TypeScript strict"],
    liveLink: "https://fluffy-churros-b798ad.netlify.app/?path=/docs/components-button--docs",
    liveLinkLabel: "Live Storybook ↗",
    caseStudyLink: "/work/ui-component-library",
  },
  {
    num: "02",
    shortTitle: "Dashboard Library",
    meta: "2024 — Present · Samsung Electronics",
    titleHTML: "Headless <em>Dashboard Library</em> — the substrate every team builds on",
    description:
      "Solo-built headless composition framework handling layout, drag-drop, resize, widget registration, persistence, polling, and widget-to-widget events. 11 built-in widgets. Teams register custom widgets and get DnD, settings panels, and persistence for free.",
    metrics: [
      { v: "11",    l: "built-in widgets" },
      { v: "4",     l: "apps in production" },
      { v: "~12",   l: "product teams" },
      { v: "9,026", l: "lines TypeScript" },
    ],
    tags: ["React 19", "Zustand", "dnd-kit", "Framer Motion", "Recharts · Nivo"],
    caseStudyLink: "/work/headless-dashboard-library",
  },
  {
    num: "03",
    shortTitle: "AI Dev Platform",
    meta: "2024 — Present · Samsung Electronics",
    titleHTML: "AI-assisted <em>dev platform</em> — scaffold, build, review, deploy",
    description:
      "End-to-end agentic frontend workflow: scaffolds a component from a web form, runs the quality pipeline, compares chunk hashes to decide testing scope, generates code, runs review, audit, and coordinates deployment. ~65% of routine work automated.",
    metrics: [
      { v: "~65%", l: "routine work automated" },
      { v: "3×",   l: "dev speed gain" },
      { v: "27",   l: "CLI wrappers" },
      { v: "30+",  l: "engineers trained" },
    ],
    tags: ["Model Context Protocol", "Claude Code", "Turborepo", "GitHub Actions", "TypeScript"],
  },
  {
    num: "04",
    shortTitle: "MCP Toolkit",
    meta: "2024 — Present · Samsung Electronics",
    titleHTML: "Custom <em>MCP toolkit</em> — 30 servers, 60+ tools, 2 surfaces",
    description:
      "~30 MCP server packages, 60+ registered tools, plus a plugin-aware server for the MFE platform. CLI wrappers for all 27 tools. The same servers that power Cline AI also power the team's parallel automation pipeline — one protocol, two clients.",
    metrics: [
      { v: "~30", l: "MCP server packages" },
      { v: "60+", l: "registered tools" },
      { v: "27",  l: "CLI wrappers" },
      { v: "2",   l: "surfaces (Cline + CI)" },
    ],
    tags: ["Model Context Protocol", "TypeScript", "Turborepo", "pnpm", "Cline"],
  },
];

function ProjectPane({ project }: { project: Project }) {
  return (
    <div style={{
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderTop: "none",
      padding: "32px",
    }}>
      {/* Meta row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ font: "var(--label)", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--accent-2)" }}>
            {project.num}
          </span>
          <span style={{ font: "var(--mono)", fontSize: 11.5, color: "var(--fg-dim)", letterSpacing: "0.04em" }}>
            {project.meta}
          </span>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          {project.liveLink && (
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mono-link"
            >
              {project.liveLinkLabel}
            </a>
          )}
          {project.caseStudyLink && (
            <Link to={project.caseStudyLink} className="mono-link" style={{ textDecoration: "none" }}>
              Read case study →
            </Link>
          )}
          {!project.liveLink && !project.caseStudyLink && (
            <a href="#contact" className="mono-link" style={{ textDecoration: "none" }}>
              Get in touch about this →
            </a>
          )}
        </div>
      </div>

      {/* Title + description + metrics */}
      <div className="project-pane-grid">
        <div>
          <h3
            style={{ font: "var(--h3)", letterSpacing: "-0.015em", marginBottom: 16 }}
            dangerouslySetInnerHTML={{ __html: project.titleHTML }}
          />
          <p style={{ font: "var(--p)", color: "var(--fg-2)", lineHeight: 1.65, marginBottom: 20 }}>
            {project.description}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {project.tags.map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        </div>

        {/* Metrics grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 1,
          background: "var(--border)",
          border: "1px solid var(--border)",
        }}>
          {project.metrics.map(({ v, l }) => (
            <div key={l} className="glass" style={{ padding: "16px" }}>
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: "clamp(1.2rem, 2vw, 1.6rem)",
                fontWeight: 600,
                letterSpacing: "-0.025em",
                color: "var(--data)",
                lineHeight: 1,
                marginBottom: 6,
              }}>
                {v}
              </div>
              <div style={{ font: "var(--mono)", fontSize: 10.5, color: "var(--fg-dim)", letterSpacing: "0.06em", lineHeight: 1.4 }}>
                {l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const ShowcaseSection = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const paneRef = useRef<HTMLDivElement>(null);

  const handleTabClick = (idx: number) => {
    if (idx === activeIdx) return;
    gsap.to(paneRef.current, {
      opacity: 0, y: 6, duration: 0.15, ease: "power2.in",
      onComplete: () => {
        setActiveIdx(idx);
        gsap.fromTo(
          paneRef.current,
          { opacity: 0, y: 6 },
          { opacity: 1, y: 0, duration: 0.22, ease: "power2.out" }
        );
      },
    });
  };

  return (
    <section id="work" style={{ paddingBlock: "var(--section-py)", borderTop: "1px solid var(--border)" }}>
      <div className="site-container">
        <div className="section-header">
          <div className="num">// 04 · Work</div>
          <h2>
            Things I've{" "}
            <span style={{ color: "var(--accent)", fontStyle: "italic" }}>built.</span>
          </h2>
          <div className="sub">Platform-scale projects at Samsung Electronics, 2024–present.</div>
        </div>

        {/* Tab bar */}
        <div className="project-tabs">
          {PROJECTS.map((p, i) => (
            <button
              key={p.num}
              className={`project-tab${activeIdx === i ? " active" : ""}`}
              onClick={() => handleTabClick(i)}
            >
              {p.num} · {p.shortTitle}
            </button>
          ))}
        </div>

        {/* Active project pane */}
        <div ref={paneRef}>
          <ProjectPane project={PROJECTS[activeIdx]} />
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 24,
          paddingTop: 18,
          borderTop: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          font: "var(--mono)", fontSize: 11.5, color: "var(--fg-dim)",
        }}>
          <span>{activeIdx + 1} of {PROJECTS.length}</span>
          <span style={{ letterSpacing: "0.04em" }}>Samsung Electronics · New Delhi, India</span>
        </div>
      </div>
    </section>
  );
};

export default ShowcaseSection;
