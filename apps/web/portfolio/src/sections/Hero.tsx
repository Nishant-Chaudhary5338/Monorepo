import { useEffect, useRef } from "react";
import gsap from "gsap";
import FloatingScene from "../components/FloatingScene";
import { personal } from "../constants";

const Hero = () => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-animate",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 1,
          ease: "power3.out",
          delay: 0.3,
        }
      );
    }, contentRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" className="hero-section">
      {/* 3D background */}
      <div className="hero-canvas">
        <FloatingScene />
      </div>

      {/* Radial glow overlays */}
      <div className="hero-radial-bg" />

      {/* Content */}
      <div ref={contentRef} className="hero-content">
        {/* Availability badge */}
        <div className="hero-animate flex items-center justify-center gap-2 mb-6">
          <span className="pill">
            <span className="glow-dot" />
            Available for Senior Roles
          </span>
        </div>

        {/* Name */}
        <h1 className="hero-title hero-animate">
          <span className="gradient-text">{personal.firstName}</span>
          <br />
          <span style={{ color: "var(--text-1)" }}>
            {personal.name.split(" ")[1]}
          </span>
        </h1>

        {/* Animated role slider */}
        <div className="hero-animate flex items-center justify-center gap-3 mt-3 mb-1">
          <div
            className="h-px w-12 flex-shrink-0"
            style={{ background: "var(--border)" }}
          />
          <div className="hero-role-wrap">
            <div className="hero-role-inner">
              <span>Senior UI/UX Designer</span>
              <span>Illustrator &amp; Visual Artist</span>
              <span>Experience Strategist</span>
            </div>
          </div>
          <div
            className="h-px w-12 flex-shrink-0"
            style={{ background: "var(--border)" }}
          />
        </div>

        {/* Tagline */}
        <p className="hero-tagline hero-animate">{personal.tagline}</p>

        {/* CTAs */}
        <div className="hero-animate flex flex-wrap items-center justify-center gap-4 mt-8">
          <a href="#work" className="btn-primary">
            <span>View My Work</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              aria-hidden="true"
              style={{ position: "relative", zIndex: 1 }}
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a href="#contact" className="btn-outline">
            Say Hello
          </a>
        </div>

        {/* Social proof line */}
        <div className="hero-animate mt-10 flex items-center justify-center gap-3 flex-wrap">
          <span
            className="text-xs font-medium uppercase tracking-widest"
            style={{ color: "var(--text-3)" }}
          >
            Currently at
          </span>
          <span
            className="text-sm font-semibold"
            style={{ color: "var(--text-2)" }}
          >
            Samsung Electronics
          </span>
          <span style={{ color: "var(--border)" }}>·</span>
          <a
            href={personal.behance}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium transition-colors"
            style={{ color: "var(--purple)" }}
          >
            View Behance →
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="scroll-indicator">
        <div className="scroll-line" />
        <span>Scroll</span>
      </div>
    </section>
  );
};

export default Hero;
