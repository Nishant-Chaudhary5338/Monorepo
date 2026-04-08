import { personal } from "../constants";

const Contact = () => {
  return (
    <section
      id="contact"
      style={{ background: "var(--bg-surface)", padding: "var(--space-xl) 0" }}
    >
      <div className="section-wrap">

        {/* Section anatomy header */}
        <p style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.72rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          marginBottom: "var(--space-sm)",
        }}>
          <span style={{ color: "var(--accent-gold)" }}>08</span> — CONTACT
        </p>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontStyle: "italic",
          fontWeight: 900,
          fontSize: "clamp(3rem, 6vw, 6rem)",
          color: "var(--text-primary)",
          lineHeight: 1.05,
          marginBottom: "var(--space-md)",
        }}>
          Let's make{" "}
          <span style={{ color: "var(--accent-purple)" }}>something.</span>
        </h2>
        <hr style={{
          border: "none",
          borderTop: "1px solid var(--border-subtle)",
          marginBottom: "var(--space-lg)",
        }} />

        {/* Links row */}
        <div style={{
          display: "flex",
          gap: "var(--space-lg)",
          flexWrap: "wrap",
          marginBottom: "var(--space-xl)",
        }}>
          <a
            href={`mailto:${personal.email}`}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: "1.1rem",
              color: "var(--text-primary)",
              textDecoration: "none",
              borderBottom: "1px solid var(--border-subtle)",
              paddingBottom: "2px",
              transition: "border-color var(--duration-base) var(--ease-out), color var(--duration-base) var(--ease-out)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--accent-purple)";
              (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent-purple)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border-subtle)";
              (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-primary)";
            }}
          >
            {personal.email}
          </a>

          <a
            href="https://www.linkedin.com/in/nidhi-chhimwal"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: "1.1rem",
              color: "var(--text-primary)",
              textDecoration: "none",
              borderBottom: "1px solid var(--border-subtle)",
              paddingBottom: "2px",
              transition: "border-color var(--duration-base) var(--ease-out), color var(--duration-base) var(--ease-out)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--accent-purple)";
              (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent-purple)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border-subtle)";
              (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-primary)";
            }}
          >
            LinkedIn ↗
          </a>

          <a
            href={personal.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: "1.1rem",
              color: "var(--text-primary)",
              textDecoration: "none",
              borderBottom: "1px solid var(--border-subtle)",
              paddingBottom: "2px",
              transition: "border-color var(--duration-base) var(--ease-out), color var(--duration-base) var(--ease-out)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--accent-purple)";
              (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent-purple)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border-subtle)";
              (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-primary)";
            }}
          >
            Resume ↗
          </a>
        </div>

        {/* Footer row */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "var(--space-md)",
          borderTop: "1px solid var(--border-subtle)",
        }}>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.72rem",
            color: "var(--text-muted)",
          }}>
            © 2025 Nidhi Chhimwal
          </p>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.72rem",
            color: "var(--text-muted)",
          }}>
            Designed &amp; built by Nidhi
          </p>
        </div>

      </div>
    </section>
  );
};

export default Contact;
