import { useState } from "react";
import {
  Dashboard,
  KPIWidget,
  RechartsWidget,
  AreaChartWidget,
  BarChartWidget,
  useDashboard,
} from "@repo/dashcraft";
import type React from "react";

// ── Responsive KPI Views ────────────────────────────────────────────────────

function MicroKPI({ value, label }: { value: string; label: string }) {
  return (
    <div className="w-full h-full flex items-center justify-between px-1 gap-1 overflow-hidden">
      <span className="text-[10px] text-gray-400 truncate min-w-0">{label}</span>
      <span className="text-xs font-bold text-gray-900 shrink-0">{value}</span>
    </div>
  );
}

function CompactKPI({ value, label }: { value: string; label: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-1">
      <span className="text-xl font-bold text-gray-900 leading-none">{value}</span>
      <span className="text-[11px] text-gray-500 text-center leading-tight">{label}</span>
    </div>
  );
}

function FullKPIView({
  value,
  label,
  trend,
  trendLabel,
}: {
  value: string;
  label: string;
  trend: "up" | "down" | "neutral";
  trendLabel: string;
}) {
  const trendColor =
    trend === "up" ? "text-emerald-500" : trend === "down" ? "text-red-500" : "text-gray-500";
  const trendIcon = trend === "up" ? "↑" : trend === "down" ? "↓" : "–";
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-3 bg-linear-to-br from-white to-gray-50">
      <div className="text-3xl font-bold tracking-tight text-gray-900">{value}</div>
      <div className="mt-1 text-sm text-gray-500 font-medium">{label}</div>
      <div className={`mt-2 flex items-center gap-1 text-xs font-medium ${trendColor}`}>
        <span>{trendIcon}</span>
        <span>{trendLabel}</span>
      </div>
    </div>
  );
}

// ── Responsive Chart Summary ─────────────────────────────────────────────────

