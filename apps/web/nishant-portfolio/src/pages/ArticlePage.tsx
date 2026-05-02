import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { articleMeta } from "../articles/index";

import "highlight.js/styles/github-dark-dimmed.css";

const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const meta = articleMeta.find((a) => a.slug === slug);

  useEffect(() => {
    setLoading(true);
    import(`../articles/${slug}.md?raw`)
      .then((mod) => { setContent(mod.default); setLoading(false); })
      .catch(() => { setContent(null); setLoading(false); });
  }, [slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-primary)", color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "0.82rem", letterSpacing: "0.08em" }}>
        Loading…
      </div>
    );
  }

  if (!content || !meta) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5rem", background: "var(--bg-primary)" }}>
        <p style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)", fontSize: "0.82rem" }}>Article not found.</p>
        <Link to="/" style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--accent-warm)", textDecoration: "none", borderBottom: "1px solid var(--accent-warm)" }}>← Back to portfolio</Link>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--bg-primary)", color: "var(--text-primary)", minHeight: "100vh" }}>

      {/* Top bar */}
      <div style={{ borderBottom: "1px solid var(--rule)", padding: "1.25rem clamp(1.25rem, 5vw, 5rem)", display: "flex", justifyContent: "space-between", alignItems: "baseline", position: "sticky", top: 0, background: "var(--bg-primary)", zIndex: 100 }}>
        <Link
          to="/"
          style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", letterSpacing: "-0.01em", fontWeight: 400, color: "var(--text-primary)", textDecoration: "none" }}
        >
          Nishant <em style={{ fontStyle: "italic", color: "var(--accent-warm)" }}>Chaudhary</em>
        </Link>
        <Link
          to="/#writing"
          style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", textDecoration: "none", transition: "color 0.2s" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-primary)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)"; }}
        >
          ← Writing
        </Link>
      </div>

      {/* Article header */}
      <div style={{ maxWidth: "740px", margin: "0 auto", padding: "4rem clamp(1.25rem, 5vw, 2rem) 2rem" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--accent-warm)", marginBottom: "1.2rem" }}>
          {meta.status === "draft" ? "Draft" : "Published"} · {meta.date} · {meta.readingTime}
        </div>

        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.1, letterSpacing: "-0.025em", marginBottom: "1.5rem", color: "var(--text-primary)" }}>
          {meta.title}
        </h1>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "3rem", paddingBottom: "2rem", borderBottom: "1px solid var(--rule)" }}>
          {meta.tags.map((tag) => (
            <span key={tag} className="editorial-tag">{tag}</span>
          ))}
        </div>
      </div>

      {/* Article body */}
      <div style={{ maxWidth: "740px", margin: "0 auto", padding: "0 clamp(1.25rem, 5vw, 2rem) 8rem" }}>
        <div className="article-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
            {content}
          </ReactMarkdown>
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid var(--rule)", padding: "3rem clamp(1.25rem, 5vw, 5rem)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <Link
          to="/#writing"
          style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", textDecoration: "none", transition: "color 0.2s" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent-warm)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)"; }}
        >
          ← Back to writing
        </Link>
        <a
          href="mailto:nishantchaudhary.dev@gmail.com"
          style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--text-muted)", textDecoration: "none", borderBottom: "1px solid var(--accent-warm)", paddingBottom: "1px", transition: "color 0.2s" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent-warm)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)"; }}
        >
          Reply by email →
        </a>
      </div>

      {/* Article typography styles */}
      <style>{`
        .article-body {
          font-family: var(--font-body);
          font-size: 1.05rem;
          line-height: 1.75;
          color: var(--text-secondary);
        }
        .article-body h2 {
          font-family: var(--font-display);
          font-weight: 400;
          font-size: clamp(1.6rem, 3vw, 2.2rem);
          line-height: 1.15;
          letter-spacing: -0.02em;
          color: var(--text-primary);
          margin: 3.5rem 0 1rem;
          padding-top: 2rem;
          border-top: 1px solid var(--rule);
        }
        .article-body h3 {
          font-family: var(--font-display);
          font-weight: 400;
          font-size: 1.35rem;
          color: var(--text-primary);
          margin: 2.5rem 0 0.8rem;
          letter-spacing: -0.01em;
        }
        .article-body p { margin: 0 0 1.4rem; }
        .article-body strong { color: var(--text-primary); font-weight: 600; }
        .article-body em { font-style: italic; }
        .article-body a { color: var(--accent-warm); text-underline-offset: 3px; }
        .article-body a:hover { opacity: 0.8; }
        .article-body ul, .article-body ol {
          margin: 0 0 1.4rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .article-body li { line-height: 1.65; }
        .article-body blockquote {
          border-left: 3px solid var(--accent-warm);
          padding: 0.8rem 0 0.8rem 1.5rem;
          margin: 1.8rem 0;
          color: var(--text-muted);
          font-style: italic;
        }
        .article-body blockquote p { margin: 0; }
        .article-body code:not(pre code) {
          font-family: var(--font-mono);
          font-size: 0.88em;
          background: var(--bg-secondary);
          padding: 0.15em 0.4em;
          border-radius: 3px;
          color: var(--accent-warm);
        }
        .article-body pre {
          background: var(--bg-secondary) !important;
          border: 1px solid var(--border-color);
          border-radius: 0;
          padding: 1.4rem 1.6rem;
          overflow-x: auto;
          margin: 1.8rem 0;
          font-family: var(--font-mono);
          font-size: 0.84rem;
          line-height: 1.65;
        }
        .article-body pre code {
          background: none !important;
          padding: 0;
          color: var(--text-primary);
          font-size: inherit;
        }
        .article-body table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.8rem 0;
          font-family: var(--font-mono);
          font-size: 0.84rem;
        }
        .article-body th {
          text-align: left;
          padding: 0.6rem 1rem;
          border-bottom: 2px solid var(--rule);
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 0.72rem;
          font-weight: 400;
        }
        .article-body td {
          padding: 0.65rem 1rem;
          border-bottom: 1px solid var(--rule);
          color: var(--text-secondary);
          vertical-align: top;
        }
        .article-body hr {
          border: none;
          border-top: 1px solid var(--rule);
          margin: 3rem 0;
        }
        /* Override highlight.js light theme for dark mode */
        .dark .article-body pre { background: #111113 !important; border-color: var(--border-color); }
        .dark .hljs { background: #111113 !important; color: #e2e8f0; }
        .dark .hljs-keyword { color: #93c5fd; }
        .dark .hljs-string  { color: #86efac; }
        .dark .hljs-comment { color: #6b7280; }
        .dark .hljs-number  { color: #fca5a5; }
        .dark .hljs-title   { color: #c4b5fd; }
        .dark .hljs-type    { color: #67e8f9; }
        .dark .hljs-built_in { color: #93c5fd; }
        .dark .hljs-attr    { color: #67e8f9; }
      `}</style>
    </div>
  );
};

export default ArticlePage;
