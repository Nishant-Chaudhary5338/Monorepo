import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { navLinks, personalInfo } from "../constants";
import { useActiveSection } from "../hooks/useActiveSection";
import { cn } from "../lib/cn";
import { container } from "../lib/styles";
import { ThemeToggle } from "./ThemeToggle";

interface NavbarProps {
  // Content pages show a single way back instead of the section links.
  back?: { label: string; to: string };
}

const SECTION_IDS = navLinks.map((l) => l.id);

const bar = cn("sticky top-0 z-50 bg-canvas border-b transition-colors duration-150");
const inner = cn(container, "flex h-14 items-center justify-between gap-6");
const navItem = "text-sm text-fg-2 transition-colors duration-150 hover:text-fg";
const mobilePanel = cn(container, "flex flex-col gap-1 pb-4 lg:hidden");
const mobileItem = "block py-2 text-base text-fg-2 hover:text-fg";

export default function Navbar({ back }: NavbarProps): ReactNode {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useActiveSection(back ? [] : SECTION_IDS);

  useEffect(() => {
    const onScroll = (): void => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const sectionLinks = navLinks.map((link) => (
    <a
      key={link.id}
      href={`/#${link.id}`}
      aria-current={active === link.id ? "true" : undefined}
      className={cn(navItem, active === link.id && "text-accent")}
    >
      {link.name}
    </a>
  ));

  return (
    <header className={cn(bar, scrolled ? "border-line" : "border-transparent")}>
      <div className={inner}>
        <Link to="/" className="text-sm font-medium text-fg">{personalInfo.name}</Link>

        {back ? (
          <div className="flex items-center gap-4">
            <Link to={back.to} className={navItem}>← {back.label}</Link>
            <ThemeToggle />
          </div>
        ) : (
          <>
            <nav aria-label="Sections" className="hidden items-center gap-6 lg:flex">{sectionLinks}</nav>
            <div className="flex items-center gap-2">
              <a href={`mailto:${personalInfo.email}`} className={cn(navItem, "px-2")}>Email</a>
              <ThemeToggle />
              <button
                type="button"
                className="px-2 py-1 text-sm text-fg-2 hover:text-fg lg:hidden"
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                onClick={() => setMenuOpen((open) => !open)}
              >
                {menuOpen ? "Close" : "Menu"}
              </button>
            </div>
          </>
        )}
      </div>

      {!back && menuOpen && (
        <nav id="mobile-menu" aria-label="Sections" className={mobilePanel}>
          {navLinks.map((link) => (
            <a key={link.id} href={`/#${link.id}`} className={mobileItem} onClick={() => setMenuOpen(false)}>
              {link.name}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
