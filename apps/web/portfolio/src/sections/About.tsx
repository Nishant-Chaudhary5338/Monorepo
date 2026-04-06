import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedCounter from "../components/AnimatedCounter";
import { personal, stats, certifications } from "../constants";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about-animate",
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, stagger: 0.14, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="section">
      <div className="section-wrap">

        {/* Section header */}
        <div className="about-animate flex flex-col items-center text-center mb-14">
          <span className="section-eyebrow mb-3">About</span>
          <h2 className="section-title">
            Design is my{" "}
            <em className="gradient-text not-italic">native language</em>
          </h2>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* Left: bio */}
          <div className="about-animate space-y-5">
            <p className="section-body">{personal.bio}</p>
            <p className="section-body">
              My work spans the full creative spectrum — from shaping enterprise UX and design
              systems to illustrating editorial characters and painting large-scale public murals.
              Every medium deepens my understanding of what makes communication land.
            </p>

            {/* IIT Delhi highlight card */}
            <div
              className="glass-card p-5 flex items-start gap-4 mt-6"
              style={{ borderColor: "rgba(245,166,35,0.35)", background: "rgba(245,166,35,0.04)" }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                style={{ background: "rgba(245,166,35,0.14)", border: "1px solid rgba(245,166,35,0.35)" }}
              >
                🏛️
              </div>
              <div>
                <p
                  className="text-xs font-bold uppercase tracking-widest mb-0.5"
                  style={{ color: "var(--gold)" }}
                >
                  Advanced Certification · IIT Delhi
                </p>
                <p className="font-semibold text-base" style={{ color: "var(--text-1)" }}>
                  Persuasive UX Strategy
                </p>
                <p className="text-sm mt-0.5" style={{ color: "var(--text-3)" }}>
                  Indian Institute of Technology, New Delhi — India's premier technical institute
                </p>
              </div>
            </div>

            {/* Other certifications */}
            <div className="space-y-2.5 mt-2">
              {certifications.filter((c) => !c.highlight).map((cert) => (
                <div key={cert.title} className="glass-card p-3.5 flex items-center gap-3">
                  <span className="text-lg shrink-0">{cert.icon}</span>
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>
                      {cert.title}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>
                      {cert.issuer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: stats + education */}
          <div className="about-animate space-y-5">
            {/* Stats grid */}
            <div className="stats-grid">
              {stats.map((stat, i) => {
                const gradients = [
                  "linear-gradient(135deg,#9d72ff,#7c52e0)",
                  "linear-gradient(135deg,#f5a623,#c9861a)",
                  "linear-gradient(135deg,#ff6b9d,#c0256a)",
                  "linear-gradient(135deg,#4cc9f0,#3a9fd1)",
                ];
                const borders = [
                  "rgba(157,114,255,0.3)",
                  "rgba(245,166,35,0.3)",
                  "rgba(255,107,157,0.3)",
                  "rgba(76,201,240,0.3)",
                ];
                return (
                  <div
                    key={stat.label}
                    className="glass-card stat-card"
                    style={{ borderColor: borders[i] }}
                  >
                    <div
                      className="stat-value"
                      style={{
                        background: gradients[i],
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      <AnimatedCounter to={stat.value} suffix={stat.suffix} />
                    </div>
                    <p className="stat-label">{stat.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Senior role positioning callout */}
            <div
              className="glass-card p-5"
              style={{ borderColor: "rgba(157,114,255,0.25)" }}
            >
              <p
                className="text-xs font-bold uppercase tracking-widest mb-3"
                style={{ color: "var(--purple)" }}
              >
                Why Senior
              </p>
              <div className="space-y-2.5">
                {[
                  { icon: "🔬", text: "IIT Delhi–certified in Persuasive UX Strategy" },
                  { icon: "📐", text: "End-to-end ownership — research → systems → delivery" },
                  { icon: "🤝", text: "Cross-functional partner to engineering, product & leadership" },
                  { icon: "⚡", text: "AI-augmented workflow in the post-AI design era" },
                  { icon: "🌍", text: "Designed for 15K+ real users across rural & enterprise contexts" },
                ].map((item) => (
                  <div key={item.text} className="flex items-start gap-3">
                    <span className="text-base shrink-0">{item.icon}</span>
                    <span className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="glass-card p-4 flex items-center gap-4">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ background: "rgba(157,114,255,0.12)", border: "1px solid var(--border)" }}
              >
                🎓
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: "var(--text-1)" }}>
                  Bachelor of Design (B.Des.)
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>
                  Doon University · Dehradun · 2015–2019
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
