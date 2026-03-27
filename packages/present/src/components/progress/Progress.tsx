/**
 * Progress — Presentation progress indicator
 *
 * Supports bar, circle, fraction, and dots variants.
 */

import React, { type ReactNode, useMemo } from "react";
import { useDeckContext } from "../deck/Deck";
import type { ProgressVariant } from "../../types";

/** Progress props */
export interface ProgressProps {
  /** Progress variant */
  variant?: ProgressVariant;
  /** Custom className */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
}

/** Progress bar component */
const ProgressBar = React.memo(function ProgressBar({ current, total, className, style }: { current: number; total: number; className?: string; style?: React.CSSProperties }): ReactNode {
  const progress = total > 0 ? (current / (total - 1)) * 100 : 0;

  return (
    <div
      className={`present-progress-bar ${className ?? ""}`}
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "4px",
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        ...style,
      }}
    >
      <div
        className="present-progress-bar-fill"
        style={{
          width: `${progress}%`,
          height: "100%",
          backgroundColor: "currentColor",
          transition: "width 0.3s ease",
        }}
      />
    </div>
  );
});

/** Progress circle component */
const ProgressCircle = React.memo(function ProgressCircle({ current, total, className, style }: { current: number; total: number; className?: string; style?: React.CSSProperties }): ReactNode {
  const progress = total > 0 ? current / total : 0;
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <div
      className={`present-progress-circle ${className ?? ""}`}
      style={{
        position: "absolute",
        bottom: "1rem",
        right: "1rem",
        width: "40px",
        height: "40px",
        ...style,
      }}
    >
      <svg width="40" height="40" viewBox="0 0 40 40">
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          stroke="rgba(0, 0, 0, 0.1)"
          strokeWidth="3"
        />
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 20 20)"
          style={{ transition: "stroke-dashoffset 0.3s ease" }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "10px",
          fontWeight: "bold",
        }}
      >
        {current + 1}/{total}
      </div>
    </div>
  );
});

/** Progress fraction component */
const ProgressFraction = React.memo(function ProgressFraction({ current, total, className, style }: { current: number; total: number; className?: string; style?: React.CSSProperties }): ReactNode {
  return (
    <div
      className={`present-progress-fraction ${className ?? ""}`}
      style={{
        position: "absolute",
        bottom: "1rem",
        right: "1rem",
        fontSize: "14px",
        fontWeight: "bold",
        ...style,
      }}
    >
      {current + 1} / {total}
    </div>
  );
});

/** Progress dots component */
const ProgressDots = React.memo(function ProgressDots({ current, total, className, style }: { current: number; total: number; className?: string; style?: React.CSSProperties }): ReactNode {
  const dots = useMemo(() => Array.from({ length: total }, (_, i) => i), [total]);

  return (
    <div
      className={`present-progress-dots ${className ?? ""}`}
      style={{
        position: "absolute",
        bottom: "1rem",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: "8px",
        ...style,
      }}
    >
      {dots.map((index) => (
        <div
          key={index}
          className="present-progress-dot"
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: index === current ? "currentColor" : "rgba(0, 0, 0, 0.2)",
            transition: "background-color 0.3s ease",
          }}
        />
      ))}
    </div>
  );
});

/** Progress component */
export const Progress = React.memo(function Progress({
  variant = "bar",
  className,
  style,
}: ProgressProps): ReactNode {
  const { state } = useDeckContext();

  const props = {
    current: state.current,
    total: state.total,
    className,
    style,
  };

  switch (variant) {
    case "bar":
      return <ProgressBar {...props} />;
    case "circle":
      return <ProgressCircle {...props} />;
    case "fraction":
      return <ProgressFraction {...props} />;
    case "dots":
      return <ProgressDots {...props} />;
    case "none":
    default:
      return null;
  }
});