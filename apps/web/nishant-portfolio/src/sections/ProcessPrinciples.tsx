const PROCESS_STEPS = [
  { k: "01", t: "Discover",  d: "Sit with the team. Watch the work. Read the codebase before suggesting anything." },
  { k: "02", t: "Spec",      d: "One page. Constraints, contracts, success metrics. Reviewed before any code." },
  { k: "03", t: "Prototype", d: "A working slice in the smallest possible scope. Real data, real users, no demoware." },
  { k: "04", t: "Ship",      d: "Incremental rollout. Feature flags. Kill-switch ready. Telemetry from day one." },
  { k: "05", t: "Measure",   d: "Numbers attached to claims. If it didn't move the needle, it didn't happen." },
] as const;

const PRINCIPLES = [
  { k: "01", t: "Contracts beat code",          d: "If two teams can't break each other's deploys, the contract is doing its job." },
  { k: "02", t: "Numbers attached to claims",   d: "\"Significantly faster\" is meaningless. \"<60s, p95, measured across 30+ runs\" is real." },
  { k: "03", t: "Automate the boring fast",     d: "Every repetitive task is a missing tool. Build the tool before the second time." },
  { k: "04", t: "DX is a product",              d: "The dev's experience is the user experience. Slow tooling compounds." },
  { k: "05", t: "Read the codebase first",      d: "Existing code is a constraint. Pretending it isn't makes the rewrite a religion." },
  { k: "06", t: "Ship the smallest real slice", d: "Demoware lies. Production teaches." },
] as const;

const ProcessPrinciples = () => (
  <>
    {/* Process */}
    <section id="process" style={{ paddingBlock: "var(--section-py)", borderTop: "1px solid var(--border)" }}>
      <div className="site-container">
        <div className="section-header">
          <div className="num">// 06 · Process</div>
          <h2>
            How I{" "}
            <span style={{ color: "var(--accent)", fontStyle: "italic" }}>actually work.</span>
          </h2>
          <div className="sub">Same pipeline whether it's a component or a platform. Boring on purpose.</div>
        </div>

        <div style={{ position: "relative" }}>
          {/* gradient pipeline spine */}
          <div className="process-spine" />

          <div className="process-steps">
            {PROCESS_STEPS.map((s, i) => (
              <div key={s.k} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 16 }}>
                <span style={{
                  width: 44, height: 44,
                  background: "var(--bg)",
                  border: `1px solid ${i === 0 ? "var(--accent)" : "var(--border-strong)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  font: "var(--mono)", fontSize: 12, letterSpacing: "0.06em",
                  color: i === 0 ? "var(--accent)" : "var(--fg-muted)",
                  boxShadow: i === 0 ? "0 0 24px -6px var(--accent-glow)" : "none",
                  flexShrink: 0,
                }}>
                  {s.k}
                </span>
                <div>
                  <div style={{ font: "600 1.05rem/1.2 var(--font-display)", letterSpacing: "-0.015em", color: "var(--fg)", marginBottom: 8 }}>
                    {s.t}
                  </div>
                  <p style={{ font: "var(--p-sm)", color: "var(--fg-muted)", margin: 0, lineHeight: 1.55 }}>
                    {s.d}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Principles */}
    <section id="principles" style={{ paddingBlock: "var(--section-py)", borderTop: "1px solid var(--border)" }}>
      <div className="site-container">
        <div className="section-header">
          <div className="num">// 07 · Principles</div>
          <h2>
            What I'd write on a{" "}
            <span style={{ color: "var(--accent)", fontStyle: "italic" }}>whiteboard</span>{" "}
            before any project.
          </h2>
          <div className="sub">Six rules, learned the hard way.</div>
        </div>

        <div className="principles-grid">
          {PRINCIPLES.map((p) => (
            <div
              key={p.k}
              style={{ background: "var(--bg)", padding: "28px 28px 32px", display: "flex", flexDirection: "column", gap: 12, transition: "background 260ms var(--ease-out)", cursor: "default" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "rgba(99,102,241,0.04)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "var(--bg)"; }}
            >
              <span style={{ font: "var(--label)", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--accent)" }}>
                // {p.k}
              </span>
              <div style={{ font: "600 1.15rem/1.3 var(--font-display)", letterSpacing: "-0.015em", color: "var(--fg)" }}>
                {p.t}
              </div>
              <p style={{ font: "var(--p-sm)", color: "var(--fg-2)", margin: 0, lineHeight: 1.6 }}>
                {p.d}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </>
);

export default ProcessPrinciples;
