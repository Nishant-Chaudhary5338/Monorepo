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
      "Replaced redeploy-per-feature cycles with runtime feature injection on Vite Module Federation. React 19 + TypeScript strict throughout — independent team deploys, sub-minute plugin onboarding, no shared release trains.",
    tags: ["React 19", "TypeScript strict", "Vite Module Federation", "Runtime composition"],
  },
  {
    label: "DX & AI",
    title: <>Custom <em>MCP servers</em> that automate the work nobody wants to do.</>,
    description:
      "Internal frontend tooling on Turborepo + pnpm with bespoke Model Context Protocol servers. Scaffolding, code review, and test generation become one-line invocations — automating ~65% of routine React + TypeScript work.",
    tags: ["Model Context Protocol", "Cline · Claude Code", "Turborepo · pnpm", "Agentic workflows"],
  },
  {
    label: "Design Systems",
    title: <>Typed, <em>accessible UI libraries</em> that scale across product teams.</>,
    description:
      "45-component React library on Radix UI + Tailwind CSS v4 + CVA serving 12 product teams with zero forks. Type-safe variants, 79 test files, 47 Storybook stories — drag-drop, resizable widgets, and real-time data out of the box.",
    tags: ["React 19", "Tailwind CSS v4", "TypeScript · CVA", "Radix UI", "Storybook"],
  },
  {
    label: "Leadership",
    title: <>Coaching teams into <em>AI-native</em> engineering.</>,
    description:
      "Trained 30+ engineers across 5 Samsung R&D teams on AI-native React/TypeScript workflows, custom MCP tooling, and Cline. Code-review standards, engineering guidelines, and release infrastructure across a team of 5.",
    tags: ["Engineering standards", "React · TypeScript mentoring", "CI/CD · GitHub Actions", "Cross-team enablement"],
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
            once: true,
          },
        }
      );
    });
  }, []);

  return (
    <section id="wired-for" style={{ paddingBlock: "var(--section-py)" }}>
      <div className="site-container">
      <TitleHeader
        num="02"
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
      </div>
    </section>
  );
};

export default FeatureCards;
