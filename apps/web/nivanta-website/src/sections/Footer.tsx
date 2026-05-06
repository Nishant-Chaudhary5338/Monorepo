import { Link } from "react-router-dom";
import { LogoFull } from "../components/LogoSVG";

const quickLinks = [
  { label: "About Hotel",        to: "/about" },
  { label: "Our Rooms",          to: "/rooms" },
  { label: "Our Amenities",      to: "/amenities" },
  { label: "Restaurant — Ember", to: "/restaurant" },
  { label: "Events & Weddings",  to: "/events" },
  { label: "Gallery",            to: "/gallery" },
  { label: "Contact Us",         to: "/contact" },
];

const amenityLinks = [
  { label: "Tattva — Pool",           to: "/amenities" },
  { label: "Ember — Restaurant",      to: "/restaurant" },
  { label: "Orana — Banquet Hall",    to: "/events" },
  { label: "Flaura — Celebration Lawn", to: "/events" },
  { label: "24×7×365 Concierge",      to: "/contact" },
];

const socials = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/silvanzabynivanta",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/silvanzabynivanta",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@silvanzabynivanta",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    label: "TripAdvisor",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path d="M12.006 4.295c-2.67 0-5.338.784-7.645 2.353H0l1.963 2.135a5.996 5.996 0 00-.498 6.442 6.037 6.037 0 0010.532 0 6.037 6.037 0 0010.532 0 5.996 5.996 0 00-.498-6.442L24 6.648h-4.35c-2.307-1.569-4.974-2.353-7.644-2.353zm0 1.882c1.57 0 3.12.34 4.558.99a9.775 9.775 0 00-4.558-1.04 9.775 9.775 0 00-4.557 1.04 10.57 10.57 0 014.557-.99zm-6.03 3.39a4.125 4.125 0 110 8.25 4.125 4.125 0 010-8.25zm12.06 0a4.125 4.125 0 110 8.25 4.125 4.125 0 010-8.25zM5.976 11.44a2.122 2.122 0 100 4.244 2.122 2.122 0 000-4.244zm12.06 0a2.122 2.122 0 100 4.244 2.122 2.122 0 000-4.244z"/>
      </svg>
    ),
  },
];

export default function Footer(): React.JSX.Element {
  return (
    <footer
      className="bg-[#020f03] text-white/60"
      role="contentinfo"
      aria-label="Site footer"
    >
      {/* LIVE REVIEWS EMBED: Once TripAdvisor / Google Business listing is live, paste widget code here */}

      <div className="max-w-7xl mx-auto px-5 lg:px-10 pt-16 pb-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

          {/* Brand — full logo */}
          <div className="lg:col-span-1 flex flex-col items-start">
            <Link to="/" aria-label="Silvanza Resort — Home" className="mb-4 block">
              {/* Try PNG logo first */}
              <img
                src="/logo-light.png"
                alt="Silvanza Resort by Nivanta"
                height={140}
                className="h-35 w-auto object-contain"
                style={{ mixBlendMode: "screen" }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling?.removeAttribute("hidden");
                }}
              />
              {/* SVG fallback — hidden until img errors */}
              <span hidden>
                <LogoFull variant="light" />
              </span>
            </Link>

            <p className="text-xs font-serif italic text-gold-light mb-4 leading-relaxed">
              "A Signature Experience Crafted Especially for You"
            </p>
            <p className="text-xs leading-relaxed text-white/60 mb-5">
              A 4-acre luxury sanctuary in Dhikuli, Ramnagar — at the gateway to Jim Corbett National Park.
            </p>

            {/* Social icons — proper SVG brand icons */}
            <div className="flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow Silvanza Resort on ${s.label}`}
                  className="w-8 h-8 border border-white/15 flex items-center justify-center text-white/60 hover:border-gold hover:text-gold transition-all duration-300"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <nav aria-label="Footer quick links">
            <p className="eyebrow eyebrow-light mb-5">Quick Links</p>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-xs text-white/65 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Amenities */}
          <nav aria-label="Footer amenities">
            <p className="eyebrow eyebrow-light mb-5">Our Amenities</p>
            <ul className="space-y-2.5">
              {amenityLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-xs text-white/65 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <address className="not-italic">
            <p className="eyebrow eyebrow-light mb-5">Contact</p>
            <div className="space-y-3 text-xs text-white/65">
              <p className="leading-relaxed">
                Village – Dhikuli, Ramnagar,<br />
                Uttarakhand 244715, India
              </p>
              <div className="space-y-0">
                <a href="tel:+919792106111" className="flex items-center min-h-11 py-1.5 hover:text-gold transition-colors">+91 979 210 6111</a>
                <a href="tel:+919792107111" className="flex items-center min-h-11 py-1.5 hover:text-gold transition-colors">+91 979 210 7111</a>
                <a href="tel:+919792109111" className="flex items-center min-h-11 py-1.5 hover:text-gold transition-colors">+91 979 210 9111</a>
              </div>
              <a href="mailto:contact@nivantahospitality.com" className="block hover:text-gold transition-colors break-all">
                contact@nivantahospitality.com
              </a>
              <a href="https://nivantahospitality.com" target="_blank" rel="noopener noreferrer" className="block hover:text-gold transition-colors">
                nivantahospitality.com
              </a>
            </div>
          </address>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-[0.65rem] text-white/25">
          <p>© 2026 Silvanza Resort by Nivanta. All Rights Reserved. Managed by Nivanta Hospitality LLP.</p>
          <div className="flex gap-4">
            <Link to="/contact" className="hover:text-gold transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
