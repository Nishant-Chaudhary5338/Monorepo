import { useEffect, useMemo, useState, type MouseEvent, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContentScroll } from "../hooks/useContentScroll";
import { MobileToc, SidebarToc } from "./ContentToc";
import type { CoverSet } from "../case-studies/covers";

import "highlight.js/styles/github-dark-dimmed.css";

export interface Compiled {
  html: string;
  toc: { id: string; text: string; level: 2 | 3 }[];
}

export interface ContentPageProps {
  /** Lazy loader for the compiled markdown, undefined when the slug has no file. */
  load: (() => Promise<Compiled>) | undefined;
  /** False when the slug has no metadata entry. */
  found: boolean;
  head: { title: string; description: string; path: string };
  notFound: { text: string; to: string; label: string };
  nav: { to: string; label: string; footerLabel: string; footerCta: string };
  cover: CoverSet;
  coverAlt: string;
  /** Minutes of reading time; when set, a "min left" chip floats beside the back-to-top button. */
  totalMinutes?: number;
  header: ReactNode;
  /** Rendered above the body, inside the content column. */
  beforeBody?: ReactNode;
}

const centered = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "var(--bg)",
} as const;

const hoverColor = (from: string, to: string) => ({
  onMouseEnter: (e: MouseEvent<HTMLElement>): void => { e.currentTarget.style.color = to; },
  onMouseLeave: (e: MouseEvent<HTMLElement>): void => { e.currentTarget.style.color = from; },
});

function useDocumentHead({ title, description, path }: ContentPageProps["head"], active: boolean): void {
  useEffect(() => {
    if (!active) return;
    const prevTitle = document.title;
    const metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const prevDesc = metaDesc?.getAttribute("content") ?? "";
    const prevCanon = canonical?.getAttribute("href") ?? "";
    const site = import.meta.env.VITE_SITE_URL?.replace(/\/$/, "");

    document.title = title;
    metaDesc?.setAttribute("content", description);
    if (site) canonical?.setAttribute("href", `${site}${path}`);

    return () => {
      document.title = prevTitle;
      metaDesc?.setAttribute("content", prevDesc);
      canonical?.setAttribute("href", prevCanon);
    };
  }, [title, description, path, active]);
}

interface Loaded {
  load: ContentPageProps["load"];
  content: Compiled | null;
}

function useCompiled(load: ContentPageProps["load"]): { content: Compiled | null; loading: boolean } {
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  useEffect(() => {
    if (!load) return;
    let cancelled = false;
    load()
      .then((content) => { if (!cancelled) setLoaded({ load, content }); })
      .catch(() => { if (!cancelled) setLoaded({ load, content: null }); });
    return () => { cancelled = true; };
  }, [load]);
  if (!load) return { content: null, loading: false };
  const settled = loaded?.load === load;
  return { content: settled ? loaded.content : null, loading: !settled };
}

