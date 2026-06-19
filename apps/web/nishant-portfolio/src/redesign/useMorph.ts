import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { morphStore } from "./morphStore";

gsap.registerPlugin(ScrollTrigger);

// Wires pointer + scroll into the morph store.
// - each [data-morph="N"] section owns one unit of continuous progress as it
//   crosses the viewport centre, so the cloud scrubs smoothly between shapes
// - pointer drives repulsion; drag (on empty space) spins the field
// - reduced-motion → discrete stepwise morph, no pointer-driven motion
export function useMorph(): void {
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-morph]"));

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        sections.forEach((el) => {
          const n = Number(el.dataset.morph);
          if (Number.isNaN(n)) return;
          ScrollTrigger.create({
            trigger: el,
            start: n === 0 ? "top top" : "top center",
            end: "bottom center",
            scrub: true,
            onUpdate: (self) => morphStore.setProgress(Math.max(0, n - 1 + self.progress)),
          });
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        sections.forEach((el) => {
          const n = Number(el.dataset.morph);
          if (Number.isNaN(n)) return;
          ScrollTrigger.create({
            trigger: el,
            start: "top center",
            end: "bottom center",
            onToggle: (self) => { if (self.isActive) morphStore.setIndex(n); },
          });
        });
      });
    });

    // pointer repulsion + drag-spin (skipped under reduced motion)
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const onMove = (e: PointerEvent): void => {
      morphStore.setPointer(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1,
        true,
      );
      if (morphStore.get().dragging) morphStore.addRot(e.movementX * 0.004);
    };
    const isInteractive = (t: EventTarget | null): boolean =>
      !!(t as HTMLElement | null)?.closest("a, button, input, textarea, select");
    const onDown = (e: PointerEvent): void => {
      if (!isInteractive(e.target)) {
        morphStore.setDragging(true);
        document.documentElement.setAttribute("data-dragging", "true");
      }
    };
    const onUp = (): void => {
      morphStore.setDragging(false);
      document.documentElement.removeAttribute("data-dragging");
    };
    const onLeave = (): void => morphStore.setPointer(0, 0, false);

    if (!reduce) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerdown", onDown);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
      document.addEventListener("pointerleave", onLeave);
    }

    return () => {
      ctx.revert();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);
}
