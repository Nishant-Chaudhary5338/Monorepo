import React, { useState, useCallback, useMemo } from "react";
import * as Popover from "@radix-ui/react-popover";
import { motion, AnimatePresence } from "framer-motion";
import type { WidgetSettings, WidgetTheme, CustomFieldConfig } from "../../types";
import { useDashboardContext } from "../Dashboard/Dashboard.context";
import { SettingsHeader } from "./SettingsHeader";
import { SettingsThemeSection } from "./SettingsThemeSection";
import { SettingsHighlightSection } from "./SettingsHighlightSection";
import { SettingsEndpointSection } from "./SettingsEndpointSection";
import { SettingsPollingSection } from "./SettingsPollingSection";
import { SettingsCustomFields } from "./SettingsCustomFields";

// ============================================================
// Props
// ============================================================

export interface SettingsPanelProps {
  id: string;
  settings: WidgetSettings;
  trigger: React.ReactNode;
  onSettingsChange?: (settings: WidgetSettings) => void;
}

// ============================================================
// Animation Variants
// ============================================================

const popoverVariants = {
  initial: { opacity: 0, scale: 0.95, y: -5 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 400, damping: 25 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -5,
    transition: { duration: 0.15 },
  },
};

// ============================================================
// Component
// ============================================================

export const SettingsPanel = React.memo(function SettingsPanel({
  id,
  settings,
  trigger,
  onSettingsChange,
}: SettingsPanelProps): React.JSX.Element {
  const { updateWidgetSettings } = useDashboardContext();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [localSettings, setLocalSettings] = useState<WidgetSettings>(settings);

  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  const handleThemeChange = useCallback(
    (theme: WidgetTheme) => {
      const newSettings: WidgetSettings = { ...localSettings, theme };
      setLocalSettings(newSettings);
      updateWidgetSettings(id, { theme });
      onSettingsChange?.(newSettings);
    },
    [id, localSettings, updateWidgetSettings, onSettingsChange]
  );

  const handleHighlightToggle = useCallback(
    (checked: boolean) => {
      const newSettings: WidgetSettings = { ...localSettings, highlight: checked };
      setLocalSettings(newSettings);
      updateWidgetSettings(id, { highlight: checked });
      onSettingsChange?.(newSettings);
    },
    [id, localSettings, updateWidgetSettings, onSettingsChange]
  );

  const handleHighlightColorChange = useCallback(
    (color: string) => {
      const newSettings: WidgetSettings = { ...localSettings, highlightColor: color };
      setLocalSettings(newSettings);
      updateWidgetSettings(id, { highlightColor: color });
      onSettingsChange?.(newSettings);
    },
    [id, localSettings, updateWidgetSettings, onSettingsChange]
  );

  const handleEndpointChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalSettings({ ...localSettings, endpoint: e.target.value });
    },
    [localSettings]
  );

  const handleEndpointBlur = useCallback(() => {
    if (localSettings.endpoint !== undefined) {
      updateWidgetSettings(id, { endpoint: localSettings.endpoint });
    }
    onSettingsChange?.(localSettings);
  }, [id, localSettings, updateWidgetSettings, onSettingsChange]);

  const handlePollingChange = useCallback(
    (value: number[]) => {
      const pollingInterval = value[0];
      const newSettings: WidgetSettings = {
        ...localSettings,
        ...(pollingInterval !== undefined && { pollingInterval }),
      };
      setLocalSettings(newSettings);
      if (pollingInterval !== undefined) {
        updateWidgetSettings(id, { pollingInterval });
      }
      onSettingsChange?.(newSettings);
    },
    [id, localSettings, updateWidgetSettings, onSettingsChange]
  );

  const handleCustomFieldChange = useCallback(
    (fieldKey: string, _value: unknown) => {
      const existingCustomFields = localSettings.customFields ?? {};
      const existingField = existingCustomFields[fieldKey];
      const updatedField: CustomFieldConfig = existingField
        ? { ...existingField }
        : { type: "text", label: fieldKey };

      const customFields: Record<string, CustomFieldConfig> = {
        ...existingCustomFields,
        [fieldKey]: updatedField,
      };

      const newSettings: WidgetSettings = { ...localSettings, customFields };
      setLocalSettings(newSettings);
      updateWidgetSettings(id, { customFields });
      onSettingsChange?.(newSettings);
    },
    [id, localSettings, updateWidgetSettings, onSettingsChange]
  );

  const currentTheme = useMemo<WidgetTheme>(
    () => localSettings.theme ?? "light",
    [localSettings.theme]
  );

  const isHighlightEnabled = useMemo<boolean>(
    () => localSettings.highlight ?? false,
    [localSettings.highlight]
  );

  const highlightColor = useMemo<string>(
    () => localSettings.highlightColor ?? "#3b82f6",
    [localSettings.highlightColor]
  );

  const endpoint = useMemo<string>(
    () => localSettings.endpoint ?? "",
    [localSettings.endpoint]
  );

  const pollingInterval = useMemo<number>(
    () => localSettings.pollingInterval ?? 0,
    [localSettings.pollingInterval]
  );

  const customFields = useMemo<Record<string, CustomFieldConfig>>(
    () => localSettings.customFields ?? {},
    [localSettings.customFields]
  );

  return (
    <Popover.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Popover.Trigger asChild>{trigger}</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="z-50" sideOffset={5} align="end" asChild>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="w-72 bg-white rounded-lg shadow-lg border border-gray-200 p-4"
                variants={popoverVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <SettingsHeader />
                <SettingsThemeSection
                  currentTheme={currentTheme}
                  onThemeChange={handleThemeChange}
                />
                <SettingsHighlightSection
                  isEnabled={isHighlightEnabled}
                  color={highlightColor}
                  onToggle={handleHighlightToggle}
                  onColorChange={handleHighlightColorChange}
                />
                <SettingsEndpointSection
                  endpoint={endpoint}
                  onChange={handleEndpointChange}
                  onBlur={handleEndpointBlur}
                />
                <SettingsPollingSection
                  pollingInterval={pollingInterval}
                  onChange={handlePollingChange}
                />
                <SettingsCustomFields
                  fields={customFields}
                  values={localSettings}
                  onChange={handleCustomFieldChange}
                />
                <Popover.Arrow className="fill-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
});

SettingsPanel.displayName = "SettingsPanel";