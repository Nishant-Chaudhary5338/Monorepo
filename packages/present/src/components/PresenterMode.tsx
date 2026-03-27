import { useDeckContext } from "./DeckProvider";
import { Slide } from "./Slide";
import { useTimer } from "../hooks/useTimer";
import { useEffect } from "react";

export function PresenterMode() {
  const { config, currentSlide, totalSlides, isPresenterMode, next, prev } =
    useDeckContext();
  const { slides, background, layout } = config;
  const { elapsedFormatted, start, reset } = useTimer();

  useEffect(() => {
    if (isPresenterMode) {
      reset();
      start();
    }
  }, [isPresenterMode]);

  if (!isPresenterMode) return null;

  const current = slides[currentSlide];
  const nextSlide = slides[currentSlide + 1];
  const slideBg = current?.background ?? background;
  const slideLayout = current?.layout ?? layout ?? "default";

  return (
    <div className="present-presenter">
      <div className="present-presenter-current">
        <div style={{ width: "100%", maxWidth: 960, aspectRatio: "16/9", position: "relative", overflow: "hidden", borderRadius: "0.5rem" }}>
          <Slide layout={slideLayout} background={slideBg}>
            {current?.content}
          </Slide>
        </div>
      </div>

      <div className="present-presenter-next">
        <span className="present-presenter-next-label">Next</span>
        <div className="present-presenter-next-slide">
          {nextSlide ? (
            <Slide
              layout={nextSlide.layout ?? slideLayout}
              background={nextSlide.background ?? slideBg}
            >
              {nextSlide.content}
            </Slide>
          ) : (
            <div className="present-slide present-slide--center">
              <span style={{ opacity: 0.4 }}>End of deck</span>
            </div>
          )}
        </div>

        <div className="present-presenter-controls">
          <div className="present-presenter-timer">{elapsedFormatted}</div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button className="present-controls-btn" onClick={prev}>←</button>
            <button className="present-controls-btn" onClick={next}>→</button>
          </div>
        </div>
      </div>
    </div>
  );
}
