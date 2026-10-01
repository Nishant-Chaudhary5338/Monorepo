import { readFileSync } from "node:fs";
import type { Plugin } from "vite";
import type { Element, Root, RootContent } from "hast";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";

export interface TocEntry {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface CompiledMarkdown {
  html: string;
  toc: TocEntry[];
}

const SUFFIX = ".md?compiled";

const stripFrontmatter = (md: string): string => {
  if (!md.startsWith("---")) return md;
  const end = md.indexOf("\n---", 3);
  return end !== -1 ? md.slice(end + 4).trimStart() : md;
};

const slugify = (text: string): string =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const textOf = (node: RootContent | Root): string => {
  if (node.type === "text") return node.value;
  return "children" in node ? (node.children as RootContent[]).map(textOf).join("") : "";
};

const dimension = (params: URLSearchParams, key: string): string | undefined => {
  const value = Number(params.get(key));
  return Number.isFinite(value) && value > 0 ? String(value) : undefined;
};

const imageSize = (src: unknown): { width?: string; height?: string } => {
  if (typeof src !== "string") return {};
  try {
    const params = new URL(src).searchParams;
    return { width: dimension(params, "w"), height: dimension(params, "h") };
  } catch {
    return {};
  }
};

function walk(node: Root | Element, visit: (el: Element) => void): void {
  for (const child of node.children) {
    if (child.type !== "element") continue;
    visit(child);
    walk(child, visit);
  }
}

// Collects the h2/h3 table of contents while stamping ids, and hardens images.
function rehypeArticle(toc: TocEntry[]): () => (tree: Root) => void {
  return () => (tree) => {
    const used = new Map<string, number>();
    walk(tree, (el) => {
      if (el.tagName === "h2" || el.tagName === "h3") {
        const text = textOf(el).replace(/\*\*|`/g, "").trim();
        const base = slugify(text);
        const seen = used.get(base) ?? 0;
        used.set(base, seen + 1);
        const id = seen === 0 ? base : `${base}-${seen + 1}`;
        el.properties = { ...el.properties, id };
        toc.push({ id, text, level: el.tagName === "h2" ? 2 : 3 });
      } else if (el.tagName === "img") {
        const { width, height } = imageSize(el.properties.src);
        el.properties = {
          ...el.properties,
          loading: "lazy",
          decoding: "async",
          ...(width && { width }),
          ...(height && { height }),
        };
      }
    });
  };
}

async function compile(source: string): Promise<CompiledMarkdown> {
  const toc: TocEntry[] = [];
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeArticle(toc))
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(stripFrontmatter(source));
  return { html: String(file), toc };
}

// `import doc from "./post.md?compiled"` yields pre-rendered HTML, so the
// markdown toolchain never ships to the browser.
export function markdownCompiled(): Plugin {
  return {
    name: "markdown-compiled",
    enforce: "pre",
    async load(id) {
      if (!id.endsWith(SUFFIX)) return null;
      const file = id.slice(0, -"?compiled".length);
      this.addWatchFile(file);
      const compiled = await compile(readFileSync(file, "utf8"));
      return `export default ${JSON.stringify(compiled)};`;
    },
  };
}
