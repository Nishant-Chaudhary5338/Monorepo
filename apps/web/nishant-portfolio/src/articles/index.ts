export interface ArticleMeta {
  slug: string;
  title: string;
  status: "published" | "draft";
  topic: "AI tooling" | "Architecture" | "React" | "AI evaluation";
  date: string;
  readingTime: string;
  tags: string[];
  description: string;
  coverImageAlt: string;
  demoUrl?: string;
  demoLabel?: string;
  repoUrl?: string;
}

export const articleMeta: ArticleMeta[] = [
  {
    slug: "how-i-write-tasks-frontier-coding-agents-fail",
    title: "How I write tasks that frontier coding agents fail",
    status: "published",
    topic: "AI evaluation",
    date: "Oct 2026",
    readingTime: "6 min read",
    tags: ["llm-evaluation", "benchmarks", "coding-agents", "ai-training"],
    description: "An expert should be able to solve it and a strong model should fail it, for a real reason. What I have learned about fairness, difficulty and the shortcuts agents take, from writing evaluation tasks for frontier models.",
    coverImageAlt: "Branded cover for an article about writing fair, hard evaluation tasks for coding agents",
  },
  {
    slug: "grading-the-grader-rubrics-and-verifiers",
    title: "Grading the grader: rubrics and verifiers I can trust",
    status: "published",
    topic: "AI evaluation",
    date: "Oct 2026",
    readingTime: "6 min read",
    tags: ["llm-evaluation", "rubrics", "verifiers", "reward-hacking"],
    description: "A score is only as honest as the thing that produces it. How I write rubrics two graders agree on, build verifiers that are hard to game, and test the grader before trusting its numbers.",
    coverImageAlt: "Branded cover for an article about writing trustworthy rubrics and verifiers",
  },
  {
    slug: "on-device-ax-platform-modular-web-development",
    title: "The AX Platform: Modular, Scalable Web Development That Runs Entirely on Your Machine",
    status: "published",
    topic: "AI tooling",
    date: "Jul 2026",
    readingTime: "12 min read",
    tags: ["developer-experience", "platform-engineering", "mcp", "ai-tooling", "monorepo"],
    description: "Developers spend only 16% of the week writing code. I built an on-device platform, one core exposed over MCP, CLI and HTTP, that handles 60 to 70% of routine frontend work.",
    coverImageAlt: "Branded cover for the AX platform article, with a blueprint grid and a cyan glow",
    repoUrl: "https://github.com/Nishant-Chaudhary5338/mcp-toolkit",
  },
  {
    slug: "production-grade-ui-library-react-monorepo",
    title: "Building shared-packages/ui: The Shared React Component Library for Our Monorepo",
    status: "published",
    topic: "React",
    date: "May 2026",
    readingTime: "9 min read",
    tags: ["react", "typescript", "monorepo", "component-library", "design-system"],
    description: "45 components, built solo with no designer. How I made the shared UI foundation every team adopts when it joins our React monorepo: typed, accessible and documented for AI tools.",
    coverImageAlt: "Branded cover with a screenshot of the Storybook for the shared React component library",
    demoUrl: "https://modern-ui-storybook.netlify.app/",
    demoLabel: "View Storybook →",
    repoUrl: "https://github.com/Nishant-Chaudhary5338/modern-ui",
  },
  {
    slug: "headless-dashboard-library",
    title: "interactive-dashboard-library: The Headless Dashboard Framework I Built for Our React Monorepo",
    status: "published",
    topic: "React",
    date: "May 2026",
    readingTime: "8 min read",
    tags: ["react", "typescript", "dashboard", "zustand", "headless-ui"],
    description: "Every dashboard was static. I built a headless framework with drag, drop, resize, live config and responsive widget views. It now runs in monitoring, analytics and customer-facing apps.",
    coverImageAlt: "Branded cover with a screenshot of the dashcraft dashboard playground",
  },
  {
    slug: "plugin-onboarding-vite-module-federation",
    title: "Plugin onboarding in under 60 seconds: building a Vite Module Federation platform",
    status: "published",
    topic: "Architecture",
    date: "May 2026",
    readingTime: "14 min read",
    tags: ["micro-frontends", "vite", "module-federation", "frontend-platform", "architecture"],
    description: "A shell, four plugin remotes, a runtime registry, and chunk-hash isolation that shows exactly which routes a change affects, so you only regression-test what changed.",
    coverImageAlt: "Branded cover for the Vite Module Federation platform article, with a blueprint grid and a lime glow",
    repoUrl: "https://github.com/Nishant-Chaudhary5338/mfe-poc",
  },
  {
    slug: "turborepo-cache-invalidation-patterns",
    title: "Turborepo at team scale: cache invalidation patterns I wish I'd known",
    status: "published",
    topic: "Architecture",
    date: "May 2026",
    readingTime: "6 min read",
    tags: ["turborepo", "monorepo", "react", "build-systems", "developer-experience"],
    description: "What happens when a shared package changes and twelve apps need to rebuild, but only some should. A mental model for Turbo's task graph that makes cache invalidation predictable.",
    coverImageAlt: "Branded cover for the Turborepo cache invalidation article, with a blueprint grid and a lime glow",
  },
  {
    slug: "one-protocol-two-surfaces",
    title: "One protocol, two surfaces: building a frontend MCP toolkit",
    status: "published",
    topic: "AI tooling",
    date: "May 2026",
    readingTime: "14 min read",
    tags: ["mcp", "model-context-protocol", "cline", "frontend-platform", "ai-tooling", "developer-experience"],
    description: "Dozens of MCP servers and CLI wrappers from one codebase. MCP is just JSON-RPC, so the same server that powers Cline can also power a parallel automation pipeline.",
    coverImageAlt: "Branded cover for the MCP toolkit article, with a blueprint grid and a cyan glow",
  },
  {
    slug: "ai-dev-platform-mfe-adoption",
    title: "The AI dev platform that made a complex architecture change accessible to every engineer",
    status: "published",
    topic: "AI tooling",
    date: "May 2026",
    readingTime: "10 min read",
    tags: ["developer-experience", "ai-tooling", "mcp", "micro-frontends", "platform-engineering"],
    description: "The architecture was built; adoption was the problem. A GUI over MCP tools and Express APIs let any engineer create, build, test and deploy plugins without opening a terminal.",
    coverImageAlt: "Branded cover for the AI developer platform article, with a blueprint grid and a cyan glow",
    repoUrl: "https://github.com/Nishant-Chaudhary5338/mfe-poc",
  },
];
