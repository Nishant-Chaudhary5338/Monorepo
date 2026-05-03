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
}

export const articleMeta: ArticleMeta[] = [
  {
    slug: "production-grade-ui-library-react-monorepo",
    title: "React Monorepo Component Library: How We Built @repo/ui",
    status: "published",
    date: "May 2026",
    readingTime: "9 min read",
    tags: ["react", "typescript", "monorepo", "component-library", "design-system"],
    description: "45 components, 79 test files, 4 apps. How we replaced shadcn copy-paste chaos with @repo/ui — a typed, accessible, AI-native React library powering 12 product teams.",
    coverImage: "https://images.unsplash.com/photo-1558655146-d09347e92766?fm=jpg&q=80&w=1200&h=630&fit=crop",
    coverImageAlt: "iMac monitor displaying a design system with component library panels open",
  },
  {
    slug: "headless-dashboard-library",
    title: "How We Built a Production-Grade Headless Dashboard Library for a React Monorepo",
    status: "published",
    date: "May 2026",
    readingTime: "8 min read",
    tags: ["react", "typescript", "monorepo", "dashboard", "frontend"],
    description: "11 widgets, 17 test files, 4 apps. How we replaced per-team dashboard chaos with @repo/dashcraft — a headless, typed, AI-native React library powering 12 product teams.",
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?fm=jpg&q=80&w=1200&h=630&fit=crop",
    coverImageAlt: "Dark analytics dashboard with multiple data visualisation panels",
  },
  {
    slug: "plugin-onboarding-vite-module-federation",
    title: "Plugin onboarding in under 60 seconds: notes from building a Vite Module Federation platform",
    status: "published",
    date: "May 2026",
    readingTime: "14 min read",
    tags: ["micro-frontends", "vite", "module-federation", "frontend-platform", "architecture"],
    description: "How I built a shell, four plugin remotes, a registry service, and a DevTools scaffolder. The registry trick, the shared-dependency war, and the chunk-hash technique that proves exactly which routes any given change affects.",
    coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?fm=jpg&q=80&w=1200&h=630&fit=crop",
    coverImageAlt: "Two monitors displaying React source code in VS Code",
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
];

export async function loadArticle(slug: string): Promise<string | null> {
  try {
    const mod = await import(`./${slug}.md?raw`);
    return mod.default as string;
  } catch {
    return null;
  }
}