function DataSummaryView({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; value: string }[];
}) {
  return (
    <div className="w-full h-full flex flex-col p-2 overflow-auto">
      <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
        {title}
      </div>
      <div className="flex flex-col gap-0.5">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex justify-between items-center text-xs py-1 border-b border-gray-100"
          >
            <span className="text-gray-500">{r.label}</span>
            <span className="font-semibold text-gray-800">{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Corner Action Buttons ───────────────────────────────────────────────────

const TopRightControls = () => {
  const { isEditMode, toggleEditMode, resetLayout } = useDashboard();
  return (
    <div style={{ position: "fixed", top: "52px", right: "16px", zIndex: 9999, display: "flex", gap: "8px" }}>
      {isEditMode && (
        <button
          onClick={resetLayout}
          style={{
            background: "linear-gradient(135deg, #7f1d1d, #991b1b)",
            color: "#fca5a5",
            border: "1px solid rgba(252,165,165,0.2)",
            borderRadius: "8px",
            padding: "7px 14px",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          ↺ Reset Layout
        </button>
      )}
      <button
        onClick={toggleEditMode}
        style={{
          background: isEditMode
            ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
            : "linear-gradient(135deg, #4f46e5, #7c3aed)",
          color: "#fff",
          border: isEditMode
            ? "1px solid rgba(255,255,255,0.25)"
            : "1px solid rgba(255,255,255,0.35)",
          borderRadius: "8px",
          padding: "7px 16px",
          fontSize: "13px",
          fontWeight: 700,
          cursor: "pointer",
          boxShadow: isEditMode
            ? "0 4px 12px rgba(99,102,241,0.5)"
            : "0 4px 16px rgba(79,70,229,0.6), 0 0 0 1px rgba(124,58,237,0.3)",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          letterSpacing: "0.01em",
        }}
      >
        {isEditMode ? "✏️ Editing" : "✏️ Edit Layout"}
      </button>
    </div>
  );
};

const TopLeftBadge = () => (
  <div
    style={{
      position: "fixed",
      top: "52px",
      left: "16px",
      zIndex: 9999,
      background: "linear-gradient(135deg, #0f172a, #1e293b)",
      border: "1px solid rgba(99,102,241,0.4)",
      borderRadius: "8px",
      padding: "7px 12px",
      display: "flex",
      alignItems: "center",
      gap: "7px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
    }}
  >
    <span style={{ fontSize: "14px" }}>📊</span>
    <span style={{ color: "#e2e8f0", fontSize: "12px", fontWeight: 700, letterSpacing: "0.04em" }}>
      AnalyticsPro
    </span>
  </div>
);

const BottomLeftStatus = () => {
  const [refreshed, setRefreshed] = useState(false);
  return (
    <div style={{ position: "fixed", bottom: "14px", left: "16px", zIndex: 9999 }}>
      <button
        onClick={() => {
          setRefreshed(true);
          setTimeout(() => setRefreshed(false), 1500);
        }}
        style={{
          background: "linear-gradient(135deg, #064e3b, #065f46)",
          color: refreshed ? "#6ee7b7" : "#a7f3d0",
          border: "1px solid rgba(16,185,129,0.3)",
          borderRadius: "8px",
          padding: "7px 12px",
          fontSize: "11px",
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
          display: "flex",
          alignItems: "center",
          gap: "5px",
        }}
      >
        {refreshed ? "✅ Refreshed" : "🔄 Refresh Data"}
      </button>
    </div>
  );
};

const BottomRightExport = () => (
  <div style={{ position: "fixed", bottom: "14px", right: "16px", zIndex: 9999 }}>
    <button
      style={{
        background: "linear-gradient(135deg, #1e3a5f, #1e40af)",
        color: "#bfdbfe",
        border: "1px solid rgba(59,130,246,0.3)",
        borderRadius: "8px",
        padding: "7px 12px",
        fontSize: "11px",
        fontWeight: 600,
        cursor: "pointer",
        boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        gap: "5px",
      }}
    >
      📤 Export
    </button>
  </div>
);

// ── Chart Data ──────────────────────────────────────────────────────────────

const revenueData = [
  { name: "Jan", revenue: 42000, profit: 18000 },
  { name: "Feb", revenue: 38000, profit: 15000 },
  { name: "Mar", revenue: 51000, profit: 22000 },
  { name: "Apr", revenue: 47000, profit: 19000 },
  { name: "May", revenue: 58000, profit: 27000 },
  { name: "Jun", revenue: 63000, profit: 31000 },
  { name: "Jul", revenue: 71000, profit: 35000 },
];

const userGrowthData = [
  { name: "Jan", users: 1200, sessions: 3400 },
  { name: "Feb", users: 1800, sessions: 4200 },
  { name: "Mar", users: 2400, sessions: 5800 },
  { name: "Apr", users: 3100, sessions: 7100 },
  { name: "May", users: 3800, sessions: 8900 },
  { name: "Jun", users: 4300, sessions: 10200 },
  { name: "Jul", users: 4832, sessions: 11600 },
];

const channelData = [
  { name: "Organic", value: 38 },
  { name: "Direct", value: 27 },
  { name: "Social", value: 19 },
  { name: "Referral", value: 10 },
  { name: "Email", value: 6 },
];

const regionData = [
  { name: "North", sales: 42000 },
  { name: "South", sales: 31000 },
  { name: "East", sales: 58000 },
  { name: "West", sales: 47000 },
  { name: "Central", sales: 25000 },
];

const performanceData = [
  { subject: "Sales", A: 88 },
  { subject: "Marketing", A: 72 },
  { subject: "Support", A: 91 },
  { subject: "DevOps", A: 83 },
  { subject: "Design", A: 79 },
];

// ── Dashboard ───────────────────────────────────────────────────────────────

export default function DashCraftTest(): React.JSX.Element {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#0d1117",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      }}
    >
      <Dashboard persistenceKey="demo-dashboard-v2" autoSave>
        {/* 4 Corner Floating Buttons */}
        <TopLeftBadge />
        <TopRightControls />
        <BottomLeftStatus />
        <BottomRightExport />

        {/* Header */}
        <header
          style={{
            background: "rgba(13,17,23,0.95)",
            borderBottom: "1px solid rgba(99,102,241,0.25)",
            padding: "12px 0",
            textAlign: "center",
            flexShrink: 0,
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "15px",
              fontWeight: 700,
              color: "#f1f5f9",
              letterSpacing: "0.02em",
            }}
          >
            Business Intelligence Dashboard
          </h1>
          <p
            style={{
              margin: "2px 0 0",
              fontSize: "10px",
              color: "#475569",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Real-time portfolio overview — July 2025
          </p>
        </header>

        {/* Main Content Area */}
        <main
          style={{
            flex: 1,
            minHeight: 0,
            padding: "10px 12px 10px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            overflow: "hidden",
          }}
        >
          {/* ── KPI Row ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: "8px",
              flexShrink: 0,
            }}
          >
            {/* Resize widgets in edit mode to see views switch:
                < 160px → micro badge | 160–299px → compact | ≥ 300px → full */}
            <KPIWidget
              id="kpi-revenue"
              title="Total Revenue"
              label="Total Revenue"
              value={128450}
              previousValue={110000}
              format="currency"
              currency="USD"
              decimals={0}
              draggable
              deletable
              viewCycler
              className="bg-white rounded-lg shadow-sm"
              viewBreakpoints={{
                initial: <MicroKPI value="$128K" label="Revenue" />,
                160: <CompactKPI value="$128,450" label="Total Revenue" />,
                300: <FullKPIView value="$128,450" label="Total Revenue" trend="up" trendLabel="+16.8%" />,
              }}
            />
            <KPIWidget
              id="kpi-users"
              title="Active Users"
              label="Active Users"
              value={4832}
              previousValue={4200}
              format="number"
              decimals={0}
              draggable
              deletable
              viewCycler
              className="bg-white rounded-lg shadow-sm"
              viewBreakpoints={{
                initial: <MicroKPI value="4,832" label="Users" />,
                160: <CompactKPI value="4,832" label="Active Users" />,
                300: <FullKPIView value="4,832" label="Active Users" trend="up" trendLabel="+15.0%" />,
              }}
            />
            <KPIWidget
              id="kpi-conversion"
              title="Conversion Rate"
              label="Conversion Rate"
              value={3.2}
              previousValue={2.8}
              format="percentage"
              decimals={1}
              draggable
              deletable
              viewCycler
              className="bg-white rounded-lg shadow-sm"
              viewBreakpoints={{
                initial: <MicroKPI value="3.2%" label="Conv." />,
                160: <CompactKPI value="3.2%" label="Conversion Rate" />,
                300: <FullKPIView value="3.2%" label="Conversion Rate" trend="up" trendLabel="+14.3%" />,
              }}
            />
            <KPIWidget
              id="kpi-growth"
              title="MoM Growth"
              label="MoM Growth"
              value={16.8}
              previousValue={12.5}
              format="percentage"
              decimals={1}
              draggable
              deletable
              viewCycler
              className="bg-white rounded-lg shadow-sm"
              viewBreakpoints={{
                initial: <MicroKPI value="16.8%" label="Growth" />,
                160: <CompactKPI value="16.8%" label="MoM Growth" />,
                300: <FullKPIView value="16.8%" label="MoM Growth" trend="up" trendLabel="+34.4%" />,
              }}
            />
            <KPIWidget
              id="kpi-orders"
              title="Total Orders"
              label="Total Orders"
              value={9241}
              previousValue={7980}
              format="number"
              decimals={0}
              draggable
              deletable
              viewCycler
              className="bg-white rounded-lg shadow-sm"
              viewBreakpoints={{
                initial: <MicroKPI value="9,241" label="Orders" />,
                160: <CompactKPI value="9,241" label="Total Orders" />,
                300: <FullKPIView value="9,241" label="Total Orders" trend="up" trendLabel="+15.8%" />,
              }}
            />
            <KPIWidget
              id="kpi-arpu"
              title="Avg Rev / User"
              label="Avg Rev / User"
              value={26.6}
              previousValue={22.1}
              format="currency"
              currency="USD"
              decimals={2}
              draggable
              deletable
              viewCycler
              className="bg-white rounded-lg shadow-sm"
              viewBreakpoints={{
                initial: <MicroKPI value="$26.60" label="ARPU" />,
                160: <CompactKPI value="$26.60" label="Avg Rev / User" />,
                300: <FullKPIView value="$26.60" label="Avg Rev / User" trend="up" trendLabel="+20.4%" />,
              }}
            />
          </div>

          {/* ── Charts Grid ── */}
          <div
            style={{
              flex: 1,
              minHeight: 0,
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr",
              gridTemplateRows: "1fr 1fr",
              gap: "8px",
            }}
          >
            {/* Revenue Area Chart — spans both rows, responsive: summary → full chart */}
            <div style={{ gridRow: "1 / 3", minHeight: 0 }}>
              <RechartsWidget
                id="chart-revenue"
                title="Revenue vs Profit"
                chartType="area"
                data={revenueData}
                series={[
                  { dataKey: "revenue", name: "Revenue", color: "#6366f1" },
                  { dataKey: "profit", name: "Profit", color: "#22d3ee" },
                ]}
                xAxisKey="name"
                draggable
                viewCycler
                chartHeight="100%"
                className="bg-white rounded-lg shadow-sm"
                style={{ height: "100%", display: "flex", flexDirection: "column" }}
                viewBreakpoints={{
                  initial: (
                    <DataSummaryView
                      title="Revenue vs Profit"
                      rows={[
                        { label: "Jul Revenue", value: "$71,000" },
                        { label: "Jun Revenue", value: "$63,000" },
                        { label: "May Revenue", value: "$58,000" },
                        { label: "Jul Profit", value: "$35,000" },
                        { label: "Jun Profit", value: "$31,000" },
                        { label: "Total (Jul)", value: "$106,000" },
                      ]}
                    />
                  ),
                  350: (
                    <div className="w-full h-full min-h-50">
                      <AreaChartWidget
                        data={revenueData}
                        series={[
                          { dataKey: "revenue", name: "Revenue", color: "#6366f1" },
                          { dataKey: "profit", name: "Profit", color: "#22d3ee" },
                        ]}
                        xAxisKey="name"
                        showLegend={true}
                        showTooltip={true}
                        showGrid={true}
                        animate={true}
                      />
                    </div>
                  ),
                }}
              />
            </div>

            {/* User Growth Line — no viewBreakpoints (standard) */}
            <RechartsWidget
              id="chart-users"
              title="User Growth"
              chartType="line"
              data={userGrowthData}
              series={[
                { dataKey: "users", name: "Users", color: "#10b981" },
                { dataKey: "sessions", name: "Sessions", color: "#f59e0b" },
              ]}
              xAxisKey="name"
              draggable
              chartHeight="100%"
              className="bg-white rounded-lg shadow-sm"
              style={{ height: "100%", display: "flex", flexDirection: "column" }}
            />

            {/* Traffic Pie — no viewBreakpoints (standard) */}
            <RechartsWidget
              id="chart-traffic"
              title="Traffic Sources"
              chartType="pie"
              data={channelData}
              series={[{ dataKey: "value", name: "Share %", color: "#6366f1" }]}
              xAxisKey="name"
              draggable
              chartHeight="100%"
              className="bg-white rounded-lg shadow-sm"
              style={{ height: "100%", display: "flex", flexDirection: "column" }}
            />

            {/* Regional Sales Bar — responsive: summary → bar chart */}
            <RechartsWidget
              id="chart-region"
              title="Sales by Region"
              chartType="bar"
              data={regionData}
              series={[{ dataKey: "sales", name: "Sales ($)", color: "#8b5cf6" }]}
              xAxisKey="name"
              draggable
              viewCycler
              chartHeight="100%"
              className="bg-white rounded-lg shadow-sm"
              style={{ height: "100%", display: "flex", flexDirection: "column" }}
              viewBreakpoints={{
                initial: (
                  <DataSummaryView
                    title="Sales by Region"
                    rows={[
                      { label: "East", value: "$58,000" },
                      { label: "West", value: "$47,000" },
                      { label: "North", value: "$42,000" },
                      { label: "South", value: "$31,000" },
                      { label: "Central", value: "$25,000" },
                    ]}
                  />
                ),
                280: (
                  <div className="w-full h-full min-h-37.5">
                    <BarChartWidget
                      data={regionData}
                      series={[{ dataKey: "sales", name: "Sales ($)", color: "#8b5cf6" }]}
                      xAxisKey="name"
                      showLegend={false}
                      showTooltip={true}
                      showGrid={true}
                      animate={true}
                    />
                  </div>
                ),
              }}
            />

            {/* Performance Radar — no viewBreakpoints (standard) */}
            <RechartsWidget
              id="chart-radar"
              title="Team Performance"
              chartType="radar"
              data={performanceData}
              series={[{ dataKey: "A", name: "Score", color: "#f43f5e" }]}
              xAxisKey="subject"
              draggable
              chartHeight="100%"
              className="bg-white rounded-lg shadow-sm"
              style={{ height: "100%", display: "flex", flexDirection: "column" }}
            />
          </div>
        </main>
      </Dashboard>
    </div>
  );
}
