export interface ArticleMeta {
  slug: string;
  title: string;
  status: "published" | "draft";
  date: string;
  readingTime: string;
  tags: string[];
  description: string;
}

export const articleMeta: ArticleMeta[] = [
  {
    slug: "plugin-onboarding-vite-module-federation",
    title: "Plugin onboarding in under 60 seconds: notes from building a Vite Module Federation platform",
    status: "published",
    date: "May 2026",
    readingTime: "14 min read",
    tags: ["micro-frontends", "vite", "module-federation", "frontend-platform", "architecture"],
    description: "How I built a shell, four plugin remotes, a registry service, and a DevTools scaffolder. The registry trick, the shared-dependency war, and the chunk-hash technique that proves exactly which routes any given change affects.",
  },
  {
    slug: "one-protocol-two-surfaces",
    title: "One protocol, two surfaces: building a frontend MCP toolkit",
    status: "draft",
    date: "May 2026",
    readingTime: "14 min read",
    tags: ["mcp", "model-context-protocol", "cline", "frontend-platform", "ai-tooling", "developer-experience"],
    description: "~30 MCP server packages, 60+ tools, 27 CLI wrappers. The insight nobody told me: MCP is just JSON-RPC — the same server that powers Cline also powers your parallel automation pipeline. One protocol, two clients.",
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
