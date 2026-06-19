import type { ReactElement } from "react";

export function About(): ReactElement {
  return (
    <section id="about" data-morph="4" className="mx-section mx-about">
      <span className="mx-eyebrow" data-reveal>About</span>
      <p className="mx-pull" data-reveal>
        I build the parts users <em>feel</em> — and the systems that keep them
        <em> consistent</em> at scale.
      </p>
      <p className="mx-about__sub" data-reveal>
        Senior Frontend Engineer at Samsung Electronics. Four years shipping production
        React and TypeScript interfaces — accessible, fast, detailed — alongside the design
        systems, micro-frontend platforms, and MCP tooling that keep them coherent as teams grow.
      </p>
    </section>
  );
}
