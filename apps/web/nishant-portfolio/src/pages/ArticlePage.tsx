import { useParams } from "react-router-dom";
import { articleMeta } from "../articles/index";
import { coverSet } from "../case-studies/covers";
import ContentPage, { type Compiled } from "./ContentPage";
import ArticleLinks from "./ArticleLinks";

const articles = import.meta.glob<Compiled>("../articles/*.md", { query: "?compiled", import: "default" });

const ArticlePage = () => {
  const { slug = "" } = useParams<{ slug: string }>();
  const meta = articleMeta.find((a) => a.slug === slug);

  return (
    <ContentPage
      load={articles[`../articles/${slug}.md`]}
      found={!!meta}
      head={{
        title: `${meta?.title ?? "Article"} | Nishant Chaudhary`,
        description: meta?.description ?? "",
        path: `/writing/${slug}`,
      }}
      notFound={{ text: "Article not found.", to: "/", label: "← Back to portfolio" }}
      nav={{ to: "/#writing", label: "← Writing", footerLabel: "← Back to writing", footerCta: "Reply by email →" }}
      cover={coverSet(slug)}
      coverAlt={meta?.coverImageAlt ?? ""}
      totalMinutes={parseInt(meta?.readingTime ?? "5", 10)}
      header={
        meta && (
          <>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--accent)", marginBottom: "1.2rem" }}>
              {meta.status === "draft" ? "Draft" : "Published"} · {meta.date} · {meta.readingTime}
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.1, letterSpacing: "-0.025em", marginBottom: "1.5rem", color: "var(--fg)" }}>
              {meta.title}
            </h1>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.4rem", marginBottom: "2rem", paddingBottom: "2rem", borderBottom: "1px solid var(--border)" }}>
              {meta.tags.map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
              <ArticleLinks repoUrl={meta.repoUrl} demoUrl={meta.demoUrl} demoLabel={meta.demoLabel} />
            </div>
          </>
        )
      }
    />
  );
};

export default ArticlePage;
