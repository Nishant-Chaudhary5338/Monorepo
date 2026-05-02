import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { expCards } from "../constants";
import TitleHeader from "../components/TitleHeader";
import GlowCard from "../components/GlowCard";

gsap.registerPlugin(ScrollTrigger);

const Experience = () => {
  useGSAP(() => {
    gsap.utils.toArray<Element>(".timeline-card").forEach((card) => {
      gsap.from(card, {
        xPercent: -100,
        opacity: 0,
        transformOrigin: "left left",
        duration: 1,
        ease: "power2.inOut",
        scrollTrigger: { trigger: card, start: "top 80%" },
      });
    });

    gsap.to(".timeline", {
      transformOrigin: "bottom bottom",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: ".timeline",
        start: "top center",
        end: "70% center",
        onUpdate: (self) => {
          gsap.to(".timeline", { scaleY: 1 - self.progress });
        },
      },
    });

    gsap.utils.toArray<Element>(".expText").forEach((text) => {
      gsap.from(text, {
        opacity: 0,
        duration: 1,
        ease: "power2.inOut",
        scrollTrigger: { trigger: text, start: "top 60%" },
      });
    });
  }, []);

  return (
    <section id="experience" className="px-5 md:px-20 py-20 md:py-32">
      <TitleHeader
        num="03"
        label="Experience"
        title={<>Where I've <em>built things.</em></>}
        className="mb-12 md:mb-16"
      />

      <div className="relative">
        <div className="relative z-50 xl:space-y-32 space-y-10">
          {expCards.map((card, index) => (
            <div key={card.title + card.company} className="exp-card-wrapper">
              <div className="xl:w-2/6">
                <GlowCard card={card} index={index}>
                  <div className="flex flex-col gap-3 p-2">
                    <img
                      src={card.imgPath}
                      alt={card.company}
                      className="w-full h-auto object-contain rounded-lg max-h-40"
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {card.techStack.map((tech) => (
                        <span key={tech} className="editorial-tag">{tech}</span>
                      ))}
                    </div>
                  </div>
                </GlowCard>
              </div>

              <div className="xl:w-4/6">
                <div className="flex items-start">
                  <div className="timeline-wrapper">
                    <div className="timeline" />
                    <div className="gradient-line w-1 h-full" />
                  </div>

                  <div className="expText flex xl:gap-20 md:gap-10 gap-5 relative z-20">
                    <div className="timeline-logo">
                      <img src={card.logoPath} alt={card.company} />
                    </div>

                    <div>
                      <h3
                        className="display-headline"
                        style={{ fontSize: "clamp(1.6rem, 2.8vw, 2.2rem)", color: "var(--text-primary)" }}
                      >
                        {card.title}
                      </h3>
                      <div
                        className="mono-label mt-2"
                        style={{ fontSize: "0.84rem", color: "var(--accent-warm)", textTransform: "none" }}
                      >
                        {card.company}
                      </div>
                      <div
                        className="mono-label mt-1"
                        style={{ color: "var(--text-muted)", fontSize: "0.76rem" }}
                      >
                        {card.date} · {card.location}
                      </div>

                      <div className="mt-7">
                        <div className="mono-label mb-3" style={{ color: "var(--accent-warm)" }}>
                          Key highlights
                        </div>
                        <ul className="flex flex-col gap-3">
                          {card.highlights.map((highlight, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-3 text-base"
                              style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}
                            >
                              <span style={{ color: "var(--accent-warm)", marginTop: "4px", flexShrink: 0 }}>▸</span>
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-6">
                        <div className="mono-label mb-3" style={{ color: "var(--text-muted)" }}>
                          Responsibilities
                        </div>
                        <ul className="flex flex-col gap-3">
                          {card.responsibilities.map((r, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-3 text-base"
                              style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}
                            >
                              <span style={{ color: "var(--border-color)", marginTop: "4px", flexShrink: 0 }}>–</span>
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
