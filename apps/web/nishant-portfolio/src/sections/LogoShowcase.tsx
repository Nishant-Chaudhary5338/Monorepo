const companies = ["Samsung Electronics", "Safex Chemicals", "DevsLane"];

const LogoShowcase = () => (
  <div style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
  <div className="site-container py-5 flex items-center justify-center gap-4 flex-wrap">
    <span
      className="mono-label"
      style={{ color: "var(--fg-muted)", marginRight: "1rem" }}
    >
      Experience at
    </span>
    {companies.map((name, i) => (
      <span key={name} className="flex items-center gap-4">
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.82rem",
            letterSpacing: "0.04em",
            color: "var(--fg-2)",
          }}
        >
          {name}
        </span>
        {i < companies.length - 1 && (
          <span style={{ color: "var(--fg-muted)" }}>·</span>
        )}
      </span>
    ))}
  </div>
  </div>
);

export default LogoShowcase;
