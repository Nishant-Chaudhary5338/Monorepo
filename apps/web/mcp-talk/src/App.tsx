import SlideEngine from "./SlideEngine";
import {
  TitleSlide,
  WhatIsMCP,
  HowItWorks,
  ThreePlayers,
  MCPServer,
  ToolsCallFlow,
  BuiltWith,
  ToolsOverview,
  ToolsDetail,
  GetStarted,
} from "./slides";

export default function App() {
  return (
    <SlideEngine>
      {/* 1 — Title */}
      <TitleSlide />
      {/* 2 — The problem MCP solves */}
      <WhatIsMCP />
      {/* 3 — High-level 4-step flow */}
      <HowItWorks />
      {/* 4 — Host / Client / Server */}
      <ThreePlayers />
      {/* 5 — What an MCP server is */}
      <MCPServer />
      {/* 6 — tools/list → decide → tools/call → result */}
      <ToolsCallFlow />
      {/* 7 — Open source stack it's built on */}
      <BuiltWith />
      {/* 8 — 9 custom tools overview */}
      <ToolsOverview />
      {/* 9 — What each tool actually does */}
      <ToolsDetail />
      {/* 10 — Interactive setup / get started */}
      <GetStarted />
    </SlideEngine>
  );
}
