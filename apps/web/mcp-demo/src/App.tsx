import { useDemoStore } from './store/demoStore'
import { DemoPage } from './pages/DemoPage'
import { GalleryPage } from './pages/GalleryPage'
import { Terminal, LayoutGrid } from 'lucide-react'

export default function App() {
  const { activeTab, setActiveTab } = useDemoStore()

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-white overflow-hidden">
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-3 border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center">
            <Terminal className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-white text-sm">MCP Tools</span>
          <span className="text-zinc-600 text-sm">/ Custom Dev Automation</span>
        </div>

        {/* Tab bar */}
        <nav className="flex items-center gap-1 ml-4">
          <button
            onClick={() => setActiveTab('demo')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'demo'
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Live Demo
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'gallery'
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            All Tools
          </button>
        </nav>

        {/* Status indicators */}
        <div className="ml-auto flex items-center gap-4 text-xs text-zinc-600">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            MCP Protocol · stdio · JSON-RPC 2.0
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            26 tools · 6 categories
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        {activeTab === 'demo' ? <DemoPage /> : <GalleryPage />}
      </main>
    </div>
  )
}
