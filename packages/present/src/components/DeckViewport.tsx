import { useCallback, useRef, useState, type CSSProperties } from "react";
import { useDeckContext } from "./DeckProvider";
import { Slide } from "./Slide";
import { themeToCssVars } from "../utils/theme";
import type { SlideTransition } from "../types";
import { resolveTheme } from "../utils/theme";

export function DeckViewport() {
  const { config, currentSlide, isOverview, isPresenterMode } =
    useDeckContext();
  const { slides, background, layout } = config;

  const viewportRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const slide = slides[currentSlide];
  const slideBg = slide?.background ?? background;
  const slideLayout = slide?.layout ?? layout ?? "default";

  const updateScale = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const theme = resolveTheme(config.theme);
    const vw = viewport.clientWidth;
    const vh = viewport.clientHeight;
    setScale(Math.min(vw / theme.slideWidth, vh / theme.slideHeight));
  }, [config.theme]);

  const themeVars = themeToCssVars(config.theme ?? {});
  const wrapperStyle: CSSProperties = {
    transform: `scale(${scale})`,
    ...themeVars,
  };

  if (isOverview || isPresenterMode) return null;

  return (
    <div className="present-viewport" ref={viewportRef}>
      <div className="present-slide-wrapper" style={wrapperStyle}>
        <div style={{ position: "absolute", inset: 0 }}>
          <Slide layout={slideLayout} background={slideBg}>
            {slide?.content}
          </Slide>
        </div>
      </div>
    </div>
  );
}
