import { useEffect, useRef } from "react";
import gsap from "gsap";

const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // No custom cursor on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // xPercent/yPercent are GSAP's own translate — letting GSAP own the
    // centering offset (instead of a CSS class's `transform: translate(...)`)
    // is what lets it compose correctly with rotation/scale into one
    // transform matrix. If the CSS class had set `transform` instead, the
    // very first rotationZ/rotationX update would have silently replaced
    // that whole declaration (inline transform fully overrides a class's
    // transform, it doesn't merge) — the ring would jump off-center and
    // the "shape" appeared frozen because the whole element was quietly
    // mispositioned every frame after that.
    gsap.set(ring, { xPercent: -50, yPercent: -50, transformPerspective: 500, borderRadius: "50%", scale: 1 });
    gsap.set(dot, { xPercent: -50, yPercent: -50 });

    // Position goes through transform (x/y), not left/top, so moving the
    // cursor never triggers layout.
    const xTo = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3" });
    const yTo = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3" });
    const dotXTo = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3" });
    const dotYTo = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3" });

    const tiltTo = gsap.quickTo(ring, "rotationX", { duration: 0.4, ease: "power2.out" });
    const squashTo = gsap.quickTo(ring, "scaleY", { duration: 0.35, ease: "power2.out" });
    // border-radius goes through a plain CSS transition (see .cursor-ring),
    // not gsap.quickTo — quickTo's unit-inference doesn't reliably pick up
    // "%" for non-transform properties like this one, so it silently never
    // moved off the initial 50%. A direct style write + CSS transition
    // sidesteps that entirely and is just as cheap for a 44px element.
    const shapeTo = (v: number): void => { ring.style.borderRadius = `${v}%`; };
    // Hover enlarge also goes through GSAP (not a CSS class transform) for
    // the same reason — it has to share the one transform with rotation/tilt.
    const scaleTo = gsap.quickTo(ring, "scale", { duration: 0.3, ease: "power2.out" });

    // Hidden until the pointer first moves, then placed exactly under it —
    // otherwise the ring sits at the top-left corner on load.
    let ready = false;
    const onMouseMove = (e: MouseEvent) => {
      if (!ready) {
        ready = true;
        gsap.set([dot, ring], { x: e.clientX, y: e.clientY });
        dot.classList.add("is-ready");
        ring.classList.add("is-ready");
      }
      dotXTo(e.clientX);
      dotYTo(e.clientY);
      xTo(e.clientX);
      yTo(e.clientY);
      wake();
    };

    // Single delegated listener — no MutationObserver rescanning the DOM
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest("a, button, [role='button'], [data-cursor]");
      ring.classList.toggle("cursor-ring--hover", !!isInteractive);
      dot.classList.toggle("cursor-dot--hover", !!isInteractive);
      scaleTo(isInteractive ? 1.7 : 1);
    };

    // Rotation has exactly one driver: a ticker that spins the ring while
    // the pointer moves or the page scrolls, plus whatever scroll adds on
    // top, rather than two tweens fighting over the same property. The
    // ticker removes itself once things have been still for a moment, so an
    // idle page costs no frames.
    // GSAP's 2D/Z-axis rotation property is called "rotation", not
    // "rotationZ" (that name silently no-ops in CSSPlugin).
    const SETTLE_MS = 600;
    let rotation = 0;
    let lastActivity = 0;
    let ticking = false;
    const spinTo = gsap.quickTo(ring, "rotation", { duration: 0.3, ease: "power1.out" });
    const onTick = (): void => {
      rotation += 0.35;
      spinTo(rotation);
      if (performance.now() - lastActivity > SETTLE_MS) {
        gsap.ticker.remove(onTick);
        ticking = false;
      }
    };
    const wake = (): void => {
      if (reduceMotion) return;
      lastActivity = performance.now();
      if (ticking) return;
      ticking = true;
      gsap.ticker.add(onTick);
    };

    let lastY = window.scrollY;
    let lastT = performance.now();
    let settleTimer: number | undefined;

    const onScroll = (): void => {
      if (reduceMotion) return;
      const y = window.scrollY;
      const t = performance.now();
      const dy = y - lastY;
      const dt = Math.max(t - lastT, 1);
      const velocity = dy / dt; // px per ms — signed, direction-aware

      wake();
      rotation += dy * 1.2;
      tiltTo(gsap.utils.clamp(-40, 40, velocity * 16));
      squashTo(gsap.utils.clamp(0.62, 1.4, 1 + velocity * 0.03));
      shapeTo(gsap.utils.clamp(8, 50, 50 - Math.abs(velocity) * 26));

      lastY = y;
      lastT = t;

      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        tiltTo(0);
        squashTo(1);
        shapeTo(50);
      }, 200);
    };

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseover", onMouseOver);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      window.removeEventListener("scroll", onScroll);
      gsap.ticker.remove(onTick);
      window.clearTimeout(settleTimer);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
};

export default CustomCursor;
