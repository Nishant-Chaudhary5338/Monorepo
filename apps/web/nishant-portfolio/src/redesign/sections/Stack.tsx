import type { ReactElement } from "react";
import { AnimatedTitle } from "../AnimatedTitle";

const GROUPS = [
  { label: "React & TypeScript", items: ["React", "TypeScript", "Next.js", "React Hook Form + Zod"] },
  { label: "Interface & UX", items: ["Accessibility (WCAG)", "Design Systems", "Storybook", "GSAP / Motion"] },
  { label: "Architecture", items: ["Micro-frontends", "Module Federation", "Turborepo"] },
  { label: "AI & Tooling", items: ["MCP Servers", "Code Indexing (AST)", "AI-assisted Dev", "CI/CD"] },
] as const;

export function Stack(): ReactElement {
  return (
    <section id="stack" data-morph="3" className="mx-section">
      <header className="mx-shead">
        <AnimatedTitle as="h2" className="mx-h2" text="Stack" />
        <span className="mx-shead__c">[ what I build with ]</span>
      </header>

      <div className="mx-stack">
        {GROUPS.map((g) => (
          <div key={g.label} className="mx-stack__group" data-reveal>
            <div className="mx-stack__label">{g.label}</div>
            <ul>
              {g.items.map((it) => <li key={it}>{it}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
