import { useRef, type ReactElement } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Thin top progress bar scrubbed by total page scroll.
export function ScrollProgress(): ReactElement {
  const fill = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      fill.current,
      { scaleX: 0 },
      { scaleX: 1, ease: "none", transformOrigin: "left center",
        scrollTrigger: { start: 0, end: "max", scrub: 0.3 } },
    );
  });

  return (
    <div className="mx-scrollbar" aria-hidden="true">
      <div className="mx-scrollbar__fill" ref={fill} />
    </div>
  );
}
