import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const Hero = () => {
  const firstNameRef  = useRef<HTMLSpanElement>(null);
  const lastNameRef   = useRef<HTMLSpanElement>(null);
  const eyebrowRef    = useRef<HTMLDivElement>(null);
  const taglineRef    = useRef<HTMLDivElement>(null);
  const stripRef      = useRef<HTMLDivElement>(null);
  const ctasRef       = useRef<HTMLDivElement>(null);
  const decorRef      = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(eyebrowRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.6 }, 0.1
    )
    .fromTo(firstNameRef.current,
      { clipPath: "inset(0 0 100% 0)" },
      { clipPath: "inset(0 0 0% 0)", duration: 1.1 }, 0.2
    )
    .fromTo(lastNameRef.current,
      { clipPath: "inset(0 0 100% 0)" },
      { clipPath: "inset(0 0 0% 0)", duration: 1.1 }, 0.35
    )
    .fromTo(taglineRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.7 }, 0.6
    )
    .fromTo(stripRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5 }, 0.9
    )
    .fromTo(ctasRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.6 }, 1.1
    )
    .fromTo(decorRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.8 }, 0.5
    );

    // Scroll parallax on name block
    ScrollTrigger.create({
      trigger: firstNameRef.current,
      start: "top top",
      end: "bottom top",
      scrub: 0.5,
      onUpdate: (self) => {
        const y = self.progress * -30;
        gsap.set([firstNameRef.current, lastNameRef.current], { y });
      },
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      className="hero-section"
      aria-label="Hero"
      style={{ minHeight: "100svh", position: "relative", overflow: "hidden" }}
    >
      {/* Teal radial glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 80% 60% at 30% 50%, rgba(13,122,111,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <style>{`
        [data-theme="dark"] .hero-teal-glow {
          background: radial-gradient(ellipse 80% 60% at 30% 50%, rgba(52,212,192,0.08) 0%, transparent 70%) !important;
        }
      `}</style>

      <div
        className="section-wrap"
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          minHeight: "100svh",
          paddingTop: "7rem",
          paddingBottom: "4rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "3rem",
            alignItems: "center",
          }}
          className="lg:grid-cols-[60fr_40fr]"
        >
          {/* ── Left column ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {/* Eyebrow */}
            <div ref={eyebrowRef} className="section-eyebrow" style={{ marginBottom: "2rem" }}>
              <span className="section-eyebrow-num">01</span>
              <span>— DELHI · 2026</span>
            </div>

            {/* Name */}
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 900,
                fontStyle: "italic",
                fontSize: "clamp(4rem, 11vw, 9rem)",
                lineHeight: 0.92,
                color: "var(--text-primary)",
                marginBottom: "2rem",
              }}
            >
              <span
                ref={firstNameRef}
                style={{ display: "block", clipPath: "inset(0 0 100% 0)" }}
              >
                Manu
              </span>
              <span
                ref={lastNameRef}
                style={{ display: "block", clipPath: "inset(0 0 100% 0)" }}
              >
                Siwatch.
              </span>
            </h1>

            {/* Tagline + body */}
            <div ref={taglineRef} style={{ marginBottom: "3rem", opacity: 0 }}>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: "clamp(1.3rem, 2.5vw, 1.9rem)",
                  color: "var(--text-primary)",
                  marginBottom: "1rem",
                }}
              >
                I help brands grow.
              </p>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 400,
                  fontSize: "1rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                  maxWidth: "50ch",
                }}
              >
                5+ years across paid acquisition, growth strategy, and training
                the next generation of digital marketers in Delhi's leading institution.
              </p>
            </div>

            {/* Capability strip */}
            <div ref={stripRef} style={{ marginBottom: "2.5rem", opacity: 0 }}>
              <div className="divider" style={{ marginBottom: "1.25rem" }} />
              <p
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.78rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                }}
              >
                OPERATOR · TRAINER · CONSULTANT · STRATEGIST
              </p>
              <div className="divider" style={{ marginTop: "1.25rem" }} />
            </div>

            {/* CTAs */}
            <div ref={ctasRef} style={{ display: "flex", flexWrap: "wrap", gap: "1rem", opacity: 0 }}>
              <a href="#contact" className="btn-primary">
                Hire me →
              </a>
              <a href="#results" className="btn-outline">
                View results →
              </a>
            </div>
          </div>

          {/* ── Right column: decorative "M" ── */}
          <div
            ref={decorRef}
            aria-hidden="true"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0,
              userSelect: "none",
            }}
          >
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 900,
                fontStyle: "italic",
                fontSize: "clamp(10rem, 20vw, 18rem)",
                color: "var(--accent-teal)",
                opacity: 0.07,
                lineHeight: 1,
                display: "block",
              }}
            >
              M
            </span>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.68rem",
          color: "var(--text-muted)",
          opacity: 0.5,
          animation: "floatBob 2.5s ease-in-out infinite",
        }}
      >
        <span>scroll</span>
        <div
          style={{
            width: "1px",
            height: "28px",
            background: "linear-gradient(to bottom, var(--border-strong), transparent)",
          }}
        />
      </div>
      <style>{`
        @keyframes floatBob {
          0%,100% { transform: translateX(-50%) translateY(0); }
          50%      { transform: translateX(-50%) translateY(8px); }
        }
      `}</style>
    </section>
  );
};

export default Hero;
