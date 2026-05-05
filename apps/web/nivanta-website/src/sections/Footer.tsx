const navLinks = [
  { label: "About Us", href: "#about" },
  { label: "Our Rooms", href: "#rooms" },
  { label: "Amenities", href: "#amenities" },
  { label: "Gallery", href: "#gallery" },
  { label: "Events", href: "#events" },
  { label: "Contact", href: "#contact" },
];

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/silvanzabynivanta", icon: "f" },
  { label: "Instagram", href: "https://www.instagram.com/silvanzabynivanta", icon: "ig" },
  { label: "YouTube", href: "https://www.youtube.com/@silvanzabynivanta", icon: "yt" },
  { label: "TripAdvisor", href: "#", icon: "ta" },
];

export default function Footer(): React.JSX.Element {
  const handleNavClick = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-[#111111] text-white/70">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-5">
              <p className="font-serif text-2xl text-white font-semibold leading-none">Silvanza</p>
              <p className="text-[#C9A84C] text-xs tracking-[0.25em] uppercase mt-1">by Nivanta</p>
            </div>
            <p className="text-sm leading-relaxed text-white/50 mb-6">
              A signature luxury experience near Jim Corbett National Park, Uttarakhand.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="w-9 h-9 border border-white/20 flex items-center justify-center text-xs text-white/50 hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors"
                >
                  {link.icon.toUpperCase()}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-white font-medium text-sm tracking-wide mb-5 uppercase">Quick Links</p>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => handleNavClick(link.href)}
                    className="text-sm text-white/50 hover:text-[#C9A84C] transition-colors bg-transparent border-none text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Amenities */}
          <div>
            <p className="text-white font-medium text-sm tracking-wide mb-5 uppercase">Amenities</p>
            <ul className="space-y-3 text-sm text-white/50">
              <li>Ember Restaurant</li>
              <li>Tattva Pools</li>
              <li>Orana Banquet</li>
              <li>Flaura Lawn</li>
              <li>24/7 Concierge</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-white font-medium text-sm tracking-wide mb-5 uppercase">Contact</p>
            <div className="space-y-3 text-sm text-white/50">
              <p className="leading-relaxed">
                Village – Dhikuli, Ramnagar,<br />
                Uttarakhand 244715
              </p>
              <div className="space-y-1">
                <a href="tel:+919792106111" className="block hover:text-[#C9A84C] transition-colors">
                  +91 979 210 6111
                </a>
                <a href="tel:+919792107111" className="block hover:text-[#C9A84C] transition-colors">
                  +91 979 210 7111
                </a>
              </div>
              <a
                href="mailto:contact@nivantahospitality.com"
                className="block hover:text-[#C9A84C] transition-colors break-all"
              >
                contact@nivantahospitality.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/30">
          <p>Silvanza Resort by Nivanta © {new Date().getFullYear()} All Rights Reserved</p>
          <p>
            Designed by{" "}
            <a
              href="https://www.instagram.com/midealabs"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#C9A84C] transition-colors"
            >
              MideaLabs
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
