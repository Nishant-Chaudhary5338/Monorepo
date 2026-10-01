import { useState } from "react";
import type { Compiled } from "./ContentPage";

interface TocProps {
  toc: Compiled["toc"];
  activeId: string;
}

export const MobileToc = ({ toc, activeId }: TocProps) => {
  const [open, setOpen] = useState(false);
  if (toc.length === 0) return null;
  return (
    <div style={{ marginBottom: "2rem" }} className="xl:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        style={{ fontFamily: "var(--font-mono)", fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--fg-muted)", background: "var(--surface)", border: "1px solid var(--border-strong)", padding: "0.55rem 1rem", cursor: "pointer", width: "100%", textAlign: "left", display: "flex", justifyContent: "space-between" }}
      >
        <span>Contents ({toc.length})</span>
        <span style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none", display: "inline-block" }}>▾</span>
      </button>
      {open && (
        <div style={{ border: "1px solid var(--border-strong)", borderTop: "none", background: "var(--surface)", padding: "1rem 1.2rem" }}>
          {toc.map((entry) => (
            <a key={entry.id} href={`#${entry.id}`} onClick={() => setOpen(false)}
              style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: entry.level === 3 ? "0.72rem" : "0.76rem", color: activeId === entry.id ? "var(--accent)" : "var(--fg-muted)", textDecoration: "none", padding: "0.35rem 0", paddingLeft: entry.level === 3 ? "1rem" : "0", transition: "color 0.2s" }}
            >
              {entry.text}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export const SidebarToc = ({ toc, activeId }: TocProps) => {
  if (toc.length === 0) return null;
  return (
    <aside className="hidden xl:block" style={{ position: "sticky", top: "5rem", maxHeight: "calc(100vh - 8rem)", overflowY: "auto" }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--fg-muted)", marginBottom: "1rem" }}>
        Contents
      </div>
      {toc.map((entry) => {
        const active = activeId === entry.id;
        return (
          <a
            key={entry.id}
            href={`#${entry.id}`}
            style={{
              display: "block",
              fontFamily: "var(--font-mono)",
              fontSize: entry.level === 3 ? "0.71rem" : "0.75rem",
              color: active ? "var(--accent)" : "var(--fg-muted)",
              textDecoration: "none",
              padding: "0.3rem 0 0.3rem 0.6rem",
              paddingLeft: entry.level === 3 ? "1.2rem" : "0.6rem",
              borderLeft: `2px solid ${active ? "var(--accent)" : "var(--border)"}`,
              transition: "color 0.2s, border-color 0.2s",
              lineHeight: 1.45,
            }}
            onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = "var(--fg)"; }}
            onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = "var(--fg-muted)"; }}
          >
            {entry.text}
          </a>
        );
      })}
    </aside>
  );
};
