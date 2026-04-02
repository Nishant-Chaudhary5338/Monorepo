import { useEffect, useRef, useState } from 'react'
import Editor from '@monaco-editor/react'
import { Copy, Check } from 'lucide-react'
import type { AIDashboardSchema } from '../../types/schema'

interface Props {
  schema: AIDashboardSchema | null
  onChange: (schema: AIDashboardSchema) => void
}

export function JSONPanel({ schema, onChange }: Props) {
  const [raw, setRaw] = useState(() =>
    schema ? JSON.stringify(schema, null, 2) : ''
  )
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Sync when schema changes from outside (AI generation / version switch)
  useEffect(() => {
    if (!schema) return
    setRaw(JSON.stringify(schema, null, 2))
    setError(null)
  }, [schema])

  const handleEditorChange = (value: string | undefined) => {
    const v = value ?? ''
    setRaw(v)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      try {
        const parsed = JSON.parse(v) as AIDashboardSchema
        if (!Array.isArray(parsed.widgets)) {
          setError('Schema must have a "widgets" array')
          return
        }
        setError(null)
        onChange(parsed)
      } catch {
        setError('Invalid JSON')
      }
    }, 500)
  }

  const handleCopy = () => {
    void navigator.clipboard.writeText(raw)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  if (!schema) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-muted-foreground p-4">
        Generate a UI first to see its JSON schema here.
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border shrink-0">
        <span className="text-xs font-medium text-muted-foreground">
          Schema JSON
        </span>
        <div className="flex items-center gap-2">
          {error && (
            <span className="text-xs text-destructive">{error}</span>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Monaco */}
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language="json"
          value={raw}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 12,
            lineNumbers: 'off',
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            tabSize: 2,
            formatOnPaste: true,
            padding: { top: 8, bottom: 8 },
          }}
        />
      </div>
    </div>
  )
}
