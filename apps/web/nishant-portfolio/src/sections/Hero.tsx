import { useEffect, useRef } from "react";
import gsap from "gsap";
import { personalInfo, products, expCards } from "../constants";
import { useGeoCV } from "../hooks/useGeoCV";
import { MagneticButton } from "../components/MagneticButton";
import { HeroName } from "./HeroName";
import { MOTION, prefersReducedMotion } from "../motion";

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// Hand-rolled scramble reveal (no paid GSAP plugin needed) — ties a plain
// 0→1 tween's onUpdate to a character-reveal, randomizing whatever hasn't
// "landed" yet. One-shot, runs once on mount, cheap (a handful of small
// text nodes for ~0.8s each).
function scrambleIn(el: HTMLElement, finalText: string, delay: number): gsap.core.Tween {
  const state = { progress: 0 };
  return gsap.to(state, {
    progress: 1,
    duration: 0.9,
    delay,
    ease: "power1.inOut",
    onUpdate: () => {
      const revealCount = Math.floor(state.progress * finalText.length);
      let out = "";
      for (let i = 0; i < finalText.length; i++) {
        out += i < revealCount || finalText[i] === " "
          ? finalText[i]
          : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }
      el.textContent = out;
    },
    onComplete: () => { el.textContent = finalText; },
  });
}

const TURBOREPO_PR = "https://github.com/vercel/turborepo/pull/12997";

const PROOF: { label: string; href?: string }[] = [
  { label: expCards[0].company },
  { label: `${products.length} npm packages` },
  { label: "Merged into Vercel Turborepo", href: TURBOREPO_PR },
  { label: "AI evaluation for 4 platforms" },
];

const Hero = () => {
  const heroRef = useRef<HTMLElement>(null);
  const { downloadCV, status } = useGeoCV();

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const reduceMotion = prefersReducedMotion();

    const ctx = gsap.context(() => {
      // Reduced motion: everything is simply there, and the outline copy
      // that normally fades in is shown at rest.
      if (reduceMotion) {
        gsap.set(".hero-name-depth", { opacity: 1 });
        return;
      }

      const { duration: posterDur, ease: posterEase } = MOTION.poster;
      const tl = gsap.timeline({ delay: 0.1 });
      tl.fromTo(".hero-name-first-inner",
          { y: "110%" },
          { y: "0%", duration: posterDur, ease: posterEase }
        )
        .fromTo(".hero-role-row",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
          "-=0.6"
        )
        .fromTo(".hero-name-last-inner",
          { y: "110%" },
          { y: "0%", duration: posterDur, ease: posterEase },
          "-=0.9"
        )
        .fromTo(".hero-deck",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: posterEase },
          "-=0.55"
        )
        .fromTo(".hero-ctas",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
          "-=0.4"
        )
        .fromTo(".hero-bottom",
          { opacity: 0 },
          { opacity: 1, duration: 0.8, ease: "power2.out" },
          "-=0.2"
        )
        .fromTo(".hero-proof-strip",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          "-=0.3"
        )
        .fromTo(".hero-name-depth",
          { opacity: 0 },
          { opacity: 1, duration: 1, ease: "power1.out" },
          "-=1.4"
        );

      // Depth duplicate — a faint outline-only copy of the name, offset a
      // few px and drifting slower on scroll than the real text (a "print
      // misregistration" depth cue). Compositor-only (transform/opacity),
      // no blur/shadow — the cheap way to fake depth after learning the
      // hard way that glow-via-text-shadow repaints every scroll frame.
      gsap.to(".hero-name-first", {
        y: -40, ease: "none",
        scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.5 },
      });
      gsap.to(".hero-name-last", {
        y: -25, ease: "none",
        scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.5 },
      });
      // Depth duplicates drift at a fraction of the real text's speed —
      // each gets exactly one tween (never shared with the real text's
      // own scrub above), otherwise two scrubbed tweens writing the same
      // element's `y` fight every frame.
      gsap.to(".hero-name-depth-first", { y: -14, ease: "none",
        scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.8 } });
      gsap.to(".hero-name-depth-last", { y: -9, ease: "none",
        scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.8 } });

      gsap.utils.toArray<HTMLElement>(".hero-role-word").forEach((el, i) => {
        scrambleIn(el, el.dataset.text ?? "", 1.7 + i * 0.15);
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" ref={heroRef} className="hero-section">
      <div className="mesh-bg" aria-hidden="true" />
      <h1 className="sr-only">{personalInfo.name}, {personalInfo.title}</h1>
      <HeroName />

      <p className="hero-deck">{personalInfo.tagline}</p>

      <div className="hero-ctas">
        <MagneticButton as="a" href="#work" className="btn-primary">
          <span>View Work</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </MagneticButton>
        <MagneticButton as="button" type="button" className="btn-outline" onClick={downloadCV} disabled={status === "loading"}>
          {status === "loading" ? "Detecting region…" : status === "done" ? "✓ Downloaded" : "Download CV"}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </MagneticButton>
        <MagneticButton as="a" href="#contact" className="btn-ghost">Say hello →</MagneticButton>
      </div>

      <div className="hero-proof-strip">
        {PROOF.map(({ label, href }) => href ? (
          <MagneticButton key={label} as="a" href={href} target="_blank" rel="noreferrer" className="hero-proof-pill">{label}</MagneticButton>
        ) : (
          <MagneticButton key={label} as="span" className="hero-proof-pill">{label}</MagneticButton>
        ))}
      </div>

      <div className="hero-bottom">
        <p className="hero-status">
          <span className="hero-status-num">01 —</span>
          {personalInfo.title} @ Samsung Electronics · Open to remote roles with EU teams
        </p>

        <div className="hero-scroll" aria-hidden="true">
          <div className="hero-scroll-line" />
          <span>Scroll</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
