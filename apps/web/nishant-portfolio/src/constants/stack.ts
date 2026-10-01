export interface StackGroup {
  category: string;
  items: string[];
}

export const stackGroups: StackGroup[] = [
  {
    category: "Product UI",
    items: ["React 19", "TypeScript (strict)", "Next.js App Router", "Vite", "React Hook Form + Zod", "RTK Query", "Zustand", "React Router"],
  },
  {
    category: "UX and quality",
    items: ["WCAG 2.2 AA", "Core Web Vitals", "Tailwind CSS v4", "Radix UI", "Storybook", "GSAP", "Vitest + Testing Library", "Playwright"],
  },
  {
    category: "Platform",
    items: ["Module Federation", "Turborepo + pnpm", "Node.js / Express", "GitHub Actions", "Docker"],
  },
  {
    category: "AI tooling",
    items: ["MCP servers", "Claude Code", "AST indexing (ts-morph)", "LLM evaluation"],
  },
];
