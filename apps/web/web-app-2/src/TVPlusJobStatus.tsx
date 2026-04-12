import { useState } from "react";

// ── Design tokens ──────────────────────────────────────────────
const SAMSUNG_BLUE = "#1428A0";
const BG_PAGE      = "#f0f2f7";
const BORDER       = "#e5e7eb";
const TEXT         = "#111827";
const TEXT_SEC     = "#6b7280";
const TEXT_MUTED   = "#9ca3af";

// ── Status config ──────────────────────────────────────────────
const STATUS: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  running:   { label: "Running",   bg: "#eff6ff", text: "#1d4ed8", dot: "#3b82f6" },
  passed:    { label: "Passed",    bg: "#f0fdf4", text: "#15803d", dot: "#22c55e" },
  failed:    { label: "Failed",    bg: "#fef2f2", text: "#b91c1c", dot: "#ef4444" },
  queued:    { label: "Queued",    bg: "#fafafa", text: "#374151", dot: "#9ca3af" },
  cancelled: { label: "Cancelled", bg: "#fefce8", text: "#92400e", dot: "#f59e0b" },
};

// ── Mock job data ──────────────────────────────────────────────
const JOBS = [
  {
    id: "JOB-2047",
    status: "running",
    countries: ["US", "UK", "IN"],
    contentType: "Live TV",
    assets: 8,
    devices: 4,
    qcCategory: "Stream Quality",
    testCases: 6,
    submittedBy: "nidhi.c@tvplus.internal",
    submittedAt: "Today, 10:42 AM",
    startedAt: "Today, 10:44 AM",
    estimatedEnd: "~11:10 AM",
    progress: 64,
    passed: 31,
    failed: 2,
    remaining: 16,
  },
  {
    id: "JOB-2046",
    status: "passed",
    countries: ["DE", "FR"],
    contentType: "VOD",
    assets: 12,
    devices: 3,
    qcCategory: "Metadata Accuracy",
    testCases: 7,
    submittedBy: "qa.team@tvplus.internal",
    submittedAt: "Today, 08:15 AM",
    startedAt: "Today, 08:17 AM",
    estimatedEnd: "Completed",
    progress: 100,
    passed: 84,
    failed: 0,
    remaining: 0,
  },
  {
    id: "JOB-2045",
    status: "failed",
    countries: ["KR", "JP"],
    contentType: "SVOD",
    assets: 5,
    devices: 6,
    qcCategory: "DRM & Licensing",
    testCases: 4,
    submittedBy: "nidhi.c@tvplus.internal",
    submittedAt: "Yesterday, 4:30 PM",
    startedAt: "Yesterday, 4:32 PM",
    estimatedEnd: "Completed",
    progress: 100,
    passed: 17,
    failed: 3,
    remaining: 0,
  },
  {
    id: "JOB-2044",
    status: "queued",
    countries: ["AU", "CA"],
    contentType: "Kids",
    assets: 15,
    devices: 5,
    qcCategory: "UI/UX Rendering",
    testCases: 8,
    submittedBy: "pm.ops@tvplus.internal",
    submittedAt: "Today, 11:00 AM",
    startedAt: "—",
    estimatedEnd: "Pending queue",
    progress: 0,
    passed: 0,
    failed: 0,
    remaining: 120,
  },
  {
    id: "JOB-2043",
    status: "passed",
    countries: ["US"],
    contentType: "News",
    assets: 3,
    devices: 2,
    qcCategory: "Performance",
    testCases: 5,
    submittedBy: "qa.team@tvplus.internal",
    submittedAt: "Yesterday, 1:10 PM",
    startedAt: "Yesterday, 1:12 PM",
    estimatedEnd: "Completed",
    progress: 100,
    passed: 30,
    failed: 0,
    remaining: 0,
  },
  {
    id: "JOB-2042",
    status: "cancelled",
    countries: ["MX", "BR"],
    contentType: "Sports",
    assets: 6,
    devices: 4,
    qcCategory: "Ad Insertion",
    testCases: 3,
    submittedBy: "nidhi.c@tvplus.internal",
    submittedAt: "Yesterday, 9:00 AM",
    startedAt: "—",
    estimatedEnd: "—",
    progress: 0,
    passed: 0,
    failed: 0,
    remaining: 0,
  },
];

type FilterKey = "all" | "running" | "passed" | "failed" | "queued" | "cancelled";
const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all",       label: "All Jobs" },
  { key: "running",   label: "Running" },
  { key: "passed",    label: "Passed" },
  { key: "failed",    label: "Failed" },
  { key: "queued",    label: "Queued" },
  { key: "cancelled", label: "Cancelled" },
];

// ── StatusBadge ────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) => {
  const s = STATUS[status];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: s.bg, color: s.text,
      borderRadius: 20, padding: "3px 10px",
      fontSize: 12, fontWeight: 600,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, display: "inline-block" }} />
      {s.label}
    </span>
  );
};

