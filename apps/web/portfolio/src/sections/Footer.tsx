import { personal, navLinks } from "../constants";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        padding: "2.5rem 1.5rem",
        borderTop: "1px solid var(--border)",
        background: "var(--bg-0)",
      }}
    >
      <div
        className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4"
        style={{ color: "var(--text-3)" }}
      >
        {/* Logo */}
        <a
          href="#"
          className="font-serif text-lg font-bold"
          style={{ fontFamily: "Playfair Display, serif", color: "var(--text-2)" }}
        >
          {personal.firstName}
          <span style={{ color: "var(--purple)" }}>.</span>
        </a>

        {/* Nav */}
        <nav className="flex flex-wrap justify-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="footer-link text-sm"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Copyright */}
        <p className="text-xs text-center md:text-right">
          © {year} {personal.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
