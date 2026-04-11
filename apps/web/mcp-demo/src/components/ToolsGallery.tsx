import { useState } from 'react'
import { CheckCircle, AlertCircle, ChevronRight, X } from 'lucide-react'

interface ToolEntry {
  id: string
  name: string
  category: string
  description: string
  tools: string[]
  status: 'working' | 'partial'
  serverName: string
}

interface GalleryData {
  total: number
  categories: { category: string; tools: ToolEntry[] }[]
  all: ToolEntry[]
}

const CATEGORY_COLORS: Record<string, string> = {
  'Code Generation': 'bg-blue-900/50 text-blue-300 border-blue-700',
  'Transformation':  'bg-purple-900/50 text-purple-300 border-purple-700',
  'Analysis':        'bg-yellow-900/50 text-yellow-300 border-yellow-700',
  'Review & Quality':'bg-rose-900/50 text-rose-300 border-rose-700',
  'Testing':         'bg-green-900/50 text-green-300 border-green-700',
  'Workspace':       'bg-zinc-800 text-zinc-300 border-zinc-600',
}

const ALL_CATEGORIES = ['All', 'Code Generation', 'Transformation', 'Analysis', 'Review & Quality', 'Testing', 'Workspace']

interface Props {
  data: GalleryData | null
  loading: boolean
}

export function ToolsGallery({ data, loading }: Props) {
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState<ToolEntry | null>(null)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-zinc-500">
        Loading tools…
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64 text-zinc-500">
        Failed to load tools. Is the server running?
      </div>
    )
  }

  const displayed = filter === 'All' ? data.all : data.all.filter((t) => t.category === filter)

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Stats bar */}
      <div className="flex items-center gap-4">
        <div className="text-2xl font-bold text-white">{data.total}</div>
        <div className="text-zinc-500 text-sm">MCP Tools across {data.categories.length} categories</div>
        <div className="ml-auto flex items-center gap-1 text-xs text-zinc-500">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          {data.all.filter((t) => t.status === 'working').length} working
          <AlertCircle className="w-3.5 h-3.5 text-yellow-400 ml-2" />
          {data.all.filter((t) => t.status === 'partial').length} partial
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-2">
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
              filter === cat
                ? 'bg-white text-zinc-900 border-white'
                : 'bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-zinc-200'
            }`}
          >
            {cat}
            {cat !== 'All' && (
              <span className="ml-1 text-zinc-600">
                ({data.all.filter((t) => t.category === cat).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 overflow-y-auto flex-1 pr-1">
        {displayed.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setSelected(tool)}
            className="text-left rounded-lg border border-zinc-800 bg-zinc-900 p-4 hover:border-zinc-600 hover:bg-zinc-800 transition-colors group"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-sm font-semibold text-white leading-tight">{tool.name}</h3>
              <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 shrink-0 mt-0.5 transition-colors" />
            </div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${CATEGORY_COLORS[tool.category] ?? 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
                {tool.category}
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                tool.status === 'working'
                  ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800'
                  : 'bg-yellow-900/30 text-yellow-400 border-yellow-800'
              }`}>
                {tool.status}
              </span>
            </div>
            <p className="text-xs text-zinc-500 line-clamp-2">{tool.description}</p>
            <p className="text-[10px] text-zinc-600 mt-2">{tool.tools.length} tool{tool.tools.length !== 1 ? 's' : ''}</p>
          </button>
        ))}
      </div>

      {/* Detail sidebar */}
      {selected && (
        <div className="fixed inset-y-0 right-0 w-80 bg-zinc-950 border-l border-zinc-800 p-6 overflow-y-auto z-50">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-white">{selected.name}</h2>
              <span className={`text-xs px-1.5 py-0.5 rounded border mt-1 inline-block ${CATEGORY_COLORS[selected.category] ?? ''}`}>
                {selected.category}
              </span>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="p-1 rounded hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-sm text-zinc-400 mb-4">{selected.description}</p>

          <div className="mb-4">
            <p className="text-xs text-zinc-600 uppercase tracking-wider mb-2">Server</p>
            <code className="text-xs text-zinc-300 font-mono bg-zinc-900 px-2 py-1 rounded">
              tools/{selected.serverName}/build/index.js
            </code>
          </div>

          <div>
            <p className="text-xs text-zinc-600 uppercase tracking-wider mb-2">
              Exposed Tools ({selected.tools.length})
            </p>
            <div className="flex flex-col gap-1.5">
              {selected.tools.map((t) => (
                <div key={t} className="flex items-center gap-2 text-xs font-mono px-2 py-1.5 rounded bg-zinc-900 border border-zinc-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                  <span className="text-zinc-300">{t}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-zinc-800">
            <p className={`text-xs font-medium ${selected.status === 'working' ? 'text-emerald-400' : 'text-yellow-400'}`}>
              {selected.status === 'working' ? '✓ Fully implemented' : '⚠ Partial implementation'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
