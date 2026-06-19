import { useEffect, useRef, useState, type ReactElement } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Branded intro: counts to 100 while fonts settle, then wipes up to reveal the
// site (and refreshes ScrollTrigger against the final, font-correct layout).
export function Preloader(): ReactElement | null {
  const ref = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const minTime = reduce ? 0.2 : 1.1;
    const counter = { v: 0 };

    const tick = gsap.to(counter, {
      v: 100, duration: minTime, ease: "power1.inOut",
      onUpdate: () => { if (numRef.current) numRef.current.textContent = String(Math.round(counter.v)); },
    });

    const ready = Promise.all([
      document.fonts?.ready ?? Promise.resolve(),
      new Promise((r) => setTimeout(r, minTime * 1000)),
    ]);

    ready.then(() => {
      gsap.to(ref.current, {
        yPercent: -100, duration: 0.9, ease: "power4.inOut",
        onComplete: () => { setDone(true); ScrollTrigger.refresh(); },
      });
    });

    return () => { tick.kill(); };
  }, []);

  if (done) return null;
  return (
    <div className="mx-preloader" ref={ref}>
      <div className="mx-preloader__row">
        <span className="mx-preloader__name">Nishant Chaudhary</span>
        <span className="mx-preloader__num"><span ref={numRef}>0</span>%</span>
      </div>
    </div>
  );
}
