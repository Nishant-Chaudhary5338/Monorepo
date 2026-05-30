import { useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useGeoCV } from "../hooks/useGeoCV";
import FloatingModulesScene from "../components/hero/FloatingModulesScene";

const HERO_WORDS = ['MFE platforms', 'MCP tooling', 'design systems', 'AI workflows'];

const IMPACT_METRICS = [
  { value: "3×", label: "dev velocity", sub: "speed gain" },
  { value: "65%", label: "automation", sub: "MCP-driven" },
  { value: "<60s", label: "onboarding", sub: "plugin spin-up" },
] as const;

const Hero = () => {
  const { downloadCV, status } = useGeoCV();
  const [wordIdx, setWordIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setWordIdx((i) => (i + 1) % HERO_WORDS.length);
    }, 2800);
    return () => clearInterval(id);
  }, []);

  useGSAP(() => {
    gsap.fromTo(
      ".hero-text h1",
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.18, duration: 0.65, ease: "power2.inOut" }
    );
    gsap.fromTo(
      ".hero-eyebrow, .hero-meta-strip, .hero-cta, .hero-metrics",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.12, duration: 0.6, ease: "power2.out", delay: 0.3 }
    );
  });

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: "100vh",
        paddingTop: "clamp(80px, 18vh, 168px)",
        paddingBottom: "clamp(56px, 10vh, 112px)",
      }}
    >
      {/* Hero-specific 3D scene — holographic floating modules */}
      <FloatingModulesScene />

      {/* Vignette — darkens hero behind text for legibility over site Canvas */}
      <div
        aria-hidden="true"
        className="hero-vignette"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 80% 100% at 30% 50%, rgba(7,8,15,0.82) 0%, rgba(7,8,15,0.35) 55%, transparent 100%)",
        }}
      />

      {/* 3. Lamp glow */}
      <div className="lamp" aria-hidden="true" style={{ zIndex: 1 }} />

      {/* 4. Content */}
      <div className="site-container" style={{ position: "relative", zIndex: 2 }}>

        {/* Availability badge */}
        <div className="hero-eyebrow flex items-center gap-3 mb-8">
          <span className="availability-dot" />
          <span className="hero-badge">
            Available · Senior &amp; Staff Frontend roles · Remote · Delhi, IN
          </span>
        </div>

        {/* Headline with inline word rotator */}
        <div className="hero-text">
          <h1>
            Building{" "}
            <span
              style={{
                display: "inline-block",
                height: "1em",
                lineHeight: "1em",
                overflow: "hidden",
                verticalAlign: "bottom",
                position: "relative",
                minWidth: "min(12ch, 42vw)",
              }}
            >
              <span
                key={wordIdx}
                style={{
                  display: "block",
                  color: "var(--accent)",
                  animation: "hero-word-in 480ms cubic-bezier(0.22, 1, 0.36, 1) both",
                }}
              >
                {HERO_WORDS[wordIdx]}
              </span>
            </span>
          </h1>
          <h1 style={{ color: "var(--fg)" }}>that let teams</h1>
          <h1>
            <em style={{ color: "var(--data)", fontStyle: "italic" }}>ship faster.</em>
          </h1>
        </div>

        {/* Hero meta strip */}
        <div className="hero-meta-strip">
          <span><b>Now</b>&nbsp;·&nbsp;Plugin-based MFE on Vite Module Federation</span>
          <span><b>Stack</b>&nbsp;·&nbsp;React, TypeScript, Turborepo</span>
          <span><b>Open to</b>&nbsp;·&nbsp;Remote · UK · EU · US · SG</span>
        </div>

        {/* Impact metrics — 3-col glass strip (proof before the ask) */}
        <div
          className="hero-metrics numbers-strip"
          style={{ marginTop: "2.5rem", maxWidth: "540px" }}
        >
          {IMPACT_METRICS.map(({ value, label, sub }) => (
            <div key={label} className="num-cell">
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                  fontWeight: 600,
                  letterSpacing: "-0.025em",
                  color: "var(--data)",
                  lineHeight: 1,
                }}
              >
                {value}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.6875rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  color: "var(--fg-muted)",
                  marginTop: "6px",
                }}
              >
                {label}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.6rem",
                  letterSpacing: "0.08em",
                  color: "var(--fg-dim)",
                  marginTop: "2px",
                }}
              >
                {sub}
              </div>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div
          className="hero-cta"
          style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "2rem" }}
        >
          <button
            onClick={downloadCV}
            disabled={status === "loading"}
            className="btn"
            style={
              status === "done"
                ? { background: "transparent", color: "var(--accent)", borderColor: "var(--accent-line)" }
                : undefined
            }
          >
            {status === "loading" ? "Detecting region…" : status === "done" ? "✓ Downloaded" : "Download CV"}
          </button>
          <a
            href="mailto:nishantchaudhary.dev@gmail.com"
            className="btn btn--ghost"
            style={{ textDecoration: "none" }}
          >
            Get in touch →
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
