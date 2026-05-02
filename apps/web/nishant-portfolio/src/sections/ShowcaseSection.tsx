import { useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TitleHeader from "../components/TitleHeader";

gsap.registerPlugin(ScrollTrigger);

interface CaseStudy {
  num: string;
  meta: string;
  title: React.ReactNode;
  description: string;
  metrics: string[];
  tags: string[];
  link?: string;
  linkLabel?: string;
  caseStudyLink?: string;
}

const caseStudies: CaseStudy[] = [
  {
    num: "01",
    meta: "2024 — Present · Samsung Electronics",
    title: <>TVPlus <em>TestSuite</em> — QA automation at production scale</>,
    description:
      "Lead architecture for Samsung's content-QA platform for Linear channels and VOD. Plugin-based MFE on Vite Module Federation, runtime feature injection, custom MCP servers automating ~65% of routine frontend work.",
    metrics: ["98.5% pilot accuracy", "↓100% manual QA effort", "Global QA teams", "4 platforms expanding to"],
    tags: ["React", "Vite Module Federation", "TypeScript", "MCP Tools", "HLS.js"],
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
    title: <>Shared <em>UI Library</em> — 45 components, zero forks</>,
    description:
      "45-component React library on Radix UI + Tailwind CSS v4 serving ~12 product teams. Custom 12-step design token system, type-safe variants via CVA, TanStack Table v8, dual ESM/CJS output. 79 test files, 47 Storybook stories, auto-doc from JSDoc.",
    metrics: ["45 components shipped", "79 test files", "47 Storybook stories", "~12 teams, 0 forks"],
    tags: ["React 19", "Radix UI", "Tailwind CSS v4", "CVA", "TanStack Table"],
    link: "https://fluffy-churros-b798ad.netlify.app/?path=/docs/components-button--docs",
    linkLabel: "Live Storybook ↗",
    caseStudyLink: "/work/ui-component-library",
  },
  {
    num: "04",
    meta: "2024 — Present · Samsung Electronics",
    title: <>AI-driven <em>MCP tooling</em> — 3× faster engineering</>,
    description:
      "~30 MCP server packages, 60+ registered tools, plus a plugin-aware server for the MFE platform. CLI wrappers for all 27 tools. Same servers power Cline AI and the team's parallel automation pipeline. Trained 30+ engineers across 5 R&D teams.",
    metrics: ["~65% routine work automated", "3× dev speed boost", "30+ engineers trained", "27 CLI wrappers built"],
    tags: ["Turborepo", "Model Context Protocol", "Claude Code", "pnpm", "GitHub Actions"],
  },
  {
    num: "05",
    meta: "2023 — 2024 · Safex Chemicals",
    title: <>Golden Farms — B2B <em>e-commerce</em> for 15K+ distributors</>,
    description:
      "Built the engineering side of India's live agricultural B2B platform on Play Store & App Store. Digital ordering, KYC onboarding, bilingual UI, and an admin ops portal — serving 15K+ distributors across India.",
    metrics: ["15K+ active distributors", "80% fewer manual order calls", "Live on Play & App Store", "4.2★ rating"],
    tags: ["React", "Node.js", "Firebase", "Azure AD", "OAuth 2.0"],
    link: "https://play.google.com/store/apps/details?id=com.safexchemicals.goldenfarms",
    linkLabel: "Play Store ↗",
  },
  {
    num: "06",
    meta: "2023 — 2024 · Safex Chemicals",
    title: <>SAP integration + <em>LMS</em> for enterprise operations</>,
    description:
      "Consolidated three legacy systems into one React/Node interface. SAP web interface with Azure AD MSAL and JWT-based RBAC across 6 roles. LMS with Firebase video streaming onboarding 1,500+ employees.",
    metrics: ["500+ daily users", "↓70% notification tracking time", "9 courses digitised", "6 RBAC roles"],
    tags: ["React", "SAP Cloud Platform", "Azure AD MSAL", "Firebase", "Express"],
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
          scrollTrigger: { trigger: row, start: "top 85%" },
        }
      );
    });
  }, []);

  return (
    <section id="work" className="px-5 md:px-20 py-20 md:py-32">
      <TitleHeader
        num="02"
        label="Selected work"
        title={<>Things I've <em>shipped.</em></>}
        className="mb-10 md:mb-12"
      />

      <div className="ruled-top">
        {caseStudies.map((cs, index) => (
          <div
            key={cs.num}
            ref={(el) => { rowRefs.current[index] = el; }}
            style={{ borderBottom: "1px solid var(--rule)", padding: "2.2rem 0" }}
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-5 flex-wrap">
                <span className="section-eyebrow" style={{ color: "var(--accent-warm)", fontSize: "0.82rem" }}>
                  {cs.num}
                </span>
                <span className="mono-label" style={{ color: "var(--text-muted)", fontSize: "0.74rem" }}>
                  {cs.meta}
                </span>
              </div>
              {cs.link && (
                <a
                  href={cs.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.72rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "var(--accent-warm)",
                    textDecoration: "none",
                    borderBottom: "1px solid var(--accent-warm)",
                    paddingBottom: "1px",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {cs.linkLabel}
                </a>
              )}
            </div>

            <div
              className="display-headline mb-5"
              style={{ fontSize: "clamp(1.5rem, 2.6vw, 2.1rem)", lineHeight: 1.15 }}
            >
              {cs.title}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              <div className="xl:col-span-7">
                <p style={{ color: "var(--text-secondary)", fontSize: "0.97rem", lineHeight: 1.65, maxWidth: "64ch" }}>
                  {cs.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {cs.tags.map((tag) => (
                    <span key={tag} className="editorial-tag">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="xl:col-span-5 flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-2">
                  {cs.metrics.map((metric) => (
                    <div
                      key={metric}
                      style={{
                        padding: "0.75rem 1rem",
                        background: "var(--bg-secondary)",
                        borderLeft: "2px solid var(--accent-warm)",
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.76rem",
                        color: "var(--text-secondary)",
                        lineHeight: 1.4,
                      }}
                    >
                      {metric}
                    </div>
                  ))}
                </div>
                {cs.caseStudyLink && (
                  <Link
                    to={cs.caseStudyLink}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.76rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: "var(--accent-warm)",
                      textDecoration: "none",
                      borderBottom: "1px solid var(--accent-warm)",
                      paddingBottom: "1px",
                      alignSelf: "flex-start",
                      marginTop: "0.5rem",
                      transition: "opacity 0.2s",
                    }}
                  >
                    Read case study →
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ShowcaseSection;
