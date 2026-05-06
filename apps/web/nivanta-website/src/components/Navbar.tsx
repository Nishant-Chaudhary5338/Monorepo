import { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "About Us",      to: "/about" },
  { label: "Our Rooms",     to: "/rooms" },
  { label: "Our Amenities", to: "/amenities" },
  { label: "Restaurant",    to: "/restaurant" },
  { label: "Gallery",       to: "/gallery" },
  { label: "Contact Us",    to: "/contact" },
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

  const textColor = scrolled ? "text-[#032105]" : "text-white";
  const goldColor = scrolled ? "text-[#B98F39]" : "text-[#D4B870]";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-[#FAF7F0] shadow-sm" : "bg-transparent"
      }`}
      role="banner"
    >
      {/* Top contact strip — visible on desktop */}
      <div className={`hidden lg:flex items-center justify-end gap-6 px-10 py-1.5 text-xs tracking-wide border-b transition-all duration-500 ${
        scrolled ? "border-[#B98F39]/20 bg-[#F5EDD4]" : "border-white/10 bg-[#032105]/40"
      }`}>
        <a
          href="tel:+919792106111"
          className={`hover:text-[#B98F39] transition-colors ${scrolled ? "text-[#5a5545]" : "text-white/60"}`}
          aria-label="Call Silvanza Resort"
        >
          📞 +91 979 210 6111
        </a>
        <a
          href="mailto:contact@nivantahospitality.com"
          className={`hover:text-[#B98F39] transition-colors ${scrolled ? "text-[#5a5545]" : "text-white/60"}`}
          aria-label="Email Silvanza Resort"
        >
          ✉ contact@nivantahospitality.com
        </a>
      </div>

      <nav
        className="max-w-7xl mx-auto px-5 lg:px-10 h-16 flex items-center justify-between"
        aria-label="Primary navigation"
      >
        {/* Logo */}
        <Link
          to="/"
          className="flex flex-col leading-none group"
          aria-label="Silvanza Resort — Home"
        >
          <span className={`font-serif text-xl font-semibold tracking-[0.08em] uppercase transition-colors duration-500 ${textColor}`}>
            Silvanza Resort
          </span>
          <span className={`text-[0.55rem] tracking-[0.25em] uppercase font-light transition-colors duration-500 ${goldColor}`}>
            by Nivanta
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-7" role="list">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `text-[0.7rem] font-normal tracking-[0.12em] uppercase transition-colors duration-300 hover:text-[#B98F39] ${
                    isActive ? "text-[#B98F39]" : textColor
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Book Now CTA */}
        <div className="hidden lg:flex items-center">
          <button
            onClick={() => navigate("/contact")}
            className="btn btn-primary text-[0.65rem]"
            aria-label="Book your stay at Silvanza Resort"
          >
            Book Now
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden flex flex-col gap-1.5 p-2 focus-visible:outline-none"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <span className={`block w-6 h-px transition-all duration-300 ${scrolled ? "bg-[#032105]" : "bg-white"} ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
          <span className={`block w-6 h-px transition-all duration-300 ${scrolled ? "bg-[#032105]" : "bg-white"} ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-px transition-all duration-300 ${scrolled ? "bg-[#032105]" : "bg-white"} ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-[#FAF7F0] border-t border-[#B98F39]/20 overflow-hidden"
          >
            <ul className="flex flex-col px-6 py-5 gap-4" role="list">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `block text-sm font-normal tracking-wide text-[#032105] hover:text-[#B98F39] transition-colors ${
                        isActive ? "text-[#B98F39]" : ""
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
              {/* Mobile contact */}
              <li className="pt-3 border-t border-[#B98F39]/20">
                <a href="tel:+919792106111" className="block text-sm text-[#5a5545] hover:text-[#B98F39] transition-colors">
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
