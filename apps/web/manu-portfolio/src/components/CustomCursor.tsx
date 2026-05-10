import { useEffect, useRef } from "react";
import gsap from "gsap";

const CustomCursor = () => {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const xTo = gsap.quickTo(ring, "left", { duration: 0.45, ease: "power3" });
    const yTo = gsap.quickTo(ring, "top",  { duration: 0.45, ease: "power3" });

    const onMouseMove = (e: MouseEvent) => {
      gsap.set(dot, { left: e.clientX, top: e.clientY });
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest("a, button, [data-cursor]");
      if (isInteractive) {
        ring.classList.add("cursor-ring--hover");
        dot.classList.add("cursor-dot--hover");
      } else {
        ring.classList.remove("cursor-ring--hover");
        dot.classList.remove("cursor-dot--hover");
      }
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover",  onMouseOver);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover",  onMouseOver);
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
};

export default CustomCursor;
