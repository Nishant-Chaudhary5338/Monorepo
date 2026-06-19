import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import { articleMeta } from "../../articles/index";
import { AnimatedTitle } from "../AnimatedTitle";

const POSTS = articleMeta.filter((a) => a.status === "published").slice(0, 4);

export function Writing(): ReactElement {
  return (
    <section id="writing" data-morph="5" className="mx-section">
      <header className="mx-shead">
        <AnimatedTitle as="h2" className="mx-h2" text="Writing" />
        <span className="mx-shead__c">[ notes on building ]</span>
      </header>

      <div className="mx-writing">
        {POSTS.map((a) => (
          <Link key={a.slug} to={`/writing/${a.slug}`} className="mx-writing__row" data-reveal>
            <span className="mx-writing__meta">{a.date} · {a.readingTime}</span>
            <h3>{a.title}</h3>
            <p>{a.description}</p>
            <span className="mx-writing__go">Read →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
