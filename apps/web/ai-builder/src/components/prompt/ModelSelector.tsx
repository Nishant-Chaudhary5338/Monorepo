import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Zap, Globe } from 'lucide-react'
import { PROVIDERS, type ProviderId } from '../../ai/providers'
import { hasApiKey } from '../../ai/aiClient'

interface Props {
  provider: ProviderId
  model: string
  onProviderChange: (provider: ProviderId) => void
  onModelChange: (model: string) => void
  disabled?: boolean
}

const PROVIDER_ICONS: Record<ProviderId, React.ReactNode> = {
  groq: <Zap size={11} />,
  openrouter: <Globe size={11} />,
}

export function ModelSelector({
  provider,
  model,
  onProviderChange,
  onModelChange,
  disabled,
}: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const providerConfig = PROVIDERS[provider]
  const currentModel = providerConfig.models.find((m) => m.id === model)
  const hasKey = hasApiKey(provider)

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleProviderSwitch = (p: ProviderId) => {
    onProviderChange(p)
    onModelChange(PROVIDERS[p].defaultModel)
  }

  return (
    <div ref={ref} className="relative shrink-0">
      {/* Trigger */}
      <button
        onClick={() => !disabled && setOpen((v) => !v)}
        disabled={disabled}
        className="flex items-center gap-1 px-2 py-1 rounded-md border border-border bg-muted
          text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted/80
          transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        title={`Provider: ${providerConfig.label} / Model: ${currentModel?.label ?? model}`}
      >
        {PROVIDER_ICONS[provider]}
        <span className="max-w-[80px] truncate">{currentModel?.label ?? model}</span>
        {!hasKey && (
          <span className="text-yellow-500" title="API key missing">⚠</span>
        )}
        <ChevronDown size={10} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute bottom-full mb-1 left-0 z-50 w-64
          rounded-lg border border-border bg-popover shadow-lg overflow-hidden">

          {/* Provider tabs */}
          <div className="flex border-b border-border">
            {(Object.keys(PROVIDERS) as ProviderId[]).map((p) => (
              <button
                key={p}
                onClick={() => handleProviderSwitch(p)}
                className={`flex-1 flex items-center justify-center gap-1 py-2 text-[11px] font-medium
                  transition-colors
                  ${p === provider
                    ? 'bg-primary/10 text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
              >
                {PROVIDER_ICONS[p]}
                {PROVIDERS[p].label}
                {!hasApiKey(p) && <span className="text-yellow-500 text-[10px]">⚠</span>}
              </button>
            ))}
          </div>

          {/* Model list */}
          <div className="max-h-52 overflow-y-auto py-1">
            {providerConfig.models.map((m) => (
              <button
                key={m.id}
                onClick={() => { onModelChange(m.id); setOpen(false) }}
                className={`w-full text-left px-3 py-2 text-xs transition-colors
                  ${m.id === model
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground hover:bg-muted/60'
                  }`}
              >
                <div className="font-medium">{m.label}</div>
                {m.description && (
                  <div className="text-[10px] text-muted-foreground">{m.description}</div>
                )}
              </button>
            ))}
          </div>

          {/* API key hint */}
          {!hasKey && (
            <div className="border-t border-border px-3 py-2 text-[10px] text-yellow-600 bg-yellow-500/10">
              Add <code className="font-mono">{providerConfig.apiKeyEnv}</code> to .env.local
            </div>
          )}
        </div>
      )}
    </div>
  )
}
