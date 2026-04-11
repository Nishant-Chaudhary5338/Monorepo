import type { Meta, StoryObj } from "@storybook/react"
import React from "react"

// ─── Token Row helper ─────────────────────────────────────────────────────────
function TokenRow({ token, value }: { token: string; value: string }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "9px 14px", borderRadius: "6px",
      background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)",
      marginBottom: "4px",
    }}>
      <code style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: "#7F90F0" }}>{token}</code>
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: "#636B8A" }}>{value}</span>
    </div>
  )
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: "64px" }}>
      <h2 style={{
        fontFamily: "'Sora', sans-serif", fontSize: "10px", fontWeight: 700,
        letterSpacing: "0.14em", textTransform: "uppercase", color: "#4A5170",
        marginBottom: "24px", display: "flex", alignItems: "center", gap: "14px",
      }}>
        {title}
        <span style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, #343A56 0%, transparent 100%)" }} />
      </h2>
      {children}
    </section>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
function DesignSystemPage() {
  React.useEffect(() => {
    const link = document.createElement("link")
    link.href = "https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=DM+Mono:wght@400;500&display=swap"
    link.rel = "stylesheet"
    document.head.appendChild(link)
    return () => { document.head.removeChild(link) }
  }, [])

  const blueScale   = ["#EEF1FC","#D4DAFF","#AAB5F7","#7F90F0","#546BE8","#1428A0","#102288","#0D1B70","#091455","#060D3A","#03071F"]
  const orangeScale = ["#FFF1ED","#FFD9CC","#FEB8A0","#FD9074","#FC6A47","#F4511E","#D43D0C","#A82E08","#7C2006","#521303","#2A0902"]
  const neutralScale= ["#F7F8FC","#ECEEF5","#D6D9E8","#B5BACE","#8C94B0","#636B8A","#4A5170","#343A56","#1E2235","#0D1020","#070910"]
  const steps       = ["50","100","200","300","400","500","600","700","800","900","950"]

  const gradients = [
    { name: "brand-diagonal",    css: "linear-gradient(135deg, #1428A0 0%, #F4511E 100%)",  token: "--gradient-brand" },
    { name: "brand-reverse",     css: "linear-gradient(135deg, #F4511E 0%, #1428A0 100%)",  token: "--gradient-brand-rev" },
    { name: "brand-dark",        css: "linear-gradient(135deg, #091455 0%, #521303 100%)",  token: "--gradient-brand-dark" },
    { name: "brand-subtle",      css: "linear-gradient(135deg, #EEF1FC 0%, #FFF1ED 100%)",  token: "--gradient-brand-subtle" },
    { name: "blue-vertical",     css: "linear-gradient(180deg, #1428A0 0%, #03071F 100%)",  token: "--gradient-blue-v" },
    { name: "orange-vertical",   css: "linear-gradient(180deg, #F4511E 0%, #2A0902 100%)",  token: "--gradient-orange-v" },
    { name: "brand-mesh",        css: "radial-gradient(ellipse at 20% 50%, rgba(20,40,160,0.65) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(244,81,30,0.6) 0%, transparent 60%), #070910", token: "--gradient-mesh" },
    { name: "glass-brand",       css: "linear-gradient(135deg, rgba(20,40,160,0.13) 0%, rgba(244,81,30,0.07) 100%)", token: "--gradient-glass" },
  ]

  const typeScale = [
    { label: "display-2xl", size: "64px", weight: 800 },
    { label: "display-xl",  size: "48px", weight: 800 },
    { label: "display-lg",  size: "36px", weight: 700 },
    { label: "display-md",  size: "30px", weight: 700 },
    { label: "display-sm",  size: "24px", weight: 600 },
    { label: "heading",     size: "20px", weight: 600 },
    { label: "subheading",  size: "16px", weight: 500 },
    { label: "body-lg",     size: "16px", weight: 400 },
    { label: "body",        size: "14px", weight: 400 },
    { label: "body-sm",     size: "12px", weight: 400 },
    { label: "caption",     size: "11px", weight: 500 },
  ]

  const card: React.CSSProperties = {
    padding: "28px", borderRadius: "14px",
    background: "#0D1020", border: "1px solid rgba(255,255,255,0.06)",
  }

  return (
    <div style={{ background: "#070910", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: "#F7F8FC" }}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div style={{ position: "relative", padding: "80px 64px 72px", borderBottom: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 12% 50%, rgba(20,40,160,0.28) 0%, transparent 50%), radial-gradient(ellipse at 88% 50%, rgba(244,81,30,0.22) 0%, transparent 50%)", pointerEvents: "none" }} />
        <div style={{ position: "relative" }}>
          {/* logo mark */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "36px" }}>
            <div style={{ width: "34px", height: "34px", borderRadius: "8px", background: "linear-gradient(135deg, #1428A0 0%, #F4511E 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <rect x="2" y="4" width="16" height="12" rx="2" stroke="white" strokeWidth="1.5"/>
                <path d="M13.5 10L8.5 7v6l5-3z" fill="white"/>
              </svg>
            </div>
            <span style={{ fontFamily: "'Sora', sans-serif", fontSize: "12px", fontWeight: 600, color: "#636B8A", letterSpacing: "0.1em", textTransform: "uppercase" }}>Signal & Flame</span>
          </div>

          <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: "clamp(40px, 5vw, 68px)", fontWeight: 800, lineHeight: 1.02, margin: "0 0 16px", background: "linear-gradient(135deg, #ffffff 40%, rgba(255,255,255,0.55) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Design System
          </h1>

          <p style={{ fontSize: "17px", color: "#8C94B0", maxWidth: "520px", lineHeight: 1.65, margin: "0 0 44px" }}>
            A unified visual language built on{" "}
            <span style={{ color: "#546BE8", fontWeight: 500 }}>Signal Blue</span> and{" "}
            <span style={{ color: "#F4511E", fontWeight: 500 }}>Flame Orange</span> — powering internal tools and client-facing portals at scale.
          </p>

          <div style={{ display: "flex", gap: "48px", flexWrap: "wrap" }}>
            {[["120+","Design Tokens"],["33","Color Steps"],["8","Gradients"],["11","Type Levels"]].map(([v, l]) => (
              <div key={l}>
                <p style={{ fontFamily: "'Sora', sans-serif", fontSize: "30px", fontWeight: 800, margin: "0 0 4px", background: "linear-gradient(135deg, #1428A0, #F4511E)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{v}</p>
                <p style={{ fontSize: "11px", color: "#636B8A", margin: 0, letterSpacing: "0.06em" }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONTENT ──────────────────────────────────────────────────────── */}
      <div style={{ padding: "64px", maxWidth: "1400px" }}>

        {/* BRAND COLORS */}
        <Section title="Brand Colors">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {[
              { role: "Primary", name: "Signal Blue", hex: "#1428A0", hsl: "228°, 79%, 36%", grad: "linear-gradient(135deg, #1428A0 0%, #0D1B70 100%)", border: "rgba(84,107,232,0.3)", token: "--color-primary" },
              { role: "Accent",  name: "Flame Orange", hex: "#F4511E", hsl: "16°, 90%, 54%",  grad: "linear-gradient(135deg, #F4511E 0%, #A82E08 100%)", border: "rgba(244,81,30,0.3)",  token: "--color-accent"   },
            ].map((b) => (
              <div key={b.name} style={{ padding: "32px", borderRadius: "16px", background: b.grad, border: `1px solid ${b.border}`, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: "-24px", right: "-24px", width: "110px", height: "110px", borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
                <p style={{ fontFamily: "'Sora', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.13em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", margin: "0 0 6px" }}>{b.role}</p>
                <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "22px", fontWeight: 700, margin: "0 0 4px", color: "white" }}>{b.name}</h3>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "13px", color: "rgba(255,255,255,0.55)", margin: "0 0 20px" }}>{b.hex} · hsl({b.hsl})</p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <span style={{ padding: "4px 12px", borderRadius: "100px", background: "rgba(255,255,255,0.16)", fontSize: "11px", color: "white", fontFamily: "'DM Mono', monospace" }}>{b.token}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* COLOR SCALES */}
        <Section title="Color Scales">
          {[
            { label: "Signal Blue",   scale: blueScale,    accent: "#546BE8" },
            { label: "Flame Orange",  scale: orangeScale,  accent: "#F4511E" },
            { label: "Neutral",       scale: neutralScale, accent: "#8C94B0" },
          ].map(({ label, scale, accent }) => (
            <div key={label} style={{ marginBottom: "32px" }}>
              <p style={{ fontFamily: "'Sora', sans-serif", fontSize: "12px", fontWeight: 600, color: accent, margin: "0 0 12px", letterSpacing: "0.06em" }}>{label}</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(11, 1fr)", gap: "5px" }}>
                {scale.map((hex, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div style={{ height: "52px", borderRadius: "7px", background: hex, border: i < 2 ? "1px solid rgba(0,0,0,0.08)" : "1px solid rgba(255,255,255,0.04)" }} />
                    <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", color: "#4A5170", margin: 0, textAlign: "center" }}>{steps[i]}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </Section>

        {/* SEMANTIC */}
        <Section title="Semantic Colors">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
            {[
              { name: "Success", solid: "#16A34A", surface: "#DCFCE7", text: "#14532D", token: "--color-success" },
              { name: "Warning", solid: "#D97706", surface: "#FEF3C7", text: "#78350F", token: "--color-warning" },
              { name: "Error",   solid: "#DC2626", surface: "#FEE2E2", text: "#7F1D1D", token: "--color-error" },
              { name: "Info",    solid: "#1428A0", surface: "#EEF1FC", text: "#060D3A", token: "--color-info" },
            ].map((s) => (
              <div key={s.name} style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ height: "60px", background: s.solid, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "white", fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "13px" }}>{s.name}</span>
                </div>
                <div style={{ height: "32px", background: s.surface, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: s.text, fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 500 }}>Surface variant</span>
                </div>
                <div style={{ padding: "10px 12px", background: "#0D1020" }}>
                  <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", color: "#4A5170", margin: 0 }}>{s.token}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* GRADIENTS */}
        <Section title="Gradient System">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
            {gradients.map((g) => (
              <div key={g.name} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ height: "88px", borderRadius: "12px", background: g.css, border: "1px solid rgba(255,255,255,0.05)" }} />
                <div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 600, color: "#B5BACE", margin: "0 0 2px" }}>{g.name}</p>
                  <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", color: "#4A5170", margin: 0 }}>{g.token}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* TYPOGRAPHY */}
        <Section title="Typography">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
            <div style={card}>
              <p style={{ fontFamily: "'Sora', sans-serif", fontSize: "10px", fontWeight: 700, color: "#4A5170", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 14px" }}>Display — Sora</p>
              <p style={{ fontFamily: "'Sora', sans-serif", fontSize: "44px", fontWeight: 800, lineHeight: 1.0, margin: "0 0 10px", color: "white" }}>Signal<br/>& Flame</p>
              <p style={{ fontFamily: "'Sora', sans-serif", fontSize: "13px", color: "#4A5170", margin: 0 }}>Aa Bb Cc Dd Ee Ff · 0123456789</p>
            </div>
            <div style={card}>
              <p style={{ fontFamily: "'Sora', sans-serif", fontSize: "10px", fontWeight: 700, color: "#4A5170", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 14px" }}>Body — DM Sans</p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "20px", fontWeight: 400, lineHeight: 1.55, margin: "0 0 10px", color: "#D6D9E8" }}>Clear, professional, readable at every size — built for portals and dashboards.</p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "#4A5170", margin: 0 }}>Aa Bb Cc Dd Ee Ff · 0123456789</p>
            </div>
          </div>

          <div style={card}>
            {typeScale.map((row, i) => (
              <div key={row.label} style={{ display: "flex", alignItems: "baseline", gap: "20px", padding: "10px 0", borderBottom: i < typeScale.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                <code style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", color: "#343A56", minWidth: "110px", flexShrink: 0 }}>--text-{row.label}</code>
                <p style={{ fontFamily: "'Sora', sans-serif", fontSize: row.size, fontWeight: row.weight, lineHeight: 1.1, margin: 0, color: "white", flex: 1, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>Portal Dashboard</p>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", color: "#343A56", flexShrink: 0 }}>{row.size} / {row.weight}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* SPACING */}
        <Section title="Spacing Scale">
          <div style={{ display: "flex", alignItems: "flex-end", gap: "16px", flexWrap: "wrap", padding: "32px", borderRadius: "14px", background: "#0D1020", border: "1px solid rgba(255,255,255,0.06)" }}>
            {[["--space-1","4px"],["--space-2","8px"],["--space-3","12px"],["--space-4","16px"],["--space-5","20px"],["--space-6","24px"],["--space-8","32px"],["--space-10","40px"],["--space-12","48px"],["--space-16","64px"],["--space-20","80px"],["--space-24","96px"]].map(([t, v]) => (
              <div key={t} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                <div style={{ width: v, height: v, minWidth: "4px", minHeight: "4px", background: "linear-gradient(135deg, #1428A0, #F4511E)", borderRadius: "3px" }} />
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", color: "#4A5170", margin: 0 }}>{v}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* RADIUS */}
        <Section title="Border Radius">
          <div style={{ display: "flex", gap: "28px", flexWrap: "wrap", alignItems: "center", padding: "32px", borderRadius: "14px", background: "#0D1020", border: "1px solid rgba(255,255,255,0.06)" }}>
            {[["sm","4px"],["md","6px"],["lg","8px"],["xl","12px"],["2xl","16px"],["3xl","24px"],["full","9999px"]].map(([n, v]) => (
              <div key={n} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "60px", height: "60px", background: "linear-gradient(135deg, #1428A0 0%, #F4511E 100%)", borderRadius: v }} />
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 500, color: "#B5BACE", margin: "0 0 2px" }}>{n}</p>
                  <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px", color: "#4A5170", margin: 0 }}>{v}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* SHADOWS */}
        <Section title="Shadows & Elevation">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "20px", marginBottom: "20px" }}>
            {[
              ["Flat",     "none"],
              ["Raised",   "0 1px 3px rgba(0,0,0,0.45)"],
              ["Floating", "0 4px 14px rgba(0,0,0,0.55)"],
              ["Overlay",  "0 8px 28px rgba(0,0,0,0.65)"],
              ["Modal",    "0 16px 48px rgba(0,0,0,0.75)"],
            ].map(([l, v]) => (
              <div key={l} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ height: "72px", borderRadius: "10px", background: "#1E2235", boxShadow: v, border: "1px solid rgba(255,255,255,0.05)" }} />
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 600, color: "#8C94B0", margin: 0 }}>{l}</p>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            {[
              ["Blue Glow",   "0 0 24px rgba(20,40,160,0.55), 0 4px 14px rgba(0,0,0,0.5)", "rgba(20,40,160,0.25)"],
              ["Orange Glow", "0 0 24px rgba(244,81,30,0.55), 0 4px 14px rgba(0,0,0,0.5)", "rgba(244,81,30,0.25)"],
              ["Brand Glow",  "0 0 32px rgba(20,40,160,0.35), 0 0 32px rgba(244,81,30,0.25)", "rgba(255,255,255,0.05)"],
            ].map(([l, sh, bg]) => (
              <div key={l} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ height: "72px", borderRadius: "10px", background: bg, boxShadow: sh, border: "1px solid rgba(255,255,255,0.08)" }} />
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 600, color: "#8C94B0", margin: 0 }}>{l}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* CSS TOKENS REFERENCE */}
        <Section title="CSS Custom Properties">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div style={card}>
              <p style={{ fontFamily: "'Sora', sans-serif", fontSize: "11px", fontWeight: 700, color: "#546BE8", margin: "0 0 14px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Color</p>
              {[
                ["--color-primary",          "#1428A0"],
                ["--color-primary-hover",    "#102288"],
                ["--color-primary-active",   "#0D1B70"],
                ["--color-accent",           "#F4511E"],
                ["--color-accent-hover",     "#D43D0C"],
                ["--color-accent-active",    "#A82E08"],
                ["--color-surface",          "#070910"],
                ["--color-surface-raised",   "#0D1020"],
                ["--color-surface-overlay",  "#1E2235"],
                ["--color-border",           "rgba(255,255,255,0.08)"],
                ["--color-border-strong",    "rgba(255,255,255,0.16)"],
                ["--color-text-primary",     "#F7F8FC"],
                ["--color-text-secondary",   "#8C94B0"],
                ["--color-text-muted",       "#636B8A"],
              ].map(([t, v]) => <TokenRow key={t} token={t} value={v} />)}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={card}>
                <p style={{ fontFamily: "'Sora', sans-serif", fontSize: "11px", fontWeight: 700, color: "#F4511E", margin: "0 0 14px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Typography</p>
                {[
                  ["--font-display",        "'Sora', sans-serif"],
                  ["--font-body",           "'DM Sans', sans-serif"],
                  ["--font-mono",           "'DM Mono', monospace"],
                  ["--font-weight-regular", "400"],
                  ["--font-weight-medium",  "500"],
                  ["--font-weight-semibold","600"],
                  ["--font-weight-bold",    "700"],
                  ["--font-weight-black",   "800"],
                ].map(([t, v]) => <TokenRow key={t} token={t} value={v} />)}
              </div>

              <div style={card}>
                <p style={{ fontFamily: "'Sora', sans-serif", fontSize: "11px", fontWeight: 700, color: "#8C94B0", margin: "0 0 14px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Radius & Motion</p>
                {[
                  ["--radius-sm",    "4px"],
                  ["--radius-md",    "6px"],
                  ["--radius-lg",    "8px"],
                  ["--radius-xl",    "12px"],
                  ["--radius-2xl",   "16px"],
                  ["--duration-fast","100ms"],
                  ["--duration-base","200ms"],
                  ["--duration-slow","400ms"],
                  ["--ease-out",     "cubic-bezier(0,0,0.2,1)"],
                  ["--ease-spring",  "cubic-bezier(0.34,1.56,0.64,1)"],
                ].map(([t, v]) => <TokenRow key={t} token={t} value={v} />)}
              </div>
            </div>
          </div>
        </Section>

        {/* COMPONENT SHOWCASE */}
        <Section title="Component Showcase">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

            {/* Buttons */}
            <div style={card}>
              <p style={{ fontFamily: "'Sora', sans-serif", fontSize: "10px", fontWeight: 700, color: "#4A5170", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 20px" }}>Buttons</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {[
                  { label: "Primary",        bg: "#1428A0",       color: "white",   border: "none" },
                  { label: "Accent",         bg: "#F4511E",       color: "white",   border: "none" },
                  { label: "Brand Gradient", bg: "linear-gradient(135deg, #1428A0, #F4511E)", color: "white", border: "none" },
                  { label: "Outline Blue",   bg: "transparent",   color: "#546BE8", border: "1px solid #1428A0" },
                  { label: "Outline Orange", bg: "transparent",   color: "#F4511E", border: "1px solid #F4511E" },
                  { label: "Ghost",          bg: "rgba(20,40,160,0.1)", color: "#546BE8", border: "1px solid rgba(20,40,160,0.25)" },
                  { label: "Destructive",    bg: "#DC2626",       color: "white",   border: "none" },
                  { label: "Neutral",        bg: "#1E2235",       color: "#B5BACE", border: "1px solid rgba(255,255,255,0.08)" },
                ].map((b) => (
                  <button key={b.label} style={{ padding: "9px 18px", borderRadius: "8px", background: b.bg, color: b.color, border: b.border, fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Badges */}
            <div style={card}>
              <p style={{ fontFamily: "'Sora', sans-serif", fontSize: "10px", fontWeight: 700, color: "#4A5170", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 20px" }}>Badges & Tags</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {[
                  { label: "Live",     bg: "#1428A0",                                            color: "white",   border: "none" },
                  { label: "Gradient", bg: "linear-gradient(135deg, #1428A0, #F4511E)",           color: "white",   border: "none" },
                  { label: "New",      bg: "#F4511E",                                            color: "white",   border: "none" },
                  { label: "Active",   bg: "rgba(22,163,74,0.15)",   color: "#16A34A", border: "1px solid rgba(22,163,74,0.3)" },
                  { label: "Pending",  bg: "rgba(217,119,6,0.15)",   color: "#D97706", border: "1px solid rgba(217,119,6,0.3)" },
                  { label: "Error",    bg: "rgba(220,38,38,0.15)",   color: "#DC2626", border: "1px solid rgba(220,38,38,0.3)" },
                  { label: "Premium",  bg: "rgba(20,40,160,0.15)",   color: "#546BE8", border: "1px solid rgba(20,40,160,0.3)" },
                  { label: "Beta",     bg: "rgba(244,81,30,0.15)",   color: "#F4511E", border: "1px solid rgba(244,81,30,0.3)" },
                  { label: "Draft",    bg: "transparent",             color: "#636B8A", border: "1px solid rgba(255,255,255,0.1)" },
                ].map((b) => (
                  <span key={b.label} style={{ padding: "4px 12px", borderRadius: "100px", background: b.bg, color: b.color, border: b.border, fontFamily: "'DM Sans', sans-serif", fontSize: "12px", fontWeight: 600, letterSpacing: "0.02em" }}>
                    {b.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Cards */}
            <div style={card}>
              <p style={{ fontFamily: "'Sora', sans-serif", fontSize: "10px", fontWeight: 700, color: "#4A5170", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 20px" }}>Card Surfaces</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { label: "Default Surface",  subtitle: "--color-surface-overlay",  bg: "#1E2235", border: "rgba(255,255,255,0.06)", shadow: "none" },
                  { label: "Glass Brand",      subtitle: "--gradient-glass-brand",   bg: "linear-gradient(135deg, rgba(20,40,160,0.13) 0%, rgba(244,81,30,0.07) 100%)", border: "rgba(20,40,160,0.25)", shadow: "none" },
                  { label: "Blue Glow Border", subtitle: "--shadow-glow-blue",       bg: "#0D1020", border: "rgba(20,40,160,0.45)", shadow: "0 0 20px rgba(20,40,160,0.22)" },
                  { label: "Orange Glow",      subtitle: "--shadow-glow-orange",     bg: "#0D1020", border: "rgba(244,81,30,0.4)",  shadow: "0 0 20px rgba(244,81,30,0.2)" },
                ].map((c) => (
                  <div key={c.label} style={{ padding: "14px 16px", borderRadius: "10px", background: c.bg, border: `1px solid ${c.border}`, boxShadow: c.shadow }}>
                    <p style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: "13px", color: "white", margin: "0 0 2px" }}>{c.label}</p>
                    <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", color: "#4A5170", margin: 0 }}>{c.subtitle}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Inputs + Progress */}
            <div style={card}>
              <p style={{ fontFamily: "'Sora', sans-serif", fontSize: "10px", fontWeight: 700, color: "#4A5170", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 20px" }}>Inputs & Progress</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 500, color: "#8C94B0", marginBottom: "6px" }}>Default</label>
                  <input type="text" placeholder="Search portals…" readOnly style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", background: "#1E2235", border: "1px solid rgba(255,255,255,0.09)", color: "#8C94B0", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", outline: "none", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 500, color: "#8C94B0", marginBottom: "6px" }}>Focus (blue ring)</label>
                  <input type="text" defaultValue="admin@portal.com" readOnly style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", background: "#1E2235", border: "1px solid #1428A0", color: "white", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", outline: "none", boxShadow: "0 0 0 3px rgba(20,40,160,0.22)", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 500, color: "#8C94B0", marginBottom: "6px" }}>Error (orange ring)</label>
                  <input type="text" defaultValue="invalid-email" readOnly style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", background: "#1E2235", border: "1px solid #F4511E", color: "white", fontFamily: "'DM Sans', sans-serif", fontSize: "13px", outline: "none", boxShadow: "0 0 0 3px rgba(244,81,30,0.22)", boxSizing: "border-box" }} />
                </div>
                {[
                  { label: "Brand", pct: "72%", bar: "linear-gradient(90deg, #1428A0, #F4511E)", text: "#546BE8" },
                  { label: "Primary", pct: "45%", bar: "#1428A0", text: "#546BE8" },
                  { label: "Accent", pct: "88%", bar: "#F4511E", text: "#F4511E" },
                ].map((p) => (
                  <div key={p.label}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#8C94B0" }}>{p.label}</span>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "11px", color: p.text }}>{p.pct}</span>
                    </div>
                    <div style={{ height: "6px", borderRadius: "100px", background: "#1E2235", overflow: "hidden" }}>
                      <div style={{ width: p.pct, height: "100%", background: p.bar, borderRadius: "100px" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div style={{ marginTop: "16px", padding: "32px", borderRadius: "14px", background: "linear-gradient(135deg, rgba(20,40,160,0.13) 0%, rgba(244,81,30,0.07) 100%)", border: "1px solid rgba(20,40,160,0.22)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>
            {[
              { label: "Active Portals", value: "24",   delta: "+3 this week",    color: "#546BE8" },
              { label: "Total Users",    value: "12.4K", delta: "+8.2% growth",   color: "#F4511E" },
              { label: "Uptime SLA",     value: "99.9%", delta: "+0.1% vs target",color: "#16A34A" },
              { label: "API Requests",   value: "2.1M",  delta: "+15% this month",color: "#D97706" },
            ].map((s) => (
              <div key={s.label}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "#636B8A", margin: "0 0 6px" }}>{s.label}</p>
                <p style={{ fontFamily: "'Sora', sans-serif", fontSize: "30px", fontWeight: 800, color: "white", margin: "0 0 4px", lineHeight: 1 }}>{s.value}</p>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", fontWeight: 600, color: s.color }}>{s.delta}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* CSS USAGE */}
        <Section title="Usage — Global CSS">
          <div style={card}>
            <pre style={{ fontFamily: "'DM Mono', monospace", fontSize: "12px", color: "#AAB5F7", background: "#070910", padding: "28px", borderRadius: "10px", border: "1px solid rgba(20,40,160,0.18)", overflow: "auto", lineHeight: 1.85, margin: 0 }}>{`:root {
  /* ── Brand ───────────────────────── */
  --color-primary:         #1428A0;
  --color-primary-hover:   #102288;
  --color-accent:          #F4511E;
  --color-accent-hover:    #D43D0C;

  /* ── Gradients ───────────────────── */
  --gradient-brand:        linear-gradient(135deg, #1428A0 0%, #F4511E 100%);
  --gradient-brand-rev:    linear-gradient(135deg, #F4511E 0%, #1428A0 100%);
  --gradient-brand-dark:   linear-gradient(135deg, #091455 0%, #521303 100%);
  --gradient-brand-subtle: linear-gradient(135deg, #EEF1FC 0%, #FFF1ED 100%);
  --gradient-glass:        linear-gradient(135deg, rgba(20,40,160,.13) 0%, rgba(244,81,30,.07) 100%);
  --gradient-mesh:         radial-gradient(ellipse at 20% 50%, rgba(20,40,160,.65) 0%, transparent 60%),
                           radial-gradient(ellipse at 80% 50%, rgba(244,81,30,.6)  0%, transparent 60%),
                           #070910;

  /* ── Surfaces (Dark Mode) ────────── */
  --color-surface:         #070910;
  --color-surface-raised:  #0D1020;
  --color-surface-overlay: #1E2235;
  --color-border:          rgba(255, 255, 255, 0.08);
  --color-border-strong:   rgba(255, 255, 255, 0.16);

  /* ── Text ───────────────────────── */
  --color-text-primary:    #F7F8FC;
  --color-text-secondary:  #8C94B0;
  --color-text-muted:      #636B8A;

  /* ── Typography ──────────────────── */
  --font-display:          'Sora', sans-serif;
  --font-body:             'DM Sans', sans-serif;
  --font-mono:             'DM Mono', monospace;

  /* ── Radius ──────────────────────── */
  --radius-sm:  4px;  --radius-md: 6px;  --radius-lg: 8px;
  --radius-xl:  12px; --radius-2xl: 16px; --radius-full: 9999px;

  /* ── Shadows ─────────────────────── */
  --shadow-glow-blue:   0 0 24px rgba(20,40,160,.55), 0 4px 14px rgba(0,0,0,.5);
  --shadow-glow-orange: 0 0 24px rgba(244,81,30,.55), 0 4px 14px rgba(0,0,0,.5);
  --shadow-glow-brand:  0 0 32px rgba(20,40,160,.35), 0 0 32px rgba(244,81,30,.25);

  /* ── Motion ──────────────────────── */
  --duration-fast:   100ms;
  --duration-base:   200ms;
  --duration-slow:   400ms;
  --ease-out:        cubic-bezier(0, 0, 0.2, 1);
  --ease-spring:     cubic-bezier(0.34, 1.56, 0.64, 1);
}`}</pre>
          </div>
        </Section>

      </div>

      {/* FOOTER */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "28px 64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "26px", height: "26px", borderRadius: "6px", background: "linear-gradient(135deg, #1428A0 0%, #F4511E 100%)" }} />
          <span style={{ fontFamily: "'Sora', sans-serif", fontSize: "12px", fontWeight: 600, color: "#343A56" }}>Signal & Flame Design System</span>
        </div>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", color: "#1E2235" }}>v1.0.0 · 2026</span>
      </div>
    </div>
  )
}

// ─── Storybook config ─────────────────────────────────────────────────────────

const meta: Meta = {
  title: "Design System/Signal & Flame",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Signal & Flame — design system built on Samsung TV Plus brand colors. Signal Blue (#1428A0) as primary, Flame Orange (#F4511E) as accent. Full token set for internal portals and client-facing products.",
      },
    },
  },
}

export default meta
type Story = StoryObj

export const Tokens: Story = {
  name: "Design Tokens",
  render: () => <DesignSystemPage />,
}
