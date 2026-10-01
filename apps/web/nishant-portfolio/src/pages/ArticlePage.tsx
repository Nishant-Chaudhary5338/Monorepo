import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import { articleMeta } from "../articles/index";
import { TextLink } from "../components/TextLink";
import { ContentShell } from "../content/ContentShell";
import { stripFrontmatter } from "../content/markdown";
import { usePageMeta } from "../content/usePageMeta";
import { cn } from "../lib/cn";
import { container, meta } from "../lib/styles";
import NotFound from "./NotFound";

const ArticlePage = (): ReactNode => {
  const { slug } = useParams<{ slug: string }>();
  const [markdown, setMarkdown] = useState<string | null | undefined>(undefined);
  const article = articleMeta.find((a) => a.slug === slug);

  useEffect(() => {
    setMarkdown(undefined);
    import(`../articles/${slug}.md?raw`)
      .then((mod: { default: string }) => setMarkdown(stripFrontmatter(mod.default)))
      .catch(() => setMarkdown(null));
  }, [slug]);

  const pageMeta = useMemo(
    () => article && { title: article.title, description: article.description, path: `/writing/${article.slug}` },
    [article],
  );
  usePageMeta(pageMeta);

  if (markdown === undefined) return <p className={cn(container, meta, "py-24")}>Loading</p>;
  if (!markdown || !article) return <NotFound what="Article" back={{ label: "Writing", to: "/#writing" }} />;

  const header = (
    <>
      <p className={meta}>{article.topic} · {article.date} · {article.readingTime}</p>
      <h1 className="mt-4 text-xl font-medium tracking-display text-fg lg:text-2xl">{article.title}</h1>
      <p className="mt-4 text-md text-fg-2">{article.description}</p>
      {(article.repoUrl || article.demoUrl) && (
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
          {article.repoUrl && <TextLink href={article.repoUrl} mono>Source on GitHub</TextLink>}
          {article.demoUrl && <TextLink href={article.demoUrl} mono>{article.demoLabel?.replace(/\s*→$/, "") ?? "Live demo"}</TextLink>}
        </div>
      )}
      <p className={cn(meta, "mt-5")}>{article.tags.join(" · ")}</p>
    </>
  );

  return (
    <ContentShell
      back={{ label: "Writing", to: "/#writing" }}
      cover={{ src: article.coverImage, alt: article.coverImageAlt }}
      header={header}
      markdown={markdown}
      allowHtml
    />
  );
};

export default ArticlePage;
