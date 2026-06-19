import type { ReactElement } from "react";
import { expCards } from "../../constants/experience";
import { AnimatedTitle } from "../AnimatedTitle";

export function Experience(): ReactElement {
  return (
    <section id="experience" data-morph="2" className="mx-section">
      <header className="mx-shead">
        <AnimatedTitle as="h2" className="mx-h2" text="Experience" />
        <span className="mx-shead__c">2021 — NOW</span>
      </header>

      <div className="mx-exp">
        {expCards.map((e) => (
          <div key={e.company} className="mx-exp__row" data-reveal>
            <div className="mx-exp__co">
              <h3>{e.company}</h3>
              <div className="mx-exp__when">{e.title}<br />{e.date} · {e.location}</div>
            </div>
            <ul className="mx-exp__list">
              {e.highlights.map((h) => <li key={h}>{h}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
