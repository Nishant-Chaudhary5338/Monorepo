---
description: Run typescript-enforcer MCP tool to scan and fix TypeScript violations in a target path. Usage: /project:fix-types <path>
---

Scan and fix TypeScript violations in **$ARGUMENTS** using the `typescript-enforcer` MCP tool.

Steps:
1. Run the `typescript-enforcer` MCP tool with `scan_directory` on the target path `$ARGUMENTS`
2. Review violations grouped by severity (error → warning → info)
3. Fix all `error`-level violations immediately using Edit tools
4. Fix `warning`-level violations that relate to: `any` usage, missing return types, untyped props
5. After fixes, run `npx tsc --noEmit` in the relevant package to confirm zero TS errors
6. For `web-app-4` (CRA): treat it as read-only — report issues but do not auto-fix

If no path is given, default to scanning `packages/ui/components`.
