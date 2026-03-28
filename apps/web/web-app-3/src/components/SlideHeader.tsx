interface SlideHeaderProps {
  title: string;
  highlight?: string;
  highlightColor?: "purple" | "cyan" | "green" | "amber" | "gradient";
  subtitle?: string;
  className?: string;
}

const highlightColorMap = {
  purple: "text-purple-400",
  cyan: "text-cyan-400",
  green: "text-green-400",
  amber: "text-amber-400",
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
      <h2 className="text-3xl font-bold text-slate-200">
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
        <p className="mt-2 text-base text-slate-400">{subtitle}</p>
      )}
    </div>
  );
}