import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experiences } from "../constants";

gsap.registerPlugin(ScrollTrigger);

// ── Single experience entry ──────────────────────────────────
const ExpEntry = ({ exp, idx }: { exp: (typeof experiences)[0]; idx: number }) => {
  const entryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entry slides up on scroll
      gsap.fromTo(entryRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: entryRef.current, start: "top 82%" }
        }
      );
      // Bullets stagger in after entry lands
      gsap.fromTo(".exp-bullet-" + idx,
        { x: -10, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.06, duration: 0.4, ease: "power2.out",
          delay: 0.3,
          scrollTrigger: { trigger: entryRef.current, start: "top 82%" }
        }
      );
    });
    return () => ctx.revert();
  }, [idx]);

  // Pick most impactful metric (first one)
  const topMetric = exp.impact?.[0];

  return (
    <div
      ref={entryRef}
      style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "var(--space-md)", paddingBottom: "var(--space-md)" }}
    >
      {/* Company row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "1.05rem", color: "var(--text-primary)" }}>
            {exp.company}
          </span>
          {exp.current && (
            <span className="pill pill-live">Current</span>
          )}
          {topMetric && (
            <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 900, fontSize: "1.1rem", color: "var(--accent-gold)" }}>
              {topMetric.value}
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", fontStyle: "normal", fontWeight: 400, color: "var(--text-muted)", marginLeft: "0.35rem", letterSpacing: "0.06em" }}>
                {topMetric.label}
              </span>
            </span>
          )}
        </div>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "var(--text-muted)", letterSpacing: "0.06em", flexShrink: 0, marginLeft: "1rem" }}>
          {exp.period}
        </span>
      </div>

      {/* Role row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "var(--space-sm)" }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: "0.9rem", color: "var(--text-secondary)" }}>
          {exp.role}
        </span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", color: "var(--text-muted)", letterSpacing: "0.04em", flexShrink: 0, marginLeft: "1rem" }}>
          {exp.location}
        </span>
      </div>

      {/* Highlights */}
      <ul style={{ listStyle: "none", margin: "0 0 var(--space-sm) 0", padding: 0, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        {exp.highlights.map((h, i) => (
          <li
            key={i}
            className={`exp-bullet-${idx}`}
            style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}
          >
            <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--accent-purple)", flexShrink: 0, marginTop: "0.55rem" }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>
              {h}
            </span>
          </li>
        ))}
      </ul>

      {/* Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
        {exp.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.65rem",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--accent-purple)",
              background: "var(--accent-purple-light)",
              border: "1px solid var(--accent-purple-light)",
              borderRadius: "var(--radius-pill)",
              padding: "0.2rem 0.6rem",
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

// ── Section ──────────────────────────────────────────────────
const Experience = () => {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section id="experience" ref={sectionRef} style={{ padding: "var(--space-xl) 0", background: "var(--bg-base)" }}>
      <div className="section-wrap">

        {/* v3 header */}
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "var(--space-sm)" }}>
          <span style={{ color: "var(--accent-gold)" }}>07</span> — EXPERIENCE
        </p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 900, fontSize: "clamp(2.8rem, 5vw, 4.8rem)", color: "var(--text-primary)", lineHeight: 1.1, marginBottom: "var(--space-md)" }}>
          Where I've worked
        </h2>
        <hr style={{ border: "none", borderTop: "1px solid var(--border-subtle)", marginBottom: "var(--space-lg)" }} />

        {/* Ruled timeline */}
        <div style={{ marginBottom: "var(--space-xl)" }}>
          {experiences.map((exp, idx) => (
            <ExpEntry key={exp.company + idx} exp={exp} idx={idx} />
          ))}
          {/* Closing rule */}
          <div style={{ borderTop: "1px solid var(--border-subtle)" }} />
        </div>

        {/* Education & Certifications */}
        <div>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "var(--space-sm)" }}>
            Education &amp; Certifications
          </p>

          {/* B.Des */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "0.875rem 0", borderTop: "1px solid var(--border-subtle)" }}>
            <div>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "1rem", color: "var(--text-primary)" }}>
                Bachelor of Design (B.Des.)
              </span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", color: "var(--text-secondary)", marginLeft: "0.75rem" }}>
                Doon University, Dehradun
              </span>
            </div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "var(--text-muted)", letterSpacing: "0.06em", flexShrink: 0, marginLeft: "1rem" }}>
              2015 – 2019
            </span>
          </div>

          {/* IIT Delhi */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "0.875rem 0", borderTop: "1px solid var(--border-subtle)" }}>
            <div>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "1rem", color: "var(--text-primary)" }}>
                Advanced Certification — Persuasive UX Strategy
              </span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", color: "var(--text-secondary)", marginLeft: "0.75rem" }}>
                IIT Delhi
              </span>
            </div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "var(--accent-gold)", letterSpacing: "0.06em", flexShrink: 0, marginLeft: "1rem" }}>
              IIT Delhi
            </span>
          </div>

          {/* University of Toronto */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "0.875rem 0", borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)" }}>
            <div>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "1rem", color: "var(--text-primary)" }}>
                Human-Centered Design for Inclusive Innovation
              </span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.875rem", color: "var(--text-secondary)", marginLeft: "0.75rem" }}>
                University of Toronto
              </span>
            </div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "var(--text-muted)", letterSpacing: "0.06em", flexShrink: 0, marginLeft: "1rem" }}>
              Certification
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Experience;
