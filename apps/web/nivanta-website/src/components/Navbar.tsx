import { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogoWordmark } from "./LogoSVG";

const navLinks = [
  { label: "About Us",      to: "/about" },
  { label: "Our Rooms",     to: "/rooms" },
  { label: "Our Amenities", to: "/amenities" },
  { label: "Restaurant",    to: "/restaurant" },
  { label: "Gallery",       to: "/gallery" },
  { label: "Contact Us",    to: "/contact" },
];

export default function Navbar(): React.JSX.Element {
  const [scrolled, setScrolled]     = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = (): void => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = (): void => setMenuOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-ivory shadow-sm" : "bg-transparent"
      }`}
      role="banner"
    >
      {/* Contact strip — desktop only */}
      <div
        className={`hidden lg:flex items-center justify-end gap-6 px-10 py-1.5 text-xs tracking-wide border-b transition-all duration-500 ${
          scrolled
            ? "border-gold/20 bg-gold-cream"
            : "border-white/10 bg-forest-deep/40"
        }`}
      >
        <a
          href="tel:+919792106111"
          className={`hover:text-gold transition-colors ${scrolled ? "text-muted" : "text-white/60"}`}
          aria-label="Call Silvanza Resort"
        >
          📞 +91 979 210 6111
        </a>
        <a
          href="mailto:contact@nivantahospitality.com"
          className={`hover:text-gold transition-colors ${scrolled ? "text-muted" : "text-white/60"}`}
          aria-label="Email Silvanza Resort"
        >
          ✉ contact@nivantahospitality.com
        </a>
      </div>

      <nav
        className="max-w-7xl mx-auto px-5 lg:px-10 h-16 flex items-center justify-between"
        aria-label="Primary navigation"
      >
        {/* ── Logo ─────────────────────────────────────── */}
        <Link to="/" className="block" aria-label="Silvanza Resort — Home">
          {logoLoaded ? (
            <img
              src="/logo-light.png"
              alt="Silvanza Resort by Nivanta"
              height={52}
              className="h-13 w-auto object-contain"
              style={{
                filter: scrolled
                  ? "none"
                  : "brightness(0) invert(1) sepia(1) saturate(2) hue-rotate(5deg)",
              }}
            />
          ) : (
            <>
              <img
                src="/logo-light.png"
                alt=""
                className="hidden"
                onLoad={() => setLogoLoaded(true)}
                onError={() => {}}
                aria-hidden="true"
              />
              <LogoWordmark scrolled={scrolled} />
            </>
          )}
        </Link>

        {/* ── Desktop nav ── */}
        <ul className="hidden lg:flex items-center gap-7" role="list">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `text-[0.7rem] font-normal tracking-[0.12em] uppercase transition-colors duration-300 hover:text-gold ${
                    isActive ? "text-gold" : scrolled ? "text-forest-deep" : "text-white"
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* ── Book Now CTA ── */}
        <div className="hidden lg:flex items-center">
          <button
            onClick={() => navigate("/contact")}
            className="btn btn-primary text-[0.65rem]"
            aria-label="Book your stay at Silvanza Resort"
          >
            Book Now
          </button>
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          className="lg:hidden flex flex-col gap-1.5 p-2 focus-visible:outline-none"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <span className={`block w-6 h-px transition-all duration-300 ${scrolled ? "bg-forest-deep" : "bg-white"} ${menuOpen ? "rotate-45 translate-y-1.75" : ""}`} />
          <span className={`block w-6 h-px transition-all duration-300 ${scrolled ? "bg-forest-deep" : "bg-white"} ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-px transition-all duration-300 ${scrolled ? "bg-forest-deep" : "bg-white"} ${menuOpen ? "-rotate-45 -translate-y-1.75" : ""}`} />
        </button>
      </nav>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-ivory border-t border-gold/20 overflow-hidden"
          >
            <ul className="flex flex-col px-6 py-5 gap-4" role="list">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `block text-sm font-normal tracking-wide text-forest-deep hover:text-gold transition-colors ${
                        isActive ? "text-gold" : ""
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
              <li>
                <Link
                  to="/contact"
                  onClick={closeMenu}
                  className="btn btn-primary w-full text-center mt-2 block"
                >
                  Book Now
                </Link>
              </li>
              <li className="pt-3 border-t border-gold/20">
                <a
                  href="tel:+919792106111"
                  className="block text-sm text-muted hover:text-gold transition-colors"
                >
                  📞 +91 979 210 6111
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
