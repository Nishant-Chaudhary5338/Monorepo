import { useEffect, useCallback, useState } from 'react'
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels'
import { History, Code2, Braces } from 'lucide-react'
import { CanvasArea } from '../components/canvas/CanvasArea'
import { Header } from '../components/layout/Header'
import { PromptBar } from '../components/prompt/PromptBar'
import { VersionSidebar } from '../components/versions/VersionSidebar'
import { JSONPanel } from '../components/panels/JSONPanel'
import { ExportPanel } from '../components/panels/ExportPanel'
import { useBuilderStore } from '../stores/builderStore'
import { useDashboardStore } from '@repo/dashcraft'
import { generateSchema, generateDiff } from '../ai/aiClient'
import { applyPatches } from '../lib/diffPatcher'
import type { AIDashboardSchema } from '../types/schema'

// ─── seed schema ─────────────────────────────────────────────────────────────

const SEED_SCHEMA: AIDashboardSchema = {
  id: 'seed',
  title: 'Sales Dashboard',
  layout: 'grid',
  columns: 3,
  gap: 16,
  widgets: [
    {
      id: 'revenue-kpi',
      type: 'kpi',
      title: 'Total Revenue',
      colSpan: 1,
      draggable: true,
      deletable: true,
      defaultSize: { width: 280, height: 160 },
      props: { value: 124500, label: 'Total Revenue', format: 'currency', previousValue: 98000 },
    },
    {
      id: 'users-kpi',
      type: 'kpi',
      title: 'Active Users',
      colSpan: 1,
      draggable: true,
      deletable: true,
      defaultSize: { width: 280, height: 160 },
      props: { value: 8420, label: 'Active Users', format: 'number', previousValue: 7100 },
    },
    {
      id: 'conversion-kpi',
      type: 'kpi',
      title: 'Conversion',
      colSpan: 1,
      draggable: true,
      deletable: true,
      defaultSize: { width: 280, height: 160 },
      props: { value: 3.6, label: 'Conversion Rate', format: 'percent', previousValue: 3.1 },
    },
    {
      id: 'monthly-sales-bar',
      type: 'bar',
      title: 'Monthly Sales',
      colSpan: 2,
      draggable: true,
      deletable: true,
      defaultSize: { width: 580, height: 300 },
      props: {
        data: [
          { month: 'Jan', sales: 4200 },
          { month: 'Feb', sales: 3800 },
          { month: 'Mar', sales: 5100 },
          { month: 'Apr', sales: 4700 },
          { month: 'May', sales: 6200 },
          { month: 'Jun', sales: 5800 },
        ],
        xAxisKey: 'month',
        series: [{ key: 'sales', color: '#3b82f6' }],
      },
    },
    {
      id: 'category-progress',
      type: 'progress-group',
      title: 'Category Performance',
      colSpan: 1,
      draggable: true,
      deletable: true,
      defaultSize: { width: 280, height: 300 },
      props: {
        items: [
          { label: 'Electronics', value: 78, max: 100 },
          { label: 'Clothing', value: 55, max: 100 },
          { label: 'Home & Garden', value: 42, max: 100 },
          { label: 'Books', value: 91, max: 100 },
        ],
      },
    },
  ],
}

type RightTab = 'json' | 'code'

// ─── Builder ─────────────────────────────────────────────────────────────────

