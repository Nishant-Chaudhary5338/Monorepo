interface SlideHeaderProps {
  title: string;
  highlight?: string;
  highlightColor?: "purple" | "cyan" | "green" | "amber" | "gradient";
  subtitle?: string;
  className?: string;
}

const highlightColorMap = {
  purple: "text-purple-600",
  cyan: "text-cyan-600",
  green: "text-green-600",
  amber: "text-amber-600",
  gradient: "gradient-text",
};

export function SlideHeader({
  title,
  highlight,
  highlightColor = "gradient",
  subtitle,
  className = "",
}: SlideHeaderProps) {
  return (
    <div className={`mb-6 ${className}`}>
      <h2 className="text-3xl font-bold text-gray-800">
        {title}
        {highlight && (
          <>
            {" "}
            <span className={highlightColorMap[highlightColor]}>
              {highlight}
            </span>
          </>
        )}
      </h2>
      {subtitle && (
        <p className="mt-2 text-base text-gray-500">{subtitle}</p>
      )}
    </div>
  );
}