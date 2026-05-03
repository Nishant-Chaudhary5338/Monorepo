---
title: "Building shared-packages/ui: A Shared Component Library for a React Monorepo"
description: "45 components, solo-built with no designer. How I created the shared UI foundation every team adopts when joining our React monorepo."
slug: "ui-component-library"
date: "2026-05-03"
lastUpdated: "2026-05-03"
author: "Nishant Chaudhary"
authorBio: "Nishant Chaudhary is a frontend engineer who built shared-packages/ui — a 45-component shared library used as the UI standard across a React monorepo."
tags: ["react", "typescript", "component-library", "design-system", "monorepo"]
---

# Building shared-packages/ui: A Shared Component Library for a React Monorepo

Before the monorepo, every team lived in its own separate repository. Separate installs, separate component libraries, separate opinions about how a button should look or a modal should close. The codebase wasn't messy in the classic sense — each repo was internally coherent. The mess was at the seams: identical problems solved five different ways, no shared accessibility baseline, no shared dark mode story, and no way to move engineers between teams without a week of orientation into a new UI toolkit.

When the company started migrating to a React monorepo, someone had to build the shared UI foundation every team would adopt as their baseline. That was me. Solo, no designer.

> **Key Takeaways**
> - I built `shared-packages/ui` solo, with no designer, as the shared UI foundation for a company-wide React monorepo migration.
> - 45 components, 79 test files, and 47 Storybook stories cover the full breadth teams need to ship CRUD dashboards.
> - A TypeScript module augmentation pattern keeps RBAC co-located with column definitions, eliminating scattered role-checking logic.
> - Teams joining the monorepo ship complete CRUD dashboards in days, not weeks, writing only business logic.
> - The library is structured for AI coding tools from the ground up — `CLAUDE.md` component maps, JSDoc `@example` blocks on every public component.

[IMAGE: A diagram showing multiple disconnected app repositories converging into a single monorepo with a shared UI package at the center - monorepo architecture diagram React]

## Why Every Shared Library Fails (and What I Did Differently)

Shared component libraries fail in a specific, predictable way. Teams adopt them, hit a limitation, fork the component into their own app, and the library slowly becomes irrelevant. Within a year it's a vestigial dependency that nobody trusts but nobody removes.

The failure mode isn't a missing component. It's a missing extension model.

If a team can't customize a component without forking it, they'll fork it. If the styling system is opaque, they'll override it with `!important`. If the type system doesn't account for their data shape, they'll cast to `any`. I'd watched this happen with external libraries across those separate repos. Building `shared-packages/ui` meant solving the extension problem first, before writing a single component.

[INTERNAL-LINK: accessibility patterns in shared component libraries → component architecture article]

The answer came down to three choices: Radix UI for the accessibility layer, Class Variance Authority (CVA) for the variant system, and a token architecture that exposed everything as CSS custom properties. These three together meant teams could restyle, re-variant, and re-compose without touching the library source.

## The Stack and Why Each Piece Earned Its Place

I'm deliberate about dependencies. Every package in `shared-packages/ui` has a clear job and no overlap with another package's job.

**Radix UI** handles the hard accessibility primitives: focus traps, keyboard navigation, ARIA attributes, portal management. I didn't want to re-implement focus trapping for modals or roving tab index for a command palette. Radix has spent years on these edge cases. I built on top.

**Class Variance Authority (CVA)** makes variant systems type-safe. When a `Button` has `variant`, `size`, and `intent` props, CVA generates the TypeScript types from the configuration object. The component API and the style config stay in sync by construction, not by discipline.

**Tailwind CSS v4** handles the visual layer. The `@theme inline` block is the piece that made a real design token system possible without a separate CSS-in-JS runtime.

**TanStack Table v8** drives `DataTable`. It's a headless library, so I own 100% of the rendering — but I inherit years of work on sorting, filtering, pagination, and column management. The RBAC story I'll cover shortly wouldn't have been possible with a "batteries included" table component.

**tsup** outputs both ESM and CJS, with proper tree-shaking. Teams can import a single component and not pull in the rest of the library.

[CHART: Bar chart - Component category breakdown: Forms (8), Data Display (7), Overlay (6), Navigation (5), Layout (5), Feedback (5), Inputs (5), Other (9) - shared-packages/ui internal audit]

## Building a Design Token System With No Figma

No designer meant I owned the visual language. That could have been a liability. In practice, it became a kind of freedom.

