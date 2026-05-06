import { Link } from "react-router-dom";

const quickLinks = [
  { label: "About Hotel",         to: "/about" },
  { label: "Our Rooms",           to: "/rooms" },
  { label: "Our Amenities",       to: "/amenities" },
  { label: "Restaurant — Ember",  to: "/restaurant" },
  { label: "Events & Weddings",   to: "/events" },
  { label: "Gallery",             to: "/gallery" },
  { label: "Contact Us",          to: "/contact" },
];

const amenityLinks = [
  { label: "Tattva — Pool", to: "/amenities" },
  { label: "Ember — Restaurant", to: "/restaurant" },
  { label: "Orana — Banquet Hall", to: "/events" },
  { label: "Flaura — Celebration Lawn", to: "/events" },
  { label: "24×7×365 Concierge", to: "/contact" },
];

const socials = [
  { label: "Facebook",    href: "https://www.facebook.com/silvanzabynivanta",  icon: "FB" },
  { label: "Instagram",   href: "https://www.instagram.com/silvanzabynivanta", icon: "IG" },
  { label: "YouTube",     href: "https://www.youtube.com/@silvanzabynivanta",  icon: "YT" },
  { label: "TripAdvisor", href: "#",                                            icon: "TA" },
];

export default function Footer(): React.JSX.Element {
  return (
    <footer
      className="bg-[#020f03] text-white/60"
      role="contentinfo"
      aria-label="Site footer"
    >
      {/* JSON-LD breadcrumb placeholder — injected by pages */}

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-5 lg:px-10 pt-16 pb-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-5" aria-label="Silvanza Resort — Home">
              <p className="font-serif text-xl text-white font-semibold leading-none tracking-[0.1em] uppercase">
                Silvanza Resort
              </p>
              <p className="text-[#B98F39] text-[0.55rem] tracking-[0.25em] uppercase mt-1 font-light">
                by Nivanta
              </p>
            </Link>
            <p className="text-xs font-serif italic text-[#A69045] mb-4 leading-relaxed">
              "A Signature Experience Crafted Especially for You"
            </p>
            <p className="text-xs leading-relaxed text-white/40 mb-5">
              A 4-acre luxury sanctuary in Dhikuli, Ramnagar — at the gateway to Jim Corbett National Park.
            </p>
            {/* Social links */}
            <div className="flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 border border-white/15 flex items-center justify-center text-[0.55rem] text-white/40 hover:border-[#B98F39] hover:text-[#B98F39] transition-colors"
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
                    className="text-xs text-white/45 hover:text-[#B98F39] transition-colors"
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
                    className="text-xs text-white/45 hover:text-[#B98F39] transition-colors"
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
            <div className="space-y-3 text-xs text-white/45">
              <p className="leading-relaxed">
                Village – Dhikuli, Ramnagar,<br />
                Uttarakhand 244715, India
              </p>
              <div className="space-y-1">
                <a href="tel:+919792106111" className="block hover:text-[#B98F39] transition-colors">
                  +91 979 210 6111
                </a>
                <a href="tel:+919792107111" className="block hover:text-[#B98F39] transition-colors">
                  +91 979 210 7111
                </a>
                <a href="tel:+919792109111" className="block hover:text-[#B98F39] transition-colors">
                  +91 979 210 9111
                </a>
              </div>
              <a
                href="mailto:contact@nivantahospitality.com"
                className="block hover:text-[#B98F39] transition-colors break-all"
              >
                contact@nivantahospitality.com
              </a>
              <a
                href="https://nivantahospitality.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-[#B98F39] transition-colors"
              >
                nivantahospitality.com
              </a>
            </div>
          </address>
        </div>

        {/* Live Reviews embed placeholder */}
        {/* LIVE REVIEWS EMBED: Once TripAdvisor/Google Business is live, paste widget code here */}

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-[0.65rem] text-white/25">
          <p>© 2026 Silvanza Resort by Nivanta. All Rights Reserved. Managed by Nivanta Hospitality LLP.</p>
          <div className="flex gap-4">
            <Link to="/contact" className="hover:text-[#B98F39] transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