const ContentPage = (props: ContentPageProps) => {
  const { load, found, head, notFound, nav, cover, coverAlt, totalMinutes, header, beforeBody } = props;
  const navigate = useNavigate();
  const { content, loading } = useCompiled(load);
    // React 19 rewrites innerHTML whenever the prop object changes identity, which
  // would detach every heading the scroll observer holds on each re-render.
  const bodyHtml = useMemo(() => ({ __html: content?.html ?? "" }), [content]);
  const ready = !loading && !!content && found;
  const { barRef, minutesRef, activeId, showBackTop } = useContentScroll(ready, totalMinutes ?? 0);
  useDocumentHead(head, found);
  useEffect(() => { window.scrollTo(0, 0); }, [head.path]);

  if (loading) {
    return (
      <div style={{ ...centered, color: "var(--fg-muted)", fontFamily: "var(--font-mono)", fontSize: "0.82rem", letterSpacing: "0.08em" }}>
        Loading…
      </div>
    );
  }

  if (!ready || !content) {
    return (
      <div style={{ ...centered, flexDirection: "column", gap: "1.5rem" }}>
        <p style={{ fontFamily: "var(--font-mono)", color: "var(--fg-muted)", fontSize: "0.82rem" }}>{notFound.text}</p>
        <Link to={notFound.to} style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--accent)", textDecoration: "none", borderBottom: "1px solid var(--accent)" }}>{notFound.label}</Link>
      </div>
    );
  }

  const { toc } = content;

  // The body is plain HTML, so route same-site links through the router instead of a full reload.
  const onBodyClick = (e: MouseEvent<HTMLDivElement>): void => {
    const link = (e.target as HTMLElement).closest("a");
    const href = link?.getAttribute("href");
    if (!link || !href?.startsWith("/") || href.startsWith("//") || link.target === "_blank") return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    navigate(href);
  };

  return (
    <div style={{ background: "var(--bg)", color: "var(--fg)", minHeight: "100vh" }}>
      {/* Reading progress bar, width written by useContentScroll */}
      <div
        ref={barRef}
        aria-hidden="true"
        style={{ position: "fixed", top: 0, left: 0, height: "2px", width: 0, backgroundColor: "var(--accent)", zIndex: 200, transition: "width 0.1s linear", pointerEvents: "none" }}
      />

      <div style={{ borderBottom: "1px solid var(--border)", padding: "1.25rem clamp(1.25rem, 5vw, 5rem)", display: "flex", justifyContent: "space-between", alignItems: "baseline", position: "sticky", top: 0, background: "var(--bg)", zIndex: 100 }}>
        <Link to="/" style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", letterSpacing: "-0.01em", fontWeight: 400, color: "var(--fg)", textDecoration: "none" }}>
          Nishant <em style={{ fontStyle: "italic", color: "var(--accent)" }}>Chaudhary</em>
        </Link>
        <Link
          to={nav.to}
          style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--fg-muted)", textDecoration: "none", transition: "color 0.2s" }}
          {...hoverColor("var(--fg-muted)", "var(--fg)")}
        >
          {nav.label}
        </Link>
      </div>

      {/* Cover image: LCP element, so no lazy loading, high priority and explicit dimensions */}
      <div style={{ width: "100%", height: "clamp(220px, 35vw, 480px)", overflow: "hidden", position: "relative" }}>
        <img
          src={cover.src}
          srcSet={cover.srcSet}
          sizes={cover.sizes}
          alt={coverAlt}
          width={cover.width}
          height={cover.height}
          fetchPriority="high"
          decoding="async"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, var(--bg) 100%)" }} />
      </div>

      <div className="site-container" style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
        <div style={{ maxWidth: "740px" }}>{header}</div>
      </div>

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
          {beforeBody}
          <MobileToc toc={toc} activeId={activeId} />

          {/* The HTML is compiled from our own markdown at build time */}
          <div className="article-body" onClick={onBodyClick} dangerouslySetInnerHTML={bodyHtml} />
        </div>

        <SidebarToc toc={toc} activeId={activeId} />
      </div>

      <div style={{ borderTop: "1px solid var(--border)", padding: "3rem clamp(1.25rem, 5vw, 5rem)", marginTop: "6rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <Link to={nav.to}
          style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--fg-muted)", textDecoration: "none", transition: "color 0.2s" }}
          {...hoverColor("var(--fg-muted)", "var(--accent)")}
        >
          {nav.footerLabel}
        </Link>
        <a href="mailto:nishantchaudhary.dev@gmail.com"
          style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--fg-muted)", textDecoration: "none", borderBottom: "1px solid var(--accent)", paddingBottom: "1px", transition: "color 0.2s" }}
          {...hoverColor("var(--fg-muted)", "var(--accent)")}
        >
          {nav.footerCta}
        </a>
      </div>

      <div style={{ position: "fixed", bottom: "2rem", right: "2rem", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem", zIndex: 50, pointerEvents: "none" }}>
        {totalMinutes !== undefined && (
          <div ref={minutesRef} style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--fg-muted)", background: "var(--surface)", border: "1px solid var(--border-strong)", padding: "0.3rem 0.75rem", borderRadius: "99px", opacity: 0, transition: "opacity 0.3s ease", letterSpacing: "0.06em" }}>
            {totalMinutes} min left
          </div>
        )}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--fg-muted)", background: "var(--surface)", border: "1px solid var(--accent)", padding: "0.35rem 0.8rem", borderRadius: "2px", cursor: "pointer", opacity: showBackTop ? 1 : 0, transition: "opacity 0.3s ease, color 0.2s", pointerEvents: showBackTop ? "auto" : "none" }}
          {...hoverColor("var(--fg-muted)", "var(--accent)")}
        >
          ↑ Top
        </button>
      </div>
    </div>
  );
};

export default ContentPage;
