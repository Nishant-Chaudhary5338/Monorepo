import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "../constants";

gsap.registerPlugin(ScrollTrigger);

// Abstract SVG art for each project card background
const AbstractArt = ({
  accentColor,
  patternId,
}: {
  accentColor: string;
  patternId: string;
}) => {
  const shapes = [
    { type: "circle", cx: 70, cy: 60, r: 45, opacity: 0.18 },
    { type: "circle", cx: 150, cy: 120, r: 70, opacity: 0.12 },
    { type: "circle", cx: 30, cy: 150, r: 30, opacity: 0.1 },
  ];

  return (
    <svg
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", inset: 0 }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={patternId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accentColor} stopOpacity="0.35" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      {shapes.map((s, i) => (
        <circle
          key={i}
          cx={`${s.cx}%`}
          cy={`${s.cy}%`}
          r={`${s.r}%`}
          fill={accentColor}
          opacity={s.opacity}
        />
      ))}
      {/* Subtle grid lines */}
      <line x1="0" y1="50%" x2="100%" y2="50%" stroke={accentColor} strokeOpacity="0.06" strokeWidth="1" />
      <line x1="50%" y1="0" x2="50%" y2="100%" stroke={accentColor} strokeOpacity="0.06" strokeWidth="1" />
    </svg>
  );
};

const ProjectCard = ({
  project,
  featured = false,
}: {
  project: (typeof projects)[0];
  featured?: boolean;
}) => (
  <div className={`work-card ${featured ? "work-featured" : ""}`}>
    {/* Visual area */}
    <div className="work-card-visual" style={{ background: project.gradient }}>
      <AbstractArt accentColor={project.accentColor} patternId={`grad-${project.id}`} />

      {/* Center label */}
      <div
        className="relative z-10 text-center px-6 select-none"
        style={{ fontFamily: "Playfair Display, serif" }}
      >
        <div
          className="text-4xl font-bold leading-none mb-2"
          style={{ color: project.accentColor, fontFamily: "inherit", opacity: 0.8 }}
        >
          {project.category.split("·")[0].trim()}
        </div>
      </div>

      {/* Hover overlay */}
      <div className="work-card-overlay">
        <div className="text-center px-6">
          <a
            href={`#${project.id}`}
            className="btn-primary text-sm"
            onClick={(e) => e.preventDefault()}
          >
            <span>View Case Study</span>
          </a>
        </div>
      </div>
    </div>

    {/* Info */}
    <div className="work-card-info">
      <p
        className="text-xs font-semibold uppercase tracking-widest mb-1"
        style={{ color: project.accentColor }}
      >
        {project.category}
      </p>
      <h3
        className="font-serif text-lg font-bold mb-2"
        style={{ fontFamily: "Playfair Display, serif", color: "var(--text-1)" }}
      >
        {project.title}
      </h3>
      {featured && (
        <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--text-2)" }}>
          {project.description}
        </p>
      )}
      <div className="flex flex-wrap gap-2 mt-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2.5 py-0.5 rounded-full"
            style={{
              background: `${project.accentColor}12`,
              color: project.accentColor,
              border: `1px solid ${project.accentColor}25`,
            }}
          >
            {tag}
          </span>
        ))}
      </div>
      <p className="text-xs mt-3" style={{ color: "var(--text-3)" }}>
        @ {project.company}
      </p>
    </div>
  </div>
);

const Work = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".work-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.85,
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

  const [featured, ...rest] = projects;

  return (
    <section
      id="work"
      ref={sectionRef}
      className="section"
    >
      <div className="section-wrap">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="section-eyebrow mb-3">Selected Work</span>
          <h2 className="section-title">
            Projects that{" "}
            <em className="gradient-text not-italic">made an impact</em>
          </h2>
          <p className="section-body mt-4 max-w-xl">
            From farmer-centric mobile apps to tarot card universes — a
            cross-industry portfolio spanning UX, illustration, and brand identity.
          </p>
        </div>

        {/* Grid */}
        <div className="work-grid">
          <ProjectCard project={featured} featured />
          {rest.map((proj) => (
            <ProjectCard key={proj.id} project={proj} />
          ))}
        </div>

        {/* Behance CTA */}
        <div className="mt-12 text-center">
          <a
            href="https://www.behance.net/nidhichhim6d3d"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
          >
            View Full Portfolio on Behance
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Work;
