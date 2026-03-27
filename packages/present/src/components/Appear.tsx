import { useEffect, useRef, useState, type ReactNode } from "react";
import { useDeckContext } from "./DeckProvider";
import type { AppearProps } from "../types";
import { cn } from "../utils/classnames";

export function Appear({
  children,
  step = 0,
  animation = "fade",
  duration = 500,
}: AppearProps) {
  const { currentSlide } = useDeckContext();
  const [visible, setVisible] = useState(false);
  const [localStep, setLocalStep] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  // Track internal sub-steps per slide
  useEffect(() => {
    // Reset when slide changes
    setLocalStep(0);
    setVisible(false);

    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "ArrowDown") {
        setLocalStep((s) => s + 1);
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        setLocalStep((s) => Math.max(0, s - 1));
      }
    };

    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentSlide]);

  useEffect(() => {
    setVisible(localStep >= step);
  }, [localStep, step]);

  return (
    <div
      className={cn(
        "present-appear",
        `present-appear--${animation}`,
        visible && "present-appear--visible"
      )}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
}

/**
 * Ordered list of children that appear one-by-one.
 */
export function AppearList({ children, animation = "slide-up" }: { children: ReactNode; animation?: AppearProps["animation"] }) {
  const items = Array.isArray(children) ? children : [children];

  return (
    <>
      {items.map((child, i) => (
        <Appear key={i} step={i} animation={animation}>
          {child}
        </Appear>
      ))}
    </>
  );
}
