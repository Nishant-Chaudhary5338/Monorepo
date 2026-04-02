import type { AIDashboardSchema, AIWidgetSchema } from '../types/schema'

function toPascalCase(str: string): string {
  return str
    .split(/[\s-_]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('')
}

function collectImports(schema: AIDashboardSchema): { dashcraft: string[]; ui: string[] } {
  const dashcraft = new Set<string>(['Dashboard', 'DashboardCard'])
  const ui = new Set<string>()

  function scan(w: AIWidgetSchema) {
    switch (w.type) {
      case 'bar':
      case 'line':
      case 'area':
      case 'pie':
      case 'scatter':
      case 'radar':
        dashcraft.add('RechartsWidget')
        break
      case 'kpi':
        dashcraft.add('KPIWidget')
        break
      case 'card':
        ui.add('Card').add('CardHeader').add('CardTitle').add('CardContent')
        break
      case 'alert':
        ui.add('Alert').add('AlertTitle').add('AlertDescription')
        break
      case 'progress-group':
        ui.add('Progress')
        break
      case 'badge-group':
        ui.add('Badge')
        break
    }
    w.children?.forEach(scan)
  }

  schema.widgets.forEach(scan)
  return { dashcraft: [...dashcraft], ui: [...ui] }
}

function widgetJSX(w: AIWidgetSchema, indent = 8): string {
  const pad = ' '.repeat(indent)
  const spanStyle =
    w.colSpan && w.colSpan > 1 ? ` style={{ gridColumn: 'span ${w.colSpan}' }}` : ''

  const inner = (() => {
    const p = w.props ?? {}
    switch (w.type) {
      case 'kpi':
        return `<KPIWidget id="${w.id}" value={${JSON.stringify(p.value ?? 0)}} label="${p.label ?? ''}" format="${p.format ?? 'number'}" />`
      case 'bar':
      case 'line':
      case 'area':
      case 'pie':
        return `<RechartsWidget id="${w.id}" chartType="${w.type}" data={${JSON.stringify(p.data ?? [])}} series={${JSON.stringify(p.series ?? [])}} xAxisKey="${p.xAxisKey ?? 'name'}" />`
      case 'card':
        return `<Card className="h-full"><CardContent><p>${p.content ?? ''}</p></CardContent></Card>`
      default:
        return `{/* ${w.type} */}`
    }
  })()

  return [
    `${pad}<DashboardCard id="${w.id}" title="${w.title ?? ''}" draggable deletable${spanStyle}>`,
    `${pad}  ${inner}`,
    `${pad}</DashboardCard>`,
  ].join('\n')
}

export function generatePreviewCode(schema: AIDashboardSchema): string {
  const name = toPascalCase(schema.title ?? 'GeneratedDashboard')
  const { dashcraft, ui } = collectImports(schema)
  const cols = schema.columns ?? 3
  const gap = schema.gap ?? 16
  const widgets = schema.widgets.map((w) => widgetJSX(w)).join('\n')

  const lines: string[] = [
    `import { ${dashcraft.join(', ')} } from '@repo/dashcraft'`,
  ]
  if (ui.length > 0) lines.push(`import { ${ui.join(', ')} } from '@repo/ui'`)

  lines.push(
    '',
    `export function ${name}() {`,
    '  return (',
    `    <Dashboard persistenceKey="${schema.id ?? 'generated'}">`,
    '      <div',
    '        className="grid w-full"',
    `        style={{`,
    `          gridTemplateColumns: 'repeat(${cols}, minmax(0, 1fr))',`,
    `          gap: '${gap}px',`,
    `          padding: '${gap}px',`,
    '        }}',
    '      >',
    widgets,
    '      </div>',
    '    </Dashboard>',
    '  )',
    '}',
  )

  return lines.join('\n')
}

export function downloadJSON(schema: AIDashboardSchema, versionId: string) {
  const json = JSON.stringify(schema, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `ai-builder-${versionId}.json`
  a.click()
  URL.revokeObjectURL(url)
}
