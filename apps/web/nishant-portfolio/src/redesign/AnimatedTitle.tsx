import { createElement, useRef, type ReactElement } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface AnimatedTitleProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "span";
}

// Word-by-word mask reveal on scroll. Each word sits in an overflow-hidden wrap
// and rises into place with a slight 3D tilt — the award-site signature, restyled.
export function AnimatedTitle({ text, className = "", as = "h2" }: AnimatedTitleProps): ReactElement {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    const words = ref.current?.querySelectorAll(".mx-aw");
    if (!words?.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(
      words,
      { yPercent: 115, rotateX: -40, opacity: 0, transformPerspective: 600, transformOrigin: "50% 100%" },
      {
        yPercent: 0,
        rotateX: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.045,
        scrollTrigger: { trigger: ref.current, start: "top 88%", toggleActions: "play none none reverse" },
      },
    );
  }, { scope: ref });

  const words = text.split(" ").map((w, i) =>
    createElement(
      "span",
      { key: i, className: "mx-aw-wrap" },
      createElement("span", { className: "mx-aw" }, w),
      " ",
    ),
  );

  // `ref` here is forwarded to the host element, not read during render — the
  // react-hooks/refs rule can't see that through createElement's dynamic tag.
  // eslint-disable-next-line react-hooks/refs
  return createElement(as, { className: `mx-anim ${className}`.trim(), ref }, words);
}
