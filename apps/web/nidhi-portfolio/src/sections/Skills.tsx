import { useEffect, useRef } from "react";
import gsap from "gsap";


const disciplineSkills = [
  { name: "UX Research",        years: "4 years" },
  { name: "Visual Design",      years: "3 years" },
  { name: "Illustration",       years: "6 years" },
  { name: "Design Systems",     years: "2 years" },
  { name: "Interaction Design", years: "3 years" },
  { name: "UX Strategy",        years: "2 years" },
  { name: "Brand & Identity",   years: "3 years" },
  { name: "Mobile App UX",      years: "2 years" },
  { name: "Motion Design",      years: "2 years" },
];

const designTools = [
  "Figma", "FigJam", "Framer", "Figma Variables", "Zeplin",
];

const visualMotionTools = [
  "Illustrator", "Photoshop", "After Effects", "Lottie", "Procreate", "InDesign",
];

const learningSkills = ["3D in Spline", "Advanced Motion"];

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

const subCategoryStyle: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "0.65rem",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--accent-gold)",
  marginBottom: "0.15rem",
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

          {/* Core Disciplines */}
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

          {/* Tools — two sub-categories */}
          <p className="skills-row" style={{ ...categoryHeaderStyle, marginTop: "var(--space-md)" }}>
            Prototyping &amp; Tools
          </p>

          {/* Design & Prototyping */}
          <div className="skills-row" style={{ ...rowStyle, flexDirection: "column", alignItems: "flex-start", gap: "0.35rem" }}>
            <span style={subCategoryStyle}>Design &amp; Prototyping</span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: "1rem", color: "var(--text-secondary)" }}>
              {designTools.join("  ·  ")}
            </span>
          </div>

          {/* Visual & Motion */}
          <div className="skills-row" style={{ ...rowStyle, flexDirection: "column", alignItems: "flex-start", gap: "0.35rem" }}>
            <span style={subCategoryStyle}>Visual &amp; Motion</span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: "1rem", color: "var(--text-secondary)" }}>
              {visualMotionTools.join("  ·  ")}
            </span>
          </div>

          {/* Currently Learning */}
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
