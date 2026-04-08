import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const disciplineSkills = [
  { name: "UX Research",        years: "4 years" },
  { name: "Visual Design",      years: "3 years" },
  { name: "Illustration",       years: "6 years" },
  { name: "Design Systems",     years: "2 years" },
  { name: "Interaction Design", years: "3 years" },
  { name: "UX Strategy",        years: "2 years" },
];

const toolSkills = [
  "Figma", "Framer", "Illustrator", "Procreate",
  "After Effects", "Photoshop", "Lottie", "Miro",
];

const learningSkills = ["Motion Design", "3D in Spline"];

const rowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "baseline",
  padding: "0.875rem 0",
  borderTop: "1px solid var(--border-subtle)",
};

const categoryHeaderStyle: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "0.72rem",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "var(--text-muted)",
  padding: "0.75rem 0",
  borderTop: "1px solid var(--border-subtle)",
};

const Skills = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".skills-row",
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.05, duration: 0.5, ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      style={{ padding: "var(--space-xl) 0", background: "var(--bg-base)" }}
    >
      <div className="section-wrap">

        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "var(--space-sm)" }}>
          <span style={{ color: "var(--accent-gold)" }}>05</span> — SKILLS
        </p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 900, fontSize: "clamp(2.8rem, 5vw, 4.8rem)", color: "var(--text-primary)", lineHeight: 1.1, marginBottom: "var(--space-md)" }}>
          Disciplines
        </h2>
        <hr style={{ border: "none", borderTop: "1px solid var(--border-subtle)", marginBottom: "var(--space-lg)" }} />

        <div style={{ maxWidth: "720px" }}>

          <p className="skills-row" style={categoryHeaderStyle}>Core Disciplines</p>
          {disciplineSkills.map((skill) => (
            <div key={skill.name} className="skills-row" style={rowStyle}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "1rem", color: "var(--text-primary)" }}>
                {skill.name}
              </span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                {skill.years}
              </span>
            </div>
          ))}

          <p className="skills-row" style={{ ...categoryHeaderStyle, marginTop: "var(--space-md)" }}>
            Prototyping &amp; Tools
          </p>
          <div className="skills-row" style={rowStyle}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: "1rem", color: "var(--text-secondary)" }}>
              {toolSkills.join("  ·  ")}
            </span>
          </div>

          <p className="skills-row" style={{ ...categoryHeaderStyle, marginTop: "var(--space-md)" }}>
            Currently Learning
          </p>
          <div className="skills-row" style={{ ...rowStyle, borderBottom: "1px solid var(--border-subtle)" }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: "1rem", color: "var(--text-secondary)" }}>
              {learningSkills.join("  ·  ")}
            </span>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Skills;
