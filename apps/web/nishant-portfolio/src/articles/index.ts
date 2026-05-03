export interface ArticleMeta {
  slug: string;
  title: string;
  status: "published" | "draft";
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
    slug: "production-grade-ui-library-react-monorepo",
    title: "Building shared-packages/ui: The Shared React Component Library for Our Monorepo",
    status: "published",
    date: "May 2026",
    readingTime: "9 min read",
    tags: ["react", "typescript", "monorepo", "component-library", "design-system"],
    description: "45 components, built solo with no designer. How I created the shared UI foundation every team adopts when joining our React monorepo — typed, accessible, AI-native.",
    coverImage: "https://images.unsplash.com/photo-1558655146-d09347e92766?fm=jpg&q=80&w=1200&h=630&fit=crop",
    coverImageAlt: "iMac monitor displaying a design system with component library panels open",
    demoUrl: "https://modern-ui-storybook.netlify.app/",
    demoLabel: "View Storybook →",
    repoUrl: "https://github.com/Nishant-Chaudhary5338/modern-ui",
  },
  {
    slug: "headless-dashboard-library",
    title: "interactive-dashboard-library: The Headless Dashboard Framework I Built for Our React Monorepo",
    status: "published",
    date: "May 2026",
    readingTime: "8 min read",
    tags: ["react", "typescript", "dashboard", "zustand", "headless-ui"],
    description: "Plain static dashboards everywhere. I built a headless framework — drag, drop, resize, real-time config, responsive widget views. Now used in monitoring, analytics, and customer-facing apps.",
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?fm=jpg&q=80&w=1200&h=630&fit=crop",
    coverImageAlt: "Dark analytics dashboard with multiple data visualisation panels",
  },
  {
    slug: "plugin-onboarding-vite-module-federation",
    title: "Plugin onboarding in under 60 seconds: building a Vite Module Federation platform",
    status: "published",
    date: "May 2026",
    readingTime: "14 min read",
    tags: ["micro-frontends", "vite", "module-federation", "frontend-platform", "architecture"],
    description: "Shell, four plugin remotes, a runtime registry, and chunk-hash isolation that proves exactly which routes a change affects — so you only regression-test what actually changed.",
    coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?fm=jpg&q=80&w=1200&h=630&fit=crop",
    coverImageAlt: "Two monitors displaying React source code in VS Code",
    repoUrl: "https://github.com/Nishant-Chaudhary5338/mfe-poc",
  },
  {
    slug: "turborepo-cache-invalidation-patterns",
    title: "Turborepo at team scale: cache invalidation patterns I wish I'd known",
    status: "published",
    date: "May 2026",
    readingTime: "6 min read",
    tags: ["turborepo", "monorepo", "react", "build-systems", "developer-experience"],
    description: "What happens when a shared package changes and twelve apps need to rebuild — and only some of them should. The mental model for Turbo's task graph that makes cache invalidation predictable.",
    coverImage: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?fm=jpg&q=80&w=1200&h=630&fit=crop",
    coverImageAlt: "Terminal showing build output and dependency graph",
  },
  {
    slug: "one-protocol-two-surfaces",
    title: "One protocol, two surfaces: building a frontend MCP toolkit",
    status: "published",
    date: "May 2026",
    readingTime: "14 min read",
    tags: ["mcp", "model-context-protocol", "cline", "frontend-platform", "ai-tooling", "developer-experience"],
    description: "~30 MCP server packages, 60+ tools, 27 CLI wrappers. The insight nobody told me: MCP is just JSON-RPC — the same server that powers Cline also powers your parallel automation pipeline. One protocol, two clients.",
    coverImage: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?fm=jpg&q=80&w=1200&h=630&fit=crop",
    coverImageAlt: "Abstract network connections representing protocol communication",
  },
  {
    slug: "ai-dev-platform-mfe-adoption",
    title: "The AI dev platform that made a complex architecture change accessible to every engineer",
    status: "published",
    date: "May 2026",
    readingTime: "10 min read",
    tags: ["developer-experience", "ai-tooling", "mcp", "micro-frontends", "platform-engineering"],
    description: "The architecture was built. The adoption problem remained. A GUI over MCP tools and Express APIs — any engineer, frontend or not, could create, build, test, and deploy plugins without touching a terminal.",
    coverImage: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?fm=jpg&q=80&w=1200&h=630&fit=crop",
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
