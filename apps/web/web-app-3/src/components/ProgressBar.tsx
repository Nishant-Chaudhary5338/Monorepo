interface ProgressBarProps {
  value: number;
  max?: number;
  color?: "purple" | "cyan" | "green" | "amber" | "red";
  showLabel?: boolean;
  className?: string;
}

const colorMap = {
  purple: "bg-purple-500",
  cyan: "bg-cyan-500",
  green: "bg-green-500",
  amber: "bg-amber-500",
  red: "bg-red-500",
};

export function ProgressBar({
  value,
  max = 100,
  color = "cyan",
  showLabel = false,
  className = "",
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${colorMap[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="min-w-[3rem] text-right text-sm font-bold text-cyan-300">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
}