// ── ProgressBar ────────────────────────────────────────────────
const ProgressBar = ({ pct, status }: { pct: number; status: string }) => {
  const color = status === "failed" ? "#ef4444" : status === "passed" ? "#22c55e" : SAMSUNG_BLUE;
  return (
    <div style={{ height: 4, background: "#f3f4f6", borderRadius: 4, overflow: "hidden", width: "100%" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 4, transition: "width 600ms ease" }} />
    </div>
  );
};

// ── JobDetailDrawer ────────────────────────────────────────────
const JobDetail = ({ job, onClose }: { job: typeof JOBS[0]; onClose: () => void }) => (
  <div style={{
    position: "fixed", inset: 0, zIndex: 3000,
    display: "flex", justifyContent: "flex-end",
  }}>
    {/* Overlay */}
    <div
      onClick={onClose}
      style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.25)" }}
    />
    {/* Drawer */}
    <div style={{
      position: "relative", zIndex: 1,
      width: 400, height: "100%",
      background: "#fff", borderLeft: `1px solid ${BORDER}`,
      display: "flex", flexDirection: "column",
      boxShadow: "-4px 0 24px rgba(0,0,0,0.08)",
    }}>
      {/* Header */}
      <div style={{ padding: "20px 24px", borderBottom: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ fontSize: 11, color: TEXT_MUTED, letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>Job Details</p>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: TEXT, margin: "4px 0 8px", letterSpacing: "-0.01em" }}>{job.id}</h2>
          <StatusBadge status={job.status} />
        </div>
        <button onClick={onClose} style={{ background: "#f3f4f6", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 16, color: TEXT_SEC, display: "flex", alignItems: "center", justifyContent: "center" }}>
          ×
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Progress */}
        {(job.status === "running" || job.status === "passed" || job.status === "failed") && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: TEXT_SEC }}>Progress</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: TEXT }}>{job.progress}%</span>
            </div>
            <ProgressBar pct={job.progress} status={job.status} />
            <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
              {[
                { label: "Passed",    val: job.passed,    color: "#22c55e" },
                { label: "Failed",    val: job.failed,    color: "#ef4444" },
                { label: "Remaining", val: job.remaining, color: "#9ca3af" },
              ].map(m => (
                <div key={m.label} style={{ flex: 1, textAlign: "center", padding: "8px 0", background: "#f9fafb", borderRadius: 8 }}>
                  <p style={{ fontSize: 18, fontWeight: 700, color: m.color, margin: 0 }}>{m.val}</p>
                  <p style={{ fontSize: 10, color: TEXT_MUTED, margin: "2px 0 0", textTransform: "uppercase", letterSpacing: "0.08em" }}>{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selection summary */}
        <div>
          <p style={{ fontSize: 11, color: TEXT_MUTED, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Test Selection</p>
          {[
            { label: "Countries",    val: job.countries.join(", ") },
            { label: "Content Type", val: job.contentType },
            { label: "Assets",       val: `${job.assets} selected` },
            { label: "Devices",      val: `${job.devices} selected` },
            { label: "QC Category",  val: job.qcCategory },
            { label: "Test Cases",   val: `${job.testCases} selected` },
          ].map(row => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: `1px solid ${BORDER}` }}>
              <span style={{ fontSize: 13, color: TEXT_SEC }}>{row.label}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: TEXT }}>{row.val}</span>
            </div>
          ))}
        </div>

        {/* Metadata */}
        <div>
          <p style={{ fontSize: 11, color: TEXT_MUTED, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Metadata</p>
          {[
            { label: "Submitted by", val: job.submittedBy },
            { label: "Submitted at", val: job.submittedAt },
            { label: "Started at",   val: job.startedAt },
            { label: "Est. end",     val: job.estimatedEnd },
          ].map(row => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: `1px solid ${BORDER}` }}>
              <span style={{ fontSize: 13, color: TEXT_SEC }}>{row.label}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: TEXT }}>{row.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: "16px 24px", borderTop: `1px solid ${BORDER}`, display: "flex", gap: 8 }}>
        {job.status === "running" && (
          <button style={{ flex: 1, background: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca", borderRadius: 8, padding: "9px 0", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            Cancel Job
          </button>
        )}
        {job.status === "failed" && (
          <button style={{ flex: 1, background: SAMSUNG_BLUE, color: "#fff", border: "none", borderRadius: 8, padding: "9px 0", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            Retry Failed Tests
          </button>
        )}
        <button onClick={onClose} style={{ flex: 1, background: "#f3f4f6", color: TEXT, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "9px 0", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          Close
        </button>
      </div>
    </div>
  </div>
);

// ── Main page ──────────────────────────────────────────────────
const TVPlusJobStatus = () => {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [selectedJob, setSelectedJob] = useState<typeof JOBS[0] | null>(null);

  const filtered = filter === "all" ? JOBS : JOBS.filter(j => j.status === filter);

  return (
    <div style={{ background: BG_PAGE, minHeight: "100vh", fontFamily: "'Inter', 'DM Sans', system-ui, sans-serif" }}>

      {/* Page header */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${BORDER}`, padding: "16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 17, fontWeight: 700, color: TEXT, margin: 0 }}>Test Run Jobs</h1>
          <p style={{ fontSize: 12, color: TEXT_SEC, margin: "2px 0 0" }}>Monitor submitted test runs and their results</p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 600, color: SAMSUNG_BLUE }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6", display: "inline-block" }} />
            1 Running
          </div>
          <span style={{ fontSize: 12, color: TEXT_MUTED }}>6 total jobs</span>
        </div>
      </div>

      <div style={{ padding: "20px 28px", display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 4, background: "#fff", padding: "4px", borderRadius: 10, border: `1px solid ${BORDER}`, width: "fit-content" }}>
          {FILTERS.map(f => {
            const count = f.key === "all" ? JOBS.length : JOBS.filter(j => j.status === f.key).length;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                style={{
                  background: filter === f.key ? SAMSUNG_BLUE : "transparent",
                  color: filter === f.key ? "#fff" : TEXT_SEC,
                  border: "none",
                  borderRadius: 7,
                  padding: "6px 14px",
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 5,
                  transition: "all 150ms",
                }}
              >
                {f.label}
                {count > 0 && (
                  <span style={{
                    background: filter === f.key ? "rgba(255,255,255,0.25)" : "#f3f4f6",
                    color: filter === f.key ? "#fff" : TEXT_MUTED,
                    borderRadius: 10, padding: "0 6px",
                    fontSize: 11,
                  }}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Job table */}
        <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${BORDER}`, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          {/* Table header */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "120px 100px 160px 100px 1fr 120px 100px",
            padding: "10px 20px",
            borderBottom: `1px solid ${BORDER}`,
            background: "#f9fafb",
          }}>
            {["Job ID", "Status", "Selection", "Progress", "", "Submitted", ""].map((h, i) => (
              <span key={i} style={{ fontSize: 11, fontWeight: 600, color: TEXT_MUTED, textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</span>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div style={{ padding: "40px 20px", textAlign: "center", color: TEXT_MUTED, fontSize: 13 }}>
              No jobs match this filter.
            </div>
          ) : (
            filtered.map((job, i) => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "120px 100px 160px 100px 1fr 120px 100px",
                  padding: "14px 20px",
                  borderBottom: i < filtered.length - 1 ? `1px solid ${BORDER}` : "none",
                  alignItems: "center",
                  cursor: "pointer",
                  transition: "background 120ms",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#f9fafb")}
                onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
              >
                {/* Job ID */}
                <span style={{ fontSize: 13, fontWeight: 700, color: SAMSUNG_BLUE }}>{job.id}</span>

                {/* Status */}
                <StatusBadge status={job.status} />

                {/* Selection summary */}
                <div>
                  <p style={{ fontSize: 12, fontWeight: 500, color: TEXT, margin: 0 }}>
                    {job.countries.join(", ")} · {job.contentType}
                  </p>
                  <p style={{ fontSize: 11, color: TEXT_MUTED, margin: "2px 0 0" }}>
                    {job.assets} assets · {job.devices} devices · {job.testCases} tests
                  </p>
                </div>

                {/* Progress */}
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: TEXT, margin: "0 0 4px" }}>{job.progress}%</p>
                  <ProgressBar pct={job.progress} status={job.status} />
                </div>

                {/* Pass/fail mini */}
                <div style={{ display: "flex", gap: 10, paddingLeft: 12 }}>
                  {job.passed > 0 && (
                    <span style={{ fontSize: 11, color: "#15803d", fontWeight: 600 }}>✓ {job.passed} passed</span>
                  )}
                  {job.failed > 0 && (
                    <span style={{ fontSize: 11, color: "#b91c1c", fontWeight: 600 }}>✗ {job.failed} failed</span>
                  )}
                  {job.remaining > 0 && (
                    <span style={{ fontSize: 11, color: TEXT_MUTED }}>· {job.remaining} remaining</span>
                  )}
                </div>

                {/* Submitted at */}
                <span style={{ fontSize: 12, color: TEXT_MUTED }}>{job.submittedAt}</span>

                {/* View arrow */}
                <span style={{ fontSize: 16, color: TEXT_MUTED, textAlign: "right" }}>›</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Detail drawer */}
      {selectedJob && <JobDetail job={selectedJob} onClose={() => setSelectedJob(null)} />}
    </div>
  );
};

export default TVPlusJobStatus;
