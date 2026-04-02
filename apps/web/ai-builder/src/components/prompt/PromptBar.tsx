import { useRef, useState } from 'react'
import { ArrowUp, Loader2, WifiOff, Wifi } from 'lucide-react'

interface Props {
  onSubmit: (prompt: string) => void
  isGenerating: boolean
  streamingStatus: string
  isOllamaOnline: boolean
  hasSchema: boolean
}

export function PromptBar({
  onSubmit,
  isGenerating,
  streamingStatus,
  isOllamaOnline,
  hasSchema,
}: Props) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = () => {
    const trimmed = value.trim()
    if (!trimmed || isGenerating) return
    onSubmit(trimmed)
    setValue('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    // auto-resize
    e.target.style.height = 'auto'
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`
  }

  const mode = hasSchema ? 'Update' : 'Create'
  const placeholder = hasSchema
    ? 'Describe a change — e.g. "Make the revenue card blue"'
    : 'Describe your UI — e.g. "Build a sales dashboard with KPIs"'

  return (
    <div className="shrink-0 border-t border-border bg-card px-4 py-3 space-y-2">
      {/* Streaming status */}
      {isGenerating && streamingStatus && (
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Loader2 size={11} className="animate-spin" />
          {streamingStatus}
        </p>
      )}

      {/* Input row */}
      <div className="flex items-end gap-2">
        {/* Ollama status */}
        <div
          title={isOllamaOnline ? 'Ollama running' : 'Ollama offline — run: ollama serve'}
          className="mb-1.5 shrink-0"
        >
          {isOllamaOnline ? (
            <Wifi size={14} className="text-green-500" />
          ) : (
            <WifiOff size={14} className="text-red-500" />
          )}
        </div>

        {/* Mode badge */}
        <span className="mb-1.5 shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
          {mode}
        </span>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isGenerating || !isOllamaOnline}
          className="flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm
            text-foreground placeholder:text-muted-foreground
            focus:outline-none focus:ring-2 focus:ring-ring
            disabled:opacity-50 disabled:cursor-not-allowed
            min-h-9 max-h-30 leading-relaxed"
        />

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!value.trim() || isGenerating || !isOllamaOnline}
          className="mb-0.5 shrink-0 flex items-center justify-center w-9 h-9 rounded-lg
            bg-primary text-primary-foreground
            hover:bg-primary/90 transition-colors
            disabled:opacity-40 disabled:cursor-not-allowed"
          title="Submit (⌘↵)"
        >
          {isGenerating ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <ArrowUp size={15} />
          )}
        </button>
      </div>

      {!isOllamaOnline && (
        <p className="text-xs text-red-500">
          Ollama is offline. Run{' '}
          <code className="font-mono bg-muted px-1 rounded">ollama serve</code>{' '}
          then{' '}
          <code className="font-mono bg-muted px-1 rounded">ollama pull llama3.2:3b</code>
        </p>
      )}
    </div>
  )
}
