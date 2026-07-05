import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";

// Subtle pointer-driven 3D tilt. transform-only (gsap.quickTo), rect
// cached on pointerenter (not read per-move — avoids forcing layout on a
// high-frequency event). No-ops on touch devices and reduced motion.
export function useTilt3D<T extends HTMLElement>(maxDeg = 6): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    gsap.set(el, { transformPerspective: 800 });
    const rx = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power2.out" });
    const ry = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power2.out" });

    let rect = el.getBoundingClientRect();
    const onEnter = (): void => { rect = el.getBoundingClientRect(); };
    const onMove = (e: PointerEvent): void => {
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      rx(-py * maxDeg * 2);
      ry(px * maxDeg * 2);
    };
    const onLeave = (): void => { rx(0); ry(0); };

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      gsap.set(el, { clearProps: "transform" });
    };
  }, [maxDeg]);

  return ref;
}
