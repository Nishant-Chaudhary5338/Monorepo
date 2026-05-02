import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TitleHeader from "../components/TitleHeader";

gsap.registerPlugin(ScrollTrigger);

interface StackGroup {
  category: string;
  items: string[];
}

const stackGroups: StackGroup[] = [
  {
    category: "Architecture & Platforms",
    items: ["Micro-frontends", "Vite Module Federation", "Monorepos", "Turborepo", "pnpm workspaces", "Design Systems", "MCP Tooling", "Agentic workflows"],
  },
  {
    category: "Languages & UI",
    items: ["TypeScript", "JavaScript (ES6+)", "React", "Next.js", "HTML5", "CSS3", "Tailwind CSS", "GSAP", "Three.js"],
  },
  {
    category: "State & Data",
    items: ["Redux Toolkit", "Zustand", "RTK Query", "REST", "GraphQL"],
  },
  {
    category: "Build, Test & DevOps",
    items: ["Vite", "Vitest", "Playwright", "Storybook", "GitHub Actions", "Docker", "Web Vitals"],
  },
  {
    category: "Cloud & Auth",
    items: ["AWS (EC2 · S3 · VPC)", "Vercel", "Azure AD (MSAL)", "OAuth 2.0", "JWT", "Firebase"],
  },
  {
    category: "AI-assisted Development",
    items: ["Cline", "Claude Code", "Cursor", "Custom MCP servers", "Agentic code generation"],
  },
];

const TechStack = () => {
  const groupRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    groupRefs.current.forEach((group, i) => {
      if (!group) return;
      gsap.fromTo(
        group,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: i * 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: group,
            start: "top 85%",
          },
        }
      );
    });
  }, []);

  return (
    <section id="skills" className="px-5 md:px-20 py-20 md:py-32">
      <TitleHeader
        num="04"
        label="Stack"
        title={<>Tools I reach for, <em>daily.</em></>}
        className="mb-10 md:mb-12"
      />

      <div className="stack-layout ruled-top pt-10">
        {/* Left column — intentionally sparse for editorial feel */}
        <div />

        {/* Right column — grouped stack */}
        <div>
          {stackGroups.map((group, index) => (
            <div
              key={group.category}
              ref={(el) => { groupRefs.current[index] = el; }}
              className="mb-8"
            >
              <h4 className="mono-label mb-3" style={{ color: "var(--text-muted)" }}>
                {group.category}
              </h4>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.92rem",
                  color: "var(--text-primary)",
                  lineHeight: 1.8,
                }}
              >
                {group.items.map((item, i) => (
                  <span key={item}>
                    {item}
                    {i < group.items.length - 1 && (
                      <span style={{ color: "var(--text-muted)", margin: "0 0.55rem" }}>·</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
