import { navLinks } from "../constants/nav";

const Footer = () => (
  <footer
    style={{
      background: "var(--bg-surface)",
      borderTop: "1px solid var(--border-subtle)",
      padding: "2rem 0",
    }}
  >
    <div
      className="section-wrap"
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1.5rem",
      }}
    >
      {/* Logo */}
      <a
        href="/"
        aria-label="Manu Siwatch — Home"
        style={{ textDecoration: "none" }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.88rem",
            color: "var(--accent-teal)",
          }}
        >
          M
        </span>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.88rem",
            color: "var(--text-muted)",
          }}
        >
          {" →"}
        </span>
      </a>

      {/* Nav */}
      <nav aria-label="Footer navigation">
        <ul
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1.5rem",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
        >
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="footer-link" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Colophon */}
      <p
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.72rem",
          color: "var(--text-muted)",
          letterSpacing: "0.04em",
        }}
      >
        © 2026 Manu Siwatch · Built with Claude Code
      </p>
    </div>
  </footer>
);

export default Footer;
