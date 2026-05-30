import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { caseStudyMeta } from "../case-studies/index";
import { caseStudyCoverImages } from "../case-studies/covers";

import "highlight.js/styles/github-dark-dimmed.css";

function stripFrontmatter(md: string): string {
  if (!md.startsWith("---")) return md;
  const end = md.indexOf("\n---", 3);
  return end !== -1 ? md.slice(end + 4).trimStart() : md;
}

function childrenToText(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(childrenToText).join("");
  if (children && typeof children === "object" && "props" in (children as object)) {
    const el = children as { props: { children?: React.ReactNode } };
    return childrenToText(el.props.children);
  }
  return String(children ?? "");
}

function headingId(children: React.ReactNode): string {
  return childrenToText(children).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

interface TocEntry {
  id: string;
  text: string;
  level: number;
}

function extractToc(markdown: string): TocEntry[] {
  const entries: TocEntry[] = [];
  for (const line of markdown.split("\n")) {
    const h2 = line.match(/^## (.+)$/);
    const h3 = line.match(/^### (.+)$/);
    if (h2) {
      const text = h2[1].replace(/\*\*/g, "").replace(/`/g, "").trim();
      entries.push({ id: text.toLowerCase().replace(/[^a-z0-9]+/g, "-"), text, level: 2 });
    } else if (h3) {
      const text = h3[1].replace(/\*\*/g, "").replace(/`/g, "").trim();
      entries.push({ id: text.toLowerCase().replace(/[^a-z0-9]+/g, "-"), text, level: 3 });
    }
  }
  return entries;
}

const CaseStudyPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeId, setActiveId] = useState("");
  const [showBackTop, setShowBackTop] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);

  const meta = caseStudyMeta.find((c) => c.slug === slug);

  useEffect(() => {
    setLoading(true);
    import(`../case-studies/${slug}.md?raw`)
      .then((mod) => { setContent(mod.default); setLoading(false); })
      .catch(() => { setContent(null); setLoading(false); });
  }, [slug]);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  // Per-page SEO: update title, description, and canonical for each case study
  useEffect(() => {
    if (!meta) return;
    const prevTitle = document.title;
    const metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const prevDesc = metaDesc?.getAttribute("content") ?? "";
    const prevCanon = canonical?.getAttribute("href") ?? "";

    document.title = `${meta.title} Case Study — Nishant Chaudhary`;
    metaDesc?.setAttribute("content", meta.description);
    canonical?.setAttribute("href", `https://nishantchaudhary.dev/work/${meta.slug}`);

    return () => {
      document.title = prevTitle;
      metaDesc?.setAttribute("content", prevDesc);
      canonical?.setAttribute("href", prevCanon);
    };
  }, [meta]);

  const handleScroll = useCallback(() => {
    const y = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docH > 0 ? (y / docH) * 100 : 0;
    setScrollProgress(progress);
    setShowBackTop(progress > 30);

    const headings = document.querySelectorAll<HTMLElement>(".article-body h2, .article-body h3");
    let current = "";
    headings.forEach((el) => { if (el.getBoundingClientRect().top < 120) current = el.id; });
    if (current) setActiveId(current);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const cleanContent = content ? stripFrontmatter(content) : null;
  const toc = cleanContent ? extractToc(cleanContent) : [];
  const coverImage = slug ? caseStudyCoverImages[slug] : undefined;

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", color: "var(--fg-muted)", fontFamily: "var(--font-mono)", fontSize: "0.82rem", letterSpacing: "0.08em" }}>
        Loading…
      </div>
    );
  }

  if (!content || !meta) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5rem", background: "var(--bg)" }}>
        <p style={{ fontFamily: "var(--font-mono)", color: "var(--fg-muted)", fontSize: "0.82rem" }}>Case study not found.</p>
        <Link to="/#work" style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--accent)", textDecoration: "none", borderBottom: "1px solid var(--accent)" }}>← Back to work</Link>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--bg)", color: "var(--fg)", minHeight: "100vh" }}>

      {/* Reading progress bar */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed", top: 0, left: 0, height: "2px",
          width: `${scrollProgress}%`,
          backgroundColor: "var(--accent)",
          zIndex: 200, transition: "width 0.1s linear", pointerEvents: "none",
        }}
      />

      {/* Top bar */}
      <div style={{ borderBottom: "1px solid var(--border)", padding: "1.25rem clamp(1.25rem, 5vw, 5rem)", display: "flex", justifyContent: "space-between", alignItems: "baseline", position: "sticky", top: 0, background: "var(--bg)", zIndex: 100 }}>
        <Link to="/" style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", letterSpacing: "-0.01em", fontWeight: 400, color: "var(--fg)", textDecoration: "none" }}>
          Nishant <em style={{ fontStyle: "italic", color: "var(--accent)" }}>Chaudhary</em>
        </Link>
        <Link
          to="/#work"
          style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--fg-muted)", textDecoration: "none", transition: "color 0.2s" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--fg)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--fg-muted)"; }}
        >
          ← Work
        </Link>
      </div>

      {/* Cover image — LCP element: no lazy, high priority, explicit dims to prevent CLS */}
      {coverImage && (
        <div style={{ width: "100%", height: "clamp(220px, 35vw, 480px)", overflow: "hidden", position: "relative" }}>
          <img
            src={coverImage}
            alt={meta.title}
            width={1200}
            height={630}
            fetchPriority="high"
            decoding="async"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, var(--bg) 100%)" }} />
        </div>
      )}

      {/* Case study header — left-aligned via site-container, no centering */}
      <div className="site-container" style={{ paddingTop: coverImage ? "2rem" : "4rem", paddingBottom: "2rem" }}>
      <div style={{ maxWidth: "740px" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--accent)", marginBottom: "1.2rem" }}>
          Case Study
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.1, letterSpacing: "-0.025em", marginBottom: "1.5rem", color: "var(--fg)" }}>
          {meta.title}
        </h1>

        {/* Meta grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", marginBottom: "3rem" }}>
          {[{ label: "Role", value: meta.role }, { label: "Period", value: meta.years }, { label: "Status", value: meta.status }].map(({ label, value }) => (
            <div key={label} style={{ padding: "1rem 0.5rem 1rem", borderRight: "1px solid var(--border)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--fg-muted)", marginBottom: "0.4rem" }}>{label}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "var(--fg)" }}>{value}</div>
            </div>
          ))}
          <div style={{ padding: "1rem 0.5rem 1rem" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--fg-muted)", marginBottom: "0.4rem" }}>Stack</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--fg)", lineHeight: 1.5 }}>{meta.stack}</div>
          </div>
        </div>
      </div>
      </div>

      {/* Content + TOC — site-container width, left-aligned (no centering) */}
      <div
        className="site-container"
        style={{
          display: "grid",
          gridTemplateColumns: toc.length > 0 ? "minmax(0, 740px) 220px" : "minmax(0, 740px)",
          gap: "3rem",
          alignItems: "start",
          justifyContent: "start",
          paddingBlock: 0,
        }}
      >
        <div>
          {toc.length > 0 && (
            <div style={{ marginBottom: "2rem" }} className="xl:hidden">
              <button onClick={() => setTocOpen((v) => !v)}
                style={{ fontFamily: "var(--font-mono)", fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--fg-muted)", background: "var(--surface)", border: "1px solid var(--border-strong)", padding: "0.55rem 1rem", cursor: "pointer", width: "100%", textAlign: "left", display: "flex", justifyContent: "space-between" }}
              >
                <span>Contents ({toc.length})</span>
                <span style={{ transition: "transform 0.2s", transform: tocOpen ? "rotate(180deg)" : "none", display: "inline-block" }}>▾</span>
              </button>
              {tocOpen && (
                <div style={{ border: "1px solid var(--border-strong)", borderTop: "none", background: "var(--surface)", padding: "1rem 1.2rem" }}>
                  {toc.map((entry) => (
                    <a key={entry.id} href={`#${entry.id}`} onClick={() => setTocOpen(false)}
                      style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: entry.level === 3 ? "0.72rem" : "0.76rem", color: activeId === entry.id ? "var(--accent)" : "var(--fg-muted)", textDecoration: "none", padding: "0.35rem 0", paddingLeft: entry.level === 3 ? "1rem" : "0", transition: "color 0.2s" }}
                    >{entry.text}</a>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="article-body">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                h2: ({ children }) => <h2 id={headingId(children)}>{children}</h2>,
                h3: ({ children }) => <h3 id={headingId(children)}>{children}</h3>,
                img: ({ src, alt }) => {
                  let w: number | undefined;
                  let h: number | undefined;
                  try {
                    const u = new URL(src ?? "");
                    w = u.searchParams.has("w") ? Number(u.searchParams.get("w")) : undefined;
                    h = u.searchParams.has("h") ? Number(u.searchParams.get("h")) : undefined;
                  } catch { /* relative URL */ }
                  return (
                    <img
                      src={src}
                      alt={alt ?? ""}
                      width={w}
                      height={h}
                      loading="lazy"
                      decoding="async"
                      style={{ maxWidth: "100%", height: "auto" }}
                    />
                  );
                },
              }}
            >
              {cleanContent ?? ""}
            </ReactMarkdown>
          </div>
        </div>

        {toc.length > 0 && (
          <aside className="hidden xl:block" style={{ position: "sticky", top: "5rem", maxHeight: "calc(100vh - 8rem)", overflowY: "auto" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--fg-muted)", marginBottom: "1rem" }}>Contents</div>
            {toc.map((entry) => (
              <a key={entry.id} href={`#${entry.id}`}
                style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: entry.level === 3 ? "0.71rem" : "0.75rem", color: activeId === entry.id ? "var(--accent)" : "var(--fg-muted)", textDecoration: "none", padding: "0.3rem 0 0.3rem", paddingLeft: entry.level === 3 ? "1.2rem" : "0.6rem", borderLeft: `2px solid ${activeId === entry.id ? "var(--accent)" : "var(--border)"}`, transition: "color 0.2s, border-color 0.2s", lineHeight: 1.45 }}
                onMouseEnter={(e) => { if (activeId !== entry.id) (e.currentTarget as HTMLAnchorElement).style.color = "var(--fg)"; }}
                onMouseLeave={(e) => { if (activeId !== entry.id) (e.currentTarget as HTMLAnchorElement).style.color = "var(--fg-muted)"; }}
              >{entry.text}</a>
            ))}
          </aside>
        )}
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid var(--border)", padding: "3rem clamp(1.25rem, 5vw, 5rem)", marginTop: "6rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <Link to="/#work"
          style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--fg-muted)", textDecoration: "none", transition: "color 0.2s" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--fg-muted)"; }}
        >← Back to work</Link>
        <a href="mailto:nishantchaudhary.dev@gmail.com"
          style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--fg-muted)", textDecoration: "none", borderBottom: "1px solid var(--accent)", paddingBottom: "1px", transition: "color 0.2s" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--fg-muted)"; }}
        >Get in touch →</a>
      </div>

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        style={{ position: "fixed", bottom: "2rem", right: "2rem", fontFamily: "var(--font-mono)", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--fg-muted)", background: "var(--surface)", border: "1px solid var(--accent)", padding: "0.35rem 0.8rem", borderRadius: "2px", cursor: "pointer", opacity: showBackTop ? 1 : 0, transition: "opacity 0.3s ease, color 0.2s", pointerEvents: showBackTop ? "auto" : "none", zIndex: 50 }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--fg-muted)"; }}
      >↑ Top</button>
    </div>
  );
};

export default CaseStudyPage;
