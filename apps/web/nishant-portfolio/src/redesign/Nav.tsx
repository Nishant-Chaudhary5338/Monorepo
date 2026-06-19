import { useEffect, useRef, type ReactElement, type MouseEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

const LINKS = [
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "Stack", href: "#stack" },
  { label: "Writing", href: "#writing" },
  { label: "Contact", href: "#contact" },
] as const;

export function Nav({ lenis }: { lenis: React.RefObject<Lenis | null> }): ReactElement {
  const navRef = useRef<HTMLElement>(null);

  // hide on scroll-down, reveal on scroll-up
  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      start: "top -80",
      end: 99999,
      onUpdate: (self) => {
        gsap.to(el, { y: self.direction === 1 ? -120 : 0, duration: 0.4, ease: "power2.out" });
      },
    });
    return () => st.kill();
  }, []);

  const onNav = (e: MouseEvent<HTMLAnchorElement>, href: string): void => {
    if (!lenis.current) return;
    e.preventDefault();
    lenis.current.scrollTo(href, { offset: 0 });
  };

  return (
    <nav className="mx-nav" ref={navRef}>
      <a href="#hero" className="mx-nav__brand" onClick={(e) => onNav(e, "#hero")}>Nishant Chaudhary</a>
      <div className="mx-nav__links">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={(e) => onNav(e, l.href)}>{l.label}</a>
        ))}
      </div>
    </nav>
  );
}
