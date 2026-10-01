import type { ReactNode } from "react";
import { roles } from "../constants";
import { RichText } from "../components/RichText";
import { Section } from "../components/Section";
import { cn } from "../lib/cn";
import { meta } from "../lib/styles";

const row = cn(
  "grid grid-cols-1 gap-4 py-8 border-t border-line lg:grid-cols-12 lg:gap-6",
  "first:border-t-0 first:pt-0",
);
const bullets = cn(
  "flex list-disc flex-col gap-3 pl-5",
  "text-base text-fg-2 marker:text-line-strong",
);

export default function Experience(): ReactNode {
  return (
    <Section id="experience" number="02" title="Experience">
      <ol>
        {roles.map((role) => (
          <li key={role.company} className={row}>
            <div className="lg:col-span-4">
              <h3 className="text-base font-medium text-fg">{role.company}</h3>
              <p className="text-sm text-fg-2">{role.title}</p>
              <p className={cn(meta, "mt-1")}>{role.date}</p>
              <p className={meta}>{role.location}</p>
            </div>
            <div className="lg:col-span-8">
              <ul className={bullets}>
                {role.highlights.map((h) => (
                  <li key={h}><RichText text={h} /></li>
                ))}
              </ul>
              <p className={cn(meta, "mt-4")}>{role.stack.join(" · ")}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
