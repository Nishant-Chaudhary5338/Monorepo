import { useState, useEffect, CSSProperties } from "react";

interface Plugin {
  name: string;
  color: string;
}

interface ArchNodeProps {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub: string;
  color: string;
  active: boolean;
  small?: boolean;
}

interface WireProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  active: boolean;
  reverse?: boolean;
  delay?: number;
}

const PLUGINS: Plugin[] = [
  { name: "billing",    color: "var(--accent)" },
  { name: "test-suite", color: "var(--data)" },
  { name: "dashboard",  color: "var(--accent)" },
  { name: "auth",       color: "var(--highlight)" },
];

const STEP_CAPTIONS = [
  "IDLE · awaiting boot",
  "FETCH · GET /api/plugins/manifest",
  "REGISTER · 4 remotes injected",
  "MOUNT · plugins live",
];

const STEPS = [
  { k: "01", title: "Shell boots empty",   desc: "No plugins compiled in. The shell knows nothing about which features will mount." },
  { k: "02", title: "Fetch manifest",      desc: "Backend returns the active plugin list — names, entry URLs, versions, permissions." },
  { k: "03", title: "Register remotes",    desc: "Each plugin's entry URL is injected into Module Federation's runtime." },
  { k: "04", title: "Mount on demand",     desc: "On route match the plugin is fetched, shared deps deduped, component mounted." },
];

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>
      <span style={{ width: 8, height: 8, background: color, borderRadius: 0, boxShadow: `0 0 10px ${color}` }} />
      {label}
    </span>
  );
}

function ArchNode({ x, y, w, h, label, sub, color, active, small = false }: ArchNodeProps) {
  return (
    <g style={{ transition: "opacity 260ms" } as CSSProperties} opacity={active ? 1 : 0.55}>
      <rect
        x={x} y={y} width={w} height={h}
        fill="rgba(15,16,24,0.95)"
        stroke={color}
        strokeWidth={active ? 1.5 : 0.8}
        filter={active ? "url(#arch-glow)" : undefined}
      />
      {/* tick corners */}
      <path d={`M${x-1} ${y+8} L${x-1} ${y-1} L${x+8} ${y-1}`} stroke={color} strokeWidth="1.5" fill="none" />
      <path d={`M${x+w-8} ${y-1} L${x+w+1} ${y-1} L${x+w+1} ${y+8}`} stroke={color} strokeWidth="1.5" fill="none" />
      <path d={`M${x-1} ${y+h-8} L${x-1} ${y+h+1} L${x+8} ${y+h+1}`} stroke={color} strokeWidth="1.5" fill="none" />
      <path d={`M${x+w-8} ${y+h+1} L${x+w+1} ${y+h+1} L${x+w+1} ${y+h-8}`} stroke={color} strokeWidth="1.5" fill="none" />
      <text
        x={x + 12} y={y + (small ? 24 : 32)}
        fill={color}
        fontFamily="var(--font-mono)" fontSize={small ? "10" : "11"} letterSpacing="2"
      >
        {label}
      </text>
      <text
        x={x + 12} y={y + (small ? 44 : 60)}
        fill="var(--fg-muted)"
        fontFamily="var(--font-mono)" fontSize={small ? "9.5" : "10"}
      >
        {sub}
      </text>
      {!small && (
        <text
          x={x + 12} y={y + h - 16}
          fill="var(--fg)"
          fontFamily="var(--font-display)" fontSize="20" fontWeight="700" letterSpacing="-0.5"
        >
          {label.includes("SHELL") ? "shell" : label.includes("MANIFEST") ? "manifest" : ""}
        </text>
      )}
    </g>
  );
}

function PathMotion({ path, color, delay }: { path: string; color: string; delay: number }) {
  return (
    <circle r="3.5" fill={color} filter="url(#arch-glow)">
      <animateMotion dur="1.4s" repeatCount="indefinite" begin={`${delay}ms`} path={path} />
      <animate attributeName="opacity" values="0;1;1;0" dur="1.4s" repeatCount="indefinite" begin={`${delay}ms`} />
    </circle>
  );
}

function Wire({ x1, y1, x2, y2, active, reverse = false, delay = 0 }: WireProps) {
  const path = `M ${x1} ${y1} C ${(x1+x2)/2} ${y1}, ${(x1+x2)/2} ${y2}, ${x2} ${y2}`;
  const dotColor = reverse ? "var(--data)" : "var(--accent)";
  return (
    <g>
      <path d={path} stroke="var(--border-strong)" strokeWidth="1" fill="none" strokeDasharray="3 4" />
      {active && <PathMotion path={path} color={dotColor} delay={delay} />}
    </g>
  );
}

