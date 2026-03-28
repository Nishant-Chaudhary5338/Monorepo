interface BenefitItemProps {
  icon: string;
  title: string;
  desc: string;
  color?: "purple" | "cyan" | "green" | "amber" | "red";
  className?: string;
}

const colorMap = {
  purple: "text-purple-400",
  cyan: "text-cyan-400",
  green: "text-green-400",
  amber: "text-amber-400",
  red: "text-red-400",
};

export function BenefitItem({
  icon,
  title,
  desc,
  color = "cyan",
  className = "",
}: BenefitItemProps) {
  return (
    <div
      className={`flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md ${className}`}
    >
      <span className="text-2xl">{icon}</span>
      <div>
        <div className={`font-semibold ${colorMap[color]}`}>{title}</div>
        <div className="text-sm text-slate-400">{desc}</div>
      </div>
    </div>
  );
}