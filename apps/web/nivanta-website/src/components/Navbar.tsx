import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "About Us", href: "#about" },
  { label: "Our Rooms", href: "#rooms" },
  { label: "Amenities", href: "#amenities" },
  { label: "Gallery", href: "#gallery" },
  { label: "Events", href: "#events" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar(): React.JSX.Element {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#FAF8F4] shadow-sm"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-10 h-18 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          className="flex flex-col leading-none group"
        >
          <span
            className={`font-serif text-xl font-semibold tracking-wide transition-colors duration-500 ${
              scrolled ? "text-[#1A1A1A]" : "text-white"
            }`}
          >
            Silvanza
          </span>
          <span
            className={`text-xs tracking-[0.2em] uppercase transition-colors duration-500 ${
              scrolled ? "text-[#C9A84C]" : "text-[#E8CC7A]"
            }`}
          >
            by Nivanta
          </span>
        </a>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <button
                onClick={() => handleNavClick(link.href)}
                className={`text-sm font-medium tracking-wide transition-colors duration-300 hover:text-[#C9A84C] cursor-pointer bg-transparent border-none ${
                  scrolled ? "text-[#1A1A1A]" : "text-white/90"
                }`}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Book Now CTA */}
        <div className="hidden lg:flex items-center gap-4">
          <button
            onClick={() => handleNavClick("#contact")}
            className="px-5 py-2.5 text-sm font-medium border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-white transition-all duration-300 tracking-wide"
          >
            Book Now
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 transition-all duration-300 ${scrolled ? "bg-[#1A1A1A]" : "bg-white"} ${
              menuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 transition-all duration-300 ${scrolled ? "bg-[#1A1A1A]" : "bg-white"} ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 transition-all duration-300 ${scrolled ? "bg-[#1A1A1A]" : "bg-white"} ${
              menuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-[#FAF8F4] border-t border-[#E8CC7A]/30 px-6 py-6"
          >
            <ul className="flex flex-col gap-5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => handleNavClick(link.href)}
                    className="text-base font-medium text-[#1A1A1A] hover:text-[#C9A84C] transition-colors w-full text-left bg-transparent border-none"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => handleNavClick("#contact")}
                  className="mt-2 w-full py-3 text-sm font-medium border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-white transition-all duration-300 tracking-wide"
                >
                  Book Now
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
