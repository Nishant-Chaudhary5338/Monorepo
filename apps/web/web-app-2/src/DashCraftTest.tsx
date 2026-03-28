import React, { useState } from "react";
import {
  Dashboard,
  useDashboard,
  RechartsWidget,
  KPIWidget,
  NivoWidget,
} from "@repo/dashcraft";

// ============================================================
// Edit Mode Toggle
// ============================================================

const EditModeToggle = React.memo(function EditModeToggle(): React.JSX.Element {
  const { isEditMode, toggleEditMode } = useDashboard();
  return (
    <button
      type="button"
      onClick={toggleEditMode}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        isEditMode
          ? "bg-blue-500 text-white hover:bg-blue-600"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      }`}
    >
      {isEditMode ? "Edit Mode ON" : "Edit Mode OFF"}
    </button>
  );
});
EditModeToggle.displayName = "EditModeToggle";

// ============================================================
// Widget Counter
// ============================================================

const WidgetCounter = React.memo(function WidgetCounter(): React.JSX.Element {
  const { widgets } = useDashboard();
  const count = Object.keys(widgets).length;
  return <div className="text-sm text-gray-500">Widgets: {count}</div>;
});
WidgetCounter.displayName = "WidgetCounter";

// ============================================================
// Sample Data
// ============================================================

const barLineData = [
  { name: "Jan", sales: 4000, revenue: 2400, profit: 1800 },
  { name: "Feb", sales: 3000, revenue: 1398, profit: 1200 },
  { name: "Mar", sales: 2000, revenue: 9800, profit: 4200 },
  { name: "Apr", sales: 2780, revenue: 3908, profit: 2100 },
  { name: "May", sales: 1890, revenue: 4800, profit: 2500 },
  { name: "Jun", sales: 2390, revenue: 3800, profit: 2300 },
];

const pieData = [
  { name: "Desktop", value: 400 },
  { name: "Mobile", value: 300 },
  { name: "Tablet", value: 200 },
  { name: "Other", value: 100 },
];

const radarData = [
  { subject: "Math", A: 120, B: 110 },
  { subject: "English", A: 98, B: 130 },
  { subject: "Physics", A: 86, B: 130 },
  { subject: "History", A: 99, B: 100 },
  { subject: "Art", A: 85, B: 90 },
  { subject: "Coding", A: 65, B: 85 },
];

const heatmapData = [
  {
    id: "Monday",
    data: [
      { x: "9am", y: 10 }, { x: "10am", y: 25 }, { x: "11am", y: 40 },
      { x: "12pm", y: 55 }, { x: "1pm", y: 30 }, { x: "2pm", y: 20 },
    ],
  },
  {
    id: "Tuesday",
    data: [
      { x: "9am", y: 15 }, { x: "10am", y: 30 }, { x: "11am", y: 45 },
      { x: "12pm", y: 60 }, { x: "1pm", y: 35 }, { x: "2pm", y: 25 },
    ],
  },
  {
    id: "Wednesday",
    data: [
      { x: "9am", y: 20 }, { x: "10am", y: 35 }, { x: "11am", y: 50 },
      { x: "12pm", y: 70 }, { x: "1pm", y: 40 }, { x: "2pm", y: 30 },
    ],
  },
];

const treemapData = [
  {
    id: "root",
    value: 9500,
    children: [
      { id: "React", value: 3500 },
      { id: "Vue", value: 2200 },
      { id: "Angular", value: 1800 },
      { id: "Svelte", value: 1200 },
      { id: "Solid", value: 800 },
    ],
  },
];

const sunburstData = [
  {
    id: "root",
    value: 9000,
    children: [
      {
        id: "Frontend", value: 4000, children: [
          { id: "React", value: 2500 },
          { id: "Vue", value: 1500 },
        ],
      },
      {
        id: "Backend", value: 3000, children: [
          { id: "Node", value: 1800 },
          { id: "Python", value: 1200 },
        ],
      },
    ],
  },
];

// ============================================================
// Tabs
// ============================================================

type Tab = "recharts" | "nivo" | "kpi";

function TabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  const tabs: { key: Tab; label: string }[] = [
    { key: "recharts", label: "Recharts" },
    { key: "nivo", label: "Nivo" },
    { key: "kpi", label: "KPI" },
  ];
  return (
    <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            active === t.key
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ============================================================
// Tab Content
// ============================================================

function RechartsTab(): React.JSX.Element {
  return (
    <div className="grid grid-cols-2 gap-4">
      <RechartsWidget
        id="rc-bar"
        title="Sales by Month"
        draggable
        chartType="bar"
        data={barLineData}
        series={[
          { dataKey: "sales", name: "Sales", color: "#3b82f6" },
          { dataKey: "revenue", name: "Revenue", color: "#22c55e" },
        ]}
        xAxisKey="name"
        className="bg-white rounded-md shadow-2xl"
      />
      <RechartsWidget
        id="rc-line"
        title="Revenue Trend"
        draggable
        chartType="line"
        data={barLineData}
        series={[
          { dataKey: "revenue", name: "Revenue", color: "#3b82f6" },
          { dataKey: "profit", name: "Profit", color: "#f97316" },
        ]}
        xAxisKey="name"
        className="bg-white rounded-md shadow-2xl"
      />
      <RechartsWidget
        id="rc-area"
        title="Sales Area"
        draggable
        chartType="area"
        data={barLineData}
        series={[{ dataKey: "sales", name: "Sales", color: "#8b5cf6" }]}
        xAxisKey="name"
        className="bg-white rounded-md shadow-2xl"
      />
      <RechartsWidget
        id="rc-pie"
        title="Device Distribution"
        draggable
        chartType="pie"
        data={pieData}
        series={[{ dataKey: "value", name: "Value", color: "#3b82f6" }]}
        xAxisKey="name"
        className="bg-white rounded-md shadow-2xl"
      />
      <RechartsWidget
        id="rc-radar"
        title="Skills Radar"
        draggable
        chartType="radar"
        data={radarData}
        series={[
          { dataKey: "A", name: "Student A", color: "#3b82f6" },
          { dataKey: "B", name: "Student B", color: "#ef4444" },
        ]}
        xAxisKey="subject"
        className="bg-white rounded-md shadow-2xl"
      />
      <RechartsWidget
        id="rc-radial"
        title="Radial Bar"
        draggable
        chartType="radialBar"
        data={pieData}
        series={[{ dataKey: "value", name: "Value", color: "#22c55e" }]}
        xAxisKey="name"
        className="bg-white rounded-md shadow-2xl"
      />
    </div>
  );
}

function NivoTab(): React.JSX.Element {
  return (
    <div className="grid grid-cols-2 gap-4">
      <NivoWidget
        id="nv-heatmap"
        title="Activity Heatmap"
        draggable
        chartType="heatmap"
        data={heatmapData}
        className="bg-white rounded-md shadow-2xl"
      />
      <NivoWidget
        id="nv-treemap"
        title="Framework Popularity"
        draggable
        chartType="treemap"
        data={treemapData}
        className="bg-white rounded-md shadow-2xl"
      />
      <NivoWidget
        id="nv-sunburst"
        title="Tech Stack"
        draggable
        chartType="sunburst"
        data={sunburstData}
        className="bg-white rounded-md shadow-2xl"
      />
    </div>
  );
}

function KPITab(): React.JSX.Element {
  return (
    <div className="grid grid-cols-3 gap-4">
      <KPIWidget
        id="kpi-rev"
        title="Total Revenue"
        draggable
        value={128450}
        label="Total Revenue"
        previousValue={110000}
        format="currency"
        currency="USD"
        decimals={0}
        className="bg-white rounded-md shadow-2xl"
      />
      <KPIWidget
        id="kpi-users"
        title="Active Users"
        draggable
        value={4832}
        label="Active Users"
        previousValue={4200}
        format="number"
        decimals={0}
        className="bg-white rounded-md shadow-2xl"
      />
      <KPIWidget
        id="kpi-conv"
        title="Conversion"
        draggable
        value={3.2}
        label="Conversion Rate"
        previousValue={2.8}
        format="percentage"
        decimals={1}
        className="bg-white rounded-md shadow-2xl"
      />
      <KPIWidget
        id="kpi-churn"
        title="Churn"
        draggable
        value={1.8}
        label="Churn Rate"
        previousValue={2.5}
        format="percentage"
        decimals={1}
        className="bg-white rounded-md shadow-2xl"
      />
      <KPIWidget
        id="kpi-status"
        title="Status"
        draggable
        value="Healthy"
        label="System Status"
        format="text"
        valueColor="#22c55e"
        className="bg-white rounded-md shadow-2xl"
      />
    </div>
  );
}

// ============================================================
// Main Page
// ============================================================

export default function DashCraftTest(): React.JSX.Element {
  const [tab, setTab] = useState<Tab>("recharts");

  const content: Record<Tab, React.JSX.Element> = {
    recharts: <RechartsTab />,
    nivo: <NivoTab />,
    kpi: <KPITab />,
  };

  return (
    <div className="min-h-screen bg-gray-200">
      <Dashboard persistenceKey="dashcraft-grid-test" autoSave>
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-50 flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">DashCraft</h1>
            <p className="text-sm text-gray-500 mt-1">Grid Layout Dashboard</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Charts</p>
            <div className="space-y-1">
              {(["recharts", "nivo", "kpi"] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    tab === t
                      ? "bg-blue-500 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {t === "recharts" ? "Recharts" : t === "nivo" ? "Nivo" : "KPI"}
                </button>
              ))}
            </div>
          </nav>

          {/* Controls */}
          <div className="p-4 border-t border-gray-200 space-y-3">
            <WidgetCounter />
            <EditModeToggle />
          </div>
        </aside>

        {/* Main Content */}
        <main className="ml-64 p-6">
          {/* Grid Layout — className controls layout, not absolute positions */}
          {content[tab]}

          {/* Footer */}
          <footer className="mt-8 text-center text-sm text-gray-500">
            <p>
              <strong>View mode:</strong> Widgets flow in CSS grid.{" "}
              <strong>Edit mode:</strong> Drag & resize freely. Positions persist via localStorage.
            </p>
          </footer>
        </main>
      </Dashboard>
    </div>
  );
}