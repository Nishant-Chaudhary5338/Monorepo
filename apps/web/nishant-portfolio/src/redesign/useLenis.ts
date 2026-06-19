import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Smooth scroll on the home route only, wired to GSAP's single ticker so Lenis,
// ScrollTrigger and the R3F loop never fight over rAF. Returns the instance so
// nav anchors can use lenis.scrollTo(). Skipped entirely under reduced-motion.
export function useLenis(): React.RefObject<Lenis | null> {
  const ref = useRef<Lenis | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const lenis = new Lenis({
      autoRaf: false,
      duration: 1.1,
      easing: (t: number): number => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    ref.current = lenis;

    const onScroll = (): void => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const raf = (time: number): void => { lenis.raf(time * 1000); };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(raf);
      lenis.destroy();
      ref.current = null;
    };
  }, []);

  return ref;
}
