import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { personal } from "../constants";

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-animate",
        { y: 50, opacity: 0 },
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
      id="contact"
      ref={sectionRef}
      className="section section-alt"
      style={{ position: "relative", overflow: "hidden" }}
    >
      {/* Background glow */}
      <div className="contact-glow" />

      <div className="section-wrap relative z-10">
        <div className="text-center max-w-2xl mx-auto">
          <div className="contact-animate">
            <span className="section-eyebrow mb-4 block">Get In Touch</span>
          </div>

          <h2
            className="contact-animate font-serif mb-6"
            style={{
              fontFamily: "Playfair Display, serif",
              fontSize: "clamp(2.2rem, 6vw, 4rem)",
              fontWeight: 700,
              lineHeight: 1.1,
              color: "var(--text-1)",
            }}
          >
            Let's create something{" "}
            <em className="gradient-text not-italic">remarkable</em>
          </h2>

          <p className="contact-animate section-body mb-10">
            Open to senior design roles, collaborative projects, and meaningful
            creative conversations. If you're building something that deserves
            great design — let's talk.
          </p>

          {/* CTA buttons */}
          <div className="contact-animate flex flex-wrap justify-center gap-4 mb-12">
            <a
              href={`mailto:${personal.email}`}
              className="btn-primary text-base !px-8 !py-4"
            >
              <span>Send an Email</span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
                style={{ position: "relative", zIndex: 1 }}
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </a>
            <a
              href={personal.behance}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline text-base !px-8 !py-4"
            >
              View Behance
            </a>
          </div>

          {/* Contact details */}
          <div className="contact-animate flex flex-wrap justify-center gap-8">
            <a
              href={`mailto:${personal.email}`}
              className="flex items-center gap-2.5 group"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-colors"
                style={{
                  background: "rgba(157,114,255,0.1)",
                  border: "1px solid var(--border)",
                }}
              >
                ✉️
              </div>
              <span
                className="text-sm font-medium transition-colors group-hover:text-white"
                style={{ color: "var(--text-2)" }}
              >
                {personal.email}
              </span>
            </a>

            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                style={{
                  background: "rgba(157,114,255,0.1)",
                  border: "1px solid var(--border)",
                }}
              >
                📍
              </div>
              <span className="text-sm font-medium" style={{ color: "var(--text-2)" }}>
                {personal.location}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                style={{
                  background: "rgba(157,114,255,0.1)",
                  border: "1px solid var(--border)",
                }}
              >
                📞
              </div>
              <a
                href={`tel:+91${personal.phone}`}
                className="text-sm font-medium transition-colors hover:text-white"
                style={{ color: "var(--text-2)" }}
              >
                +91 {personal.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
