import type { ReactNode } from "react";

type CardVariant = "default" | "purple" | "cyan" | "green" | "amber" | "red";

interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  border?: "top" | "left" | "none";
  className?: string;
}

const variantStyles: Record<CardVariant, string> = {
  default: "bg-white/5 border-white/10",
  purple: "bg-purple-500/10 border-purple-500/30",
  cyan: "bg-cyan-500/10 border-cyan-500/30",
  green: "bg-green-500/10 border-green-500/30",
  amber: "bg-amber-500/10 border-amber-500/30",
  red: "bg-red-500/10 border-red-500/30",
};

const borderTopColors: Record<CardVariant, string> = {
  default: "border-t-white/10",
  purple: "border-t-purple-500",
  cyan: "border-t-cyan-500",
  green: "border-t-green-500",
  amber: "border-t-amber-500",
  red: "border-t-red-500",
};

const borderLeftColors: Record<CardVariant, string> = {
  default: "border-l-white/10",
  purple: "border-l-purple-500",
  cyan: "border-l-cyan-500",
  green: "border-l-green-500",
  amber: "border-l-amber-500",
  red: "border-l-red-500",
};

export function Card({
  children,
  variant = "default",
  border = "none",
  className = "",
}: CardProps) {
  const borderClass =
    border === "top"
      ? `border-t-3 ${borderTopColors[variant]}`
      : border === "left"
        ? `border-l-3 ${borderLeftColors[variant]}`
        : "";

  return (
    <div
      className={`rounded-xl border backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/20 ${variantStyles[variant]} ${borderClass} ${className}`}
    >
      {children}
    </div>
  );
}