import type { ReactNode } from "react";
import { caseStudyMeta } from "../case-studies";
import { contributions, products, STATS_AS_OF } from "../constants";
import type { Product } from "../constants";
import { RichText } from "../components/RichText";
import { Section } from "../components/Section";
import { TextLink } from "../components/TextLink";
import { cn } from "../lib/cn";
import { eyebrow, meta } from "../lib/styles";

const row = "py-6 border-t border-line";
const rowHead = "flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2";
const links = "flex flex-wrap gap-x-4 gap-y-1";
const body = "mt-3 max-w-measure text-base text-fg-2";
const groupLabel = cn(eyebrow, "mb-3");
const name = "text-lg font-medium text-fg";

const formatCount = (n: number): string => n.toLocaleString("en-GB");

function ProductRow({ product }: { product: Product }): ReactNode {
  const { links: l } = product;
  return (
    <li className={row}>
      <div className={rowHead}>
        <div>
          <h4 className={name}>{product.name}</h4>
          <p className={cn(meta, "mt-1")}>{formatCount(product.downloads)} npm downloads in the past year</p>
        </div>
        <div className={links}>
          {l.live && <TextLink href={l.live} mono>Live</TextLink>}
          {l.npm && <TextLink href={l.npm} mono>npm</TextLink>}
          {l.github && <TextLink href={l.github} mono>GitHub</TextLink>}
        </div>
      </div>
      <p className={body}><RichText text={product.summary} /> {product.detail}</p>
      <p className={cn(meta, "mt-3")}>{product.tags.join(" · ")}</p>
    </li>
  );
}

export default function Work(): ReactNode {
  return (
    <Section id="work" number="01" title="Work">
      <h3 className={groupLabel}>At Samsung</h3>
      <ul>
        {caseStudyMeta.map((cs) => (
          <li key={cs.slug} className={row}>
            <div className={rowHead}>
              <div>
                <h4 className={name}>{cs.name}</h4>
                <p className={cn(meta, "mt-1")}>Internal library · {cs.years}</p>
              </div>
              <TextLink href={`/work/${cs.slug}`} mono>Read the case study</TextLink>
            </div>
            <p className={body}><RichText text={cs.summary} /></p>
          </li>
        ))}
      </ul>

      <h3 className={cn(groupLabel, "mt-14")}>Published on npm</h3>
      <ul>
        {products.map((p) => <ProductRow key={p.name} product={p} />)}
      </ul>
      <p className={cn(meta, "mt-1")}>Download counts from npm, {STATS_AS_OF}.</p>

      <h3 className={cn(groupLabel, "mt-14")}>Upstream contributions</h3>
      <ul>
        {contributions.map((c) => (
          <li key={c.url} className={cn(row, rowHead)}>
            <div>
              <p className="font-mono text-sm text-fg">{c.repo}</p>
              <p className="mt-1 text-base text-fg-2">{c.title}</p>
            </div>
            <TextLink href={c.url} mono>Pull request</TextLink>
          </li>
        ))}
      </ul>
    </Section>
  );
}
