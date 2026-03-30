import React, { useCallback } from "react";
import * as Slider from "@radix-ui/react-slider";

// ============================================================
// Props
// ============================================================

export interface SettingsPollingSectionProps {
  pollingInterval: number;
  onChange: (value: number[]) => void;
}

// ============================================================
// Presets
// ============================================================

const PRESETS: Array<{ label: string; value: number }> = [
  { label: "Off",  value: 0 },
  { label: "5s",   value: 5_000 },
  { label: "15s",  value: 15_000 },
  { label: "30s",  value: 30_000 },
  { label: "1m",   value: 60_000 },
];

// ============================================================
// Component
// ============================================================

export const SettingsPollingSection = React.memo(
  function SettingsPollingSection({
    pollingInterval,
    onChange,
  }: SettingsPollingSectionProps): React.JSX.Element {
    const displayValue =
      pollingInterval > 0 ? `${pollingInterval / 1000}s` : "Off";

    const handlePreset = useCallback(
      (value: number) => () => onChange([value]),
      [onChange]
    );

    return (
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-gray-600">
            Polling Interval
          </label>
          <span className="text-xs text-gray-500 tabular-nums">{displayValue}</span>
        </div>

        {/* Quick presets */}
        <div className="flex gap-1 mb-3">
          {PRESETS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={handlePreset(p.value)}
              className={`flex-1 py-0.5 text-xs rounded border transition-colors ${
                pollingInterval === p.value
                  ? "bg-blue-500 border-blue-500 text-white"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Fine-tune slider (0 – 60 s) */}
        <Slider.Root
          value={[pollingInterval]}
          onValueChange={onChange}
          min={0}
          max={60_000}
          step={1_000}
          className="relative flex items-center select-none touch-none w-full h-5"
        >
          <Slider.Track className="bg-gray-200 relative grow rounded-full h-1">
            <Slider.Range className="absolute bg-blue-500 rounded-full h-full" />
          </Slider.Track>
          <Slider.Thumb className="block w-4 h-4 bg-white border border-gray-300 rounded-full shadow hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </Slider.Root>
      </div>
    );
  }
);

SettingsPollingSection.displayName = "SettingsPollingSection";
