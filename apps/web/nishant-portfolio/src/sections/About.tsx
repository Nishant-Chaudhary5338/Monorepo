import type { ReactNode } from "react";
import { personalInfo, sideRole, stackGroups } from "../constants";
import { Section } from "../components/Section";
import { cn } from "../lib/cn";
import { eyebrow, meta } from "../lib/styles";

const listRow = cn("grid grid-cols-1 gap-1 py-4 border-t border-line sm:grid-cols-12 sm:gap-6");

export default function About(): ReactNode {
  return (
    <Section id="about" number="04" title="About">
      <div className="flex max-w-measure flex-col gap-4 text-base text-fg-2">
        {personalInfo.bio.map((p) => <p key={p}>{p}</p>)}
      </div>

      <h3 className={cn(eyebrow, "mt-12 mb-3")}>Also doing</h3>
      <div className={listRow}>
        <p className={cn(meta, "sm:col-span-3 sm:pt-0.5")}>{sideRole.date}</p>
        <div className="sm:col-span-9">
          <p className="text-base font-medium text-fg">{sideRole.title} · {sideRole.org}</p>
          <p className="mt-1 text-base text-fg-2">{sideRole.text}</p>
        </div>
      </div>

      <h3 className={cn(eyebrow, "mt-12 mb-3")}>Stack</h3>
      <dl>
        {stackGroups.map((group) => (
          <div key={group.category} className={listRow}>
            <dt className="font-mono text-sm text-fg sm:col-span-3">{group.category}</dt>
            <dd className="text-sm text-fg-2 sm:col-span-9">{group.items.join(", ")}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
