
# Shared UI Component Library

## The problem

Every product team across a multi-team platform was solving the same UI problems independently. Forms with validation. Data tables with filtering and sorting. Modals, toasts, role-gated interfaces. The solutions diverged — different accessibility patterns, different visual treatment of the same interaction, no shared dark mode story. Each new team started from scratch.

The fix was a shared component library. But shared libraries fail in a specific, predictable way: teams adopt them, hit a limitation, fork the component locally, and the library slowly becomes irrelevant. Building something a dozen teams would actually use — *without those forks* — meant getting the design system, the component API, and the extension model right simultaneously.

I owned all of it, solo. No designer.

## What I built

A 45-component React library serving ~12 product teams across 4 production apps with hundreds of import locations across consumers. Radix UI primitives for the accessibility foundation. Tailwind CSS v4 with a custom design token system. Class Variance Authority for type-safe style variants. TanStack Table v8 for the data layer. tsup for dual ESM/CJS output with tree-shaking.

Every component ships with a Vitest test suite (79 test files), a Storybook story (47 stories total, autodoc via `react-docgen-typescript`), and a companion `.docs.md` file. The Storybook configuration extracts JSDoc `@example` blocks from source automatically — change a prop interface, the docs update.

## The design token system

No design team. I owned the visual language entirely.

The token system is built on CSS custom properties mapped to Tailwind's `@theme inline` block. Every decision is codified: a 12-step color scale for both brand colors, semantic tokens for backgrounds/foregrounds/borders, a full z-index scale (base → dropdown → sticky → fixed → modal → popover → tooltip → notification), animation duration and easing tokens, and layout constants (`--header-height`, `--sidebar-width`, `--content-max-width`).

Dark mode is a full `:root.dark` override — not a half-implementation. Every semantic token has a dark-mode value.

The token file is the single source of truth. No Figma sync, no export scripts. Tokens live in code and are versioned with the library. The constraint of not having a designer turned out to be a feature: every visual decision had to be defensible from first principles, and decisions in code don't drift from decisions in Figma — there's no Figma.

## The DataTable: where the abstractions earned their keep

A dozen teams means a dozen different table requirements. Sorting. Filtering. Pagination. Row selection with bulk actions. Column pinning. Drag-to-reorder columns. Column resizing. CSV export. Server-side mode.

I built all of this into a single `<DataTable>` with 22+ opt-in features via a `features` prop. The hard part wasn't any individual feature — it was role-based access control.

Different user roles needed to see different columns. Different roles needed to edit different cells. The naive approach (a `visible` flag + an `editable` flag on each column) breaks the moment you have more than two roles, because the role logic ends up scattered across the table component, the page component, and the API layer.

The solution was TypeScript module augmentation on TanStack Table's `ColumnMeta` generic:

```typescript
declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    roles?: string[]        // roles that can view this column
    editRoles?: string[]    // roles that can edit this column
    editable?: boolean
    editType?: 'text' | 'number' | 'date' | 'select' | 'boolean' | 'textarea'
    validate?: (value: unknown) => string | undefined
    onCellSave?: (value: unknown, row: TData) => Promise<void>
  }
}
```

RBAC config lives co-located with column definitions — not in a separate role-checking middleware, not in a context provider, not in the page component. The table reads it and applies it. A column that's visible to `admin` and `editor` but not `viewer`, editable only by `admin`, with per-column validation and a save callback, is a single object. Adding a new role is one line per column.

The inline editing system (double-click any cell, type, Tab/Enter to save, Escape to cancel) works correctly with keyboard navigation and doesn't break screen reader focus order. That last property is non-negotiable for an internal tool used by accessibility-conscious teams; it took longer to get right than the editing logic itself.

## Adoption: what teams actually built

Teams shipped quickly because the abstractions held. A complete CRUD dashboard — filterable data table, multi-step form, role-gated column visibility — went from "started" to "in review" in a couple of days. The form system (React Hook Form + Zod + accessible field composition via the slot pattern) handled validation and error states. The DataTable handled display, filtering, and editing. The team wrote business logic; the library handled everything else.

A monitoring team shipped a new analytics view in under a week. Another team had a complete new product surface running with the library providing the entire UI layer. Across all 4 consuming apps, the library is imported in hundreds of places, with `Button`, `Card`, `Dialog`, `DataTable`, and `Form` dominating the usage — exactly the components you'd expect to dominate, which means the breadth of the library is a real backstop, not a cosmetic claim.

## AI-native design

The library was built to be AI-coding-tool-friendly from the start. `CLAUDE.md` at the library root is a comprehensive agentic reference: a component map table (every component, its purpose, its key props), composition patterns with full code examples (Form + Zod, DataTable with RBAC, AutoForm from schema, Command Palette, Page Layout), theming section, and explicit Do/Don't rules.

JSDoc `@example` blocks on 20+ components are consumed automatically by Storybook's autodoc. Prop-level `@default` annotations appear in generated docs without extra work. When an AI coding tool scaffolds a form or a table in this codebase, it generates team-idiomatic code — not generic React — because the library's documentation is structured for programmatic consumption.

This is the next frontier for component libraries: not just human-readable docs, but documentation structured so that the AI coding tools every consuming team uses can read and apply the library's conventions. The team-vs-individual gap in AI tooling closes from the *library* side, not the prompt side.

## Numbers

| Metric | Value |
|--------|-------|
| Components | 45 |
| Consuming apps in production | 4 |
| Product teams reached | ~12 |
| Storybook stories | 47 |
| Test files | 79 |
| DataTable opt-in features | 22+ |
| Design token lines | ~793 |

## What kept the library from fragmenting

The abstractions earned their keep. A single DataTable that holds a dozen different team requirements. A token layer thin enough that dark mode took a day to add. A composition surface so that the rare case where a team needed something custom, they composed it from primitives instead of forking the component. Documentation structured to be read by both humans and AI tools.

The forks I worried about never happened.
