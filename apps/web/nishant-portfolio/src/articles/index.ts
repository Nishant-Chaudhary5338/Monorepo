export interface ArticleMeta {
  slug: string;
  title: string;
  status: "published" | "draft";
  topic: "AI tooling" | "Architecture" | "React";
  date: string;
  readingTime: string;
  tags: string[];
  description: string;
  coverImage: string;
  coverImageAlt: string;
  demoUrl?: string;
  demoLabel?: string;
  repoUrl?: string;
}

export const articleMeta: ArticleMeta[] = [
  {
    slug: "on-device-ax-platform-modular-web-development",
    title: "The AX Platform: Modular, Scalable Web Development That Runs Entirely on Your Machine",
    status: "published",
    topic: "AI tooling",
    date: "Jul 2026",
    readingTime: "12 min read",
    tags: ["developer-experience", "platform-engineering", "mcp", "ai-tooling", "monorepo"],
    description: "Developers spend only 16% of the week writing code. I built an on-device platform, one core exposed over MCP, CLI and HTTP, that handles 60 to 70% of routine frontend work.",
    coverImage: "https://images.unsplash.com/photo-1759661990336-51bd4b951fea?fm=webp&q=80&w=1200&h=630&fit=crop",
    coverImageAlt: "A multi-monitor developer workstation glowing with code under neon light, evoking a local, on-device engineering platform",
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
    coverImage: "https://images.unsplash.com/photo-1558655146-d09347e92766?fm=webp&q=80&w=1200&h=630&fit=crop",
    coverImageAlt: "iMac monitor displaying a design system with component library panels open",
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
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?fm=webp&q=80&w=1200&h=630&fit=crop",
    coverImageAlt: "Dark analytics dashboard with multiple data visualisation panels",
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
    coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?fm=webp&q=80&w=1200&h=630&fit=crop",
    coverImageAlt: "Two monitors displaying React source code in VS Code",
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
    coverImage: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?fm=webp&q=80&w=1200&h=630&fit=crop",
    coverImageAlt: "Terminal showing build output and dependency graph",
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
    coverImage: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?fm=webp&q=80&w=1200&h=630&fit=crop",
    coverImageAlt: "Abstract network connections representing protocol communication",
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
    coverImage: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?fm=webp&q=80&w=1200&h=630&fit=crop",
    coverImageAlt: "Abstract AI neural network with glowing connections representing an intelligent developer platform",
    repoUrl: "https://github.com/Nishant-Chaudhary5338/mfe-poc",
  },
];

export async function loadArticle(slug: string): Promise<string | null> {
  try {
    const mod = await import(`./${slug}.md?raw`);
    return mod.default as string;
  } catch {
    return null;
  }
}
