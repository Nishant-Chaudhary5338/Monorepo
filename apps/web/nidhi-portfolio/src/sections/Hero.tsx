import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { personal } from "../constants";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const ctx = gsap.context(() => {
      // ── Clip-path text reveal ──────────────────────────────
      // Names print up from baseline — overflow:hidden on parent does the clipping
      const tl = gsap.timeline({ delay: 0.1 });
      tl.fromTo(".hero-name-first-inner",
          { y: "110%" },
          { y: "0%", duration: 1.1, ease: "power3.out" }
        )
        .fromTo(".hero-role-row",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
          "-=0.6"
        )
        .fromTo(".hero-name-last-inner",
          { y: "110%" },
          { y: "0%", duration: 1.1, ease: "power3.out" },
          "-=0.9"
        )
        .fromTo(".hero-ctas",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
          "-=0.4"
        )
        .fromTo(".hero-bottom",
          { opacity: 0 },
          { opacity: 1, duration: 0.8, ease: "power2.out" },
          "-=0.2"
        );

      // ── Scroll scrub — split parallax on name lines ────────
      gsap.to(".hero-name-first", {
        y: -40, ease: "none",
        scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.5 },
      });
      gsap.to(".hero-name-last", {
        y: -25, ease: "none",
        scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.5 },
      });

      // ── Mouse parallax on hero image preview ───────────────
      const onMove = (e: MouseEvent) => {
        const dx = (e.clientX / window.innerWidth  - 0.5) * 15;
        const dy = (e.clientY / window.innerHeight - 0.5) * 10;
        gsap.to(".hero-image-preview", { x: -dx, y: -dy, duration: 0.8, ease: "power2.out" });
      };
      hero.addEventListener("mousemove", onMove);
      return () => hero.removeEventListener("mousemove", onMove);
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" ref={heroRef} className="hero-section">
      {/* Name block */}
      <div className="hero-name-block">
        {/* Clip wrapper — overflow hidden acts as the mask */}
        <span className="hero-name-first" style={{ display: "block", overflow: "hidden" }}>
          <span className="hero-name-first-inner" style={{ display: "block" }}>
            {personal.firstName}
          </span>
        </span>

        {/* Role row — anchored between the two name lines */}
        <div className="hero-role-row">
          <span>Product Designer</span>
          <span className="hero-role-dot" />
          <span>Illustrator</span>
          <span className="hero-role-dot" />
          <span>Researcher</span>
        </div>

        <span className="hero-name-last" style={{ display: "block", overflow: "hidden" }}>
          <span className="hero-name-last-inner" style={{ display: "block" }}>
            {personal.name.split(" ")[1]}
          </span>
        </span>
      </div>

      {/* CTAs */}
      <div className="hero-ctas">
        <a href="#work" className="btn-primary">
          <span>View Work</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
        <a href={personal.resumeUrl} download className="btn-outline">
          Download Resume
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </a>
        <a href="#contact" className="btn-ghost">Say hello →</a>
      </div>

      {/* Bottom bar */}
      <div className="hero-bottom">
        <p className="hero-status">
          <span className="hero-status-num">01 —</span>
          Currently designing @ Samsung Research
        </p>

        <div className="hero-scroll" aria-hidden="true">
          <div className="hero-scroll-line" />
          <span>Scroll</span>
        </div>

        {/* Featured project preview — parallax target */}
        <div className="hero-image-preview" aria-hidden="true">
          <div style={{
            width: "100%", height: "100%",
            background: "linear-gradient(160deg, #0d1a06 0%, #1a3500 60%, #0d1a06 100%)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: "0.5rem", padding: "1rem",
          }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#6dca3e", opacity: 0.8 }}>
              Golden Farms
            </span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: "#8A8580" }}>
              B2B · Live App
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
