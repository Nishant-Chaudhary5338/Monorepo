import { useEffect, useRef } from "react";
import gsap from "gsap";
import { processSteps } from "../constants";


const Process = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".process-card",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.12, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="process"
      ref={sectionRef}
      style={{ padding: "var(--space-xl) 0", background: "var(--bg-base)" }}
    >
      <div className="section-wrap">

        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "var(--space-sm)" }}>
          <span style={{ color: "var(--accent-gold)" }}>06</span> — PROCESS
        </p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 900, fontSize: "clamp(2.8rem, 5vw, 4.8rem)", color: "var(--text-primary)", lineHeight: 1.1, marginBottom: "var(--space-md)" }}>
          How I work
        </h2>
        <hr style={{ border: "none", borderTop: "1px solid var(--border-subtle)", marginBottom: "var(--space-lg)" }} />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--space-md)" }}>
          {processSteps.map((step) => (
            <div
              key={step.num}
              className="process-card"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-card)", padding: "2rem" }}
            >
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1rem", color: "var(--accent-gold)", marginBottom: "var(--space-sm)" }}>
                {step.num}
              </p>
              <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "1.2rem", color: "var(--text-primary)", marginBottom: "var(--space-sm)" }}>
                {step.title}
              </h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: "0.9rem", lineHeight: 1.65, color: "var(--text-secondary)" }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Process;
