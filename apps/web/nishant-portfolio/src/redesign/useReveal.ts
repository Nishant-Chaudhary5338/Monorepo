import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Batch reveal for content blocks marked [data-reveal] — they rise + fade in as
// they enter, staggered per group. No-op under reduced motion (content stays put).
export function useReveal(selector = "[data-reveal]"): void {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = gsap.utils.toArray<HTMLElement>(selector);
    if (!els.length) return;

    gsap.set(els, { opacity: 0, y: 44 });
    const triggers = ScrollTrigger.batch(els, {
      start: "top 88%",
      onEnter: (batch) =>
        gsap.to(batch, { opacity: 1, y: 0, duration: 0.85, ease: "power3.out", stagger: 0.09, overwrite: true }),
    });
    ScrollTrigger.refresh();

    return () => {
      triggers.forEach((t) => t.kill());
      gsap.set(els, { clearProps: "opacity,transform" });
    };
  }, [selector]);
}
