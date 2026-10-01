import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import type { Plugin } from "vite";

const slugsIn = (dir: string): string[] =>
  readdirSync(resolve(__dirname, dir))
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));

const sitemap = (base: string): string => {
  const paths = [
    "/",
    ...slugsIn("src/articles").map((s) => `/writing/${s}`),
    ...slugsIn("src/case-studies").map((s) => `/work/${s}`),
  ];
  const urls = paths.map((p) => `  <url><loc>${base}${p}</loc></url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
};

// Canonical, Open Graph and sitemap URLs must be absolute, and the domain is
// chosen per deploy (VITE_SITE_URL). When it is unset the build drops those
// tags instead of advertising a domain that doesn't resolve.
export function siteMeta(siteUrl: string | undefined): Plugin {
  const base = siteUrl?.replace(/\/$/, "");
  return {
    name: "site-meta",
    transformIndexHtml: {
      order: "pre",
      handler: (html) =>
        base
          ? html.replaceAll("%SITE_URL%", base)
          : html.split("\n").filter((line) => !line.includes("%SITE_URL%")).join("\n"),
    },
    buildStart() {
      if (!base) this.warn("VITE_SITE_URL is not set: canonical, og:url, og:image and sitemap are omitted.");
    },
    generateBundle() {
      const robots = ["User-agent: *", "Allow: /"];
      if (base) {
        robots.push("", `Sitemap: ${base}/sitemap.xml`);
        this.emitFile({ type: "asset", fileName: "sitemap.xml", source: sitemap(base) });
      }
      this.emitFile({ type: "asset", fileName: "robots.txt", source: `${robots.join("\n")}\n` });
    },
  };
}
