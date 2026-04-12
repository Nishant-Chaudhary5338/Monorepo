import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// ── Design tokens ──────────────────────────────────────────────
const BLUE   = "#1428A0";
const BG     = "#f0f2f7";
const CARD: React.CSSProperties = {
  background: "#ffffff",
  borderRadius: 12,
  boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.04)",
  border: "1px solid rgba(0,0,0,0.06)",
};

// Chart palette
const C1 = "#1428A0"; // primary blue
const C2 = "#06b6d4"; // cyan
const C3 = "#10b981"; // emerald
const C4 = "#f59e0b"; // amber
const C5 = "#f43f5e"; // rose
const C6 = "#8b5cf6"; // violet
const C7 = "#64748b"; // slate

// ── Mock data ──────────────────────────────────────────────────
const serverHealthData = [
  { time: "00:00", US: 98, UK: 97, IN: 94, DE: 99, KR: 97, JP: 95, AU: 98 },
  { time: "04:00", US: 97, UK: 98, IN: 96, DE: 98, KR: 96, JP: 97, AU: 99 },
  { time: "08:00", US: 99, UK: 95, IN: 97, DE: 97, KR: 98, JP: 98, AU: 97 },
  { time: "12:00", US: 96, UK: 99, IN: 98, DE: 96, KR: 99, JP: 96, AU: 95 },
  { time: "16:00", US: 98, UK: 97, IN: 99, DE: 99, KR: 97, JP: 99, AU: 98 },
  { time: "20:00", US: 100, UK: 98, IN: 97, DE: 98, KR: 98, JP: 97, AU: 99 },
  { time: "Now",   US: 99, UK: 99, IN: 98, DE: 100, KR: 99, JP: 98, AU: 100 },
];

const issueTrendsData = [
  { week: "Wk 1", Critical: 12, Major: 28, Minor: 45 },
  { week: "Wk 2", Critical: 9,  Major: 24, Minor: 38 },
  { week: "Wk 3", Critical: 14, Major: 31, Minor: 52 },
  { week: "Wk 4", Critical: 7,  Major: 19, Minor: 33 },
  { week: "Wk 5", Critical: 5,  Major: 15, Minor: 27 },
  { week: "Wk 6", Critical: 3,  Major: 11, Minor: 21 },
];

const ageingData = [
  { range: "0–1h",  hours: 142 },
  { range: "1–4h",  hours: 89 },
  { range: "4–8h",  hours: 54 },
  { range: "8–24h", hours: 31 },
  { range: "1–3d",  hours: 18 },
  { range: "3d+",   hours: 7 },
];

const liveAssetsData = [
  { name: "Movies",  value: 1240, color: C1 },
  { name: "Series",  value: 874,  color: C2 },
  { name: "Sports",  value: 312,  color: C3 },
  { name: "News",    value: 196,  color: C4 },
  { name: "Kids",    value: 441,  color: C5 },
];

const vodAssetsData = [
  { name: "Premium",  value: 2180, color: C6 },
  { name: "Free",     value: 3640, color: C2 },
  { name: "Catch-up", value: 890,  color: C3 },
  { name: "Short",    value: 540,  color: C4 },
];

// ── Sub-components ─────────────────────────────────────────────
const ChartCard = ({
  title,
  children,
  style,
}: {
  title: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) => (
  <div style={{ ...CARD, display: "flex", flexDirection: "column", ...style }}>
    <div style={{
      padding: "10px 14px 8px",
      fontSize: 12,
      fontWeight: 600,
      color: "#111827",
      borderBottom: "1px solid #f3f4f6",
      flexShrink: 0,
    }}>
      {title}
    </div>
    <div style={{ flex: 1, padding: "6px 8px 8px", minHeight: 0 }}>
      {children}
    </div>
  </div>
);

const KPICard = ({
  title,
  value,
  prev,
  format,
}: {
  title: string;
  value: number;
  prev: number;
  format: "number" | "percentage";
}) => {
  const pct = ((value - prev) / prev) * 100;
  const up = pct >= 0;
  // Issues: fewer is better
  const isGood = title === "Open Issues" ? !up : up;

  let display: string;
  if (format === "percentage") {
    display = `${value.toFixed(1)}%`;
  } else if (value >= 10000) {
    display = `${(value / 1000).toFixed(1)}k`;
  } else {
    display = value.toLocaleString();
  }

  return (
    <div style={{
      ...CARD,
      padding: "12px 14px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: 2,
    }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: "#111827", lineHeight: 1.2 }}>
        {display}
      </div>
      <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 500, lineHeight: 1.3 }}>
        {title}
      </div>
      <div style={{
        fontSize: 10,
        fontWeight: 600,
        color: isGood ? "#10b981" : "#f43f5e",
        marginTop: 1,
      }}>
        {up ? "↑" : "↓"} {Math.abs(pct).toFixed(1)}% vs prev
      </div>
    </div>
  );
};

