import { useEffect, useState } from 'react'
import { codeToHtml } from 'shiki'
import { Download, Copy, Check, Code2 } from 'lucide-react'
import { generatePreviewCode, downloadJSON } from '../../lib/codeGen'
import type { AIDashboardSchema } from '../../types/schema'

interface Props {
  schema: AIDashboardSchema | null
  versionId: string
}

export function ExportPanel({ schema, versionId }: Props) {
  const [highlighted, setHighlighted] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const [isRendering, setIsRendering] = useState(false)

  useEffect(() => {
    if (!schema) return
    setIsRendering(true)
    const code = generatePreviewCode(schema)
    codeToHtml(code, {
      lang: 'tsx',
      theme: 'github-dark',
    })
      .then(setHighlighted)
      .catch(() => setHighlighted(`<pre>${code}</pre>`))
      .finally(() => setIsRendering(false))
  }, [schema])

  if (!schema) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-muted-foreground p-4">
        Generate a UI first to preview its React code.
      </div>
    )
  }

  const code = generatePreviewCode(schema)

  const handleCopyCode = () => {
    void navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border shrink-0 flex-wrap">
        <span className="text-xs font-medium text-muted-foreground mr-auto">
          React Preview
        </span>
        <button
          onClick={handleCopyCode}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
        <button
          onClick={() => downloadJSON(schema, versionId)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <Download size={12} />
          JSON
        </button>
        <button
          onClick={() => {
            const blob = new Blob([code], { type: 'text/plain' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `Dashboard.tsx`
            a.click()
            URL.revokeObjectURL(url)
          }}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <Code2 size={12} />
          .tsx
        </button>
      </div>

      {/* Code preview */}
      <div className="flex-1 min-h-0 overflow-auto bg-[#0d1117]">
        {isRendering ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
          </div>
        ) : highlighted ? (
          <div
            className="text-xs [&>pre]:p-4 [&>pre]:h-full [&>pre]:overflow-auto [&>pre]:m-0 [&>pre]:rounded-none"
            // shiki returns sanitized HTML — safe to use here
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        ) : (
          <pre className="text-xs text-white/70 p-4 overflow-auto">{code}</pre>
        )}
      </div>
    </div>
  )
}
