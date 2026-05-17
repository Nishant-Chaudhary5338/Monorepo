import { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "About Us",         to: "/about" },
  { label: "Our Rooms",        to: "/rooms" },
  { label: "Our Amenities",    to: "/amenities" },
  { label: "Restaurant",       to: "/restaurant" },
  { label: "Events & Weddings", to: "/events" },
  { label: "Gallery",          to: "/gallery" },
  { label: "Contact Us",       to: "/contact" },
];

export default function Navbar(): React.JSX.Element {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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
        scrolled ? "bg-ivory shadow-sm" : "bg-forest-deep"
      }`}
      role="banner"
    >
      <nav
        className="max-w-7xl mx-auto px-5 lg:px-10 h-16 flex items-center justify-between"
        aria-label="Primary navigation"
      >
        {/* ── Logo ─────────────────────────────────────── */}
        <Link to="/" className="shrink-0" aria-label="Silvanza Resort — Home">
          <img
            src="/logo-rect.png"
            alt="Silvanza Resort by Nivanta"
            className="h-11 w-auto object-contain transition-all duration-500"
            style={scrolled ? {} : { filter: "brightness(0) invert(1) sepia(1) saturate(3) hue-rotate(5deg)" }}
          />
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

        {/* ── Book Now CTA + contact icons ── */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href="tel:+919792106111"
            aria-label="Call Silvanza Resort: +91 979 210 6111"
            title="+91 979 210 6111"
            className={`p-1.5 rounded-full transition-colors hover:text-gold ${scrolled ? "text-forest-deep" : "text-white"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.74a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.03z"/>
            </svg>
          </a>
          <a
            href="mailto:sales@nivantahospitality.com"
            aria-label="Email Silvanza Resort: sales@nivantahospitality.com"
            title="sales@nivantahospitality.com"
            className={`p-1.5 rounded-full transition-colors hover:text-gold ${scrolled ? "text-forest-deep" : "text-white"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect width="20" height="16" x="2" y="4" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
          </a>
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
              <li className="pt-3 border-t border-gold/20 flex gap-4">
                <a
                  href="tel:+919792106111"
                  aria-label="Call Silvanza Resort: +91 979 210 6111"
                  title="+91 979 210 6111"
                  className="p-2 text-forest-deep hover:text-gold transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.74a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.03z"/>
                  </svg>
                </a>
                <a
                  href="mailto:sales@nivantahospitality.com"
                  aria-label="Email Silvanza Resort: sales@nivantahospitality.com"
                  title="sales@nivantahospitality.com"
                  className="p-2 text-forest-deep hover:text-gold transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect width="20" height="16" x="2" y="4" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
