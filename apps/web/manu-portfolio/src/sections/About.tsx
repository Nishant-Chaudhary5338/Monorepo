import { useEffect, useRef } from "react";
import gsap from "gsap";
import TitleHeader from "../components/TitleHeader";
import AnimatedCounter from "../components/AnimatedCounter";

const aboutStats = [
  { to: 5, suffix: "+", label: "Years experience" },
  { to: 4, suffix: "",  label: "Concurrent senior roles" },
  { to: 3, suffix: "",  label: "Industry verticals" },
  { to: 1000, suffix: "+", label: "Marketers trained" },
];

const About = () => {
  const colLeftRef  = useRef<HTMLDivElement>(null);
  const colRightRef = useRef<HTMLDivElement>(null);
  const statsRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from([colLeftRef.current, colRightRef.current], {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.1,
        scrollTrigger: { trigger: colLeftRef.current, start: "top 80%" },
      });
      gsap.from(statsRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        scrollTrigger: { trigger: statsRef.current, start: "top 80%" },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" className="section">
      <div className="section-wrap">
        <TitleHeader
          num="02"
          label="ABOUT"
          title="Five years. Four roles. One throughline: growth that compounds."
          className="mb-12"
        />

        {/* 2-col bio + photo */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "3rem",
            marginBottom: "4rem",
          }}
          className="lg:grid-cols-[60fr_40fr]"
        >
          {/* Bio text */}
          <div ref={colLeftRef}>
            <p className="section-body" style={{ marginBottom: "1.25rem" }}>
              I run paid acquisition and growth programs for brands that need
              results in quarters, not years. Across agency rooms, in-house seats,
              freelance projects, and a classroom at Delhi School of Internet
              Marketing — I've spent the last five years figuring out which
              levers actually move pipeline and teaching the next generation of
              marketers how to find them too.
            </p>
            <p className="section-body" style={{ marginBottom: "1.25rem" }}>
              The work spans Google Ads, Meta, LinkedIn, SEO, email automation,
              and the analytics stack that ties them together. The throughline:
              campaigns that earn their budget back, and the systems to prove it.
            </p>
            <p className="section-body">
              Currently a co-founder at Digitribe, where I run the Grow side of
              a senior 3-person agency for DTC and SaaS founders in the EU and US.
            </p>
          </div>

          {/* Photo placeholder */}
          <div ref={colRightRef} style={{ display: "flex", alignItems: "flex-start" }}>
            <div
              style={{
                width: "100%",
                maxWidth: "280px",
                aspectRatio: "4/5",
                border: "1px solid var(--border-default)",
                borderRadius: "0",
                background: "var(--bg-surface)",
                boxShadow: "var(--shadow-elevated)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.7rem",
                  color: "var(--text-muted)",
                  letterSpacing: "0.06em",
                }}
              >
                [Photo coming]
              </span>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div ref={statsRef} className="stats-row">
          {aboutStats.map((stat) => (
            <div key={stat.label} className="stat-item">
              <div className="stat-value">
                <AnimatedCounter to={stat.to} suffix={stat.suffix} duration={1600} />
              </div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
