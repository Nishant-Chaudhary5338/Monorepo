import React from "react";

// ============================================================
// Props
// ============================================================

export interface SettingsEndpointSectionProps {
  endpoint: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
}

// ============================================================
// Component
// ============================================================

export const SettingsEndpointSection = React.memo(
  function SettingsEndpointSection({
    endpoint,
    onChange,
    onBlur,
  }: SettingsEndpointSectionProps): React.JSX.Element {
    return (
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Data Endpoint
        </label>
        <input
          type="text"
          value={endpoint}
          onChange={onChange}
          onBlur={onBlur}
          placeholder="https://api.example.com/data"
          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
    );
  }
);

SettingsEndpointSection.displayName = "SettingsEndpointSection";