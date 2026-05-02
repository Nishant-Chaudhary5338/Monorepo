import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import AnimatedCounter from "../components/AnimatedCounter";
import { words } from "../constants";
import HeroExperience from "../components/models/hero_models/HeroExperience";

const Hero = () => {
  useGSAP(() => {
    gsap.fromTo(
      ".hero-text h1",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.2, duration: 1, ease: "power2.inOut" }
    );
    gsap.fromTo(
      ".hero-eyebrow, .hero-meta-strip",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.15, duration: 0.9, ease: "power2.out", delay: 0.1 }
    );
  });

  return (
    <section id="hero" className="relative overflow-hidden">
      <div className="absolute top-0 left-0 z-10">
        <img src="/images/bg.png" alt="" />
      </div>

      <div className="hero-layout">
        {/* LEFT: Hero Content */}
        <header className="flex flex-col justify-center md:w-full w-screen md:px-20 px-5 gap-8">

          {/* Availability badge */}
          <div className="hero-eyebrow flex items-center gap-3">
            <span className="availability-dot" />
            <span className="hero-badge">
              Available · Senior &amp; Staff Frontend roles · Remote · Delhi, IN
            </span>
          </div>

          {/* Editorial headline */}
          <div className="hero-text">
            <h1>
              Building
              <span className="slide">
                <span className="wrapper">
                  {words.map((word, index) => (
                    <span
                      key={index}
                      className="flex items-center md:gap-3 gap-1 pb-2"
                    >
                      <img
                        src={word.imgPath}
                        alt=""
                        className="xl:size-12 md:size-10 size-7 md:p-2 p-1 rounded-full bg-white-50"
                      />
                      <span>{word.text}</span>
                    </span>
                  ))}
                </span>
              </span>
            </h1>
            <h1>that let teams</h1>
            <h1><em>ship faster.</em></h1>
          </div>

          {/* Hero meta strip */}
          <div className="hero-meta-strip">
            <span><b>Now</b>&nbsp;·&nbsp;Plugin-based MFE on Vite Module Federation</span>
            <span><b>Stack</b>&nbsp;·&nbsp;React, TypeScript, Turborepo</span>
            <span><b>Open to</b>&nbsp;·&nbsp;Remote · UK · EU · US · SG</span>
          </div>
        </header>

        {/* RIGHT: 3D Model */}
        <figure>
          <div className="hero-3d-layout">
            <HeroExperience />
          </div>
        </figure>
      </div>

      {/* Numbers strip */}
      <AnimatedCounter />
    </section>
  );
};

export default Hero;
