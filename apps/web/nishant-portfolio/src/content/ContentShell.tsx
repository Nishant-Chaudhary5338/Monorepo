import { useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../sections/Footer";
import { personalInfo } from "../constants";
import { cn } from "../lib/cn";
import { container, meta, textLink } from "../lib/styles";
import { extractToc } from "./markdown";
import { MarkdownBody } from "./MarkdownBody";
import { TocDisclosure, TocSidebar } from "./Toc";
import { useReadingProgress } from "./useReadingProgress";

interface ContentShellProps {
  back: { label: string; to: string };
  cover?: { src: string; alt: string };
  header: ReactNode;
  markdown: string;
  allowHtml?: boolean;
}

const cover = cn("block h-cover w-full object-cover", "border-y border-line");
const bodyGrid = cn(container, "grid grid-cols-1 gap-12 xl:grid-cols-12");
const topButton = cn(
  "fixed right-5 bottom-5 z-40 px-3 py-2 bg-canvas",
  "font-mono text-xs text-fg-2 border border-line-strong rounded-md hover:text-fg",
);

export function ContentShell({ back, cover: coverImage, header, markdown, allowHtml }: ContentShellProps): ReactNode {
  const { progress, activeId } = useReadingProgress();
  const toc = extractToc(markdown);

  useEffect(() => { window.scrollTo(0, 0); }, [markdown]);

  return (
    <>
      <Navbar back={back} />
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 z-50 h-0.5 bg-accent"
        style={{ width: `${progress}%` }}
      />
      <main>
        {coverImage && (
          <img src={coverImage.src} alt={coverImage.alt} width={1200} height={630} fetchPriority="high" decoding="async" className={cover} />
        )}
        <div className={cn(container, "pt-12 pb-10")}>
          <div className="max-w-measure">{header}</div>
        </div>
        <div className={bodyGrid}>
          <article className="min-w-0 max-w-measure xl:col-span-8">
            {toc.length > 0 && <TocDisclosure entries={toc} activeId={activeId} />}
            <MarkdownBody markdown={markdown} allowHtml={allowHtml} />
          </article>
          {toc.length > 0 && (
            <aside className="xl:col-span-3 xl:col-start-10">
              <TocSidebar entries={toc} activeId={activeId} />
            </aside>
          )}
        </div>
        <div className={cn(container, "mt-24 flex flex-wrap justify-between gap-4 pt-8")}>
          <Link to={back.to} className={cn(meta, "hover:text-fg")}>← Back to {back.label.toLowerCase()}</Link>
          <a href={`mailto:${personalInfo.email}`} className={cn(textLink, "text-sm")}>Reply by email</a>
        </div>
      </main>
      <Footer />
      {progress > 30 && (
        <button type="button" className={topButton} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          ↑ Top
        </button>
      )}
    </>
  );
}
