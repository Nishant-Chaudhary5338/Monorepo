import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import { caseStudyMeta } from "../case-studies/index";
import { caseStudyCoverImages } from "../case-studies/covers";
import { ContentShell } from "../content/ContentShell";
import { stripFrontmatter } from "../content/markdown";
import { usePageMeta } from "../content/usePageMeta";
import { cn } from "../lib/cn";
import { container, eyebrow, meta } from "../lib/styles";
import NotFound from "./NotFound";

const factRow = cn("grid grid-cols-1 gap-1 py-3 border-t border-line sm:grid-cols-4 sm:gap-4");

const CaseStudyPage = (): ReactNode => {
  const { slug } = useParams<{ slug: string }>();
  const [markdown, setMarkdown] = useState<string | null | undefined>(undefined);
  const study = caseStudyMeta.find((c) => c.slug === slug);

  useEffect(() => {
    setMarkdown(undefined);
    import(`../case-studies/${slug}.md?raw`)
      .then((mod: { default: string }) => setMarkdown(stripFrontmatter(mod.default)))
      .catch(() => setMarkdown(null));
  }, [slug]);

  const pageMeta = useMemo(
    () => study && { title: `${study.name} case study`, description: study.description, path: `/work/${study.slug}` },
    [study],
  );
  usePageMeta(pageMeta);

  if (markdown === undefined) return <p className={cn(container, meta, "py-24")}>Loading</p>;
  if (!markdown || !study) return <NotFound what="Case study" back={{ label: "Work", to: "/#work" }} />;

  const facts = [
    { label: "Role", value: study.role },
    { label: "Period", value: study.years },
    { label: "Status", value: study.status },
    { label: "Stack", value: study.stack },
  ];
  const cover = slug ? caseStudyCoverImages[slug] : undefined;

  const header = (
    <>
      <p className={eyebrow}>Case study · Samsung</p>
      <h1 className="mt-4 text-xl font-medium tracking-display text-fg lg:text-2xl">{study.name}</h1>
      <p className="mt-1 font-mono text-sm text-fg-3">{study.title}</p>
      <p className="mt-4 text-md text-fg-2">{study.description}</p>
      <dl className="mt-8 border-b border-line">
        {facts.map((f) => (
          <div key={f.label} className={factRow}>
            <dt className={meta}>{f.label}</dt>
            <dd className="text-sm text-fg-2 sm:col-span-3">{f.value}</dd>
          </div>
        ))}
      </dl>
    </>
  );

  return (
    <ContentShell
      back={{ label: "Work", to: "/#work" }}
      cover={cover ? { src: cover, alt: "" } : undefined}
      header={header}
      markdown={markdown}
    />
  );
};

export default CaseStudyPage;
