import type { ReactNode } from "react";
import { useState } from "react";

interface ExpandableCardProps {
  icon: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  color?: "purple" | "cyan" | "green" | "amber" | "red";
  className?: string;
}

const colorMap = {
  purple: {
    bg: "bg-purple-500/10",
    border: "border-purple-400",
    text: "text-purple-600",
    hover: "hover:bg-purple-500/20",
  },
  cyan: {
    bg: "bg-cyan-500/10",
    border: "border-cyan-400",
    text: "text-cyan-600",
    hover: "hover:bg-cyan-500/20",
  },
  green: {
    bg: "bg-green-500/10",
    border: "border-green-400",
    text: "text-green-600",
    hover: "hover:bg-green-500/20",
  },
  amber: {
    bg: "bg-amber-500/10",
    border: "border-amber-400",
    text: "text-amber-600",
    hover: "hover:bg-amber-500/20",
  },
  red: {
    bg: "bg-red-500/10",
    border: "border-red-400",
    text: "text-red-600",
    hover: "hover:bg-red-500/20",
  },
};

export function ExpandableCard({
  icon,
  title,
  subtitle,
  children,
  color = "purple",
  className = "",
}: ExpandableCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const colors = colorMap[color];

  return (
    <div
      className={`rounded-xl border-2 ${colors.border} ${colors.bg} ${colors.hover} cursor-pointer transition-all duration-300 ${className}`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-center gap-4 p-6">
        <span className="text-4xl">{icon}</span>
        <div className="flex-1">
          <h3 className={`text-xl font-bold ${colors.text}`}>{title}</h3>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        <span
          className={`text-2xl text-gray-400 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
        >
          ▼
        </span>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="border-t border-gray-200 px-6 py-4">{children}</div>
      </div>
    </div>
  );
}