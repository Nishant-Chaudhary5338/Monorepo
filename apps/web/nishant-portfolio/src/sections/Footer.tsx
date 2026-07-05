import { personalInfo, navLinks } from "../constants";
import { useGeoCV } from "../hooks/useGeoCV";

const Footer = () => {
  const year = new Date().getFullYear();
  const { downloadCV, status } = useGeoCV();

  return (
    <footer style={{ borderTop: "1px solid var(--border-subtle)", background: "var(--bg-surface)", padding: "var(--space-md) 0" }}>
      <div className="section-wrap" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-sm)" }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem", letterSpacing: "0.06em", color: "var(--text-muted)" }}>
          <span style={{ color: "var(--accent-purple)" }}>N —</span>
        </span>

        <nav style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-md)" }}>
          {navLinks.map((link) => (
            <a key={link.link} href={link.link} className="footer-link" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.8rem", letterSpacing: "0.04em" }}>
              {link.name}
            </a>
          ))}
          <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="footer-link" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.8rem", letterSpacing: "0.04em" }}>
            LinkedIn
          </a>
          <a href={personalInfo.github} target="_blank" rel="noreferrer" className="footer-link" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.8rem", letterSpacing: "0.04em" }}>
            GitHub
          </a>
          <a href="https://www.npmjs.com/package/mcp-react-toolkit" target="_blank" rel="noreferrer" className="footer-link" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.8rem", letterSpacing: "0.04em" }}>
            npm
          </a>
          <button
            type="button"
            onClick={downloadCV}
            disabled={status === "loading"}
            className="footer-link"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.8rem", letterSpacing: "0.04em", background: "none", border: 0, padding: 0, cursor: "pointer" }}
          >
            {status === "done" ? "Resume ✓" : "Resume ↓"}
          </button>
        </nav>

        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", color: "var(--text-muted)", letterSpacing: "0.04em" }}>
          © {year} {personalInfo.name} — {personalInfo.location}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
