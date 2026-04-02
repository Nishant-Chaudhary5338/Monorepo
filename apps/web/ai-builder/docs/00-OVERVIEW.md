# AI Frontend Builder — Project Overview

> **One-line pitch:** Type a prompt → get a fully editable, drag/drop/resize UI — not a chat response, an actual running interface.

---

## What This Is

An AI-powered frontend builder that lives inside the monorepo as `apps/web/ai-builder`.

The user types a natural language prompt. A local LLM (Ollama + llama3.2:3b) generates a `DashboardSchema` JSON. That JSON is rendered as live, editable React components powered by `@repo/dashcraft`. The user can then drag, resize, delete, and reconfigure widgets — or type a follow-up prompt to patch only the changed parts via a diff system.

**This is NOT a chat UI. It is a system generator.**

---

## Key Differentiators

| Feature | How |
|---|---|
| Prompt → real UI | Ollama generates `DashboardSchema` JSON, rendered by dashcraft |
| Drag/drop/resize after generation | `@repo/dashcraft` `DashboardCard` handles it natively |
| Edit JSON manually + UI sync | Monaco editor ↔ Zustand store bidirectional sync |
| Versioning (v1, v2, v3...) | Snapshot store → `Version[]`, switchable |
| Prompt → diff update | AI receives current schema + prompt → returns `DiffPatch[]` only |
| Export to React code | MCP tools read schema, generate JSX with `@repo/ui` imports |
| Export to JSON config | Download raw `DashboardSchema` |

---

## Monorepo Context

- **Location:** `apps/web/ai-builder`
- **Package name:** `ai-builder`
- **Port:** `5174` (to avoid conflict with web-app-1 on 5173)
- **Package manager:** pnpm@8.15.6
- **Turborepo:** uses same `build`/`dev` pipeline

### Key packages consumed

| Package | What it provides |
|---|---|
| `@repo/dashcraft` | Canvas engine — drag, resize, delete, settings, persistence, Zustand store |
| `@repo/ui` | 41 shadcn/ui components rendered inside dashcraft widgets |
| `@repo/router` | Routing (optional for builder, but available) |
| `@repo/tailwind-config` | Shared Tailwind tokens, CSS variables, dark mode |

---

## What We Are NOT Building

- No backend / API server (v1 is entirely client-side)
- No auth system
- No custom drag/drop engine (dashcraft handles it)
- No pixel-perfect Figma-like canvas (panel-based layout, not absolute coordinates)
- No cloud sync (v1 localStorage only; server sync interface defined but not implemented)

---

## Docs Index

| File | Contents |
|---|---|
| `00-OVERVIEW.md` | This file — project summary and context |
| `01-ARCHITECTURE.md` | Full system architecture, data flow, component tree |
| `02-TECH-STACK.md` | Every library, why it was chosen, version pins |
| `03-SCHEMA-DESIGN.md` | `DashboardSchema`, `DiffPatch`, `Version` type definitions |
| `04-AI-LAYER.md` | Ollama setup, system prompts, diff strategy, llama3.2:3b constraints |
| `05-DASHCRAFT-INTEGRATION.md` | How dashcraft is used, `DashboardFromSchema`, `WidgetRenderer` |
| `06-UI-LAYOUT.md` | Panel layout, component hierarchy, panel responsibilities |
| `07-DEV-PHASES.md` | Phase-by-phase implementation plan with file checklists |
| `08-EXPORT-MCP.md` | Export strategy, MCP tool integration, code generation plan |
