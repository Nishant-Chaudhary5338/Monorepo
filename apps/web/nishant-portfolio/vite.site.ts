import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import type { Plugin, ResolvedConfig } from "vite";
import { articleMeta } from "./src/articles/index";
import { caseStudyMeta } from "./src/case-studies/index";
import { products } from "./src/constants/projects";

const AUTHOR = { "@type": "Person", name: "Nishant Chaudhary" };
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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

const escapeAttr = (value: string): string =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

const ldScript = (data: unknown): string =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;

// "May 2026" -> "2026-05-01"
const isoDate = (label: string): string => {
  const [month, year] = label.split(" ");
  return `${year}-${String(MONTHS.indexOf(month) + 1).padStart(2, "0")}-01`;
};

const setTag = (html: string, pattern: RegExp, tag: string): string =>
  pattern.test(html) ? html.replace(pattern, () => tag) : html.replace("</head>", () => `    ${tag}\n  </head>`);

const metaTag = (attr: "name" | "property", key: string, content: string): [RegExp, string] => [
  new RegExp(`<meta\\s+${attr}="${key}"[^>]*>`),
  `<meta ${attr}="${key}" content="${escapeAttr(content)}" />`,
];

interface RoutePage {
  path: string;
  title: string;
  description: string;
  image: string;
  jsonLd: (url: string | undefined, image: string | undefined) => unknown;
}

function routePages(): RoutePage[] {
  const articles = new Set(slugsIn("src/articles"));
  const cases = new Set(slugsIn("src/case-studies"));
  const writing = articleMeta
    .filter((a) => articles.has(a.slug))
    .map((a): RoutePage => ({
      path: `/writing/${a.slug}`,
      title: `${a.title} | Nishant Chaudhary`,
      description: a.description,
      image: `/og/${a.slug}.png`,
      jsonLd: (url, image) => ({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: a.title,
        description: a.description,
        datePublished: isoDate(a.date),
        author: AUTHOR,
        ...(image && { image }),
        ...(url && { mainEntityOfPage: url }),
      }),
    }));
  const work = caseStudyMeta
    .filter((c) => cases.has(c.slug))
    .map((c): RoutePage => ({
      path: `/work/${c.slug}`,
      title: `${c.title} case study | Nishant Chaudhary`,
      description: c.description,
      image: `/og/work-${c.slug}.png`,
      jsonLd: (url, image) => ({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: `${c.title} case study`,
        description: c.description,
        author: AUTHOR,
        ...(image && { image }),
        ...(url && { mainEntityOfPage: url }),
      }),
    }));
  return [...writing, ...work];
}

function routeHtml(template: string, page: RoutePage, base: string | undefined): string {
  const url = base && `${base}${page.path}`;
  const image = base && `${base}${page.image}`;
  const tags: [RegExp, string][] = [
    [/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(page.title)}</title>`],
    metaTag("name", "description", page.description),
    metaTag("property", "og:type", "article"),
    metaTag("property", "og:title", page.title),
    metaTag("property", "og:description", page.description),
    metaTag("name", "twitter:title", page.title),
    metaTag("name", "twitter:description", page.description),
    ...(url && image
      ? [
          [/<link\s+rel="canonical"[^>]*>/, `<link rel="canonical" href="${escapeAttr(url)}" />`] as [RegExp, string],
          metaTag("property", "og:url", url),
          metaTag("property", "og:image", image),
          metaTag("name", "twitter:image", image),
        ]
      : []),
  ];
  // The home page's package schema has no place on an article route.
  const withoutPackages = template.replace(
    /<script type="application\/ld\+json">(?:(?!<\/script>)[\s\S])*"SoftwareSourceCode"[\s\S]*?<\/script>\s*/,
    "",
  );
  const withTags = tags.reduce((html, [pattern, tag]) => setTag(html, pattern, tag), withoutPackages);
  return withTags.replace("</head>", () => `    ${ldScript(page.jsonLd(url, image))}\n  </head>`);
}

const packagesJsonLd = (): string =>
  ldScript(
    products
      .filter((p) => p.proof.npm)
      .map((p) => ({
        "@context": "https://schema.org",
        "@type": "SoftwareSourceCode",
        name: p.name,
        description: p.shipped,
        url: p.proof.npm,
        ...(p.proof.github && { codeRepositoryUrl: p.proof.github }),
        programmingLanguage: "TypeScript",
        author: AUTHOR,
      })),
  );

// Canonical, Open Graph and sitemap URLs must be absolute, and the domain is
// chosen per deploy (VITE_SITE_URL). When it is unset the build drops those
// tags instead of advertising a domain that doesn't resolve.
export function siteMeta(siteUrl: string | undefined): Plugin {
  const base = siteUrl?.replace(/\/$/, "");
  let config: ResolvedConfig;
  return {
    name: "site-meta",
    configResolved(resolved) {
      config = resolved;
    },
    transformIndexHtml: {
      order: "pre",
      handler: (html) => {
        const resolved = base
          ? html.replaceAll("%SITE_URL%", base)
          : html.split("\n").filter((line) => !line.includes("%SITE_URL%")).join("\n");
        return resolved.replace("</head>", () => `    ${packagesJsonLd()}\n  </head>`);
      },
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
    // LinkedIn and other scrapers don't run JS, so each route needs its own
    // head tags in static HTML. Written after the bundle so the entry's hashed
    // asset links are already in dist/index.html.
    closeBundle() {
      if (config.command !== "build") return;
      const outDir = resolve(config.root, config.build.outDir);
      const indexPath = resolve(outDir, "index.html");
      if (!existsSync(indexPath)) return;
      const template = readFileSync(indexPath, "utf8");
      for (const page of routePages()) {
        const file = resolve(outDir, `.${page.path}`, "index.html");
        mkdirSync(dirname(file), { recursive: true });
        writeFileSync(file, routeHtml(template, page, base));
      }
    },
  };
}
