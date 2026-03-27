import { useDeckContext } from "./DeckProvider";
import type { ProgressVariant } from "../types";
import { ProgressBar } from "./ProgressBar";
import { ProgressDots } from "./ProgressDots";
import { ProgressCircle } from "./ProgressCircle";
import { ProgressFraction } from "./ProgressFraction";

interface DeckControlsProps {
  progress?: ProgressVariant;
  showNav?: boolean;
}

export function DeckControls({ progress = "bar", showNav = true }: DeckControlsProps) {
  const { prev, next, toggleFullscreen, toggleOverview, togglePresenterMode } =
    useDeckContext();

  return (
    <>
      {progress === "bar" && <ProgressBar />}
      {progress === "dots" && <ProgressDots />}
      {progress === "circle" && <ProgressCircle />}
      {progress === "fraction" && <ProgressFraction />}

      {showNav && (
        <div className="present-controls">
          <button className="present-controls-btn" onClick={prev} aria-label="Previous slide">
            ‹
          </button>
          <button className="present-controls-btn" onClick={toggleOverview} aria-label="Overview">
            ⊞
          </button>
          <button className="present-controls-btn" onClick={togglePresenterMode} aria-label="Presenter mode">
            🎤
          </button>
          <button className="present-controls-btn" onClick={toggleFullscreen} aria-label="Fullscreen">
            ⛶
          </button>
          <button className="present-controls-btn" onClick={next} aria-label="Next slide">
            ›
          </button>
        </div>
      )}
    </>
  );
}
