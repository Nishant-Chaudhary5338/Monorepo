import { useEffect, useRef } from "react";
import gsap from "gsap";
import TitleHeader from "../components/TitleHeader";
import { personal } from "../constants/personal";

const Contact = () => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(contentRef.current, {
        opacity: 0,
        y: 24,
        duration: 0.7,
        scrollTrigger: { trigger: contentRef.current, start: "top 80%" },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" className="section contact-section">
      <div className="section-wrap">
        <TitleHeader
          num="07"
          label="CONTACT"
          title="Got a brand to grow?"
          className="mb-8"
        />

        <div ref={contentRef}>
          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 900,
              fontStyle: "italic",
              fontSize: "clamp(1.5rem, 3vw, 2.4rem)",
              color: "var(--accent-teal)",
              marginBottom: "2rem",
              lineHeight: 1.2,
            }}
          >
            Let's run the numbers.
          </p>

          <p
            className="section-body"
            style={{ maxWidth: "55ch", marginBottom: "2rem" }}
          >
            Whether it's a new acquisition channel, a stalled funnel, or a
            training program for your in-house team — happy to talk through it.
            First call is always free, no pitch attached.
          </p>

          <p style={{ marginBottom: "2.5rem" }}>
            <a
              href={`mailto:${personal.email}`}
              className="contact-link"
            >
              {personal.email}
            </a>
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
            <a href={`mailto:${personal.email}`} className="btn-primary">
              Email me →
            </a>
            <a
              href={personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              Connect on LinkedIn →
            </a>
          </div>

          {/* LinkedIn text link */}
          <p>
            <a
              href={personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.78rem",
                color: "var(--text-muted)",
                textDecoration: "none",
                letterSpacing: "0.04em",
                transition: "color var(--duration-fast)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent-teal)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
            >
              linkedin.com/in/manu-siwatch-6b7a07285 ↗
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
