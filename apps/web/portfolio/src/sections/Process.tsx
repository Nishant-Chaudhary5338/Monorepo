import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { processSteps } from "../constants";

gsap.registerPlugin(ScrollTrigger);

const Process = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".process-card",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="process"
      ref={sectionRef}
      className="section section-alt"
    >
      <div className="section-wrap">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="section-eyebrow mb-3">Design Process</span>
          <h2 className="section-title">
            How I turn{" "}
            <em className="gradient-text not-italic">research into reality</em>
          </h2>
          <p className="section-body mt-4 max-w-xl">
            Every project follows a human-centered framework — rooted in empathy,
            grounded in strategy, and polished to perfection.
          </p>
        </div>

        {/* Steps grid */}
        <div className="process-grid">
          {processSteps.map((step, idx) => (
            <div
              key={step.num}
              className="process-card glass-card p-7 relative overflow-hidden"
            >
              {/* Background number */}
              <span className="process-step-num">{step.num}</span>

              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5"
                style={{
                  background:
                    idx === 0
                      ? "rgba(157,114,255,0.12)"
                      : idx === 1
                      ? "rgba(245,166,35,0.12)"
                      : idx === 2
                      ? "rgba(255,107,157,0.12)"
                      : "rgba(76,201,240,0.12)",
                  border: `1px solid ${
                    idx === 0
                      ? "rgba(157,114,255,0.3)"
                      : idx === 1
                      ? "rgba(245,166,35,0.3)"
                      : idx === 2
                      ? "rgba(255,107,157,0.3)"
                      : "rgba(76,201,240,0.3)"
                  }`,
                }}
              >
                {step.icon}
              </div>

              {/* Content */}
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-1"
                style={{
                  color:
                    idx === 0
                      ? "var(--purple)"
                      : idx === 1
                      ? "var(--gold)"
                      : idx === 2
                      ? "var(--rose)"
                      : "#4cc9f0",
                }}
              >
                {step.tagline}
              </p>
              <h3
                className="font-serif text-xl font-bold mb-3"
                style={{
                  fontFamily: "Playfair Display, serif",
                  color: "var(--text-1)",
                }}
              >
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--text-2)" }}>
                {step.description}
              </p>

              {/* Deliverables */}
              <div className="flex flex-wrap gap-1.5">
                {step.deliverables.map((d) => (
                  <span
                    key={d}
                    className="text-xs px-2.5 py-1 rounded-full"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid var(--border)",
                      color: "var(--text-3)",
                    }}
                  >
                    {d}
                  </span>
                ))}
              </div>

              {/* Step connector arrow (hidden on last) */}
              {idx < processSteps.length - 1 && (
                <div
                  className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 items-center justify-center rounded-full z-10"
                  style={{
                    background: "var(--bg-2)",
                    border: "1px solid var(--border)",
                    color: "var(--purple)",
                    fontSize: "0.75rem",
                  }}
                >
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
