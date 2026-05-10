import { useEffect, useState } from "react";
import { navLinks } from "../constants/nav";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
      {/* Logo mark */}
      <a href="/" className="navbar-logo" aria-label="Manu Siwatch — Home">
        M<span className="navbar-logo-dash"> —</span>
      </a>

      {/* Desktop nav */}
      <nav className="hidden lg:block" aria-label="Primary navigation">
        <ul className="nav-links">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Right: toggle + CTA + mobile burger */}
      <div className="flex items-center gap-4">
        <ThemeToggle />

        <a
          href="#contact"
          className="hidden lg:inline-flex btn-primary"
          style={{ padding: "0.55rem 1.25rem", fontSize: "0.85rem" }}
        >
          Hire me →
        </a>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden flex flex-col gap-1.5 p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block w-5 h-px"
              style={{
                background: "var(--text-secondary)",
                transition: "transform 250ms, opacity 150ms",
                transform:
                  i === 0 && menuOpen ? "rotate(45deg) translate(3px, 3px)"
                  : i === 2 && menuOpen ? "rotate(-45deg) translate(3px, -3px)"
                  : "",
                opacity: i === 1 && menuOpen ? 0 : 1,
              }}
            />
          ))}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          className="absolute top-full left-0 right-0 lg:hidden py-6 px-6 flex flex-col gap-4"
          style={{
            background: "var(--bg-overlay)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.95rem",
                fontWeight: 600,
                color: "var(--text-secondary)",
              }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="mt-2 pt-4" style={{ borderTop: "1px solid var(--border-subtle)" }}>
            <a
              href="#contact"
              className="btn-primary w-full justify-center"
              onClick={() => setMenuOpen(false)}
            >
              Hire me →
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
