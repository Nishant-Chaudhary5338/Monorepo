import { useEffect, useState } from "react";

interface BarData {
  label: string;
  value: number;
  maxValue: number;
  color: "red" | "amber" | "green" | "cyan" | "purple";
  suffix?: string;
}

interface BarChartProps {
  data: BarData[];
  title?: string;
  className?: string;
}

const colorMap = {
  red: "bg-red-500",
  amber: "bg-amber-500",
  green: "bg-green-500",
  cyan: "bg-cyan-500",
  purple: "bg-purple-500",
};

export function BarChart({ data, title, className = "" }: BarChartProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {title && (
        <h4 className="text-sm font-semibold text-gray-600">{title}</h4>
      )}
      {data.map((bar) => {
        const percentage = (bar.value / bar.maxValue) * 100;
        return (
          <div key={bar.label} className="flex items-center gap-3">
            <span className="w-24 text-right text-xs font-medium text-gray-500">
              {bar.label}
            </span>
            <div className="h-4 flex-1 overflow-hidden rounded-full bg-white/20">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${colorMap[bar.color]}`}
                style={{ width: animated ? `${percentage}%` : "0%" }}
              />
            </div>
            <span className="w-16 text-left text-sm font-bold text-gray-700">
              {bar.value}
              {bar.suffix}
            </span>
          </div>
        );
      })}
    </div>
  );
}