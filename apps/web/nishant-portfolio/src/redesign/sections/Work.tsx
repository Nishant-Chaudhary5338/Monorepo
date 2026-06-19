import type { ReactElement } from "react";
import { projects } from "../../constants/projects";
import { counterItems } from "../../constants/skills";
import { AnimatedTitle } from "../AnimatedTitle";

const FEATURED = projects.slice(0, 6);

export function Work(): ReactElement {
  return (
    <section id="work" data-morph="1" className="mx-section">
      <header className="mx-shead">
        <AnimatedTitle as="h2" className="mx-h2" text="Selected Work" />
        <span className="mx-shead__c">[ {String(FEATURED.length).padStart(2, "0")} projects ]</span>
      </header>

      <div className="mx-work">
        {FEATURED.map((p, i) => (
          <a
            key={p.title}
            className="mx-work__row"
            href={p.link ?? "#"}
            {...(p.link ? { target: "_blank", rel: "noreferrer" } : {})}
            data-reveal
          >
            <span className="mx-work__n">{String(i + 1).padStart(2, "0")}</span>
            <span className="mx-work__t">
              <h3>{p.title}</h3>
              <p>{p.description}</p>
            </span>
            <span className="mx-work__tags">{p.tags.slice(0, 3).join(" · ")}</span>
            <span className="mx-work__ar">↗</span>
          </a>
        ))}
      </div>

      <div className="mx-metrics">
        {counterItems.map((c) => (
          <div key={c.label} className="mx-metric" data-reveal>
            <div className="mx-metric__v">{c.value}{c.suffix}</div>
            <div className="mx-metric__k">{c.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
