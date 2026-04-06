import { useEffect, useRef, useState, Suspense, lazy } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { skillCategories } from "../constants";

gsap.registerPlugin(ScrollTrigger);

// Lazy-load the 3D scene to keep initial bundle lighter
const ToolOrbit = lazy(() => import("../components/ToolOrbit"));

// ─── Tool icon grid data ────────────────────────────────────
const tools = [
  { name: "Figma",          emoji: "◈", color: "#f24e1e", glow: "rgba(242,78,30,0.25)" },
  { name: "Procreate",      emoji: "✏️", color: "#4cc9f0", glow: "rgba(76,201,240,0.25)" },
  { name: "Illustrator",    emoji: "◭",  color: "#f5a623", glow: "rgba(245,166,35,0.25)" },
  { name: "Photoshop",      emoji: "◫",  color: "#31a8ff", glow: "rgba(49,168,255,0.25)" },
  { name: "After Effects",  emoji: "◈", color: "#9d72ff", glow: "rgba(157,114,255,0.25)" },
  { name: "Adobe XD",       emoji: "◉", color: "#ff2bc2", glow: "rgba(255,43,194,0.25)" },
  { name: "InDesign",       emoji: "◧", color: "#ff3366", glow: "rgba(255,51,102,0.25)" },
  { name: "Figma Variables", emoji: "⬡", color: "#a259ff", glow: "rgba(162,89,255,0.25)" },
  { name: "Figma Plugins",  emoji: "⚙️", color: "#9d72ff", glow: "rgba(157,114,255,0.25)" },
  { name: "Miro / FigJam",  emoji: "⬡", color: "#fdd835", glow: "rgba(253,216,53,0.25)" },
  { name: "Storybook",      emoji: "◉", color: "#ff4785", glow: "rgba(255,71,133,0.25)" },
  { name: "ProtoPie",       emoji: "◈", color: "#ec6bcd", glow: "rgba(236,107,205,0.25)" },
];

// ─── Category color config ──────────────────────────────────
const catConfig: Record<string, { accent: string; dim: string; icon: string }> = {
  purple: { accent: "var(--purple)", dim: "rgba(157,114,255,0.12)", icon: "rgba(157,114,255,0.3)" },
  teal:   { accent: "var(--teal)",   dim: "rgba(45,212,191,0.12)",  icon: "rgba(45,212,191,0.3)" },
  gold:   { accent: "var(--gold)",   dim: "rgba(245,166,35,0.12)",  icon: "rgba(245,166,35,0.3)" },
  rose:   { accent: "var(--rose)",   dim: "rgba(255,107,157,0.12)", icon: "rgba(255,107,157,0.3)" },
  amber:  { accent: "var(--amber)",  dim: "rgba(251,191,36,0.12)",  icon: "rgba(251,191,36,0.3)" },
};

// ─── Skill tag with hover lift ──────────────────────────────
const SkillTag = ({ skill, accent }: { skill: string; accent: string }) => (
  <span
    className="skill-tag"
    style={{ "--tag-accent": accent } as React.CSSProperties}
    onMouseEnter={(e) => {
      (e.currentTarget as HTMLElement).style.borderColor = accent;
      (e.currentTarget as HTMLElement).style.color = accent;
      (e.currentTarget as HTMLElement).style.background = accent + "18";
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLElement).style.borderColor = "";
      (e.currentTarget as HTMLElement).style.color = "";
      (e.currentTarget as HTMLElement).style.background = "";
    }}
  >
    {skill}
  </span>
);

// ─── Tool card with glow hover ──────────────────────────────
const ToolCard = ({ tool }: { tool: (typeof tools)[0] }) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 14;
    const y = -((e.clientY - r.top) / r.height - 0.5) * 14;
    el.style.transform = `perspective(400px) rotateX(${y}deg) rotateY(${x}deg) translateY(-6px) scale(1.06)`;
    el.style.boxShadow = `0 20px 40px rgba(0,0,0,0.35), 0 0 22px ${tool.glow}`;
    el.style.borderColor = tool.color + "55";
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "";
    el.style.boxShadow = "";
    el.style.borderColor = "";
  };

  return (
    <div
      ref={ref}
      className="tool-card"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ transition: "transform 0.15s ease, box-shadow 0.15s ease, border-color 0.2s" }}
    >
      <span className="tool-icon">{tool.emoji}</span>
      <span className="tool-name">{tool.name}</span>
    </div>
  );
};

// ─── AI Skills pills row ────────────────────────────────────
const aiSkills = [
  { label: "Midjourney",              color: "#9d72ff" },
  { label: "ChatGPT for Research",    color: "#19c37d" },
  { label: "Framer AI",               color: "#0055ff" },
  { label: "AI-Assisted Prototyping", color: "#f5a623" },
  { label: "Prompt Engineering",      color: "#ff6b9d" },
  { label: "Generative UI Exploration",color: "#4cc9f0"},
  { label: "Design Tokens (W3C)",     color: "#fbbf24" },
];

