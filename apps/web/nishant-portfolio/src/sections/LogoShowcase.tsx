const companies = ["Samsung Electronics", "Safex Chemicals", "DevsLane"];

const LogoShowcase = () => (
  <div
    className="py-5 px-5 md:px-20 flex items-center justify-center gap-4 flex-wrap"
    style={{ borderTop: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)" }}
  >
    <span
      className="mono-label"
      style={{ color: "var(--text-muted)", marginRight: "1rem" }}
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
            color: "var(--text-secondary)",
          }}
        >
          {name}
        </span>
        {i < companies.length - 1 && (
          <span style={{ color: "var(--text-muted)" }}>·</span>
        )}
      </span>
    ))}
  </div>
);

export default LogoShowcase;
