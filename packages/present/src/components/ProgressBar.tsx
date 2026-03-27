import { useDeckContext } from "./DeckProvider";

export function ProgressBar() {
  const { currentSlide, totalSlides } = useDeckContext();
  const progress = ((currentSlide + 1) / totalSlides) * 100;

  return (
    <div
      className="present-progress-bar"
      style={{ width: `${progress}%` }}
      role="progressbar"
      aria-valuenow={currentSlide + 1}
      aria-valuemin={1}
      aria-valuemax={totalSlides}
    />
  );
}
