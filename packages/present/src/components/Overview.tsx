import { useDeckContext } from "./DeckProvider";

export function Overview() {
  const { config, currentSlide, isOverview, goTo, toggleOverview } =
    useDeckContext();
  const { slides } = config;

  if (!isOverview) return null;

  return (
    <div className="present-overview" onClick={toggleOverview}>
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`present-overview-slide${
            i === currentSlide ? " present-overview-slide--active" : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();
            goTo(i);
            toggleOverview();
          }}
        >
          <span className="present-overview-slide-number">{i + 1}</span>
          <div style={{ transform: "scale(0.22)", transformOrigin: "top left", width: "455%", height: "455%" }}>
            <div className="present-slide present-slide--center">
              <span className="present-heading present-heading--3">
                {slide.title ?? `Slide ${i + 1}`}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
