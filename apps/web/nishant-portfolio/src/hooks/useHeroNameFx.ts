import { useEffect, type RefObject } from "react";

// Spotlight window is 360px (see .hero-spot in index.css).
const SPOT_HALF = 180;

// The hero spotlight follows the pointer with transforms only, so mousemove
// never repaints the name: the window moves to the pointer while its bright
// copy is counter-translated to stay aligned. The letterpress extrusion is
// static; making it follow the pointer measurably cost frames.
export function useHeroNameFx(blockRef: RefObject<HTMLDivElement | null>): void {
  useEffect(() => {
    const block = blockRef.current;
    if (!block || !window.matchMedia("(pointer: fine)").matches) return;

    const spot = block.querySelector<HTMLElement>(".hero-spot");
    const spotInner = block.querySelector<HTMLElement>(".hero-spot-inner");
    if (!spot || !spotInner) return;

    const sizeObserver = new ResizeObserver(() => block.style.setProperty("--bw", `${block.clientWidth}px`));
    sizeObserver.observe(block);

    const onMove = (e: PointerEvent): void => {
      const rect = block.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spot.style.transform = `translate3d(${x - SPOT_HALF}px, ${y - SPOT_HALF}px, 0)`;
      spotInner.style.transform = `translate3d(${SPOT_HALF - x}px, ${SPOT_HALF - y}px, 0)`;
    };

    block.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      block.removeEventListener("pointermove", onMove);
      sizeObserver.disconnect();
    };
  }, [blockRef]);
}
