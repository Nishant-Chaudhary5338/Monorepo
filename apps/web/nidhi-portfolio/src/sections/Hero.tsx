import { useEffect, useRef } from "react";
import gsap from "gsap";
import { personal } from "../constants";


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

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" ref={heroRef} className="hero-section">
      {/* Name block */}
      <div className="hero-name-block">
        {/* Clip wrapper — overflow hidden acts as the mask.
            Padding gives Playfair Italic 900 room for serif overhang;
            negative margin cancels the extra space visually. */}
        <span className="hero-name-first" style={{ display: "block", overflow: "hidden", paddingTop: "0.1em", paddingBottom: "0.05em", paddingLeft: "0.1em", marginTop: "-0.1em" }}>
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

        <span className="hero-name-last" style={{ display: "block", overflow: "hidden", paddingBottom: "0.08em", paddingRight: "0.06em", marginBottom: "-0.08em", marginRight: "-0.06em" }}>
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

      </div>
    </section>
  );
};

export default Hero;
