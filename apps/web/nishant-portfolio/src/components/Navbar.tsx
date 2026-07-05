import { useEffect, useState } from "react";
import { navLinks, personalInfo } from "../constants";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isDark = theme === "dark";

  return (
    <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <a href="/" className="navbar-logo" aria-label="Home">
        N<span className="navbar-logo-dash"> —</span>
      </a>

      <nav className="hidden lg:block">
        <ul className="nav-links">
          {navLinks.map((link) => (
            <li key={link.link}>
              <a href={link.link}>{link.name}</a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex items-center gap-4">
        <button
          className="theme-toggle"
          role="switch"
          aria-checked={isDark ? "true" : "false"}
          aria-label="Toggle color theme"
          onClick={toggleTheme}
        >
          <span className="toggle-knob" />
        </button>

        <a
          href={personalInfo.github}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden lg:inline-flex btn-ghost text-sm"
        >
          GitHub ↗
        </a>

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
              key={link.link}
              href={link.link}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.95rem",
                fontWeight: 600,
                color: "var(--text-secondary)",
              }}
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <div className="flex gap-3 mt-2 pt-4" style={{ borderTop: "1px solid var(--border-subtle)" }}>
            <a
              href="#contact"
              className="btn-primary flex-1 justify-center"
              onClick={() => setMenuOpen(false)}
            >
              <span>Say Hello</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
