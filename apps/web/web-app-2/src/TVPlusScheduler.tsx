import { useState } from "react";

// ── Theme ──────────────────────────────────────────────────────
const BG       = "#f0f2f7";
const BG_CARD  = "#ffffff";
const BG_STEP  = "#ffffff";
const ACCENT   = "#1428A0";
const BORDER   = "#e5e7eb";
const BORDER_ACTIVE = "#1428A0";
const TEXT     = "#111827";
const TEXT_MUTED = "#9ca3af";
const SELECTED_BG = "#eff6ff";

// ── Step definitions ───────────────────────────────────────────
const STEPS = [
  "Country",
  "Content Type",
  "Assets",
  "Devices",
  "QC Category",
  "Test Cases",
  "Submit",
];

// ── Step data ──────────────────────────────────────────────────
const STEP_OPTIONS: Record<number, { id: string; label: string; sub?: string }[]> = {
  0: [
    { id: "us", label: "United States" },
    { id: "uk", label: "United Kingdom" },
    { id: "in", label: "India" },
    { id: "de", label: "Germany" },
    { id: "kr", label: "South Korea" },
    { id: "jp", label: "Japan" },
    { id: "au", label: "Australia" },
    { id: "fr", label: "France" },
    { id: "ca", label: "Canada" },
    { id: "br", label: "Brazil" },
    { id: "mx", label: "Mexico" },
    { id: "es", label: "Spain" },
  ],
  1: [
    { id: "live", label: "Live TV",    sub: "Linear broadcast channels" },
    { id: "vod",  label: "VOD",        sub: "Video on demand content" },
    { id: "svod", label: "SVOD",       sub: "Subscription VOD" },
    { id: "news", label: "News",       sub: "Live news streams" },
    { id: "kids", label: "Kids",       sub: "Children's content" },
    { id: "sport", label: "Sports",   sub: "Live and replay sports" },
  ],
  2: [
    { id: "a001", label: "TVPlus US News",  sub: "SVC-0041-US · Live" },
    { id: "a002", label: "Tastemade",          sub: "SVC-0078-US · VOD" },
    { id: "a003", label: "BBC Earth",          sub: "SVC-0112-UK · Live" },
    { id: "a004", label: "Pluto TV Movies",    sub: "SVC-0199-US · VOD" },
    { id: "a005", label: "TVPlus Free UK",    sub: "SVC-0203-UK · Live" },
    { id: "a006", label: "Sports 24",          sub: "SVC-0217-DE · Live" },
    { id: "a007", label: "Kids Zone",          sub: "SVC-0234-IN · VOD" },
    { id: "a008", label: "News18 India",       sub: "SVC-0256-IN · Live" },
    { id: "a009", label: "Rakuten Movies JP",  sub: "SVC-0271-JP · VOD" },
    { id: "a010", label: "Channel 9 AU",       sub: "SVC-0289-AU · Live" },
    { id: "a011", label: "CGTN Korea",         sub: "SVC-0301-KR · Live" },
    { id: "a012", label: "Eurosport DE",       sub: "SVC-0318-DE · Live" },
  ],
  3: [
    { id: "tv55", label: "Smart TV 55\"",   sub: "Tizen 7.0 · 4K UHD" },
    { id: "tv65", label: "Smart TV 65\"",   sub: "Tizen 7.0 · 4K UHD" },
    { id: "tv75", label: "Smart TV 75\"",   sub: "Tizen 8.0 · 8K" },
    { id: "neo",  label: "QLED 85\"",       sub: "Tizen 8.0 · 8K" },
    { id: "fhub", label: "Family Hub",      sub: "Tizen 6.5 · 1080p" },
    { id: "mob",  label: "Galaxy S24",        sub: "Android 14" },
    { id: "tab",  label: "Galaxy Tab S9",     sub: "Android 14" },
    { id: "aihub", label: "AI Hub Screen",   sub: "Tizen 9.0 · 4K" },
  ],
  4: [
    { id: "stream",  label: "Stream Quality",    sub: "Bitrate, buffering, resolution" },
    { id: "meta",    label: "Metadata Accuracy", sub: "Titles, thumbnails, descriptions" },
    { id: "drm",     label: "DRM & Licensing",   sub: "Playback authorisation" },
    { id: "ui",      label: "UI/UX Rendering",   sub: "Layout, fonts, overlays" },
    { id: "ads",     label: "Ad Insertion",      sub: "CSAI/SSAI accuracy" },
    { id: "perf",    label: "Performance",       sub: "Load time, crash, ANR" },
    { id: "access",  label: "Accessibility",     sub: "Subtitles, audio description" },
  ],
  5: [
    { id: "tc01", label: "Channel Launch Test",       sub: "Open channel · verify stream loads in <3s" },
    { id: "tc02", label: "Thumbnail Match",            sub: "Verify EPG thumbnail vs. actual frame" },
    { id: "tc03", label: "Resolution Switch",          sub: "4K → 1080p adaptive bitrate" },
    { id: "tc04", label: "Ad Break Insertion",         sub: "Mid-roll ad timing ±2s tolerance" },
    { id: "tc05", label: "DRM Token Validation",       sub: "Licence request/response cycle" },
    { id: "tc06", label: "Subtitle Sync",              sub: "Subtitle offset <500ms" },
    { id: "tc07", label: "Metadata Completeness",      sub: "All required fields present" },
    { id: "tc08", label: "Cold Start Performance",     sub: "App launch to content play <5s" },
    { id: "tc09", label: "Seek Accuracy",              sub: "Seek landing ±1s of target" },
    { id: "tc10", label: "Background Audio Resume",    sub: "Audio resumes after app switch" },
  ],
};

