import { useDeckContext } from "./DeckProvider";

export function ProgressFraction() {
  const { currentSlide, totalSlides } = useDeckContext();

  return (
    <div className="present-progress-fraction">
      {currentSlide + 1} / {totalSlides}
    </div>
  );
}
