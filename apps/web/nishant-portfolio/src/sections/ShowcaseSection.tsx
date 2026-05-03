import { useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TitleHeader from "../components/TitleHeader";

gsap.registerPlugin(ScrollTrigger);

interface Project {
  num: string;
  meta: string;
  title: React.ReactNode;
  description: string;
  metrics: string[];
  tags: string[];
  liveLink?: string;
  liveLinkLabel?: string;
  githubLink?: string;
  caseStudyLink?: string;
}

const projects: Project[] = [
  {
    num: "01",
    meta: "2024 — Present · Samsung Electronics",
    title: <>Shared <em>UI Library</em> — 45 components, zero forks</>,
    description:
      "45-component React library on Radix UI + Tailwind CSS v4 serving ~12 product teams. Custom 12-step design token system, type-safe variants via CVA, TanStack Table v8, dual ESM/CJS output. 79 test files, 47 Storybook stories, auto-doc from JSDoc.",
    metrics: ["45 components shipped", "79 test files", "47 Storybook stories", "~12 teams · 0 forks"],
    tags: ["React 19", "Radix UI", "Tailwind CSS v4", "CVA", "TypeScript strict"],
    liveLink: "https://fluffy-churros-b798ad.netlify.app/?path=/docs/components-button--docs",
    liveLinkLabel: "Live Storybook ↗",
    caseStudyLink: "/work/ui-component-library",
  },
  {
    num: "02",
    meta: "2024 — Present · Samsung Electronics",
    title: <>Headless <em>Dashboard Library</em> — the substrate every team builds on</>,
    description:
      "Solo-built headless composition framework handling layout, drag-drop, resize, widget registration, persistence, polling, and widget-to-widget events. 11 built-in widgets. Teams register custom widgets and get DnD, settings panels, and persistence for free.",
    metrics: ["11 built-in widgets", "4 apps in production", "~12 product teams", "9,026 lines TypeScript"],
    tags: ["React 19", "Zustand", "dnd-kit", "Framer Motion", "Recharts · Nivo"],
    caseStudyLink: "/work/headless-dashboard-library",
  },
  {
    num: "03",
    meta: "2024 — Present · Samsung Electronics",
    title: <>AI-assisted <em>dev platform</em> — scaffold, build, review, deploy</>,
    description:
      "End-to-end agentic frontend workflow: scaffolds a component from a web form, runs the quality pipeline, compares chunk hashes to decide testing scope, generates code, runs review, audit, and coordinates deployment. ~65% of routine work automated.",
    metrics: ["~65% routine work automated", "3× dev speed", "27 CLI wrappers", "30+ engineers trained"],
    tags: ["Model Context Protocol", "Claude Code", "Turborepo", "GitHub Actions", "TypeScript"],
  },
  {
    num: "04",
    meta: "2024 — Present · Samsung Electronics",
    title: <>Custom <em>MCP toolkit</em> — 30 servers, 60+ tools, 2 surfaces</>,
    description:
      "~30 MCP server packages, 60+ registered tools, plus a plugin-aware server for the MFE platform. CLI wrappers for all 27 tools. The same servers that power Cline AI also power the team's parallel automation pipeline — one protocol, two clients.",
    metrics: ["~30 MCP server packages", "60+ registered tools", "27 CLI wrappers", "Cline + automation"],
    tags: ["Model Context Protocol", "TypeScript", "Turborepo", "pnpm", "Cline"],
  },
];

const ShowcaseSection = () => {
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    rowRefs.current.forEach((row) => {
      if (!row) return;
      gsap.fromTo(
        row,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: row, start: "top 85%", once: true },
        }
      );
    });
  }, []);

  return (
    <section id="work" style={{ paddingBlock: "var(--section-py)" }}>
      <div className="site-container">
        <TitleHeader
          num="02"
          label="Projects"
          title={<>Things I've <em>built.</em></>}
          className="mb-10 md:mb-12"
        />

        <div className="ruled-top">
          {projects.map((project, index) => (
            <div
              key={project.num}
              ref={(el) => { rowRefs.current[index] = el; }}
              style={{ borderBottom: "1px solid var(--rule)", padding: "2.2rem 0" }}
            >
              {/* Row header */}
              <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                <div className="flex items-center gap-5 flex-wrap">
                  <span className="section-eyebrow" style={{ color: "var(--accent-warm)", fontSize: "0.82rem" }}>
                    {project.num}
                  </span>
                  <span className="mono-label" style={{ color: "var(--text-muted)", fontSize: "0.74rem" }}>
                    {project.meta}
                  </span>
                </div>
                {/* External links */}
                <div className="flex items-center gap-4 shrink-0">
                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", textDecoration: "none", borderBottom: "1px solid var(--border-color)", paddingBottom: "1px", transition: "color 0.2s, border-color 0.2s", whiteSpace: "nowrap" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-primary)"; (e.currentTarget as HTMLAnchorElement).style.borderBottomColor = "var(--text-primary)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)"; (e.currentTarget as HTMLAnchorElement).style.borderBottomColor = "var(--border-color)"; }}
                    >
                      GitHub ↗
                    </a>
                  )}
                  {project.liveLink && (
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--accent-warm)", textDecoration: "none", borderBottom: "1px solid var(--accent-warm)", paddingBottom: "1px", whiteSpace: "nowrap" }}
                    >
                      {project.liveLinkLabel}
                    </a>
                  )}
                </div>
              </div>

              {/* Title */}
              <div
                className="display-headline mb-5"
                style={{ fontSize: "clamp(1.5rem, 2.6vw, 2.1rem)", lineHeight: 1.15 }}
              >
                {project.title}
              </div>

              {/* Description + metrics */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                <div className="xl:col-span-7">
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.97rem", lineHeight: 1.65, maxWidth: "64ch" }}>
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.tags.map((tag) => (
                      <span key={tag} className="editorial-tag">{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="xl:col-span-5 flex flex-col gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    {project.metrics.map((metric) => (
                      <div
                        key={metric}
                        style={{ padding: "0.75rem 1rem", background: "var(--bg-secondary)", borderLeft: "2px solid var(--accent-warm)", fontFamily: "var(--font-mono)", fontSize: "0.76rem", color: "var(--text-secondary)", lineHeight: 1.4 }}
                      >
                        {metric}
                      </div>
                    ))}
                  </div>
                  {project.caseStudyLink && (
                    <Link
                      to={project.caseStudyLink}
                      style={{ fontFamily: "var(--font-mono)", fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--accent-warm)", textDecoration: "none", borderBottom: "1px solid var(--accent-warm)", paddingBottom: "1px", alignSelf: "flex-start", marginTop: "0.5rem", transition: "opacity 0.2s" }}
                    >
                      Read case study →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShowcaseSection;
