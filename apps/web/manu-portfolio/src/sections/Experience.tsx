import { useEffect, useRef } from "react";
import gsap from "gsap";
import TitleHeader from "../components/TitleHeader";
import { experience } from "../constants/experience";

const Experience = () => {
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".exp-card", {
        opacity: 0,
        y: 40,
        duration: 0.7,
        stagger: 0.12,
        scrollTrigger: { trigger: cardsRef.current, start: "top 80%" },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" className="section section-alt">
      <div className="section-wrap">
        <TitleHeader
          num="03"
          label="EXPERIENCE"
          title="Where the work happened."
          className="mb-12"
        />

        <div ref={cardsRef} className="exp-grid">
          {experience.map((item) => (
            <article key={item.ghost} className="exp-card">
              {/* Ghost number */}
              <span className="exp-num" aria-hidden="true">{item.ghost}</span>

              {/* Period */}
              <p
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.72rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  marginBottom: "0.75rem",
                }}
              >
                {item.period}
              </p>

              {/* Role */}
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 900,
                  fontStyle: "italic",
                  fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)",
                  color: "var(--accent-teal)",
                  lineHeight: 1.2,
                  marginBottom: "0.25rem",
                }}
              >
                {item.role}
              </h3>

              {/* Org */}
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: "1rem",
                  color: "var(--text-primary)",
                  marginBottom: "1rem",
                }}
              >
                {item.org}
              </p>

              {/* Body */}
              <p className="section-body" style={{ marginBottom: "1.25rem" }}>
                {item.body}
              </p>

              {/* Highlights */}
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "0 0 1.5rem 0",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.4rem",
                }}
              >
                {item.highlights.map((h) => (
                  <li
                    key={h}
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.9rem",
                      color: "var(--text-secondary)",
                      display: "flex",
                      gap: "0.6rem",
                      alignItems: "flex-start",
                    }}
                  >
                    <span style={{ color: "var(--accent-teal)", flexShrink: 0 }}>→</span>
                    {h}
                  </li>
                ))}
              </ul>

              {/* Tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {item.tags.map((tag) => (
                  <span key={tag} className="exp-tag">{tag}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
