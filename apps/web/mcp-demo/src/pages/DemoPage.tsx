import { useCallback, useState } from 'react'
import { Trash2 } from 'lucide-react'
import { WorkflowStepper, type WorkflowStep } from '../components/WorkflowStepper'
import { ToolCallCard } from '../components/ToolCallCard'
import { CodePanel } from '../components/CodePanel'
import { useDemoStore } from '../store/demoStore'
import { callTool, callParallel } from '../api/client'

const MONOREPO_ROOT = '/Users/nishantchaudhary/Desktop/my-turborepo'

const STEPS: WorkflowStep[] = [
  {
    id: 'convert-ts',
    label: 'Convert to TypeScript',
    description: 'Rename .js→.ts, add types, convert propTypes to interfaces',
    server: 'code-modernizer',
    tool: 'convert-to-typescript',
    args: {
      path: `${MONOREPO_ROOT}/apps/web/mcp-demo/sample`,
      includeProps: true,
      dryRun: true,
    },
    icon: '🔄',
  },
  {
    id: 'scan-file',
    label: 'Enforce TypeScript Rules',
    description: 'Scan MessyComponent.tsx for violations: any types, missing generics, type guards',
    server: 'typescript-enforcer',
    tool: 'scan_file',
    args: {
      path: `${MONOREPO_ROOT}/apps/web/mcp-demo/sample/MessyComponent.tsx`,
      severity: 'warning',
    },
    icon: '🔍',
  },
  {
    id: 'generate-component',
    label: 'Generate Clean Component',
    description: 'Generate a new Button with TypeScript, tests, and Storybook stories',
    server: 'component-factory',
    tool: 'generate_component',
    args: {
      name: 'Button',
      outputPath: `${MONOREPO_ROOT}/apps/web/mcp-demo/src/components/generated`,
      includeTests: true,
      includeStories: true,
      includeTypes: true,
    },
    icon: '⚡',
  },
  {
    id: 'scan-folder',
    label: 'Folder-Level Scan',
    description: 'Scan entire packages/ui/components for TS violations across all files',
    server: 'typescript-enforcer',
    tool: 'scan_directory',
    args: {
      path: `${MONOREPO_ROOT}/packages/ui/components`,
      severity: 'warning',
      maxFiles: 30,
    },
    icon: '📁',
  },
  {
    id: 'generate-tests',
    label: 'Generate Tests',
    description: 'Auto-generate Vitest tests for all functions and components in sample files',
    server: 'generate-tests',
    tool: 'generate_all_tests',
    args: {
      path: `${MONOREPO_ROOT}/apps/web/mcp-demo/sample`,
      overwrite: true,
    },
    icon: '🧪',
  },
  {
    id: 'lighthouse',
    label: 'Lighthouse Audit',
    description: 'Run Lighthouse on this demo app — performance, accessibility, SEO scores',
    server: 'lighthouse-runner',
    tool: 'run_lighthouse',
    args: {
      url: 'http://localhost:5175',
      categories: ['performance', 'accessibility', 'best-practices', 'seo'],
    },
    icon: '🔦',
  },
]

export function DemoPage() {
  const { toolCalls, addToolCall, updateToolCall, clearToolCalls } = useDemoStore()
  const [lighthouseUrl, setLighthouseUrl] = useState('http://localhost:5175')

  const runningIds = new Set(toolCalls.filter((c) => c.status === 'running').map((c) => c.id))
  const doneIds = new Set(toolCalls.filter((c) => c.status === 'done').map((c) => c.id))
  const isRunningAll = runningIds.size > 0

  const runStep = useCallback(
    async (step: WorkflowStep) => {
      const args = step.id === 'lighthouse' ? { ...step.args, url: lighthouseUrl } : step.args
      const callId = `${step.id}-${Date.now()}`
      addToolCall({ id: callId, server: step.server, tool: step.tool, args })
      updateToolCall(callId, { status: 'running', startedAt: Date.now() })

      const result = await callTool(step.server, step.tool, args)

      updateToolCall(callId, {
        status: result.success ? 'done' : 'error',
        result: result.result,
        error: result.error,
        duration: result.duration,
      })
    },
    [addToolCall, updateToolCall]
  )

  const runAll = useCallback(async () => {
    const parallelSteps = STEPS.slice(0, 3) // first 3 in parallel
    const callIds = parallelSteps.map((step) => `${step.id}-${Date.now()}`)

    // Register all as running immediately
    parallelSteps.forEach((step, i) => {
      addToolCall({ id: callIds[i], server: step.server, tool: step.tool, args: step.args })
      updateToolCall(callIds[i], { status: 'running', startedAt: Date.now() })
    })

    const results = await callParallel(
      parallelSteps.map((step, i) => ({
        id: callIds[i],
        server: step.server,
        tool: step.tool,
        args: step.args,
      }))
    )

    results.forEach((r) => {
      updateToolCall(r.id, {
        status: r.success ? 'done' : 'error',
        result: r.result,
        error: r.error,
        duration: r.duration,
      })
    })
  }, [addToolCall, updateToolCall])

  return (
    <div className="grid grid-cols-[280px_1fr_300px] gap-4 h-full p-4 overflow-hidden">
      {/* Left — Workflow stepper */}
      <div className="overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-zinc-300">Workflow Steps</h2>
          {toolCalls.length > 0 && (
            <button
              onClick={clearToolCalls}
              className="p-1 rounded hover:bg-zinc-800 text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <WorkflowStepper
          steps={STEPS}
          runningIds={runningIds}
          doneIds={doneIds}
          onRunStep={runStep}
          onRunAll={runAll}
          isRunningAll={isRunningAll}
          lighthouseUrl={lighthouseUrl}
          onLighthouseUrlChange={setLighthouseUrl}
        />
      </div>

      {/* Center — Tool call output */}
      <div className="flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-zinc-300">Live Tool Output</h2>
          <span className="text-xs text-zinc-600">
            {toolCalls.length} call{toolCalls.length !== 1 ? 's' : ''}
          </span>
        </div>

        {toolCalls.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-zinc-600 border border-dashed border-zinc-800 rounded-lg">
            <div className="text-4xl">⚡</div>
            <p className="text-sm">Click a step or "Run All Parallel" to start</p>
            <p className="text-xs">Each tool spawns its own MCP server process</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
            {[...toolCalls].reverse().map((call) => (
              <ToolCallCard key={call.id} call={call} />
            ))}
          </div>
        )}
      </div>

      {/* Right — Code panel */}
      <CodePanel />
    </div>
  )
}