The token system is built on CSS custom properties, mapped into Tailwind's `@theme inline` block. Every semantic decision is explicit in the file: a 12-step color scale for both primary and neutral palettes, semantic tokens for backgrounds, foregrounds, and borders, a full z-index scale (`--z-base`, `--z-dropdown`, `--z-sticky`, `--z-fixed`, `--z-modal`, `--z-popover`, `--z-tooltip`, `--z-notification`), animation duration and easing tokens, and layout constants like `--header-height`, `--sidebar-width`, and `--content-max-width`.

The file runs to roughly 793 lines. Every token in it is referenced somewhere in a component.

Dark mode is a `:root.dark` override — complete, not partial. Every semantic token has a dark-mode value. Adding dark mode to the whole library took one day, because the token layer was already designed to support it. A consuming app gets dark mode by adding a class to `<html>`. No per-component work.

The constraint of no Figma was actually useful: decisions that live only in a design file drift from decisions in code. Here, the token file is the source of truth. There's nothing to drift from.

[INTERNAL-LINK: CSS custom properties and Tailwind v4 theming → Tailwind v4 deep-dive article]

[IMAGE: A code snippet showing the @theme inline token block with semantic color tokens and a dark mode override - design token system CSS variables]

## The Component Structure: Seven Files Per Component

Every component in the library ships as a seven-file unit. The discipline matters.

```
Button/
  Button.tsx          # component implementation
  Button.types.ts     # prop interfaces, variant types
  Button.styles.ts    # CVA variant configuration
  Button.test.tsx     # Vitest + Testing Library
  Button.stories.tsx  # Storybook story with autodoc
  Button.docs.md      # prose documentation
  index.ts            # barrel export
```

This structure makes the library scannable. A new engineer joining the monorepo can look at `Button.types.ts` to understand the API, `Button.styles.ts` to understand the variants, and `Button.docs.md` to understand the intended use cases. The Storybook autodoc pulls JSDoc `@example` blocks from `Button.tsx` automatically. Change a prop interface, the docs update — no separate maintenance step.

79 test files across 45 components means nearly two test files per component on average. Some components are simple enough to fit in one file. Components like `DataTable`, `AutoForm`, and `CommandPalette` have multiple test files covering distinct behaviors.

## The DataTable: Role-Based Access Control via TypeScript Module Augmentation

[ORIGINAL DATA]

The `DataTable` component ended up being the most technically demanding part of the library. 12 product teams means 12 different table requirements: sorting, filtering, pagination, row selection with bulk actions, column pinning, drag-to-reorder, column resizing, CSV export, server-side mode. I put all of it behind a `features` prop with 22+ opt-in capabilities.

The hard problem wasn't any individual feature. It was role-based column visibility and inline cell editing.

The naive approach — a `visible` flag and an `editable` flag per column — breaks the moment you have more than two roles. Role logic ends up scattered: some in the table component, some in the page component, some in an API middleware. Teams end up duplicating checks. A role changes name and you're grepping across three layers.

The solution was TypeScript module augmentation on TanStack Table's `ColumnMeta` generic:

```typescript
declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    roles?: string[]
    editRoles?: string[]
    editable?: boolean
    editType?: 'text' | 'number' | 'date' | 'select' | 'boolean' | 'textarea'
    validate?: (value: unknown) => string | undefined
    onCellSave?: (value: unknown, row: TData) => Promise<void>
  }
}
```

This extends TanStack's own type system without forking it. Column definitions now carry their access rules directly:

```typescript
const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'email',
    header: 'Email',
    meta: {
      roles: ['admin', 'editor', 'viewer'],
      editRoles: ['admin'],
      editable: true,
      editType: 'text',
      validate: (v) => (isValidEmail(v as string) ? undefined : 'Invalid email'),
      onCellSave: async (value, row) => updateUser(row.id, { email: value as string }),
    },
  },
]
```

A column visible to `admin`, `editor`, and `viewer` but editable only by `admin`, with its own validation and save callback, is a single object in the column definition array. Adding a new role is one line per column. Removing a permission is one line. The business rules are co-located with the UI structure, not distributed across the codebase.

The inline editing itself — double-click a cell, type, Tab or Enter to save, Escape to cancel — required careful attention to keyboard navigation and screen reader focus order. That last part took longer than the editing logic. It's the kind of thing that looks working until someone tabs into a cell with a keyboard and the focus jumps unexpectedly.

[INTERNAL-LINK: TanStack Table module augmentation pattern → data tables in TypeScript article]

