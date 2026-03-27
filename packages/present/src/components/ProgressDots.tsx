import { useDeckContext } from "./DeckProvider";

export function ProgressDots() {
  const { currentSlide, totalSlides, goTo } = useDeckContext();

  return (
    <div className="present-progress-dots">
      {Array.from({ length: totalSlides }, (_, i) => (
        <button
          key={i}
          className={`present-progress-dot${i === currentSlide ? " present-progress-dot--active" : ""}`}
          onClick={() => goTo(i)}
          aria-label={`Go to slide ${i + 1}`}
        />
      ))}
    </div>
  );
}
