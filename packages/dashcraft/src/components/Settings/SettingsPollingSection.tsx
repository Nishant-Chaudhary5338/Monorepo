import React from "react";
import * as Slider from "@radix-ui/react-slider";

// ============================================================
// Props
// ============================================================

export interface SettingsPollingSectionProps {
  pollingInterval: number;
  onChange: (value: number[]) => void;
}

// ============================================================
// Component
// ============================================================

export const SettingsPollingSection = React.memo(
  function SettingsPollingSection({
    pollingInterval,
    onChange,
  }: SettingsPollingSectionProps): React.JSX.Element {
    const displayValue = pollingInterval > 0
      ? `${pollingInterval / 1000}s`
      : "Off";

    return (
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-gray-600">
            Polling Interval
          </label>
          <span className="text-xs text-gray-500">{displayValue}</span>
        </div>
        <Slider.Root
          value={[pollingInterval]}
          onValueChange={onChange}
          min={0}
          max={60000}
          step={1000}
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