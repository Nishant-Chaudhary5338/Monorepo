import type { ReactNode } from "react";
import { cn } from "../lib/cn";
import { container, eyebrow } from "../lib/styles";

interface SectionProps {
  id: string;
  number: string;
  title: string;
  children: ReactNode;
}

const grid = cn(container, "grid grid-cols-1 gap-8 lg:grid-cols-12");
const header = "lg:sticky lg:top-20 lg:col-span-4 lg:self-start";
const heading = "mt-2 text-xl font-medium tracking-heading text-fg";

export function Section({ id, number, title, children }: SectionProps): ReactNode {
  const headingId = `${id}-title`;
  return (
    <section id={id} aria-labelledby={headingId} className="pb-section">
      <div className={cn(container, "mb-10")}>
        <div className="relative border-t border-line">
          <span aria-hidden="true" className="absolute left-0 -top-px h-px w-6 bg-accent" />
        </div>
      </div>
      <div className={grid}>
        <header className={header}>
          <p className={eyebrow}>{number}</p>
          <h2 id={headingId} className={heading}>{title}</h2>
        </header>
        <div className="min-w-0 lg:col-span-8">{children}</div>
      </div>
    </section>
  );
}
