import { useRef, type ReactElement, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  as?: "button" | "a";
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
}

// Button that pulls toward the cursor and springs back on leave.
export function MagneticButton({
  children, className = "", as = "button", href, onClick, disabled,
}: MagneticButtonProps): ReactElement {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const move = (e: PointerEvent): void => {
      const r = el.getBoundingClientRect();
      gsap.to(el, {
        x: (e.clientX - (r.left + r.width / 2)) * 0.35,
        y: (e.clientY - (r.top + r.height / 2)) * 0.45,
        duration: 0.5, ease: "power3.out",
      });
    };
    const leave = (): void => { gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" }); };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
  }, { scope: ref });

  if (as === "a") {
    return (
      <a ref={ref as React.RefObject<HTMLAnchorElement>} className={className} href={href} data-cursor="view">
        {children}
      </a>
    );
  }
  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      className={className}
      onClick={onClick}
      disabled={disabled}
      data-cursor="view"
    >
      {children}
    </button>
  );
}
