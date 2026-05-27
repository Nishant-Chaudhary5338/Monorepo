import { useState, useEffect, useMemo } from "react";

type LineKind = "prompt" | "info" | "ok" | "warn" | "err";
type ScriptLine = [LineKind, string];

interface ScriptEntry {
  t: number;
  line: ScriptLine;
}

interface SparklineProps {
  label: string;
  max: number;
  now: number;
  unit?: string;
  color: string;
}

const SCRIPT: ScriptEntry[] = [
  { t: 0,    line: ["prompt", "$ mcp scaffold component <DashboardCard/>"] },
  { t: 700,  line: ["info",   "→ resolving template · @nc/ui · v3.2.1"] },
  { t: 1400, line: ["info",   "→ generating Card.tsx · Card.stories.tsx · Card.test.tsx"] },
  { t: 2100, line: ["info",   "→ running quality pipeline · 3 hooks"] },
  { t: 2700, line: ["ok",     "  ✓ types · strict mode passed"] },
  { t: 3100, line: ["ok",     "  ✓ a11y · 0 violations"] },
  { t: 3500, line: ["ok",     "  ✓ tests · 5 new · 100% pass"] },
  { t: 4100, line: ["info",   "→ chunk-hash diff · only Card affected · scoped CI"] },
  { t: 4800, line: ["ok",     "✓ component scaffolded in 4.2s"] },
  { t: 5600, line: ["prompt", "$ mcp review --pr 1247"] },
  { t: 6300, line: ["info",   "→ reading diff · 3 files changed · +127 −18"] },
  { t: 7100, line: ["info",   "→ semantic analysis · context loaded"] },
  { t: 7700, line: ["warn",   "⚠ suggestion: Card.tsx · memoize render() · perf"] },
  { t: 8400, line: ["ok",     "✓ review posted · 1 suggestion · 0 blockers"] },
  { t: 9400, line: ["prompt", "$ _"] },
];

const LINE_COLORS: Record<LineKind, string> = {
  prompt: "var(--fg)",
  info:   "var(--fg-2)",
  ok:     "var(--ok)",
  warn:   "var(--warn)",
  err:    "var(--err)",
};

const COMMITS = [
  { repo: "mcp-toolkit",    sha: "a4f8c12", msg: "feat: chunk-hash diff",     dt: "2h" },
  { repo: "headless-ui",    sha: "9e2b377", msg: "Card variants via CVA",     dt: "5h" },
  { repo: "shell-platform", sha: "0b566c3", msg: "manifest hot-reload",       dt: "1d" },
];

function Sparkline({ label, max, now, unit = "", color }: SparklineProps) {
  const points = useMemo(() => {
    const N = 24;
    return Array.from({ length: N }).map((_, i) => {
      const base = now * (0.6 + 0.4 * (i / (N - 1)));
      const wobble = (Math.sin(i * 0.9) + Math.sin(i * 1.7) * 0.6) * (now * 0.06);
      return Math.max(0, Math.min(max, base + wobble));
    });
  }, [now, max]);

  const w = 240;
  const h = 36;
  const svgPath = points
    .map((v, i) => `${i === 0 ? "M" : "L"} ${(i / (points.length - 1)) * w} ${h - (v / max) * h}`)
    .join(" ");
  const areaPath = `${svgPath} L ${w} ${h} L 0 ${h} Z`;
  const gradId = `spark-${label.replace(/\s/g, "")}`;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, font: "var(--mono)", fontSize: 11, color: "var(--fg-muted)" }}>
        <span>{label}</span>
        <span style={{ color }}>{now}{unit}</span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: h, display: "block" }}>
        <defs>
          <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%"   stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#${gradId})`} />
        <path d={svgPath} stroke={color} strokeWidth="1.4" fill="none" />
        <circle cx={w} cy={h - (points[points.length - 1] / max) * h} r="3" fill={color} />
      </svg>
    </div>
  );
}

