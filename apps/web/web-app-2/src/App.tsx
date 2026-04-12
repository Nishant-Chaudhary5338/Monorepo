import { useState } from "react";
import TVPlusDashboard from "./TVPlusDashboard";
import TVPlusScheduler from "./TVPlusScheduler";
import TVPlusJobStatus from "./TVPlusJobStatus";
import "./App.css";

const TABS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "schedule",  label: "Schedule Test" },
  { id: "jobs",      label: "Job Status" },
];

function App() {
  const [active, setActive] = useState<"dashboard" | "schedule" | "jobs">("dashboard");

  return (
    <div style={{ background: "#f0f2f7", height: "100vh", overflow: "hidden" }}>
      {/* Tab bar */}
      <div style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 2000,
        background: "#1428A0",
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        height: 44,
        gap: 2,
      }}>
        <span style={{
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.04em",
          color: "rgba(255,255,255,0.9)",
          marginRight: 20,
        }}>
          TVPlus Test Suite
        </span>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id as typeof active)}
            style={{
              background: "transparent",
              border: "none",
              borderBottom: active === tab.id ? "2px solid #fff" : "2px solid transparent",
              borderRadius: 0,
              padding: "0 16px",
              height: 44,
              fontSize: 13,
              fontWeight: active === tab.id ? 600 : 400,
              color: active === tab.id ? "#fff" : "rgba(255,255,255,0.6)",
              cursor: "pointer",
              transition: "all 150ms",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Page content */}
      <div style={{ paddingTop: 44 }}>
        {active === "dashboard" && <TVPlusDashboard />}
        {active === "schedule"  && <TVPlusScheduler />}
        {active === "jobs"      && <TVPlusJobStatus />}
      </div>
    </div>
  );
}

export default App;
