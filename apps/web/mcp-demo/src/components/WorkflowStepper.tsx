import { Play, Zap, Loader2 } from 'lucide-react'

export interface WorkflowStep {
  id: string
  label: string
  description: string
  server: string
  tool: string
  args: Record<string, unknown>
  icon?: string
}

interface Props {
  steps: WorkflowStep[]
  runningIds: Set<string>
  doneIds: Set<string>
  onRunStep: (step: WorkflowStep) => void
  onRunAll: () => void
  isRunningAll: boolean
  lighthouseUrl: string
  onLighthouseUrlChange: (url: string) => void
}

export function WorkflowStepper({
  steps,
  runningIds,
  doneIds,
  onRunStep,
  onRunAll,
  isRunningAll,
  lighthouseUrl,
  onLighthouseUrlChange,
}: Props) {
  return (
    <div className="flex flex-col gap-3">
      {/* Run all parallel button */}
      <button
        onClick={onRunAll}
        disabled={isRunningAll}
        className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
      >
        {isRunningAll ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Running parallel…
          </>
        ) : (
          <>
            <Zap className="w-4 h-4" />
            Run All Parallel
          </>
        )}
      </button>

      <div className="text-xs text-zinc-600 text-center">or run individually ↓</div>

      {/* Individual steps */}
      <div className="flex flex-col gap-2">
        {steps.map((step) => {
          const isRunning = runningIds.has(step.id)
          const isDone = doneIds.has(step.id)
          return (
            <div
              key={step.id}
              className={`rounded-lg border p-3 transition-colors ${
                isDone
                  ? 'border-emerald-700 bg-emerald-950/30'
                  : isRunning
                  ? 'border-blue-600 bg-blue-950/30'
                  : 'border-zinc-800 bg-zinc-900'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{step.label}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{step.description}</p>
                  <div className="flex gap-1 mt-1.5">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                      {step.server}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-blue-400">
                      {step.tool}
                    </span>
                  </div>
                  {step.id === 'lighthouse' && (
                    <input
                      type="url"
                      value={lighthouseUrl}
                      onChange={(e) => onLighthouseUrlChange(e.target.value)}
                      placeholder="http://localhost:5175"
                      className="mt-2 w-full text-xs bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500"
                    />
                  )}
                </div>
                <button
                  onClick={() => onRunStep(step)}
                  disabled={isRunning}
                  className="shrink-0 p-1.5 rounded-md hover:bg-zinc-700 text-zinc-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {isRunning ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
