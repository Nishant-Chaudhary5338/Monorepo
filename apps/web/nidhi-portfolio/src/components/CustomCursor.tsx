import { useEffect, useRef } from "react";
import gsap from "gsap";

const CustomCursor = () => {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // No custom cursor on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // GSAP quickTo — shares the same RAF tick, smoother than manual lerp
    const xTo = gsap.quickTo(ring, "left", { duration: 0.45, ease: "power3" });
    const yTo = gsap.quickTo(ring, "top",  { duration: 0.45, ease: "power3" });

    const onMouseMove = (e: MouseEvent) => {
      dot.style.left = `${e.clientX}px`;
      dot.style.top  = `${e.clientY}px`;
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest("a, button, [data-cursor]");
      if (isInteractive) {
        ring.style.width       = "56px";
        ring.style.height      = "56px";
        ring.style.borderColor = "rgba(184,146,58,0.8)"; // --accent-gold
        dot.style.transform    = "translate(-50%, -50%) scale(1.8)";
      } else {
        ring.style.width       = "36px";
        ring.style.height      = "36px";
        ring.style.borderColor = "rgba(91,78,232,0.6)"; // --accent-purple
        dot.style.transform    = "translate(-50%, -50%) scale(1)";
      }
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
};

export default CustomCursor;
