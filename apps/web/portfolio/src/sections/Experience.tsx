import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experiences, freelanceWork } from "../constants";

gsap.registerPlugin(ScrollTrigger);

// Mouse-tracking glow border hook
const useGlowCard = (cardRef: React.RefObject<HTMLDivElement | null>) => {
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const onMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      let angle = Math.atan2(y, x) * (180 / Math.PI);
      angle = (angle + 360) % 360;
      card.style.setProperty("--start", String(angle + 60));
    };
    card.addEventListener("mousemove", onMove as EventListener);
    return () => card.removeEventListener("mousemove", onMove as EventListener);
  }, []);
};

// Individual experience card
const ExpCard = ({
  exp,
  idx,
}: {
  exp: (typeof experiences)[0];
  idx: number;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  useGlowCard(cardRef);

  return (
    <div
      ref={cardRef}
      className="exp-card"
      style={
        {
          "--exp-accent": `${exp.accentColor}cc`,
          "--exp-accent-color": exp.accentColor,
        } as React.CSSProperties
      }
    >
      {/* Left accent bar */}
      <div className="exp-accent-bar" />

      {/* Decorative large number */}
      <div className="exp-num">{exp.num}</div>

      {/* Inner content */}
      <div className="p-6 md:p-8 pl-8 md:pl-10">
        {/* Top row */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
          <div className="flex-1 min-w-0">
            {/* Company + badge */}
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: exp.accentColor }}
              >
                {exp.company}
              </span>
              {exp.current && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{
                    background: `${exp.accentColor}18`,
                    color: exp.accentColor,
                    border: `1px solid ${exp.accentColor}35`,
                  }}
                >
                  ● Current
                </span>
              )}
            </div>

            {/* Role title */}
            <h3
              className="font-serif text-xl md:text-2xl font-bold leading-tight"
              style={{ fontFamily: "Playfair Display, serif", color: "var(--text-1)" }}
            >
              {exp.role}
            </h3>

            {/* Location + period */}
            <p className="text-sm mt-1" style={{ color: "var(--text-3)" }}>
              {exp.period} · {exp.location}
            </p>
          </div>

          {/* Impact metrics */}
          <div className="flex gap-3 flex-shrink-0">
            {exp.impact.map((m) => (
              <div
                key={m.label}
                className="text-center px-3 py-2 rounded-xl min-w-[60px]"
                style={{
                  background: `${exp.accentColor}10`,
                  border: `1px solid ${exp.accentColor}25`,
                }}
              >
                <div
                  className="font-serif text-lg font-bold leading-none"
                  style={{ color: exp.accentColor, fontFamily: "Playfair Display, serif" }}
                >
                  {m.value}
                </div>
                <div className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="divider mb-5" />

        {/* Highlights */}
        <ul className="space-y-2.5 mb-5">
          {exp.highlights.map((h, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2"
                style={{ background: exp.accentColor }}
              />
              <span className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
                {h}
              </span>
            </li>
          ))}
        </ul>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {exp.tags.map((tag) => (
            <span
              key={tag}
              className="exp-tag text-xs"
              style={{
                background: `${exp.accentColor}10`,
                color: exp.accentColor,
                border: `1px solid ${exp.accentColor}28`,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const Experience = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<Element>(".exp-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { x: i % 2 === 0 ? -50 : 50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 82%" },
          }
        );
      });

      gsap.fromTo(
        ".freelance-card",
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: "power2.out",
          scrollTrigger: { trigger: ".freelance-section", start: "top 80%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" ref={sectionRef} className="section">
      <div className="section-wrap">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <span className="section-eyebrow mb-3">Career</span>
          <h2 className="section-title">
            Where I've{" "}
            <em className="gradient-text not-italic">shaped experiences</em>
          </h2>
          <p className="section-body mt-3 max-w-xl">
            Five years of designing for real people across enterprise tools, consumer apps, and cultural brands.
          </p>
        </div>

        {/* Experience cards */}
        <div className="exp-grid mb-12">
          {experiences.map((exp, idx) => (
            <ExpCard key={exp.company + idx} exp={exp} idx={idx} />
          ))}
        </div>

        {/* Freelance & Creative Work */}
        <div className="freelance-section">
          <div className="flex items-center gap-4 mb-6">
            <div className="gradient-line flex-shrink-0" style={{ width: "2px", height: "2.5rem" }} />
            <div>
              <p className="section-eyebrow mb-0.5">Freelance & Independent Work</p>
              <p className="text-sm" style={{ color: "var(--text-3)" }}>
                2018 – 2023 · Creative projects, brand collaborations, public art
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {freelanceWork.map((item) => (
              <div
                key={item.title}
                className="freelance-card glass-card p-4 flex items-start gap-3"
              >
                <div
                  className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-base"
                  style={{ background: "rgba(157,114,255,0.12)", border: "1px solid var(--border)" }}
                >
                  ✦
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-snug" style={{ color: "var(--text-1)" }}>
                    {item.title}
                  </p>
                  <p className="text-xs mt-0.5 leading-snug" style={{ color: "var(--text-3)" }}>
                    {item.description}
                  </p>
                  <p className="text-xs mt-1 font-medium" style={{ color: "var(--purple)" }}>
                    {item.period}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education + Certifications callout */}
        <div
          className="mt-10 glass-card p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-10 items-start"
          style={{ borderColor: "rgba(157,114,255,0.2)" }}
        >
          {/* Education */}
          <div className="flex items-start gap-4 flex-1">
            <div
              className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-2xl"
              style={{ background: "rgba(157,114,255,0.12)", border: "1px solid var(--border)" }}
            >
              🎓
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--text-3)" }}>
                Education
              </p>
              <p className="font-semibold" style={{ color: "var(--text-1)" }}>
                Bachelor of Design (B.Des.)
              </p>
              <p className="text-sm" style={{ color: "var(--text-3)" }}>
                Doon University · Dehradun, Uttarakhand · 2015–2019
              </p>
            </div>
          </div>

          <div className="hidden md:block w-px self-stretch" style={{ background: "var(--border)" }} />

          {/* IIT Delhi certification — highlighted */}
          <div className="flex items-start gap-4 flex-1">
            <div
              className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-2xl"
              style={{ background: "rgba(245,166,35,0.12)", border: "1px solid rgba(245,166,35,0.3)" }}
            >
              🏛️
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "var(--gold)" }}>
                Advanced Certification · IIT Delhi
              </p>
              <p className="font-semibold" style={{ color: "var(--text-1)" }}>
                Persuasive UX Strategy
              </p>
              <p className="text-sm" style={{ color: "var(--text-3)" }}>
                Indian Institute of Technology, New Delhi
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
