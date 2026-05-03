---
description: Audit a component for TypeScript errors, test coverage gaps, and accessibility issues. Usage: /project:review-component <path>
---

Audit the component at **$ARGUMENTS** across three dimensions.

Steps:
1. **TypeScript** — Run `component-reviewer` MCP tool on `$ARGUMENTS`. List all type errors, missing return types, and `any` usages.
2. **Test coverage** — Run `test-gap-analyzer` MCP tool. Identify untested branches, missing edge cases, missing error states.
3. **Accessibility** — Run `accessibility-checker` MCP tool. Flag WCAG violations: missing aria labels, keyboard trap, colour contrast, focus management.
4. Produce a prioritised fix list:
   - 🔴 Critical (breaks functionality or a11y)
   - 🟡 Important (type safety, test coverage)
   - 🟢 Nice-to-have (style, minor improvements)
5. Ask before auto-fixing — show the list first, then apply fixes only on confirmation.

If no path is provided, ask for the target before proceeding.