// ── TVPlusDashboard ────────────────────────────────────────────
const TVPlusDashboard = () => (
  <div style={{
    background: BG,
    height: "calc(100vh - 44px)",
    display: "flex",
    flexDirection: "column",
    fontFamily: "'Inter', 'DM Sans', system-ui, sans-serif",
    overflow: "hidden",
  }}>

    {/* ── Page header ── */}
    <div style={{
      background: "#ffffff",
      borderBottom: "1px solid #e5e7eb",
      padding: "12px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexShrink: 0,
    }}>
      <div>
        <h1 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: 0, letterSpacing: "-0.01em" }}>
          TVPlus Test Suite
        </h1>
        <p style={{ fontSize: 11, color: "#6b7280", margin: "1px 0 0" }}>
          Global QA Automation · Monitoring Dashboard
        </p>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          background: "#f0fdf4", border: "1px solid #bbf7d0",
          borderRadius: 20, padding: "4px 12px",
          fontSize: 11, fontWeight: 600, color: "#15803d",
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
          Live · All Systems Operational
        </div>
        <div style={{
          background: "#eff6ff", border: "1px solid #bfdbfe",
          borderRadius: 20, padding: "4px 12px",
          fontSize: 11, fontWeight: 600, color: BLUE,
        }}>
          98.5% Accuracy · Pilot
        </div>
        <span style={{ fontSize: 11, color: "#9ca3af" }}>Last sync 2 min ago</span>
      </div>
    </div>

    {/* ── Content ── */}
    <div style={{
      flex: 1,
      minHeight: 0,
      padding: "14px 20px",
      display: "flex",
      flexDirection: "column",
      gap: 12,
    }}>

      {/* ── KPI strip ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 10, flexShrink: 0 }}>
        {[
          { title: "Total Assets",    value: 8674,  prev: 7920,  format: "number"     as const },
          { title: "Open Issues",     value: 43,    prev: 71,    format: "number"     as const },
          { title: "Countries",       value: 24,    prev: 21,    format: "number"     as const },
          { title: "Devices Covered", value: 156,   prev: 148,   format: "number"     as const },
          { title: "QC Hours Saved",  value: 12480, prev: 9800,  format: "number"     as const },
          { title: "Tests Run (7d)",  value: 38920, prev: 31500, format: "number"     as const },
          { title: "Pass Rate",       value: 98.5,  prev: 97.1,  format: "percentage" as const },
        ].map(kpi => (
          <KPICard key={kpi.title} {...kpi} />
        ))}
      </div>

      {/* ── Row 1: Server Health + Issue Trends ── */}
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 10, flex: "1 1 0", minHeight: 0 }}>
        <ChartCard title="Server Health by Region (%)">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={serverHealthData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#9ca3af" }} stroke="#e5e7eb" />
              <YAxis domain={[90, 101]} tick={{ fontSize: 10, fill: "#9ca3af" }} stroke="#e5e7eb" />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e5e7eb" }} />
              <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 10, paddingTop: 4 }} />
              {[
                { key: "US", color: C1 }, { key: "UK", color: C2 }, { key: "IN", color: C3 },
                { key: "DE", color: C4 }, { key: "KR", color: C5 }, { key: "JP", color: C6 },
                { key: "AU", color: C7 },
              ].map(s => (
                <Line key={s.key} type="monotone" dataKey={s.key} stroke={s.color}
                  strokeWidth={1.5} dot={false} isAnimationActive={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Issue Trends by Severity">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={issueTrendsData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#9ca3af" }} stroke="#e5e7eb" />
              <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} stroke="#e5e7eb" />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e5e7eb" }} />
              <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 10, paddingTop: 4 }} />
              <Line type="monotone" dataKey="Critical" stroke={C5} strokeWidth={2} dot={{ r: 3, fill: C5 }} isAnimationActive={false} />
              <Line type="monotone" dataKey="Major"    stroke={C4} strokeWidth={2} dot={{ r: 3, fill: C4 }} isAnimationActive={false} />
              <Line type="monotone" dataKey="Minor"    stroke={C2} strokeWidth={2} dot={{ r: 3, fill: C2 }} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ── Row 2: Ageing + Live ring + VOD ring ── */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 10, flex: "1 1 0", minHeight: 0 }}>
        <ChartCard title="Ageing Recording Hours">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ageingData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="range" tick={{ fontSize: 10, fill: "#9ca3af" }} stroke="#e5e7eb" />
              <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} stroke="#e5e7eb" />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e5e7eb" }} />
              <Bar dataKey="hours" name="Hours" fill={C1} radius={[4, 4, 0, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Live Assets by Type">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={liveAssetsData}
                cx="50%" cy="46%"
                innerRadius="42%" outerRadius="68%"
                paddingAngle={3}
                dataKey="value"
                nameKey="name"
                isAnimationActive={false}
              >
                {liveAssetsData.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e5e7eb" }} />
              <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 10 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="VOD Assets by Type">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={vodAssetsData}
                cx="50%" cy="46%"
                innerRadius="42%" outerRadius="68%"
                paddingAngle={3}
                dataKey="value"
                nameKey="name"
                isAnimationActive={false}
              >
                {vodAssetsData.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e5e7eb" }} />
              <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 10 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

    </div>
  </div>
);

export default TVPlusDashboard;