[IMAGE: Screenshot of a DataTable component showing role-gated columns, inline cell editing, and bulk action toolbar - React DataTable RBAC component library]

## AutoForm: Schema-Driven Forms From a Zod Definition

[UNIQUE INSIGHT]

Most form libraries make you define your schema and your form separately. The schema handles validation. The form handles rendering. They agree on field names only through convention.

`AutoForm` collapses the two. Pass a Zod schema, get a rendered form with correct input types, labels, validation, and error messages. The mapping is introspected from the schema at runtime.

```typescript
const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(['admin', 'editor', 'viewer']),
  active: z.boolean().default(true),
})

<AutoForm schema={schema} onSubmit={handleSubmit} />
```

For internal tools — the primary use case across these 12 teams — most forms are CRUD forms where the schema already exists for API validation. `AutoForm` means that schema does double duty. You're not maintaining a separate form layout that has to stay in sync with your API types.

Teams can override individual fields via a `fieldConfig` prop when the default rendering isn't right. The common case is zero config; the escape hatch is always available.

## What Adoption Actually Looked Like

[PERSONAL EXPERIENCE]

When a new team joins the monorepo, `shared-packages/ui` is the first thing they install. It's not a suggestion — it's the onboarding baseline. Part of the reason that works is that the abstractions held under real conditions.

A complete CRUD dashboard — filterable and sortable data table, multi-step form with Zod validation, role-gated column visibility — went from started to in code review in a couple of days. Not because the team was fast, but because the library handled everything except the business logic. The form system took a Zod schema and rendered an accessible form. The DataTable took a column definition with RBAC metadata and handled the rest. The team wrote the API calls and the domain logic. That was it.

Across all four consuming apps, the library appears in hundreds of import locations. `Button`, `Card`, `Dialog`, `DataTable`, and `Form` dominate the usage count — exactly the components you'd expect to dominate. That distribution tells me the breadth is real, not cosmetic. Teams aren't reaching for the library for hero components and then writing their own buttons.

The forks I worried about never happened. Not one.

## Building for AI Coding Tools

I built `shared-packages/ui` knowing that the teams adopting it would use AI coding assistants heavily. That shaped how I wrote the documentation.

`CLAUDE.md` at the library root is a structured agentic reference: a component map table with every component, its purpose, and its key props; composition patterns with full working code examples (Form with Zod, DataTable with RBAC metadata, AutoForm from schema, CommandPalette integration, page layout composition); theming guidance; and explicit Do/Don't rules for the patterns teams most commonly get wrong.

JSDoc `@example` blocks on 20+ components get picked up by Storybook's autodoc automatically. Prop-level `@default` annotations appear in generated documentation without extra maintenance. When an AI coding tool scaffolds a form in this codebase, it generates library-idiomatic code — not generic React boilerplate — because the library's documentation is structured for programmatic consumption.

I also built MCP scaffolding tools that can generate a new component's seven-file structure from a spec. That's the practical version of AI-native design: not just documentation the AI can read, but tooling the AI can invoke.

The gap between what an AI tool knows generically and what it needs to know about a specific codebase closes from the library side. Structured documentation is the lever.

[INTERNAL-LINK: AI-native documentation patterns for component libraries → MCP tooling article]

## The Numbers

| Metric | Value |
|---|---|
| Components | 45 |
| Consuming apps in production | 4 |
| Product teams reached | ~12 |
| Storybook stories | 47 |
| Test files | 79 |
| DataTable opt-in features | 22+ |
| Design token lines | ~793 |

## What I'd Do Differently

The seven-file structure was the right call, but I'd formalize the generator earlier. I wrote the scaffolding tool after building a dozen components by hand. The first twelve components have slight inconsistencies in test style and documentation format because I was still deciding conventions. The generator enforces conventions by construction.

I'd also add visual regression testing earlier. Storybook Chromatic or a self-hosted alternative. The Vitest tests cover behavior, but I caught a handful of visual regressions through manual Storybook review that automated snapshots would have caught immediately.

The token system is solid, but 793 lines is a lot to read before you understand it. A better organized index — grouping by semantic purpose rather than property type — would reduce the time-to-orientation for a new team.

These are small corrections to a system that worked. The abstractions held. The library became the foundation it was supposed to be, not a source of forks and overrides.

---

*Nishant Chaudhary is a frontend engineer who built shared-packages/ui as the shared UI foundation for a company-wide React monorepo migration.*
