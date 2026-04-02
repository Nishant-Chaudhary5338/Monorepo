import { RechartsWidget, KPIWidget } from '@repo/dashcraft'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@repo/ui'
import { Alert, AlertTitle, AlertDescription } from '@repo/ui'
import { Progress } from '@repo/ui'
import { Badge } from '@repo/ui'
import type { AIWidgetSchema } from '../../types/schema'

interface Props {
  widget: AIWidgetSchema
}

// ─── helpers ────────────────────────────────────────────────────────────────

type StatItem = { label: string; value: string | number; trend?: string }
type ProgressItem = { label: string; value: number; max: number }
type BadgeItem = { label: string; variant?: 'default' | 'secondary' | 'destructive' | 'outline' }
type ListItem = { text: string; description?: string }

// ─── WidgetRenderer ───────────────────────────────────────────────────────────

export function WidgetRenderer({ widget }: Props) {
  const { type, props = {}, children = [], title } = widget

  switch (type) {
    // ── dashcraft chart widgets ──────────────────────────────────────────────
    case 'bar':
      return (
        <RechartsWidget
          id={widget.id}
          chartType="bar"
          title={title}
          data={(props.data as object[]) ?? []}
          series={(props.series as object[]) ?? []}
          xAxisKey={(props.xAxisKey as string) ?? 'name'}
        />
      )

    case 'line':
      return (
        <RechartsWidget
          id={widget.id}
          chartType="line"
          title={title}
          data={(props.data as object[]) ?? []}
          series={(props.series as object[]) ?? []}
          xAxisKey={(props.xAxisKey as string) ?? 'name'}
        />
      )

    case 'area':
      return (
        <RechartsWidget
          id={widget.id}
          chartType="area"
          title={title}
          data={(props.data as object[]) ?? []}
          series={(props.series as object[]) ?? []}
          xAxisKey={(props.xAxisKey as string) ?? 'name'}
        />
      )

    case 'pie':
      return (
        <RechartsWidget
          id={widget.id}
          chartType="pie"
          title={title}
          data={(props.data as object[]) ?? []}
          series={(props.series as object[]) ?? []}
          xAxisKey={(props.xAxisKey as string) ?? 'name'}
        />
      )

    case 'scatter':
      return (
        <RechartsWidget
          id={widget.id}
          chartType="scatter"
          title={title}
          data={(props.data as object[]) ?? []}
          series={(props.series as object[]) ?? []}
          xAxisKey={(props.xAxisKey as string) ?? 'name'}
        />
      )

    case 'radar':
      return (
        <RechartsWidget
          id={widget.id}
          chartType="radar"
          title={title}
          data={(props.data as object[]) ?? []}
          series={(props.series as object[]) ?? []}
          xAxisKey={(props.xAxisKey as string) ?? 'name'}
        />
      )

    case 'kpi':
      return (
        <KPIWidget
          id={widget.id}
          value={(props.value as number | string) ?? 0}
          label={(props.label as string) ?? title ?? ''}
          format={(props.format as 'number' | 'currency' | 'percent') ?? 'number'}
          previousValue={props.previousValue as number | undefined}
          trendLabel={props.trendLabel as string | undefined}
        />
      )

    // ── @repo/ui components ──────────────────────────────────────────────────
    case 'card':
      return (
        <Card className="h-full">
          {(props.title ?? title) && (
            <CardHeader>
              <CardTitle>{(props.title ?? title) as string}</CardTitle>
              {props.description && (
                <CardDescription>{props.description as string}</CardDescription>
              )}
            </CardHeader>
          )}
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {(props.content as string) ?? ''}
            </p>
          </CardContent>
        </Card>
      )

    case 'alert':
      return (
        <Alert
          variant={(props.variant as 'default' | 'destructive') ?? 'default'}
          className="h-full"
        >
          <AlertTitle>{(props.title as string) ?? title ?? 'Alert'}</AlertTitle>
          <AlertDescription>
            {(props.description as string) ?? ''}
          </AlertDescription>
        </Alert>
      )

    case 'stat':
      return (
        <div className="grid grid-cols-3 gap-4 p-4 h-full">
          {((props.items as StatItem[]) ?? []).map((item, i) => (
            <div key={i} className="text-center space-y-1">
              <div className="text-2xl font-bold text-foreground">
                {item.value}
              </div>
              <div className="text-xs text-muted-foreground">{item.label}</div>
              {item.trend && (
                <div
                  className={`text-xs font-medium ${
                    item.trend === 'up'
                      ? 'text-green-600'
                      : item.trend === 'down'
                        ? 'text-red-500'
                        : 'text-muted-foreground'
                  }`}
                >
                  {item.trend === 'up' ? '↑' : item.trend === 'down' ? '↓' : '–'}
                </div>
              )}
            </div>
          ))}
        </div>
      )

    case 'progress-group':
      return (
        <div className="space-y-3 p-4 h-full">
          {((props.items as ProgressItem[]) ?? []).map((item, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-foreground">{item.label}</span>
                <span className="text-muted-foreground">
                  {item.value}/{item.max}
                </span>
              </div>
              <Progress value={(item.value / item.max) * 100} />
            </div>
          ))}
        </div>
      )

    case 'badge-group':
      return (
        <div className="flex flex-wrap gap-2 p-4 h-full items-start content-start">
          {((props.items as BadgeItem[]) ?? []).map((item, i) => (
            <Badge key={i} variant={item.variant ?? 'default'}>
              {item.label}
            </Badge>
          ))}
        </div>
      )

    case 'list':
      return (
        <div className="divide-y divide-border h-full overflow-auto">
          {((props.items as ListItem[]) ?? []).map((item, i) => (
            <div key={i} className="px-4 py-3">
              <p className="text-sm font-medium text-foreground">{item.text}</p>
              {item.description && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )

    // ── layout containers ────────────────────────────────────────────────────
    case 'section':
      return (
        <div className="p-4 h-full">
          {title && (
            <h3 className="text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
              {title}
            </h3>
          )}
          <div className="space-y-2">
            {children.map((child) => (
              <WidgetRenderer key={child.id} widget={child} />
            ))}
          </div>
        </div>
      )

    case 'row':
      return (
        <div className="flex gap-4 p-4 h-full">
          {children.map((child) => (
            <WidgetRenderer key={child.id} widget={child} />
          ))}
        </div>
      )

    // ── fallback ─────────────────────────────────────────────────────────────
    case 'placeholder':
    default:
      return (
        <div className="flex items-center justify-center h-full min-h-24 text-muted-foreground text-sm border-2 border-dashed border-border rounded-lg p-4">
          <span>
            Unknown widget:{' '}
            <code className="font-mono bg-muted px-1 rounded">{type}</code>
          </span>
        </div>
      )
  }
}
