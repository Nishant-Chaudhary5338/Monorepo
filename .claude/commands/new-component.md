---
description: Scaffold a new @repo/ui component using the component-factory MCP tool. Usage: /project:new-component <ComponentName>
---

Scaffold a new component named **$ARGUMENTS** in `packages/ui/components/`.

Steps:
1. Use the `component-factory` MCP tool to generate the component scaffold for `$ARGUMENTS`
2. Ensure the generated files follow the co-location pattern: `$ARGUMENTS.tsx` + `$ARGUMENTS.test.tsx` + `$ARGUMENTS.types.ts`
3. Verify the component is exported from `packages/ui/src/index.ts`
4. Check it follows the engineering standards in CLAUDE.md: ≤ 300 lines, strict TypeScript, Radix + Tailwind, Zod props if needed
5. Generate a Storybook story using the `storybook-generator` MCP tool
6. Run `pnpm --filter @repo/ui build` to confirm the build passes

If no name is provided, ask for the component name before proceeding.
