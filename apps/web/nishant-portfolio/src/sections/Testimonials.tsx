import TitleHeader from "../components/TitleHeader";

const quickFacts = [
  { metric: "<60s", label: "Plugin onboarding — down from days, via Vite Module Federation" },
  { metric: "~65%", label: "Frontend workflows automated via custom MCP servers" },
  { metric: "30+", label: "Engineers trained on AI-native dev across 5 Samsung R&D teams" },
  { metric: "6", label: "Product teams shipping on the shared headless UI library" },
  { metric: "25,000+", label: "B2B customers on the Safex e-commerce platform" },
];

const openTo = [
  "Senior & Staff frontend roles",
  "Remote · UK · EU · US · SG",
  "Product-led companies, platform teams",
  "Plugin-based MFE on Vite Module Federation",
  "Expanding MCP tooling into agent-assisted CI/CD",
];

const Testimonials = () => (
  <section id="about" style={{ paddingBlock: "var(--section-py)" }}>
    <div className="site-container">
    <TitleHeader
      num="05"
      label="About"
      title={<>The person behind <em>the platforms.</em></>}
      className="mb-12 md:mb-16"
    />

    <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 xl:gap-20 ruled-top pt-10">

      {/* Left: Bio */}
      <div className="xl:col-span-7 flex flex-col gap-6 text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        <p>
          I'm a{" "}
          <strong style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)", fontStyle: "italic" }}>
            Senior Frontend Engineer at Samsung Electronics
          </strong>
          , leading architecture for TVPlus TestSuite — a content-QA platform for Linear channels and VOD.
          I work where micro-frontends, MCP tooling, and AI-assisted developer experience meet production scale.
        </p>
        <p>
          I replaced redeploy-per-feature cycles with a{" "}
          <strong style={{ color: "var(--text-primary)" }}>plugin-based MFE platform</strong>{" "}
          on Vite Module Federation — cutting plugin onboarding from days to under 60 seconds,
          enabling fully independent team deploys with no shared release trains.
        </p>
        <p>
          I also built an{" "}
          <strong style={{ color: "var(--text-primary)" }}>internal MCP tooling ecosystem</strong>{" "}
          on Turborepo, automating ~65% of routine frontend work — UI generation, scaffolding, code review,
          and test generation all become one-line invocations. I then trained 30+ engineers across 5 teams
          to adopt these AI-native workflows.
        </p>
        <p>
          I'm open to senior and staff-level roles at product-led companies where architecture,
          developer experience, and engineering velocity are first-class priorities.
        </p>
      </div>

      {/* Right: Facts + Open to */}
      <div className="xl:col-span-5 flex flex-col gap-8">

        {/* Quick facts */}
        <div>
          <div className="mono-label mb-5" style={{ color: "var(--accent-warm)" }}>Impact</div>
          <div className="flex flex-col">
            {quickFacts.map(({ metric, label }) => (
              <div
                key={metric}
                className="flex items-start gap-5 py-4"
                style={{ borderBottom: "1px solid var(--rule)" }}
              >
                <div
                  className="display-headline shrink-0"
                  style={{ fontSize: "1.6rem", color: "var(--accent-warm)", minWidth: "5rem" }}
                >
                  {metric}
                </div>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.55, paddingTop: "0.3rem" }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Open to */}
        <div>
          <div className="mono-label mb-4" style={{ color: "var(--accent-warm)" }}>Open to</div>
          <ul className="flex flex-col gap-3">
            {openTo.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3"
                style={{ color: "var(--text-secondary)", fontSize: "0.97rem" }}
              >
                <span style={{ color: "var(--accent-warm)", flexShrink: 0 }}>▸</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
    </div>
  </section>
);

export default Testimonials;
