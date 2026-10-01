import gsap from "gsap";

// The site's shared motion vocabulary, so every section moves the same way:
//   Poster Reveal  — hero name masks up        (1.05s, power3.out, .12s stagger)
//   Proof Drift    — cards/rows rise into view (0.7s,  power3.out)
//   Magnetic Micro — buttons/pills on hover    (120-180ms, power2.out; MagneticButton)
//   Spotlight      — glow follows the pointer  (CSS vars, 280ms opacity)
// Under reduced motion every reveal becomes a short opacity-only fade.
export const MOTION = {
  poster: { duration: 1.05, ease: "power3.out", stagger: 0.12 },
  drift: { duration: 0.7, ease: "power3.out", y: 36 },
  fade: { duration: 0.2, ease: "power1.out" },
} as const;

export const prefersReducedMotion = (): boolean =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

interface DriftOptions {
  trigger?: gsap.DOMTarget;
  stagger?: number;
  delay?: number;
  start?: string;
}

export function proofDrift(targets: gsap.TweenTarget, opts: DriftOptions = {}): gsap.core.Tween {
  const { trigger, stagger = 0.08, delay = 0, start = "top 82%" } = opts;
  const scrollTrigger = trigger ? { trigger, start } : undefined;

  if (prefersReducedMotion()) {
    return gsap.fromTo(targets, { opacity: 0 }, { opacity: 1, ...MOTION.fade, scrollTrigger });
  }
  return gsap.fromTo(
    targets,
    { y: MOTION.drift.y, opacity: 0 },
    { y: 0, opacity: 1, duration: MOTION.drift.duration, ease: MOTION.drift.ease, stagger, delay, scrollTrigger },
  );
}
