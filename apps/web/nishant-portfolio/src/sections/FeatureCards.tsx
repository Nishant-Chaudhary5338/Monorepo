import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TitleHeader from "../components/TitleHeader";

gsap.registerPlugin(ScrollTrigger);

interface CapabilityBlock {
  label: string;
  title: React.ReactNode;
  description: string;
  tags: string[];
}

const capabilities: CapabilityBlock[] = [
  {
    label: "Architecture",
    title: <>Plugin-based <em>micro-frontends</em> that don't get in your way.</>,
    description:
      "Replaced redeploy-per-feature with runtime feature injection on Vite Module Federation. Independent team deploys, sub-minute plugin onboarding, no shared release trains.",
    tags: ["Vite Module Federation", "Runtime composition", "Independent deploys", "Manifest-driven loading"],
  },
  {
    label: "DX & AI",
    title: <>Custom <em>MCP servers</em> that automate the work nobody wants to do.</>,
    description:
      "Internal frontend tooling on Turborepo + pnpm with bespoke Model Context Protocol servers. Scaffolding, code review, and test generation become one-line invocations — automating ~65% of routine frontend work.",
    tags: ["Model Context Protocol", "Cline · Claude Code", "Turborepo · pnpm", "Agentic workflows"],
  },
  {
    label: "Design Systems",
    title: <>Headless <em>UI libraries</em> that scale across product teams.</>,
    description:
      "Production-grade headless library powering dashboards across 6 product teams. Standardized drag-drop, dynamic resizing, and widget management — improving UX consistency and cross-team DX.",
    tags: ["Headless components", "Token-driven theming", "Storybook", "Visual regression"],
  },
  {
    label: "Leadership",
    title: <>Coaching teams into <em>AI-native</em> engineering.</>,
    description:
      "Trained 30+ engineers across 5 teams at Samsung R&D on Cline, custom MCP tooling, and agentic frontend workflows. Code-review standards, engineering guidelines, and release infrastructure across a team of 5.",
    tags: ["Engineering standards", "CI/CD on GitHub Actions", "Docker · AWS", "Cross-team enablement"],
  },
];

const FeatureCards = () => {
  const blockRefs = useRef<(HTMLElement | null)[]>([]);

  useGSAP(() => {
    blockRefs.current.forEach((block) => {
      if (!block) return;
      gsap.fromTo(
        block,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: block,
            start: "top 80%",
          },
        }
      );
    });
  }, []);

  return (
    <section id="wired-for" className="px-5 md:px-20 py-20 md:py-32">
      <TitleHeader
        num="01"
        label="What I'm wired for"
        title={<>Four problems I keep <em>solving.</em></>}
        className="mb-10 md:mb-12"
      />

      <div className="ruled-top">
        {capabilities.map((cap, index) => (
          <article
            key={cap.label}
            ref={(el) => { blockRefs.current[index] = el; }}
            className="cap-block"
          >
            <div className="mono-label pt-1">{cap.label}</div>
            <div>
              <h3
                className="display-headline mb-4"
                style={{ fontSize: "clamp(1.5rem, 2.4vw, 2rem)", lineHeight: 1.15 }}
              >
                {cap.title}
              </h3>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.65, maxWidth: "60ch" }}>
                {cap.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-5">
                {cap.tags.map((tag) => (
                  <span key={tag} className="editorial-tag">{tag}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default FeatureCards;
