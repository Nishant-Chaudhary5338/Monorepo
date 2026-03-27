import { useDeckContext } from "./DeckProvider";

export function ProgressCircle() {
  const { currentSlide, totalSlides } = useDeckContext();
  const size = 40;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = ((currentSlide + 1) / totalSlides) * circumference;

  return (
    <div className="present-progress-circle">
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--present-primary)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
