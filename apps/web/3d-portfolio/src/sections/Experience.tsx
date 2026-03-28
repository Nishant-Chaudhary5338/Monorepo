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
        scrollTrigger: {
          trigger: card,
          start: "top 80%",
        },
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
          gsap.to(".timeline", {
            scaleY: 1 - self.progress,
          });
        },
      },
    });

    gsap.utils.toArray<Element>(".expText").forEach((text) => {
      gsap.from(text, {
        opacity: 0,
        xPercent: 0,
        duration: 1,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: text,
          start: "top 60%",
        },
      });
    }, "<");
  }, []);

  return (
    <section
      id="experience"
      className="flex-center md:mt-40 mt-20 section-padding xl:px-0"
    >
      <div className="w-full h-full md:px-20 px-5">
        <TitleHeader
          title="Professional Work Experience"
          sub="💼 My Career Overview"
        />
        <div className="mt-32 relative">
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
                          <span
                            key={tech}
                            className="text-xs px-2 py-1 rounded-full"
                            style={{
                              backgroundColor: "var(--bg-secondary)",
                              color: "var(--text-secondary)",
                              border: "1px solid var(--border-color)",
                            }}
                          >
                            {tech}
                          </span>
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
                        <h1 className="font-semibold text-3xl" style={{ color: "var(--text-primary)" }}>{card.title}</h1>
                        <h3 className="font-semibold mt-2 text-lg" style={{ color: "var(--text-secondary)" }}>
                          {card.company}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
                          <span>🗓️ {card.date}</span>
                          <span>📍 {card.location}</span>
                        </div>

                        {/* Key Highlights */}
                        <div className="mt-6">
                          <p className="italic font-semibold mb-3" style={{ color: "var(--text-muted)" }}>
                            ⚡ Key Highlights
                          </p>
                          <ul className="flex flex-col gap-3">
                            {card.highlights.map((highlight, i) => (
                              <li
                                key={i}
                                className="text-lg flex items-start gap-3"
                                style={{ color: "var(--text-secondary)" }}
                              >
                                <span className="text-green-400 mt-1 flex-shrink-0">
                                  ▸
                                </span>
                                <span>{highlight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Detailed Responsibilities */}
                        <div className="mt-6">
                          <p className="italic font-semibold mb-3" style={{ color: "var(--text-muted)" }}>
                            📋 Responsibilities
                          </p>
                          <ul className="list-disc ms-5 flex flex-col gap-3">
                            <style>{`.exp-list li { color: var(--text-secondary); }`}</style>
                            {card.responsibilities.map((responsibility, i) => (
                              <li key={i} className="text-lg exp-list" style={{ color: "var(--text-secondary)" }}>
                                {responsibility}
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
      </div>
    </section>
  );
};

export default Experience;