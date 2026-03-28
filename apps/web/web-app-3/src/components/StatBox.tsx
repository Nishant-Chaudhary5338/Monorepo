interface StatBoxProps {
  value: string;
  label: string;
  sub?: string;
  color?: "purple" | "cyan" | "green" | "amber" | "red";
  className?: string;
}

const colorMap = {
  purple: {
    text: "text-purple-400",
    bg: "bg-purple-500/15",
    border: "border-t-purple-500",
  },
  cyan: {
    text: "text-cyan-400",
    bg: "bg-cyan-500/15",
    border: "border-t-cyan-500",
  },
  green: {
    text: "text-green-400",
    bg: "bg-green-500/15",
    border: "border-t-green-500",
  },
  amber: {
    text: "text-amber-400",
    bg: "bg-amber-500/15",
    border: "border-t-amber-500",
  },
  red: {
    text: "text-red-400",
    bg: "bg-red-500/15",
    border: "border-t-red-500",
  },
};

export function StatBox({
  value,
  label,
  sub,
  color = "purple",
  className = "",
}: StatBoxProps) {
  const styles = colorMap[color];

  return (
    <div
      className={`rounded-xl border border-white/10 ${styles.bg} p-6 text-center ${className}`}
      style={{ borderTopWidth: "3px" }}
    >
      <div className={`text-4xl font-extrabold leading-none ${styles.text}`}>
        {value}
      </div>
      <div className="mt-2 font-semibold text-slate-200">{label}</div>
      {sub && <div className="mt-1 text-sm text-slate-400">{sub}</div>}
    </div>
  );
}