import { useEffect, useState } from "react";
import { navLinks, personal } from "../constants";
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
      {/* Logo */}
      <a href="#" className="navbar-logo" aria-label="Home">
        {personal.firstName}<span>.</span>
      </a>

      {/* Desktop nav */}
      <nav className="hidden lg:block">
        <ul className="nav-links">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Right: Theme toggle + CTA */}
      <div className="flex items-center gap-3">
        <ThemeToggle />

        <a
          href={personal.behance}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden lg:inline-flex btn-outline text-sm !py-2 !px-4"
        >
          Behance ↗
        </a>
        <a href="#contact" className="btn-primary !py-2 !px-5 text-sm hidden lg:inline-flex">
          <span>Hire Me</span>
        </a>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden flex flex-col gap-1.5 p-2 ml-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block w-5 h-0.5 transition-all duration-300"
              style={{
                background: "var(--text-2)",
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

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="absolute top-full left-0 right-0 lg:hidden py-5 px-5 flex flex-col gap-3.5"
          style={{
            background: "rgba(5,4,12,0.97)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium"
              style={{ color: "var(--text-2)" }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="flex gap-3 mt-1">
            <a href="#contact" className="btn-primary flex-1 justify-center text-sm !py-2" onClick={() => setMenuOpen(false)}>
              <span>Hire Me</span>
            </a>
            <a href={personal.behance} target="_blank" rel="noopener noreferrer" className="btn-outline text-sm !py-2 !px-4">
              Behance
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