const NowPlayingSection = () => {
  const [lines, setLines] = useState<ScriptLine[]>([]);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    function play() {
      setLines([]);
      SCRIPT.forEach((s) => {
        timers.push(setTimeout(() => setLines((L) => [...L, s.line]), s.t));
      });
      timers.push(setTimeout(play, 11000));
    }

    play();
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 500);
    return () => clearInterval(id);
  }, []);

  const cursor = tick % 2 === 0 ? "▌" : " ";
  const lastLine = lines[lines.length - 1];
  const showCursor = lines.length > 0 && lastLine?.[1] !== "$ _";

  return (
    <section id="now" style={{ padding: "120px 0", borderTop: "1px solid var(--border)" }}>
      <div className="site-container">
        <div className="section-header">
          <div className="num">// 03 · Now playing</div>
          <h2>
            The platform{" "}
            <span style={{ color: "var(--accent)", fontStyle: "italic" }}>in motion.</span>
          </h2>
          <div className="sub">
            A live look at the MCP tooling — scaffolding, reviewing, and shipping a component end-to-end.
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24 }}>
          {/* Terminal */}
          <div style={{
            background: "var(--bg-deep)",
            border: "1px solid rgba(255,255,255,0.06)",
            position: "relative",
            minHeight: 380,
            display: "flex",
            flexDirection: "column",
            boxShadow: "var(--elev-glass)",
          }}>
            {/* chrome bar */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "10px 16px",
              borderBottom: "1px solid var(--border)",
              background: "var(--surface)",
            }}>
              <div style={{ display: "flex", gap: 6 }}>
                <span style={{ width: 11, height: 11, borderRadius: "50%", background: "var(--err)",  opacity: 0.7, display: "inline-block" }} />
                <span style={{ width: 11, height: 11, borderRadius: "50%", background: "var(--warn)", opacity: 0.7, display: "inline-block" }} />
                <span style={{ width: 11, height: 11, borderRadius: "50%", background: "var(--ok)",   opacity: 0.7, display: "inline-block" }} />
              </div>
              <div style={{ font: "var(--mono)", fontSize: 11, color: "var(--fg-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                mcp · @samsung/platform-toolkit
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span className="dot" style={{ width: 5, height: 5 }} />
                <span style={{ font: "var(--mono)", fontSize: 10.5, color: "var(--ok)", letterSpacing: "0.12em", textTransform: "uppercase" }}>live</span>
              </div>
            </div>

            {/* output lines */}
            <div style={{ padding: "18px 22px", flex: 1, font: "var(--code)", fontSize: 13.5, color: "var(--fg-2)", lineHeight: 1.7, overflow: "hidden" }}>
              {lines.map(([kind, text], i) => (
                <div key={i} style={{ animation: "hero-word-in 280ms var(--ease-out) both", color: LINE_COLORS[kind] }}>
                  {kind === "prompt" ? (
                    <>
                      <span style={{ color: "var(--accent)" }}>{text.split(" ")[0]}</span>
                      {" " + text.split(" ").slice(1).join(" ")}
                    </>
                  ) : text}
                </div>
              ))}
              {showCursor && (
                <div style={{ color: "var(--accent)", opacity: 0.6 }}>{cursor}</div>
              )}
            </div>
          </div>

          {/* Status panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Commit feed */}
            <div className="card" style={{ padding: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <span style={{ font: "var(--label)", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--accent)" }}>
                  // recent commits
                </span>
                <span className="dot" style={{ width: 5, height: 5 }} />
              </div>
              {COMMITS.map((c) => (
                <div key={c.sha} style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr auto",
                  gap: 10,
                  padding: "8px 0",
                  borderTop: "1px solid var(--border)",
                  font: "var(--mono)", fontSize: 11.5,
                  alignItems: "center",
                }}>
                  <span style={{ color: "var(--data)" }}>{c.sha}</span>
                  <span style={{ color: "var(--fg-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.msg}</span>
                  <span style={{ color: "var(--fg-dim)" }}>{c.dt}</span>
                </div>
              ))}
            </div>

            {/* Platform health */}
            <div className="card" style={{ padding: 22 }}>
              <div style={{ font: "var(--label)", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 14 }}>
                // platform health
              </div>
              <Sparkline label="MCP invocations · 24h"    max={580}  now={412} color="var(--data)" />
              <div style={{ height: 14 }} />
              <Sparkline label="plugin onboarding · p95"  max={120}  now={48}  unit="s" color="var(--accent)" />
              <div style={{ height: 14 }} />
              <Sparkline label="CI pass rate · 7d"        max={100}  now={98}  unit="%" color="var(--ok)" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NowPlayingSection;
