import { useEffect, useRef, type ElementType, type ReactNode, type ComponentPropsWithoutRef } from "react";
import gsap from "gsap";

type MagneticButtonProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children">;

// Subtle pointer-follow pull on hover — button eases toward the cursor,
// snaps back on leave. transform-only (gsap.quickTo), no layout/paint
// cost; no-ops on touch devices and under reduced motion.
export function MagneticButton<T extends ElementType = "button">({
  as, children, ...rest
}: MagneticButtonProps<T>) {
  const Component = as ?? "button";
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3" });

    let rect = el.getBoundingClientRect();
    const onEnter = (): void => { rect = el.getBoundingClientRect(); };
    const onMove = (e: PointerEvent): void => {
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      xTo(relX * 0.3);
      yTo(relY * 0.3);
    };
    const onLeave = (): void => { xTo(0); yTo(0); };

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      gsap.set(el, { clearProps: "transform" });
    };
  }, []);

  return (
    // @ts-expect-error — polymorphic ref across arbitrary element types
    <Component ref={ref} {...rest}>
      {children}
    </Component>
  );
}
