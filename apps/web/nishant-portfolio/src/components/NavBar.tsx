import { useState, useEffect, useCallback, useRef } from "react";
import gsap from "gsap";
import { navLinks } from "../constants";
import ThemeToggle from "./ThemeToggle";

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const hireRef = useRef<HTMLDivElement>(null);

  const handleHireMagnet = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hireRef.current) return;
    const rect = hireRef.current.getBoundingClientRect();
    const ox = (e.clientX - rect.left - rect.width / 2) * 0.35;
    const oy = (e.clientY - rect.top - rect.height / 2) * 0.35;
    gsap.to(hireRef.current, { x: ox, y: oy, duration: 0.3, ease: "power2.out" });
  };

  const handleHireLeave = () => {
    if (!hireRef.current) return;
    gsap.to(hireRef.current, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
  };

  const updateScroll = useCallback(() => {
    const y = window.scrollY;
    setScrolled(y > 10);

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    setScrollProgress(docHeight > 0 ? (y / docHeight) * 100 : 0);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", updateScroll, { passive: true });
    return () => window.removeEventListener("scroll", updateScroll);
  }, [updateScroll]);

  useEffect(() => {
    const sectionIds = navLinks.map((l) => l.link.replace("#", ""));
    const observers = sectionIds.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((obs) => obs?.disconnect());
  }, []);

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className={`navbar ${scrolled ? "scrolled" : "not-scrolled"}`}>
        {/* Scroll progress line */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            height: "1.5px",
            width: `${scrollProgress}%`,
            backgroundColor: "var(--accent-warm)",
            transition: "width 0.1s linear",
            pointerEvents: "none",
          }}
        />

        <div className="inner">
          <a href="#hero" className="logo" onClick={closeMenu}>
            Nishant <em>Chaudhary</em>
          </a>

          {/* Desktop nav */}
          <nav className="desktop" aria-label="Primary">
            <ul>
              {navLinks.map(({ link, name }) => {
                const sectionId = link.replace("#", "");
                const isActive = activeSection === sectionId;
                return (
                  <li key={name}>
                    <a
                      href={link}
                      style={{
                        color: isActive ? "var(--text-primary)" : undefined,
                        borderBottom: isActive ? "1px solid var(--accent-warm)" : "1px solid transparent",
                        paddingBottom: "2px",
                        transition: "color 0.2s, border-color 0.2s",
                      }}
                    >
                      {name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div
              ref={hireRef}
              className="contact-btn hidden lg:flex"
              onMouseMove={handleHireMagnet}
              onMouseLeave={handleHireLeave}
            >
              <span className="availability-dot" />
              <a href="#contact">Hire me</a>
            </div>

            {/* Hamburger — mobile only */}
            <button
              className="lg:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                color: "var(--text-primary)",
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                width: "24px",
              }}
            >
              <span
                style={{
                  display: "block",
                  height: "1.5px",
                  backgroundColor: "currentColor",
                  transformOrigin: "center",
                  transition: "transform 0.25s ease, opacity 0.25s ease",
                  transform: menuOpen ? "translateY(6.5px) rotate(45deg)" : "none",
                }}
              />
              <span
                style={{
                  display: "block",
                  height: "1.5px",
                  backgroundColor: "currentColor",
                  transition: "opacity 0.25s ease",
                  opacity: menuOpen ? 0 : 1,
                }}
              />
              <span
                style={{
                  display: "block",
                  height: "1.5px",
                  backgroundColor: "currentColor",
                  transformOrigin: "center",
                  transition: "transform 0.25s ease, opacity 0.25s ease",
                  transform: menuOpen ? "translateY(-6.5px) rotate(-45deg)" : "none",
                }}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        aria-hidden={!menuOpen}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 90,
          backgroundColor: "var(--bg-primary)",
          display: "flex",
          flexDirection: "column",
          padding: "7rem 1.5rem 3rem",
          transform: menuOpen ? "translateY(0)" : "translateY(-100%)",
          opacity: menuOpen ? 1 : 0,
          transition: "transform 0.35s cubic-bezier(0.77,0,0.18,1), opacity 0.3s ease",
          pointerEvents: menuOpen ? "auto" : "none",
        }}
      >
        <nav aria-label="Mobile">
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {navLinks.map(({ link, name }, i) => {
              const sectionId = link.replace("#", "");
              const isActive = activeSection === sectionId;
              return (
                <li
                  key={name}
                  style={{
                    borderBottom: "1px solid var(--rule)",
                    transform: menuOpen ? "translateY(0)" : "translateY(-12px)",
                    opacity: menuOpen ? 1 : 0,
                    transition: `transform 0.35s ease ${i * 0.05}s, opacity 0.3s ease ${i * 0.05}s`,
                  }}
                >
                  <a
                    href={link}
                    onClick={closeMenu}
                    style={{
                      display: "block",
                      padding: "1.4rem 0",
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(1.8rem, 7vw, 2.5rem)",
                      fontWeight: 400,
                      letterSpacing: "-0.02em",
                      color: isActive ? "var(--accent-warm)" : "var(--text-primary)",
                      textDecoration: "none",
                      transition: "color 0.2s",
                    }}
                  >
                    {isActive ? <em>{name}</em> : name}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div
          style={{
            marginTop: "auto",
            opacity: menuOpen ? 1 : 0,
            transition: "opacity 0.4s ease 0.25s",
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="availability-dot" />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.78rem",
                color: "var(--text-muted)",
                letterSpacing: "0.06em",
              }}
            >
              Available · Senior &amp; Staff roles · Remote
            </span>
          </div>
          <a
            href="#contact"
            onClick={closeMenu}
            style={{
              display: "inline-block",
              fontFamily: "var(--font-mono)",
              fontSize: "0.84rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--text-primary)",
              textDecoration: "none",
              borderBottom: "1.5px solid var(--accent-warm)",
              paddingBottom: "0.2rem",
            }}
          >
            Hire me →
          </a>
        </div>
      </div>
    </>
  );
};

export default NavBar;
