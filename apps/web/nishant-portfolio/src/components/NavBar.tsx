import { useState, useEffect } from "react";
import { navLinks } from "../constants";
import ThemeToggle from "./ThemeToggle";

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? "scrolled" : "not-scrolled"}`}>
      <div className="inner">
        <a href="#hero" className="logo">
          Nishant <em>Chaudhary</em>
        </a>

        <nav className="desktop" aria-label="Primary">
          <ul>
            {navLinks.map(({ link, name }) => (
              <li key={name}>
                <a href={link}>{name}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-5">
          <ThemeToggle />
          <div className="contact-btn">
            <span className="availability-dot" />
            <a href="#contact">Hire me</a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
