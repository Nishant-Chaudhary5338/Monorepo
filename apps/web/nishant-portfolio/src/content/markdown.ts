import type { ReactNode } from "react";

export interface TocEntry {
  id: string;
  text: string;
  level: 2 | 3;
}

export function stripFrontmatter(md: string): string {
  if (!md.startsWith("---")) return md;
  const end = md.indexOf("\n---", 3);
  return end !== -1 ? md.slice(end + 4).trimStart() : md;
}

const slugify = (text: string): string =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function childrenToText(children: ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(childrenToText).join("");
  if (children && typeof children === "object" && "props" in children) {
    return childrenToText((children as { props: { children?: ReactNode } }).props.children);
  }
  return String(children ?? "");
}

export const headingId = (children: ReactNode): string => slugify(childrenToText(children));

export function extractToc(markdown: string): TocEntry[] {
  const entries: TocEntry[] = [];
  for (const line of markdown.split("\n")) {
    const match = line.match(/^(##|###) (.+)$/);
    if (!match) continue;
    const text = match[2].replace(/\*\*/g, "").replace(/`/g, "").trim();
    entries.push({ id: slugify(text), text, level: match[1] === "##" ? 2 : 3 });
  }
  return entries;
}
