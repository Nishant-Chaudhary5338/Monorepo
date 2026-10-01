import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { articleMeta } from "../articles";
import { Section } from "../components/Section";
import { cn } from "../lib/cn";
import { meta, rowLink } from "../lib/styles";

const inner = "grid grid-cols-1 gap-2 lg:grid-cols-12 lg:gap-6";
const title = cn(
  "text-md font-medium text-fg",
  "transition-colors duration-150 group-hover:text-accent",
);
const teaser = "mt-1 line-clamp-2 text-sm text-fg-2";

const published = articleMeta.filter((a) => a.status === "published");

export default function Writing(): ReactNode {
  return (
    <Section id="writing" number="03" title="Writing">
      <ul>
        {published.map((article) => (
          <li key={article.slug} className="border-t border-line first:border-t-0">
            <Link to={`/writing/${article.slug}`} className={cn(rowLink, "group")}>
              <span className={inner}>
                <span className={cn(meta, "lg:col-span-2 lg:pt-1")}>{article.topic}</span>
                <span className="lg:col-span-7">
                  <span className={cn(title, "block")}>{article.title}</span>
                  <span className={cn(teaser, "block")}>{article.description}</span>
                </span>
                <span className={cn(meta, "whitespace-nowrap lg:col-span-3 lg:pt-1 lg:text-right")}>
                  {article.date} · {article.readingTime.replace(" read", "")}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
