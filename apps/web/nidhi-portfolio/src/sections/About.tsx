import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedCounter from "../components/AnimatedCounter";
import { personal, stats } from "../constants";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Two-column content fades up
      gsap.fromTo(".about-col",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" }
        }
      );
      // Stats cells stagger in from below
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
    <section
      id="about"
      ref={sectionRef}
      style={{ padding: "var(--space-xl) 0", background: "var(--bg-base)" }}
    >
      <div className="section-wrap">

        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "var(--space-sm)" }}>
          <span style={{ color: "var(--accent-gold)" }}>02</span> — ABOUT
        </p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 900, fontSize: "clamp(2.8rem, 5vw, 4.8rem)", color: "var(--text-primary)", lineHeight: 1.1, marginBottom: "var(--space-md)" }}>
          Who I am
        </h2>
        <hr style={{ border: "none", borderTop: "1px solid var(--border-subtle)", marginBottom: "var(--space-lg)" }} />

        {/* Two-column layout */}
        <div style={{ display: "grid", gridTemplateColumns: "5fr 6fr", gap: "var(--space-lg)", alignItems: "start", marginBottom: "var(--space-lg)" }}>

          {/* Left: bio + photo */}
          <div className="about-col">
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: "1rem", lineHeight: 1.75, color: "var(--text-secondary)", marginBottom: "var(--space-md)" }}>
              {personal.bio}
            </p>
            <div style={{ aspectRatio: "1 / 1", background: "var(--bg-surface)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-card)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "var(--text-muted)" }}>
                Photo · 1:1
              </p>
            </div>
          </div>

          {/* Right: pull quote */}
          <div className="about-col" style={{ paddingLeft: "var(--space-md)" }}>
            <blockquote style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 900, fontSize: "clamp(1.8rem, 3vw, 2.8rem)", color: "var(--text-primary)", lineHeight: 1.35, margin: 0 }}>
              "The best work lives at the edge of{" "}
              <span style={{ color: "var(--accent-gold)" }}>two</span>{" "}
              disciplines."
            </blockquote>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "var(--space-sm)", letterSpacing: "0.12em" }}>
              — Nidhi Chhimwal
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div
          className="stats-row"
          style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)" }}
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="stat-cell"
              style={{ padding: "var(--space-md) 0", textAlign: "center", borderLeft: i > 0 ? "1px solid var(--border-subtle)" : "none" }}
            >
              <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 900, fontSize: "3.5rem", color: "var(--accent-gold)", lineHeight: 1, marginBottom: "0.5rem" }}>
                <AnimatedCounter to={stat.value} suffix={stat.suffix} />
              </p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default About;
