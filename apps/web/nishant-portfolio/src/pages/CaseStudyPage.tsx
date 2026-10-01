import { useParams } from "react-router-dom";
import { caseStudyMeta } from "../case-studies/index";
import { coverSet } from "../case-studies/covers";
import ContentPage, { type Compiled } from "./ContentPage";
import CaseStudyVideo from "./CaseStudyVideo";

const caseStudies = import.meta.glob<Compiled>("../case-studies/*.md", { query: "?compiled", import: "default" });

const labelStyle = { fontFamily: "var(--font-mono)", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--fg-muted)", marginBottom: "0.4rem" } as const;

const CaseStudyPage = () => {
  const { slug = "" } = useParams<{ slug: string }>();
  const meta = caseStudyMeta.find((c) => c.slug === slug);

  return (
    <ContentPage
      load={caseStudies[`../case-studies/${slug}.md`]}
      found={!!meta}
      head={{
        title: `${meta?.title ?? "Case study"} case study | Nishant Chaudhary`,
        description: meta?.description ?? "",
        path: `/work/${slug}`,
      }}
      notFound={{ text: "Case study not found.", to: "/#work", label: "← Back to work" }}
      nav={{ to: "/#work", label: "← Work", footerLabel: "← Back to work", footerCta: "Get in touch →" }}
      cover={coverSet(`work-${slug}`)}
      coverAlt={meta?.coverImageAlt ?? ""}
      beforeBody={meta && <CaseStudyVideo video={meta.video} />}
      header={
        meta && (
          <>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--accent)", marginBottom: "1.2rem" }}>
              Case Study
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.1, letterSpacing: "-0.025em", marginBottom: "1.5rem", color: "var(--fg)" }}>
              {meta.title}
            </h1>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
              {meta.results.map(({ value, label }) => (
                <div key={label}>
                  <div className="stat-value">{value}</div>
                  <div className="stat-label">{label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", marginBottom: "3rem" }}>
              {[{ label: "Role", value: meta.role }, { label: "Period", value: meta.years }, { label: "Status", value: meta.status }].map(({ label, value }) => (
                <div key={label} style={{ padding: "1rem 0.5rem 1rem", borderRight: "1px solid var(--border)" }}>
                  <div style={labelStyle}>{label}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "var(--fg)" }}>{value}</div>
                </div>
              ))}
              <div style={{ padding: "1rem 0.5rem 1rem" }}>
                <div style={labelStyle}>Stack</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--fg)", lineHeight: 1.5 }}>{meta.stack}</div>
              </div>
            </div>
          </>
        )
      }
    />
  );
};

export default CaseStudyPage;
