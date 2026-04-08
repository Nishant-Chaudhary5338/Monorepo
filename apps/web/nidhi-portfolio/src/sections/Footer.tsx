import { personal, navLinks } from "../constants";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        borderTop: "1px solid var(--border-subtle)",
        background: "var(--bg-surface)",
        padding: "var(--space-md) 0",
      }}
    >
      <div
        className="section-wrap"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "var(--space-sm)",
        }}
      >
        {/* Logo mark */}
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.8rem",
            letterSpacing: "0.06em",
            color: "var(--text-muted)",
          }}
        >
          <span style={{ color: "var(--accent-purple)" }}>N —</span>
        </span>

        {/* Nav */}
        <nav style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-md)" }}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                fontSize: "0.8rem",
                letterSpacing: "0.04em",
                color: "var(--text-muted)",
                textDecoration: "none",
                transition: "color var(--duration-base) var(--ease-out)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--text-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text-muted)";
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Copyright */}
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.68rem",
            color: "var(--text-muted)",
            letterSpacing: "0.04em",
          }}
        >
          © {year} {personal.name}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
