# Export & MCP Integration

---

## Export Strategy

There are two export outputs:

| Output | How | When to use |
|---|---|---|
| JSON config | `JSON.stringify(schema)` download | Share schema, import into another builder session |
| React code | MCP tool → AI-assisted codegen | Production-ready component file with proper imports |

---

## JSON Export (simple)

```typescript
// lib/exportJson.ts

export function downloadSchema(schema: AIDashboardSchema, versionId: string) {
  const json = JSON.stringify(schema, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `ai-builder-${versionId}.json`
  a.click()
  URL.revokeObjectURL(url)
}
```

---

## React Code Export via MCP

When the user clicks "Export via MCP", the app:
1. Writes the current `AIDashboardSchema` to a temp file: `ai-builder-export.json`
2. The user then runs the MCP tool in Claude Code which reads that file and generates the full React component

This is a deliberate separation: the builder is a design tool, the MCP tool is a code generator.

### What the MCP tool does

Given an `AIDashboardSchema`, it generates a self-contained React component:

```tsx
// Generated output example for a "Sales Dashboard" schema

import { Dashboard, DashboardCard } from '@repo/dashcraft'
import { KPIWidget, RechartsWidget } from '@repo/dashcraft/widgets'
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui'

export function SalesDashboard() {
  return (
    <Dashboard persistenceKey="sales-dashboard">
      <div className="grid grid-cols-3 gap-4 p-4">
        <DashboardCard id="revenue-kpi" title="Revenue" draggable deletable>
          <KPIWidget
            id="revenue-kpi"
            value={124500}
            label="Total Revenue"
            format="currency"
            previousValue={98000}
          />
        </DashboardCard>

        <DashboardCard id="sales-bar" title="Monthly Sales" draggable deletable style={{ gridColumn: 'span 2' }}>
          <RechartsWidget
            id="sales-bar"
            chartType="bar"
            data={[
              { name: 'Jan', sales: 4000 },
              { name: 'Feb', sales: 3000 },
              { name: 'Mar', sales: 5000 },
            ]}
            series={[{ key: 'sales', color: '#3b82f6' }]}
            xAxisKey="name"
          />
        </DashboardCard>
      </div>
    </Dashboard>
  )
}
```

### MCP tool implementation plan

The tool lives in `tools/` directory (existing MCP tools location). It should:

1. Accept a path to the JSON schema file as input
2. Read and parse `AIDashboardSchema`
3. For each widget in `schema.widgets`:
   - Look up the correct `@repo/dashcraft` or `@repo/ui` component
   - Generate the JSX with correct props from `widget.props`
   - Generate the `<DashboardCard>` wrapper
4. Assemble all imports (deduplicated)
5. Generate the full component file
6. Write to `apps/web/ai-builder/src/generated/{ComponentName}.tsx`

### Tool name: `generate-dashboard-component`

```typescript
// tools/generate-dashboard-component/index.ts

// MCP tool input
interface Input {
  schemaPath: string        // path to the JSON schema file
  componentName: string     // e.g. "SalesDashboard"
  outputDir?: string        // default: apps/web/ai-builder/src/generated/
}
```

---

## Basic Code Preview (shiki — no MCP)

Before the MCP tool is built, the Code tab in the right panel shows a simplified preview using a client-side code generator. This is enough to understand what will be generated.

```typescript
// lib/codeGen.ts

export function generatePreviewCode(schema: AIDashboardSchema): string {
  const componentName = toPascalCase(schema.title ?? 'GeneratedDashboard')

  const widgetCode = schema.widgets.map(w => {
    const spanStyle = w.colSpan && w.colSpan > 1
      ? ` style={{ gridColumn: 'span ${w.colSpan}' }}`
      : ''

    return `
        <DashboardCard id="${w.id}" title="${w.title ?? ''}" draggable deletable${spanStyle}>
          {/* ${w.type} widget */}
        </DashboardCard>`
  }).join('\n')

  return `
import { Dashboard, DashboardCard } from '@repo/dashcraft'
// ... widget imports

export function ${componentName}() {
  return (
    <Dashboard persistenceKey="${schema.id ?? 'generated'}">
      <div className="grid grid-cols-${schema.columns ?? 3} gap-4 p-4">
${widgetCode}
      </div>
    </Dashboard>
  )
}
`.trim()
}
```

---

## Import from JSON (future)

Allow users to import a previously exported `ai-builder-X.json` back into the builder to continue editing:

```typescript
// lib/importSchema.ts
export async function importSchemaFromFile(): Promise<AIDashboardSchema | null> {
  return new Promise(resolve => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return resolve(null)
      const text = await file.text()
      try {
        const schema = JSON.parse(text)
        resolve(validateSchema(schema))
      } catch {
        resolve(null)
      }
    }
    input.click()
  })
}
```