function ArchSvg({ step }: { step: number }) {
  return (
    <svg viewBox="0 0 760 360" style={{ width: "100%", height: "auto" }}>
      <defs>
        <filter id="arch-glow">
          <feGaussianBlur stdDeviation="2" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* dot grid */}
      <g opacity="0.5">
        {Array.from({ length: 20 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="360" stroke="rgba(148,163,184,0.04)" />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 40} x2="760" y2={i * 40} stroke="rgba(148,163,184,0.04)" />
        ))}
      </g>

      <ArchNode x={40}  y={120} w={160} h={120} label="HOST SHELL" sub="React 19 · Vite"     color="var(--accent)"    active={step === 0 || step === 3} />
      <ArchNode x={300} y={120} w={160} h={120} label="MANIFEST"   sub="/api/plugins"         color="var(--highlight)" active={step === 1 || step === 2} />
      {PLUGINS.map((p, i) => (
        <ArchNode key={p.name} x={560} y={20 + i * 80} w={170} h={62}
          label={`PLUGIN · ${p.name.toUpperCase()}`} sub={`v1.${i+2}.0`}
          color={p.color} active={step === 2 || step === 3} small />
      ))}

      <Wire x1={200} y1={180} x2={300} y2={180} active={step === 1} />
      <Wire x1={460} y1={180} x2={560} y2={51}  active={step === 2} delay={0} />
      <Wire x1={460} y1={180} x2={560} y2={131} active={step === 2} delay={120} />
      <Wire x1={460} y1={180} x2={560} y2={211} active={step === 2} delay={240} />
      <Wire x1={460} y1={180} x2={560} y2={291} active={step === 2} delay={360} />
      {step === 3 && PLUGINS.map((_, i) => (
        <Wire key={`m${i}`} x1={560} y1={51 + i * 80} x2={200} y2={180} active reverse delay={i * 80} />
      ))}

      <text x="380" y="18" textAnchor="middle"
        fill="var(--fg-muted)" fontFamily="var(--font-mono)" fontSize="10" letterSpacing="2"
      >
        {STEP_CAPTIONS[step]}
      </text>
    </svg>
  );
}

const ArchitectureSection = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % 4), 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="architecture" style={{ paddingBlock: "var(--section-py)", borderTop: "1px solid var(--border)" }}>
      <div className="site-container">
        <div className="section-header">
          <div className="num">// 02 · System</div>
          <h2>
            How the platform{" "}
            <span style={{ color: "var(--accent)", fontStyle: "italic" }}>actually runs.</span>
          </h2>
          <div className="sub">
            Runtime feature injection on Vite Module Federation — the architecture that put plugin onboarding under 60 seconds.
          </div>
        </div>

        <div className="arch-grid">
          {/* Diagram panel */}
          <div style={{
            background: "var(--glass)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            border: "1px solid rgba(255,255,255,0.06)",
            padding: 28,
            position: "relative",
            minHeight: 480,
            boxShadow: "var(--elev-glass)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div style={{ font: "var(--label)", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--accent)" }}>
                fig.01 · plugin load sequence
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--data)", boxShadow: "0 0 12px var(--data)", animation: "dot-pulse 1.8s ease-in-out infinite", display: "inline-block" }} />
                <span style={{ font: "var(--mono)", fontSize: 11, color: "var(--data)", letterSpacing: "0.16em", textTransform: "uppercase" }}>
                  live · step {step + 1}/4
                </span>
              </div>
            </div>

            <ArchSvg step={step} />

            <div style={{
              marginTop: 24, paddingTop: 18, borderTop: "1px solid var(--border)",
              display: "flex", gap: 24, flexWrap: "wrap",
              font: "var(--mono)", fontSize: 11.5, color: "var(--fg-muted)", letterSpacing: "0.04em",
            }}>
              <LegendDot color="var(--accent)"    label="shell" />
              <LegendDot color="var(--highlight)" label="manifest" />
              <LegendDot color="var(--data)"      label="plugin remote" />
            </div>
          </div>

          {/* Step explanation cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {STEPS.map((s, i) => (
              <div key={s.k} style={{
                padding: "16px 18px",
                background: step === i ? "rgba(99,102,241,0.06)" : "transparent",
                border: `1px solid ${step === i ? "var(--accent-line)" : "var(--border)"}`,
                boxShadow: step === i ? "0 0 24px -10px var(--accent-glow)" : "none",
                transition: "all 260ms var(--ease-out)",
              }}>
                <div style={{
                  font: "var(--label)", letterSpacing: "0.16em", textTransform: "uppercase",
                  color: step === i ? "var(--accent)" : "var(--fg-dim)", marginBottom: 6,
                }}>
                  // {s.k}
                </div>
                <div style={{
                  font: "600 0.95rem/1.3 var(--font-display)", letterSpacing: "-0.015em",
                  color: step === i ? "var(--fg)" : "var(--fg-2)", marginBottom: 5,
                }}>
                  {s.title}
                </div>
                <div style={{ font: "var(--p-sm)", color: "var(--fg-muted)", lineHeight: 1.55 }}>
                  {s.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArchitectureSection;
