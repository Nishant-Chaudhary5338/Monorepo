import { useState } from 'react'
import { MultiStreamGrid, LogPanel, VariantViewer, useHlsStore } from '@repo/hls-player'
import { useAppStore } from './store/appStore.ts'
import { AddStreamDialog } from './components/AddStreamDialog.tsx'
import { AlertBanner } from './components/AlertBanner.tsx'
import { AnalyticsDashboard } from './components/AnalyticsDashboard.tsx'

type SidePanel = 'log' | 'analytics' | 'variants' | null

export default function App() {
  const { streams, removeStream } = useHlsStore()
  const { addStreamOpen, setAddStreamOpen, selectedStreamId, selectStream } = useAppStore()
  const [sidePanel, setSidePanel] = useState<SidePanel>('log')

  const activeStream = streams.find((s) => s.id === selectedStreamId) ?? streams[0]

  const toggleSide = (panel: SidePanel) =>
    setSidePanel((p) => (p === panel ? null : panel))

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-white overflow-hidden">
      {/* Top nav */}
      <header className="flex items-center gap-4 px-4 h-12 border-b border-zinc-800/60 flex-shrink-0">
        {/* Brand */}
        <div className="flex items-center gap-2 mr-2">
          <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center">
            <span className="text-white text-[10px] font-bold leading-none">HS</span>
          </div>
          <span className="text-white font-semibold text-sm tracking-tight">HLS Monitor</span>
        </div>

        {/* Stream count */}
        <span className="text-zinc-600 text-xs">
          {streams.length} {streams.length === 1 ? 'stream' : 'streams'}
        </span>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Panel toggles */}
        <div className="flex items-center gap-1">
          <NavBtn active={sidePanel === 'log'} onClick={() => toggleSide('log')}>Log</NavBtn>
          <NavBtn active={sidePanel === 'analytics'} onClick={() => toggleSide('analytics')}>Analytics</NavBtn>
          <NavBtn active={sidePanel === 'variants'} onClick={() => toggleSide('variants')}>Variants</NavBtn>
        </div>

        {/* Add stream */}
        <button
          onClick={() => setAddStreamOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-all"
        >
          <span className="text-base leading-none">+</span>
          Add Stream
        </button>
      </header>

      {/* Alert banner */}
      <AlertBanner />

      {/* Main content */}
      <div className="flex flex-1 min-h-0">
        {/* Video grid */}
        <div className="flex-1 min-w-0 p-2">
          <MultiStreamGrid
            onStreamClick={(id) => selectStream(id === selectedStreamId ? null : id)}
            className="h-full"
          />
        </div>

        {/* Side panel */}
        {sidePanel && (
          <div className="w-[420px] flex-shrink-0 border-l border-zinc-800 flex flex-col">
            {/* Side panel header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800 flex-shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                  {sidePanel === 'log' && 'Segment Log'}
                  {sidePanel === 'analytics' && 'Analytics'}
                  {sidePanel === 'variants' && 'Renditions'}
                </span>
                {activeStream && (
                  <span className="text-[10px] text-zinc-600 truncate max-w-[140px]">{activeStream.title}</span>
                )}
              </div>

              {/* Stream selector */}
              {streams.length > 1 && (
                <select
                  value={selectedStreamId ?? ''}
                  onChange={(e) => selectStream(e.target.value || null)}
                  className="text-[10px] bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-zinc-300 focus:outline-none"
                >
                  <option value="">All streams</option>
                  {streams.map((s) => (
                    <option key={s.id} value={s.id}>{s.title.slice(0, 30)}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Panel content */}
            <div className="flex-1 min-h-0 overflow-hidden">
              {sidePanel === 'log' && (
                <LogPanel streamId={selectedStreamId ?? undefined} className="h-full" />
              )}
              {sidePanel === 'analytics' && (
                <div className="h-full overflow-y-auto p-3">
                  <AnalyticsDashboard streamId={selectedStreamId ?? undefined} />
                </div>
              )}
              {sidePanel === 'variants' && activeStream && (
                <div className="h-full p-3">
                  <VariantViewer
                    streamId={activeStream.id}
                    onClose={() => setSidePanel(null)}
                  />
                </div>
              )}
              {sidePanel === 'variants' && !activeStream && (
                <div className="flex items-center justify-center h-full text-zinc-600 text-xs">
                  Select a stream to view renditions
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Stream management footer (when streams exist) */}
      {streams.length > 0 && (
        <footer className="flex items-center gap-2 px-4 py-2 border-t border-zinc-800/60 flex-shrink-0 overflow-x-auto">
          {streams.map((s) => (
            <div
              key={s.id}
              className={`flex items-center gap-2 px-2.5 py-1 rounded-full border text-xs flex-shrink-0 cursor-pointer transition-all ${
                s.id === selectedStreamId
                  ? 'border-blue-500/60 bg-blue-950/30 text-blue-300'
                  : 'border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
              }`}
              onClick={() => selectStream(s.id === selectedStreamId ? null : s.id)}
            >
              <StatusDot status={s.status} />
              <span className="truncate max-w-[120px]">{s.title}</span>
              <span className="text-[10px] opacity-50 font-mono">
                {s.metrics.codecString !== 'unknown'
                  ? s.metrics.codecString.split('.')[0]?.toUpperCase()
                  : '—'}
              </span>
              <button
                className="opacity-40 hover:opacity-100 transition-opacity text-red-400 ml-1"
                onClick={(e) => { e.stopPropagation(); removeStream(s.id) }}
                title="Remove stream"
              >
                ×
              </button>
            </div>
          ))}
        </footer>
      )}

      <AddStreamDialog open={addStreamOpen} onClose={() => setAddStreamOpen(false)} />
    </div>
  )
}

function NavBtn({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: string
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
        active
          ? 'bg-zinc-800 text-white'
          : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
      }`}
    >
      {children}
    </button>
  )
}

function StatusDot({ status }: { status: string }) {
  const cls: Record<string, string> = {
    idle: 'bg-zinc-600',
    loading: 'bg-yellow-500 animate-pulse',
    playing: 'bg-emerald-500',
    paused: 'bg-blue-500',
    error: 'bg-red-500',
    stalled: 'bg-orange-500 animate-pulse',
  }
  return <span className={`w-1.5 h-1.5 rounded-full ${cls[status] ?? 'bg-zinc-600'}`} />
}
