import React, { useCallback } from "react";
import * as Switch from "@radix-ui/react-switch";
import { motion } from "framer-motion";

// ============================================================
// Props
// ============================================================

export interface SettingsHighlightSectionProps {
  isEnabled: boolean;
  color: string;
  onToggle: (checked: boolean) => void;
  onColorChange: (color: string) => void;
}

// ============================================================
// Component
// ============================================================

export const SettingsHighlightSection = React.memo(
  function SettingsHighlightSection({
    isEnabled,
    color,
    onToggle,
    onColorChange,
  }: SettingsHighlightSectionProps): React.JSX.Element {
    const handleColorChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onColorChange(e.target.value);
      },
      [onColorChange]
    );

    return (
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-gray-600">
            Highlight Border
          </label>
          <Switch.Root
            checked={isEnabled}
            onCheckedChange={onToggle}
            className="w-9 h-5 bg-gray-300 rounded-full relative data-[state=checked]:bg-blue-500 transition-colors"
          >
            <Switch.Thumb className="block w-4 h-4 bg-white rounded-full shadow transition-transform translate-x-0.5 data-[state=checked]:translate-x-4" />
          </Switch.Root>
        </div>

        {isEnabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 flex items-center gap-2"
          >
            <label className="text-xs text-gray-500">Color:</label>
            <input
              type="color"
              value={color}
              onChange={handleColorChange}
              className="w-8 h-8 rounded cursor-pointer"
            />
            <span className="text-xs text-gray-500">{color}</span>
          </motion.div>
        )}
      </div>
    );
  }
);

SettingsHighlightSection.displayName = "SettingsHighlightSection";