// ── Summary labels ─────────────────────────────────────────────
const SUMMARY_LABELS = ["Countries", "Content Types", "Assets", "Devices", "QC Categories", "Test Cases"];

// ── TVPlusScheduler ────────────────────────────────────────────
const TVPlusScheduler = () => {
  const [currentStep, setCurrentStep] = useState(2); // default to Assets step (most visual)
  const [selections, setSelections] = useState<Record<number, Set<string>>>({
    0: new Set(["us", "uk", "in"]),
    1: new Set(["live", "vod"]),
    2: new Set(),
    3: new Set(),
    4: new Set(),
    5: new Set(),
  });

  const toggle = (id: string) => {
    setSelections(prev => {
      const next = new Set(prev[currentStep]);
      next.has(id) ? next.delete(id) : next.add(id);
      return { ...prev, [currentStep]: next };
    });
  };

  const totalSelected = Object.values(selections).reduce((acc, s) => acc + s.size, 0);
  const opts = STEP_OPTIONS[currentStep] ?? [];
  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <div style={{
      background: BG,
      minHeight: "100vh",
      fontFamily: "'Inter', 'DM Sans', system-ui, sans-serif",
      display: "flex",
      flexDirection: "column",
    }}>

      {/* Header */}
      <div style={{
        padding: "18px 28px",
        borderBottom: `1px solid ${BORDER}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: ACCENT }} />
            <span style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: ACCENT }}>
              TVPlus Test Suite
            </span>
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: TEXT, margin: 0 }}>Schedule New Test Run</h1>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {totalSelected > 0 && (
            <span style={{
              background: SELECTED_BG,
              border: `1px solid ${BORDER_ACTIVE}`,
              borderRadius: 20,
              padding: "4px 14px",
              fontSize: 12,
              color: ACCENT,
              fontWeight: 600,
            }}>
              {totalSelected} selected
            </span>
          )}
        </div>
      </div>

      {/* Stepper */}
      <div style={{
        display: "flex",
        alignItems: "center",
        padding: "0 28px",
        borderBottom: `1px solid ${BORDER}`,
        background: BG_STEP,
        overflowX: "auto",
      }}>
        {STEPS.map((step, i) => {
          const isDone    = i < currentStep;
          const isActive  = i === currentStep;
          const isFuture  = i > currentStep;
          return (
            <button
              key={i}
              onClick={() => i <= currentStep && setCurrentStep(i)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 0,
                background: "transparent",
                border: "none",
                cursor: i <= currentStep ? "pointer" : "default",
                padding: 0,
                flexShrink: 0,
              }}
            >
              {/* Step pill */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 16px",
                borderBottom: isActive ? `2px solid ${ACCENT}` : "2px solid transparent",
                color: isActive ? TEXT : isDone ? "#374151" : TEXT_MUTED,
              }}>
                <div style={{
                  width: 22, height: 22,
                  borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 700,
                  background: isActive ? ACCENT : isDone ? "#dbeafe" : "#f3f4f6",
                  color: isActive ? "#fff" : isDone ? ACCENT : TEXT_MUTED,
                  flexShrink: 0,
                }}>
                  {isDone ? "✓" : i + 1}
                </div>
                <span style={{ fontSize: 12, fontWeight: isActive ? 600 : 400, whiteSpace: "nowrap" }}>
                  {step}
                  {selections[i]?.size > 0 && (
                    <span style={{
                      marginLeft: 6,
                      background: SELECTED_BG,
                      border: `1px solid ${BORDER}`,
                      borderRadius: 10,
                      padding: "1px 7px",
                      fontSize: 10,
                      color: ACCENT,
                    }}>
                      {selections[i].size}
                    </span>
                  )}
                </span>
              </div>
              {/* Arrow */}
              {i < STEPS.length - 1 && (
                <span style={{ color: BORDER, fontSize: 16, margin: "0 2px", userSelect: "none" }}>›</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Options panel */}
        <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto" }}>
          <div style={{ marginBottom: 16, display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: TEXT, margin: 0 }}>
                Select {STEPS[currentStep]}
              </h2>
              <p style={{ fontSize: 12, color: TEXT_MUTED, marginTop: 4 }}>
                {currentStep < STEPS.length - 1
                  ? `Multi-select. Continues to: ${STEPS[currentStep + 1]}`
                  : "Review your full selection before submitting."}
              </p>
            </div>
            {opts.length > 0 && (
              <button
                onClick={() => {
                  const allIds = opts.map(o => o.id);
                  setSelections(prev => ({ ...prev, [currentStep]: new Set(allIds) }));
                }}
                style={{
                  background: "transparent",
                  border: `1px solid ${BORDER}`,
                  borderRadius: 6,
                  padding: "4px 12px",
                  fontSize: 11,
                  color: TEXT_MUTED,
                  cursor: "pointer",
                }}
              >
                Select all
              </button>
            )}
          </div>

          {/* Options grid */}
          {opts.length > 0 ? (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 8,
            }}>
              {opts.map(opt => {
                const sel = selections[currentStep]?.has(opt.id);
                return (
                  <button
                    key={opt.id}
                    onClick={() => toggle(opt.id)}
                    style={{
                      background: sel ? SELECTED_BG : BG_CARD,
                      border: `1px solid ${sel ? BORDER_ACTIVE : BORDER}`,
                      borderRadius: 8,
                      padding: "12px 14px",
                      cursor: "pointer",
                      textAlign: "left",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      transition: "all 150ms",
                    }}
                  >
                    <div style={{
                      width: 16, height: 16,
                      borderRadius: 4,
                      border: `1.5px solid ${sel ? ACCENT : BORDER}`,
                      background: sel ? ACCENT : "transparent",
                      flexShrink: 0,
                      marginTop: 2,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {sel && <span style={{ color: "#fff", fontSize: 10, lineHeight: 1 }}>✓</span>}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: sel ? TEXT : "#374151" }}>
                        {opt.label}
                      </div>
                      {opt.sub && (
                        <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 2 }}>
                          {opt.sub}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            /* Submit step */
            <div style={{
              background: BG_CARD,
              border: `1px solid ${BORDER}`,
              borderRadius: 10,
              padding: "28px 24px",
              textAlign: "center",
            }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🚀</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: TEXT, marginBottom: 8 }}>
                Ready to submit
              </h3>
              <p style={{ fontSize: 13, color: TEXT_MUTED, marginBottom: 20, maxWidth: 400, margin: "0 auto 20px" }}>
                Your test run will be queued and executed automatically. Results will be available in the dashboard within 2–4 hours.
              </p>
              <button style={{
                background: ACCENT,
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "12px 32px",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(20,40,160,0.25)",
              }}>
                Submit Test Run →
              </button>
            </div>
          )}
        </div>

        {/* Summary sidebar */}
        <div style={{
          width: 240,
          borderLeft: `1px solid ${BORDER}`,
          padding: "20px 18px",
          background: BG_STEP,
          display: "flex",
          flexDirection: "column",
          gap: 0,
        }}>
          <p style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: TEXT_MUTED, marginBottom: 14 }}>
            Selection Summary
          </p>

          {SUMMARY_LABELS.map((label, i) => {
            const count = selections[i]?.size ?? 0;
            return (
              <div key={i} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "9px 0",
                borderBottom: `1px solid ${BORDER}`,
              }}>
                <div>
                  <div style={{ fontSize: 12, color: i === currentStep ? TEXT : "#6b7280" }}>
                    {label}
                  </div>
                </div>
                <span style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: count > 0 ? ACCENT : TEXT_MUTED,
                  background: count > 0 ? SELECTED_BG : "transparent",
                  border: count > 0 ? `1px solid ${BORDER_ACTIVE}` : "1px solid transparent",
                  borderRadius: 20,
                  padding: count > 0 ? "2px 9px" : "2px 9px",
                  minWidth: 28,
                  textAlign: "center",
                }}>
                  {count > 0 ? count : "—"}
                </span>
              </div>
            );
          })}

          {/* Total estimate */}
          <div style={{ marginTop: "auto", paddingTop: 16 }}>
            <div style={{
              background: SELECTED_BG,
              border: `1px solid ${BORDER_ACTIVE}`,
              borderRadius: 8,
              padding: "12px 14px",
            }}>
              <p style={{ fontSize: 10, color: TEXT_MUTED, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>
                Estimated Run
              </p>
              <p style={{ fontSize: 20, fontWeight: 700, color: ACCENT, margin: 0 }}>
                ~{Math.max(1, Object.values(selections).reduce((a, s) => a + s.size, 0) * 12)} tests
              </p>
              <p style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 3 }}>
                approx. {Math.max(1, Object.values(selections).reduce((a, s) => a + s.size, 0) * 4)} min
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer nav */}
      <div style={{
        padding: "14px 24px",
        borderTop: `1px solid ${BORDER}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: BG_STEP,
      }}>
        <button
          onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
          disabled={currentStep === 0}
          style={{
            background: "transparent",
            border: `1px solid ${BORDER}`,
            borderRadius: 8,
            padding: "9px 20px",
            fontSize: 13,
            color: currentStep === 0 ? TEXT_MUTED : TEXT,
            cursor: currentStep === 0 ? "default" : "pointer",
            opacity: currentStep === 0 ? 0.4 : 1,
          }}
        >
          ← Back
        </button>

        <span style={{ fontSize: 12, color: TEXT_MUTED }}>
          Step {currentStep + 1} of {STEPS.length}
        </span>

        <button
          onClick={() => setCurrentStep(s => Math.min(STEPS.length - 1, s + 1))}
          style={{
            background: ACCENT,
            border: "none",
            borderRadius: 8,
            padding: "9px 24px",
            fontSize: 13,
            fontWeight: 600,
            color: "#fff",
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(20,40,160,0.25)",
          }}
        >
          {isLastStep ? "Submit →" : `Continue: ${STEPS[currentStep + 1]} →`}
        </button>
      </div>
    </div>
  );
};

export default TVPlusScheduler;
