import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TitleHeader from "../components/TitleHeader";

gsap.registerPlugin(ScrollTrigger);

interface StackLayer {
  num: string;
  category: string;
  label: string;
  items: string[];
  accent?: boolean;
}

const stackLayers: StackLayer[] = [
  {
    num: "05",
    category: "AI & DX",
    label: "Top of stack",
    items: ["MCP Servers", "Claude Code", "Cline", "Cursor", "Agentic Workflows", "Custom Scaffolders"],
    accent: true,
  },
  {
    num: "04",
    category: "Platform",
    label: "Distribution layer",
    items: ["Vite Module Federation", "Turborepo", "pnpm workspaces", "Runtime plugin registry", "Design System tokens"],
  },
  {
    num: "03",
    category: "Application",
    label: "UI runtime",
    items: ["React 19", "TypeScript strict", "Next.js", "GSAP", "Three.js / R3F", "Framer Motion", "Tailwind CSS v4", "Radix UI · CVA"],
  },
  {
    num: "02",
    category: "State & Data",
    label: "Data layer",
    items: ["Zustand", "Redux Toolkit", "RTK Query", "REST", "GraphQL", "react-query"],
  },
  {
    num: "01",
    category: "Build · Test · Ops",
    label: "Foundation",
    items: ["Vite", "Vitest", "Playwright", "Storybook", "GitHub Actions", "Docker", "AWS · Vercel", "Azure AD · Firebase"],
  },
];

const TechStack = () => {
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out",
          scrollTrigger: { trigger: headerRef.current, start: "top 85%", once: true } }
      );
    }

    layerRefs.current.forEach((layer, i) => {
      if (!layer) return;
      gsap.fromTo(
        layer,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          delay: i * 0.07,
          ease: "power2.out",
          scrollTrigger: { trigger: layer, start: "top 88%", once: true },
        }
      );
    });
  }, []);

  return (
    <section id="skills" style={{ paddingBlock: "var(--section-py)" }}>
      <div className="site-container">
        <div ref={headerRef}>
          <TitleHeader
            num="01"
            label="Stack"
            title={<>How I think about <em>systems.</em></>}
            className="mb-10 md:mb-12"
          />
        </div>

        {/* Architecture layer diagram */}
        <div className="ruled-top">
          {stackLayers.map((layer, index) => (
            <div
              key={layer.category}
              ref={(el) => { layerRefs.current[index] = el; }}
              style={{
                display: "grid",
                gridTemplateColumns: "4rem minmax(10rem, 18rem) 1fr",
                gap: "clamp(1rem, 3vw, 2.5rem)",
                padding: "1.5rem 0",
                borderBottom: "1px solid var(--rule)",
                alignItems: "start",
              }}
            >
              {/* Layer number */}
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.72rem",
                  color: layer.accent ? "var(--accent-warm)" : "var(--text-muted)",
                  letterSpacing: "0.1em",
                  paddingTop: "0.15rem",
                }}
              >
                L{layer.num}
              </div>

              {/* Category + label */}
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.82rem",
                    fontWeight: 500,
                    color: layer.accent ? "var(--accent-warm)" : "var(--text-primary)",
                    letterSpacing: "0.04em",
                    marginBottom: "0.2rem",
                  }}
                >
                  {layer.category}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.68rem",
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  {layer.label}
                </div>
              </div>

              {/* Items */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem 0.55rem", alignItems: "center" }}>
                {layer.items.map((item, i) => (
                  <span key={item} style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.88rem",
                        color: layer.accent ? "var(--text-primary)" : "var(--text-secondary)",
                        lineHeight: 1.6,
                      }}
                    >
                      {item}
                    </span>
                    {i < layer.items.length - 1 && (
                      <span style={{ color: "var(--border-color)", fontSize: "0.7rem" }}>·</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Stack legend */}
        <div
          style={{
            marginTop: "2rem",
            display: "flex",
            alignItems: "center",
            gap: "2rem",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ width: "2rem", height: "1px", backgroundColor: "var(--rule)" }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              L01 – L04 · Production stack
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ width: "2rem", height: "1px", backgroundColor: "var(--accent-warm)" }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--accent-warm)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              L05 · AI-native layer
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
