import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { words } from "../constants";
import { useGeoCV } from "../hooks/useGeoCV";

const Hero = () => {
  const { downloadCV, status } = useGeoCV();

  useGSAP(() => {
    gsap.fromTo(
      ".hero-text h1",
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.18, duration: 1, ease: "power2.inOut" }
    );
    gsap.fromTo(
      ".hero-eyebrow, .hero-meta-strip",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.15, duration: 0.9, ease: "power2.out", delay: 0.2 }
    );
  });

  return (
    <section id="hero" className="relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute top-0 left-0 z-10 pointer-events-none">
        <img src="/images/bg.png" alt="" />
      </div>
      {/* Warm radial glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "radial-gradient(ellipse 80% 60% at 55% 40%, var(--hero-glow), transparent 70%)",
          zIndex: 5,
          pointerEvents: "none",
        }}
      />

      <div
        className="relative z-10 site-container"
        style={{
          paddingTop: "clamp(7rem, 16vw, 14rem)",
          paddingBottom: "clamp(4rem, 8vw, 8rem)",
        }}
      >
        {/* Availability badge */}
        <div className="hero-eyebrow flex items-center gap-3 mb-8">
          <span className="availability-dot" />
          <span className="hero-badge">
            Available · Senior &amp; Staff Frontend roles · Remote · Delhi, IN
          </span>
        </div>

        {/* Editorial headline — inline slider, full width available */}
        <div className="hero-text">
          <h1>
            Building
            <span className="slide">
              <span className="wrapper">
                {words.map((word, index) => (
                  <span
                    key={index}
                    className="flex items-center md:gap-3 gap-1 pb-2"
                  >
                    <img
                      src={word.imgPath}
                      alt=""
                      className="xl:size-12 md:size-10 size-7 md:p-2 p-1 rounded-full bg-white-50"
                    />
                    <span>{word.text}</span>
                  </span>
                ))}
              </span>
            </span>
          </h1>
          <h1>that let teams</h1>
          <h1><em>ship faster.</em></h1>
        </div>

        {/* Hero meta strip */}
        <div className="hero-meta-strip">
          <span><b>Now</b>&nbsp;·&nbsp;Plugin-based MFE on Vite Module Federation</span>
          <span><b>Stack</b>&nbsp;·&nbsp;React, TypeScript, Turborepo</span>
          <span><b>Open to</b>&nbsp;·&nbsp;Remote · UK · EU · US · SG</span>
        </div>

        {/* CTA row */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "2.5rem" }}>
          <button
            onClick={downloadCV}
            disabled={status === "loading"}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: status === "done" ? "var(--accent-warm)" : "var(--bg-primary)",
              background: status === "done" ? "transparent" : "var(--text-primary)",
              border: "1px solid var(--text-primary)",
              padding: "0.6rem 1.4rem",
              borderRadius: "2px",
              cursor: status === "loading" ? "wait" : "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {status === "loading" ? "Detecting region…" : status === "done" ? "✓ Downloaded" : "Download CV"}
          </button>
          <a
            href="mailto:nishantchaudhary.dev@gmail.com"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--text-muted)",
              textDecoration: "none",
              border: "1px solid var(--rule)",
              padding: "0.6rem 1.4rem",
              borderRadius: "2px",
              transition: "color 0.2s, border-color 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-primary)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border-color)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--rule)";
            }}
          >
            Get in touch →
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
