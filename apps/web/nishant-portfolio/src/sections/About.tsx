import { useEffect, useRef } from "react";
import gsap from "gsap";
import { personalInfo, counterItems } from "../constants";
import AnimatedCounter from "../components/AnimatedCounter";
import { AnimatedTitle } from "../components/AnimatedTitle";

// Shared, stable handler — finds the spot element via currentTarget rather
// than a ref, so refs never get passed through functions during render.
const onGlowMove = (e: React.MouseEvent<HTMLDivElement>): void => {
  const rect = e.currentTarget.getBoundingClientRect();
  const spot = e.currentTarget.querySelector<HTMLDivElement>(".glow-card__spot");
  if (!spot) return;
  spot.style.setProperty("--gx", `${e.clientX - rect.left}px`);
  spot.style.setProperty("--gy", `${e.clientY - rect.top}px`);
};

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".about-col",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" }
        }
      );
      gsap.fromTo(".stat-cell",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: ".stats-row", start: "top 80%" }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="section section-alt">
      <div className="section-wrap">
        <div className="section-glow" style={{ "--section-glow-color": "var(--accent-purple)", "--section-glow-color-2": "var(--accent-rose)" } as React.CSSProperties}>
          <p className="section-label">
            <span className="section-label-num">05</span> — ABOUT
          </p>
          <AnimatedTitle title="Who I am" style={{ marginTop: "var(--space-sm)", marginBottom: "var(--space-md)" }} />
        </div>
        <hr className="section-rule" style={{ marginBottom: "var(--space-lg)" }} />

        <div style={{ display: "grid", gridTemplateColumns: "6fr 5fr", gap: "var(--space-lg)", alignItems: "stretch", marginBottom: "var(--space-lg)" }}>
          <div
            className="about-col product-card glow-card"
            onMouseMove={onGlowMove}
            style={{ "--card-accent": "var(--accent-purple)" } as React.CSSProperties}
          >
            <div className="glow-card__spot" style={{ "--glow-color": "var(--accent-purple)" } as React.CSSProperties} aria-hidden="true" />
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: "1rem", lineHeight: 1.75, color: "var(--text-secondary)" }}>
              {personalInfo.bio}
            </p>
          </div>

          <div
            className="about-col product-card glow-card"
            onMouseMove={onGlowMove}
            style={{ "--card-accent": "var(--accent-gold)" } as React.CSSProperties}
          >
            <div className="glow-card__spot" style={{ "--glow-color": "var(--accent-gold)" } as React.CSSProperties} aria-hidden="true" />
            <blockquote className="pull-quote">
              The parts users <span className="pull-quote-gold gradient-text">feel</span> — consistent at scale.
            </blockquote>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "var(--space-sm)", letterSpacing: "0.12em" }}>
              — {personalInfo.name}
            </p>
          </div>
        </div>

        <div
          className="product-card glow-card"
          onMouseMove={onGlowMove}
          style={{ "--card-accent": "var(--accent-cyan)", padding: 0 } as React.CSSProperties}
        >
          <div className="glow-card__spot" style={{ "--glow-color": "var(--accent-cyan)" } as React.CSSProperties} aria-hidden="true" />
          <div className="stats-row" style={{ border: "none" }}>
            {counterItems.map((stat) => (
              <div key={stat.label} className="stat-cell stat-item">
                <p className="stat-value">
                  <AnimatedCounter to={stat.value} suffix={stat.suffix} />
                </p>
                <p className="stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
