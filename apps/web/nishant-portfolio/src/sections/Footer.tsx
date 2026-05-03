import { personalInfo } from "../constants";

const links = [
  { label: "LinkedIn", handle: "nishant-chaudhary", url: personalInfo.linkedin },
  { label: "GitHub", handle: "nishantchaudhary5338", url: personalInfo.github },
  { label: "Email", handle: personalInfo.email, url: `mailto:${personalInfo.email}` },
  { label: "Phone", handle: personalInfo.phone, url: `tel:${personalInfo.phone.replace(/\s/g, "")}` },
];

const Footer = () => (
  <footer
    style={{
      borderTop: "1px solid var(--rule)",
      padding: "5rem 0 3rem",
      margin: "4rem 0 0",
    }}
  >
    <div className="site-container">

      {/* Main CTA row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 mb-16">

        {/* Left: CTA headline + email */}
        <div>
          <h2
            className="display-headline"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", maxWidth: "18ch", lineHeight: 1.1 }}
          >
            Let's build something <em>great.</em>
          </h2>
          <a
            href={`mailto:${personalInfo.email}`}
            style={{
              display: "inline-block",
              fontFamily: "var(--font-mono)",
              fontSize: "0.96rem",
              marginTop: "1.5rem",
              color: "var(--text-primary)",
              textDecoration: "none",
              borderBottom: "1.5px solid var(--accent-warm)",
              paddingBottom: "0.2rem",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent-warm)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-primary)"; }}
          >
            {personalInfo.email} →
          </a>
        </div>

        {/* Right: Links list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {links.map(({ label, handle, url }) => (
            <a
              key={label}
              href={url}
              target={url.startsWith("http") ? "_blank" : undefined}
              rel={url.startsWith("http") ? "noopener noreferrer" : undefined}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                fontFamily: "var(--font-mono)",
                fontSize: "0.88rem",
                color: "var(--text-muted)",
                textDecoration: "none",
                borderBottom: "1px dashed var(--border-color)",
                padding: "0.6rem 0",
                transition: "color 0.18s, border-color 0.18s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.color = "var(--accent-warm)";
                el.style.borderBottomColor = "var(--accent-warm)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.color = "var(--text-muted)";
                el.style.borderBottomColor = "var(--border-color)";
              }}
            >
              <span>{label}</span>
              <span style={{ fontSize: "0.78rem", letterSpacing: "0.05em" }}>{handle}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Colophon */}
      <div
        style={{
          borderTop: "1px solid var(--rule)",
          paddingTop: "2rem",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.75rem",
          fontFamily: "var(--font-mono)",
          fontSize: "0.72rem",
          color: "var(--text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        <span>Set in Instrument Serif · JetBrains Mono</span>
        <span>© {new Date().getFullYear()} {personalInfo.name}</span>
        <span>Delhi, India · 28.61° N, 77.21° E</span>
      </div>

    </div>
  </footer>
);

export default Footer;
