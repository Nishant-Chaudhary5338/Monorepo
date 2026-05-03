/**
 * PreziDemo — Showcases the spatial canvas with the new path-based API.
 *
 * Each slide is a <Frame> at a canvas position. The `path` prop drives
 * the camera through them in order. Press → / Space to advance, ← to go
 * back, O for overview, F for fullscreen.
 */

import "@repo/present/styles";
import { PreziCanvas, Frame, usePreziCanvas } from "@repo/present/ui";
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

// ─── Canvas layout ─────────────────────────────────────────────────────────
const W = 1280;
const H = 720;
// Large gaps create the spatial canvas feel — camera zooms way out between frames
const GAP_X = 3200;   // horizontal gap between frames (~2.5× frame width)
const GAP_Y = 2200;   // vertical gap between rows (~3× frame height)

// 11 frames in a 4-4-3 grid, last row centered
const LAYOUT = [
  // Row 1
  { id: "title",          x: 0,              y: 0 },
  { id: "problem",        x: GAP_X,          y: 0 },
  { id: "monorepo",       x: GAP_X * 2,      y: 0 },
  { id: "packages",       x: GAP_X * 3,      y: 0 },
  // Row 2
  { id: "apps-layer",     x: 0,              y: GAP_Y },
  { id: "turborepo",      x: GAP_X,          y: GAP_Y },
  { id: "mcp-tools",      x: GAP_X * 2,      y: GAP_Y },
  { id: "workflow",       x: GAP_X * 3,      y: GAP_Y },
  // Row 3 (3 centered)
  { id: "results",        x: GAP_X * 0.5,   y: GAP_Y * 2 },
  { id: "roi",            x: GAP_X * 1.5,   y: GAP_Y * 2 },
  { id: "cta",            x: GAP_X * 2.5,   y: GAP_Y * 2 },
] as const;

const SLIDE_COMPONENTS = [
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
];

const LABELS = [
  "Title",
  "The Problem",
  "Monorepo",
  "Shared Packages",
  "Apps Layer",
  "Turborepo",
  "MCP Tools",
  "Workflow",
  "Results",
  "ROI",
  "Call to Action",
];

const PATH = LAYOUT.map((f) => f.id);

// ─── Canvas decoration: section blobs + connector paths ────────────────────
const CENTERS = LAYOUT.map(({ x, y }) => ({ cx: x + W / 2, cy: y + H / 2 }));

// Soft territorial blobs behind each row
const CLUSTER_BLOBS = [
  { cx: 5440, cy: 360,  r: 5200, color: "rgba(99,102,241,0.045)" },  // row 1 — indigo
  { cx: 5440, cy: 2560, r: 5200, color: "rgba(139,92,246,0.04)"  },  // row 2 — violet
  { cx: 5440, cy: 4760, r: 4500, color: "rgba(6,182,212,0.035)"  },  // row 3 — teal
];

function makeBezier(
  a: { cx: number; cy: number },
  b: { cx: number; cy: number },
): string {
  const dx = b.cx - a.cx;
  // S-curve: control points bend vertically toward target row
  return `M ${a.cx} ${a.cy} C ${a.cx + dx * 0.5} ${a.cy}, ${a.cx + dx * 0.5} ${b.cy}, ${b.cx} ${b.cy}`;
}

function CanvasDecor() {
  const { pathIndex } = usePreziCanvas();

  return (
    <>
      {/* Section territorial blobs */}
      {CLUSTER_BLOBS.map((blob, i) => (
        <div
          key={i}
          style={{
            position:     "absolute",
            left:         blob.cx - blob.r,
            top:          blob.cy - blob.r,
            width:        blob.r * 2,
            height:       blob.r * 2,
            borderRadius: "50%",
            background:   `radial-gradient(circle, ${blob.color} 0%, transparent 65%)`,
            pointerEvents:"none",
            zIndex:       0,
          }}
        />
      ))}

      {/* SVG connector paths */}
      <svg
        style={{
          position:     "absolute",
          left:         0,
          top:          0,
          overflow:     "visible",
          pointerEvents:"none",
          zIndex:       1,
          width:        0,
          height:       0,
        }}
      >
        <defs>
          <filter id="prezi-path-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {CENTERS.map((c, i) => {
          if (i === 0) return null;
          const prev     = CENTERS[i - 1]!;
          const traveled = i <= pathIndex;
          const d        = makeBezier(prev, c);
          return (
            <g key={i}>
              {/* Dim dashed baseline — entire path */}
              <path
                d={d}
                stroke="rgba(99,102,241,0.12)"
                strokeWidth={1.5}
                fill="none"
                strokeDasharray="10 20"
              />
              {/* Glowing solid overlay — only traveled segments */}
              {traveled && (
                <path
                  d={d}
                  stroke="rgba(120,130,255,0.55)"
                  strokeWidth={2.5}
                  fill="none"
                  filter="url(#prezi-path-glow)"
                />
              )}
            </g>
          );
        })}

        {/* Node dots at each frame center */}
        {CENTERS.map((c, i) => {
          const reached = i <= pathIndex;
          return (
            <circle
              key={i}
              cx={c.cx}
              cy={c.cy}
              r={reached ? 6 : 4}
              fill={reached ? "rgba(99,102,241,0.7)" : "rgba(255,255,255,0.10)"}
              filter={reached ? "url(#prezi-path-glow)" : undefined}
            />
          );
        })}
      </svg>
    </>
  );
}

export default function PreziDemo() {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <PreziCanvas path={PATH} showNav>
        <CanvasDecor />
        {LAYOUT.map(({ id, x, y }, i) => {
          const SlideComponent = SLIDE_COMPONENTS[i];
          if (!SlideComponent) return null;
          return (
            <Frame
              key={id}
              id={id}
              x={x}
              y={y}
              width={W}
              height={H}
              label={LABELS[i]}
            >
              <SlideComponent />
            </Frame>
          );
        })}
      </PreziCanvas>
    </div>
  );
}
