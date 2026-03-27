import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { useDeckContext } from "./DeckProvider";
import type { PreziStep } from "../types";

interface PreziCanvasProps {
  children: ReactNode;
  steps: PreziStep[];
  width?: number;
  height?: number;
}

export function PreziCanvas({
  children,
  steps,
  width = 3000,
  height = 2000,
}: PreziCanvasProps) {
  const { currentSlide } = useDeckContext();
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    // Map slide index to prezi step
    if (currentSlide < steps.length) {
      setActiveStep(currentSlide);
    }
  }, [currentSlide, steps.length]);

  const step = steps[activeStep] ?? steps[0];
  if (!step) return null;

  const contentStyle: CSSProperties = {
    width,
    height,
    transform: `scale(${step.zoom}) translate(${-step.x}px, ${-step.y}px)${step.rotation ? ` rotate(${step.rotation}deg)` : ""}`,
  };

  return (
    <div className="present-canvas">
      <div className="present-canvas-content" style={contentStyle}>
        {children}
      </div>
    </div>
  );
}
