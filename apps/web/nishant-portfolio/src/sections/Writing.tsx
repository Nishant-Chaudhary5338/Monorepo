import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TitleHeader from "../components/TitleHeader";

gsap.registerPlugin(ScrollTrigger);

interface Article {
  status: "published" | "draft" | "idea";
  statusLabel: string;
  title: React.ReactNode;
  description: string;
  readTime: string;
  tags: string[];
  link?: string;
}

const articles: Article[] = [
  {
    status: "published",
    statusLabel: "Long-form",
    title: <>Plugin onboarding in under <em>60 seconds</em>: building an MFE platform on Vite Module Federation</>,
    description:
      "How I built a shell, four plugin remotes, a registry service, and a DevTools scaffolder. The registry trick, the shared-dependency war, and the chunk-hash technique that proves exactly which routes any given change affects.",
    readTime: "~14 min read",
    tags: ["Micro-frontends", "Vite", "Module Federation", "Platform Engineering"],
  },
  {
    status: "draft",
    statusLabel: "In draft",
    title: <>One protocol, <em>two surfaces</em>: building a frontend MCP toolkit</>,
    description:
      "~30 MCP server packages, 60+ tools, 27 CLI wrappers. The insight nobody told me: MCP is just JSON-RPC — the same server that powers Cline also powers your parallel automation pipeline. One protocol, two clients.",
    readTime: "~14 min read",
    tags: ["Model Context Protocol", "AI Tooling", "Developer Experience", "Frontend Platform"],
  },
  {
    status: "idea",
    statusLabel: "Coming soon",
    title: <>Turborepo at team scale: <em>cache invalidation</em> patterns I wish I'd known</>,
    description:
      "What happens when a shared package changes and twelve apps need to rebuild — and only some of them should. The mental model for Turbo's task graph that makes cache invalidation predictable.",
    readTime: "Notes · ~6 min read",
    tags: ["Turborepo", "Monorepo", "Build Systems", "Developer Experience"],
  },
];

const statusColors: Record<Article["status"], string> = {
  published: "var(--accent-warm)",
  draft: "var(--text-muted)",
  idea: "var(--text-muted)",
};

const Writing = () => {
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useGSAP(() => {
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      gsap.fromTo(
        card,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: i * 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: card, start: "top 85%" },
        }
      );
    });
  }, []);

  return (
    <section id="writing" className="px-5 md:px-20 py-20 md:py-32">
      <TitleHeader
        num="05"
        label="Writing"
        title={<>Notes from the <em>frontier.</em></>}
        className="mb-10 md:mb-12"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {articles.map((article, index) => (
          <a
            key={index}
            ref={(el) => { cardRefs.current[index] = el; }}
            href={article.link ?? "#"}
            onClick={!article.link ? (e) => e.preventDefault() : undefined}
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "2rem 1.8rem",
              border: `1px solid ${article.status === "published" ? "var(--border-color)" : "var(--rule)"}`,
              borderStyle: article.status !== "published" ? "dashed" : "solid",
              textDecoration: "none",
              color: "inherit",
              minHeight: "260px",
              transition: "border-color 0.22s ease, transform 0.22s ease",
              cursor: article.link ? "pointer" : "default",
            }}
            onMouseEnter={(e) => {
              if (!article.link) return;
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--accent-warm)";
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor =
                article.status === "published" ? "var(--border-color)" : "var(--rule)";
              (e.currentTarget as HTMLAnchorElement).style.transform = "none";
            }}
          >
            {/* Status */}
            <div
              className="mono-label mb-4"
              style={{ color: statusColors[article.status], fontSize: "0.72rem", letterSpacing: "0.12em" }}
            >
              {article.statusLabel}
            </div>

            {/* Title */}
            <div
              className="display-headline"
              style={{ fontSize: "clamp(1.2rem, 1.8vw, 1.45rem)", lineHeight: 1.2, flexGrow: 1, marginBottom: "1rem" }}
            >
              {article.title}
            </div>

            {/* Description */}
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.88rem",
                color: "var(--text-muted)",
                lineHeight: 1.6,
                marginBottom: "1.2rem",
              }}
            >
              {article.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {article.tags.map((tag) => (
                <span key={tag} className="editorial-tag" style={{ fontSize: "0.68rem" }}>{tag}</span>
              ))}
            </div>

            {/* Read time */}
            <div className="mono-label" style={{ color: "var(--text-muted)", fontSize: "0.72rem", marginTop: "auto" }}>
              {article.readTime}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default Writing;