export function Builder() {
  const {
    versions,
    activeVersionId,
    isGenerating,
    streamingStatus,
    provider,
    model,
    addVersion,
    setActiveVersion,
    deleteVersion,
    updateSchema,
    setGenerating,
    setStreamingStatus,
    setProvider,
    setModel,
    hydrate,
    activeSchema,
  } = useBuilderStore()

  const [rightTab, setRightTab] = useState<RightTab>('json')
  const [aiError, setAiError] = useState<string | null>(null)

  const schema = activeSchema()
  const activeId = activeVersionId ?? 'seed'

  // ── Hydrate from localStorage on mount ─────────────────────────────────────
  useEffect(() => {
    void hydrate().then(() => {
      if (useBuilderStore.getState().versions.length === 0) {
        addVersion({
          schema: SEED_SCHEMA,
          prompt: 'Seed schema (Phase 1 demo)',
          timestamp: Date.now(),
          isBase: true,
        })
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Phase 5: Canvas → JSON sync ────────────────────────────────────────────
  useEffect(() => {
    const unsub = useDashboardStore.subscribe((dashState) => {
      const current = useBuilderStore.getState().activeSchema()
      if (!current) return

      const dashIds = new Set(Object.keys(dashState.widgets))

      const surviving = current.widgets.filter((w) => dashIds.has(w.id))

      const updatedWidgets = surviving.map((w): typeof w => {
        const ds = dashState.widgets[w.id]
        if (!ds) return w
        return {
          ...w,
          defaultSize: ds.size ?? w.defaultSize,
          settings: (ds.settings ? { ...w.settings, ...ds.settings } : w.settings) as typeof w.settings,
        }
      })

      const sizeChanged = updatedWidgets.some((uw, i) => {
        const orig = current.widgets[i]
        return (
          uw.defaultSize?.width !== orig?.defaultSize?.width ||
          uw.defaultSize?.height !== orig?.defaultSize?.height
        )
      })
      const deletionHappened = surviving.length !== current.widgets.length

      if (sizeChanged || deletionHappened) {
        useBuilderStore.getState().updateSchema({ ...current, widgets: updatedWidgets })
      }
    })
    return unsub
  }, [])

  // ── AI prompt handler ──────────────────────────────────────────────────────

  const handlePromptSubmit = useCallback(async (prompt: string) => {
    setAiError(null)
    const currentSchema = useBuilderStore.getState().activeSchema()
    const isDiff = Boolean(currentSchema)
    const { provider: p, model: m } = useBuilderStore.getState()

    if (isDiff && currentSchema) {
      // ── Diff mode: patch existing schema ───────────────────────────────────
      setGenerating(true, 'Generating changes...')

      try {
        const patches = await generateDiff(
          prompt,
          currentSchema,
          m,
          p,
          (token) => {
            void token // streaming token — could use for live status
            setStreamingStatus('Streaming patch...')
          }
        )

        if (!patches) {
          setAiError('Failed to generate changes. Check the console for raw output.')
          return
        }

        const patched = applyPatches(currentSchema, patches)
        addVersion({
          schema: patched,
          prompt,
          timestamp: Date.now(),
          diff: patches,
        })
      } catch (err) {
        console.error('[Builder] Diff error:', err)
        setAiError(`Error: ${err instanceof Error ? err.message : String(err)}`)
      } finally {
        setGenerating(false)
      }
    } else {
      // ── Create mode: full schema generation ────────────────────────────────
      setGenerating(true, 'Generating dashboard...')

      try {
        const newSchema = await generateSchema(
          prompt,
          m,
          p,
          (token) => {
            void token
            setStreamingStatus('Streaming schema...')
          }
        )

        if (!newSchema) {
          setAiError('Failed to generate schema. Check the console for raw output.')
          return
        }

        addVersion({
          schema: newSchema,
          prompt,
          timestamp: Date.now(),
          isBase: true,
        })
      } catch (err) {
        console.error('[Builder] Generate error:', err)
        setAiError(`Error: ${err instanceof Error ? err.message : String(err)}`)
      } finally {
        setGenerating(false)
      }
    }
  }, [addVersion, setGenerating, setStreamingStatus])

  const handleSchemaChange = useCallback(
    (updated: AIDashboardSchema) => updateSchema(updated),
    [updateSchema]
  )

  const handleWidgetSettingsChange = useCallback(
    (id: string, settings: unknown) => {
      const current = useBuilderStore.getState().activeSchema()
      if (!current) return
      updateSchema({
        ...current,
        widgets: current.widgets.map((w) =>
          w.id === id ? { ...w, settings: { ...w.settings, ...(settings as Record<string, unknown>) } } : w
        ),
      })
    },
    [updateSchema]
  )

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Header */}
      <Header
        versions={versions}
        activeVersionId={activeVersionId}
        onVersionSwitch={setActiveVersion}
      />

      {/* AI error banner */}
      {aiError && (
        <div className="shrink-0 px-4 py-2 bg-destructive/10 border-b border-destructive/30
          flex items-center justify-between gap-2">
          <p className="text-xs text-destructive">{aiError}</p>
          <button
            onClick={() => setAiError(null)}
            className="text-xs text-destructive/70 hover:text-destructive shrink-0"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main panels */}
      <div className="flex-1 min-h-0">
        <PanelGroup direction="horizontal" className="h-full">

          {/* Left — version history */}
          <Panel defaultSize={18} minSize={0} collapsible className="min-w-0">
            <div className="flex flex-col h-full border-r border-border bg-card">
              <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border shrink-0">
                <History size={13} className="text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Versions
                </span>
              </div>
              <div className="flex-1 overflow-y-auto">
                <VersionSidebar
                  versions={versions}
                  activeVersionId={activeVersionId}
                  onSwitch={setActiveVersion}
                  onDelete={deleteVersion}
                />
              </div>
            </div>
          </Panel>

          <PanelResizeHandle className="w-px bg-border hover:bg-primary/50 transition-colors cursor-col-resize" />

          {/* Center — canvas */}
          <Panel minSize={40}>
            <CanvasArea
              schema={schema}
              versionId={activeId}
              onWidgetDelete={() => {}}
              onWidgetSettingsChange={handleWidgetSettingsChange}
            />
          </Panel>

          <PanelResizeHandle className="w-px bg-border hover:bg-primary/50 transition-colors cursor-col-resize" />

          {/* Right — JSON / Code */}
          <Panel defaultSize={28} minSize={0} collapsible className="min-w-0">
            <div className="flex flex-col h-full border-l border-border bg-card">
              <div className="flex items-center border-b border-border shrink-0">
                <button
                  onClick={() => setRightTab('json')}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-colors ${
                    rightTab === 'json'
                      ? 'text-foreground border-b-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Braces size={12} />
                  JSON
                </button>
                <button
                  onClick={() => setRightTab('code')}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-colors ${
                    rightTab === 'code'
                      ? 'text-foreground border-b-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Code2 size={12} />
                  Code
                </button>
              </div>

              <div className="flex-1 min-h-0">
                {rightTab === 'json' ? (
                  <JSONPanel schema={schema} onChange={handleSchemaChange} />
                ) : (
                  <ExportPanel schema={schema} versionId={activeId} />
                )}
              </div>
            </div>
          </Panel>

        </PanelGroup>
      </div>

      {/* Prompt bar */}
      <PromptBar
        onSubmit={(prompt) => { void handlePromptSubmit(prompt) }}
        isGenerating={isGenerating}
        streamingStatus={streamingStatus}
        hasSchema={!!schema}
        provider={provider}
        model={model}
        onProviderChange={setProvider}
        onModelChange={setModel}
      />
    </div>
  )
}
