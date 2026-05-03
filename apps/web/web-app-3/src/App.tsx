import { useState } from "react";
import SlideEngine from "./SlideEngine";
import PreziDemo from "./PreziDemo";
import {
  TitleSlide,
  ProblemSlide,
  MonorepoSlide,
  SharedPackagesSlide,
  AppsLayerSlide,
  TurborepoSlide,
  MCPToolsSlide,
  WorkflowSlide,
  ResultsSlide,
  ROISlide,
  CTASlide,
} from "./slides";
import "./presentation.css";

export default function App() {
  const [mode, setMode] = useState<"deck" | "prezi">("deck");

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
      {/* Mode toggle — only shown in deck mode; in Prezi mode press F for fullscreen */}
      <div
        style={{
          position:  "fixed",
          top:       12,
          left:      "50%",
          transform: "translateX(-50%)",
          zIndex:    9999,
          display:   "flex",
          background:"rgba(8,8,20,0.8)",
          border:    "1px solid rgba(255,255,255,0.08)",
          borderRadius: 99,
          padding:   3,
          backdropFilter: "blur(16px)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          // Hide toggle when in Prezi mode so it doesn't overlap the canvas
          opacity:    mode === "prezi" ? 0 : 1,
          pointerEvents: mode === "prezi" ? "none" : "auto",
          transition: "opacity 0.25s",
        }}
      >
        {(["deck", "prezi"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              padding:      "5px 16px",
              borderRadius: 99,
              border:       "none",
              fontSize:     11,
              fontWeight:   700,
              letterSpacing:"0.05em",
              textTransform:"uppercase",
              cursor:       "pointer",
              transition:   "all 200ms",
              background:   mode === m
                ? "linear-gradient(135deg, #7c3aed, #06b6d4)"
                : "transparent",
              color: mode === m ? "#fff" : "rgba(255,255,255,0.35)",
            }}
          >
            {m === "deck" ? "Deck" : "✦ Prezi"}
          </button>
        ))}
      </div>

      {/* In Prezi mode, show a small exit button top-right */}
      {mode === "prezi" && (
        <button
          onClick={() => setMode("deck")}
          title="Exit Prezi mode"
          style={{
            position:     "fixed",
            top:          14,
            right:        16,
            zIndex:       9999,
            background:   "rgba(8,8,20,0.8)",
            border:       "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            color:        "rgba(255,255,255,0.45)",
            cursor:       "pointer",
            padding:      "5px 10px",
            fontSize:     11,
            fontWeight:   600,
            letterSpacing:"0.05em",
            backdropFilter:"blur(12px)",
            display:      "flex",
            alignItems:   "center",
            gap:          4,
          }}
        >
          ✕ Exit
        </button>
      )}

      {mode === "deck" ? (
        <SlideEngine>
          <TitleSlide />
          <ProblemSlide />
          <MonorepoSlide />
          <SharedPackagesSlide />
          <AppsLayerSlide />
          <TurborepoSlide />
          <MCPToolsSlide />
          <WorkflowSlide />
          <ResultsSlide />
          <ROISlide />
          <CTASlide />
        </SlideEngine>
      ) : (
        /* Prezi mode: full viewport, no chrome overhead */
        <div style={{ position: "absolute", inset: 0 }}>
          <PreziDemo />
        </div>
      )}
    </div>
  );
}