// ─── Main section ───────────────────────────────────────────
const Skills = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [orbitVisible, setOrbitVisible] = useState(false);
  const orbitRef = useRef<HTMLDivElement>(null);

  // Lazy reveal 3D orbit when in view
  useEffect(() => {
    const el = orbitRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setOrbitVisible(true); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".skills-header-anim", { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      });
      gsap.fromTo(".tool-card", { scale: 0.8, opacity: 0 }, {
        scale: 1, opacity: 1, stagger: 0.05, duration: 0.5, ease: "back.out(1.4)",
        scrollTrigger: { trigger: ".tools-grid-section", start: "top 80%" },
      });
      gsap.fromTo(".ai-pill", { x: -20, opacity: 0 }, {
        x: 0, opacity: 1, stagger: 0.07, duration: 0.5, ease: "power2.out",
        scrollTrigger: { trigger: ".ai-section", start: "top 82%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const activeCat = skillCategories[activeTab];
  const cfg = catConfig[activeCat.color] ?? catConfig.purple;

  return (
    <section id="skills" ref={sectionRef} className="section section-alt">
      <div className="section-wrap">

        {/* ── Header ── */}
        <div className="skills-header-anim flex flex-col items-center text-center mb-14">
          <span className="section-eyebrow mb-3">Expertise</span>
          <h2 className="section-title">
            A toolkit built on{" "}
            <em className="gradient-text-rose not-italic">curiosity</em>
          </h2>
          <p className="section-body mt-3 max-w-lg">
            Equal parts strategist and craftsperson — UX thinking, visual artistry,
            research rigour, and AI-augmented design in one toolkit.
          </p>
        </div>

        {/* ── Top block: 3D orbit + category tabs ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14 items-center">

          {/* 3D Tool Orbit */}
          <div
            ref={orbitRef}
            style={{
              height: "380px",
              borderRadius: "1.5rem",
              overflow: "hidden",
              border: "1px solid var(--border)",
              background: "var(--bg-card)",
              position: "relative",
            }}
          >
            {/* Label overlay */}
            <div
              style={{
                position: "absolute", top: "1rem", left: "1rem",
                zIndex: 10, pointerEvents: "none",
              }}
            >
              <span className="pill text-xs">3D · Interactive</span>
            </div>

            {orbitVisible ? (
              <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center" style={{ color: "var(--text-3)", fontSize: "0.85rem" }}>
                  Loading orbit…
                </div>
              }>
                <ToolOrbit />
              </Suspense>
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ color: "var(--text-3)", fontSize: "0.85rem" }}>
                Scroll to load…
              </div>
            )}
          </div>

          {/* Category tabs + skills */}
          <div>
            {/* Tabs */}
            <div className="skills-tabs mb-5">
              {skillCategories.map((cat, i) => (
                <button
                  key={cat.id}
                  className={`skills-tab ${activeTab === i ? "active" : ""}`}
                  onClick={() => setActiveTab(i)}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>

            {/* Active category card */}
            <div
              className="glass-card p-6"
              style={{ borderColor: cfg.icon, minHeight: "260px" }}
            >
              {/* Category description */}
              <p className="text-xs font-medium mb-4 leading-relaxed" style={{ color: "var(--text-3)" }}>
                {activeCat.description}
              </p>

              {/* Skill tags */}
              <div className="flex flex-wrap gap-2">
                {activeCat.skills.map((skill) => (
                  <SkillTag key={skill} skill={skill} accent={cfg.accent} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Tools icon grid ── */}
        <div className="tools-grid-section mb-14">
          <div className="flex items-center gap-3 mb-6">
            <h3 className="font-semibold text-base" style={{ color: "var(--text-1)" }}>
              Design Toolset
            </h3>
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
            <span className="text-xs" style={{ color: "var(--text-3)" }}>hover to interact</span>
          </div>

          <div className="tool-grid">
            {tools.map((tool) => (
              <ToolCard key={tool.name} tool={tool} />
            ))}
          </div>
        </div>

        {/* ── AI-Augmented Design strip ── */}
        <div
          className="ai-section glass-card p-6 md:p-8"
          style={{ borderColor: "rgba(251,191,36,0.25)" }}
        >
          <div className="flex flex-wrap items-start gap-6">
            {/* Label */}
            <div className="shrink-0">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-2"
                style={{ background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.3)" }}
              >
                ⚡
              </div>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--amber)" }}>
                AI-Augmented
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>
                In the post-AI era
              </p>
            </div>

            {/* Pills */}
            <div className="flex flex-wrap gap-2 flex-1">
              {aiSkills.map((a) => (
                <span
                  key={a.label}
                  className="ai-pill inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-default transition-all duration-200"
                  style={{
                    border: `1px solid ${a.color}35`,
                    color: a.color,
                    background: `${a.color}10`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = `${a.color}22`;
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = `${a.color}10`;
                    (e.currentTarget as HTMLElement).style.transform = "";
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: a.color }}
                  />
                  {a.label}
                </span>
              ))}
            </div>
          </div>

          {/* Callout text */}
          <p className="text-sm mt-5 leading-relaxed" style={{ color: "var(--text-3)" }}>
            Senior UX designers today don't just use AI tools — they orchestrate them strategically.
            I leverage AI for faster research synthesis, generative ideation, and accelerated prototyping
            while keeping human empathy and design judgment at the center.
          </p>
        </div>

        {/* ── Quote ── */}
        <div className="mt-12 text-center">
          <blockquote
            className="italic text-lg md:text-xl max-w-2xl mx-auto"
            style={{
              fontFamily: "Playfair Display, serif",
              color: "var(--text-2)",
            }}
          >
            "Design is not just what it looks like and feels like.
            Design is how it works."
          </blockquote>
          <p className="text-xs mt-2" style={{ color: "var(--text-3)" }}>— Steve Jobs</p>
        </div>

      </div>
    </section>
  );
};

export default Skills;
