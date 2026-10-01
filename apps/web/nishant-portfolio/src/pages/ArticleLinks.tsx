import type { MouseEvent } from "react";

interface ArticleLinksProps {
  repoUrl?: string;
  demoUrl?: string;
  demoLabel?: string;
}

const base = {
  fontFamily: "var(--font-mono)",
  fontSize: "0.72rem",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  textDecoration: "none",
  padding: "0.3rem 0.8rem",
  borderRadius: "2px",
  whiteSpace: "nowrap",
} as const;

const paint = (e: MouseEvent<HTMLElement>, styles: Partial<CSSStyleDeclaration>): void => {
  Object.assign(e.currentTarget.style, styles);
};

const ArticleLinks = ({ repoUrl, demoUrl, demoLabel }: ArticleLinksProps) => {
  if (!repoUrl && !demoUrl) return null;
  return (
    <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
      {repoUrl && (
        <a
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ ...base, color: "var(--fg-muted)", border: "1px solid var(--border)", transition: "border-color 0.2s, color 0.2s" }}
          onMouseEnter={(e) => paint(e, { color: "var(--fg)", borderColor: "var(--fg)" })}
          onMouseLeave={(e) => paint(e, { color: "var(--fg-muted)", borderColor: "var(--border)" })}
        >
          GitHub →
        </a>
      )}
      {demoUrl && (
        <a
          href={demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ ...base, color: "var(--accent)", border: "1px solid var(--accent)", transition: "background 0.2s, color 0.2s" }}
          onMouseEnter={(e) => paint(e, { background: "var(--accent)", color: "var(--bg)" })}
          onMouseLeave={(e) => paint(e, { background: "transparent", color: "var(--accent)" })}
        >
          {demoLabel ?? "View Live →"}
        </a>
      )}
    </div>
  );
};

export default ArticleLinks;
