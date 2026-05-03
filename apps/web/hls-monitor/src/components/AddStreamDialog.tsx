import { useState, useRef, useEffect } from 'react'
import { useHlsStore } from '@repo/hls-player'
import { useAppStore } from '../store/appStore.ts'

const DEMO_STREAMS = [
  { label: 'Apple HLS Demo', url: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8' },
  { label: 'Akamai Test Stream', url: 'https://multiplatform-f.akamaihd.net/i/multi/will/bunny/big_buck_bunny_,640x360_400,640x360_700,640x360_1000,950x540_1500,.f4v.csmil/master.m3u8' },
  { label: 'Test HEVC', url: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8' },
]

type Props = {
  open: boolean
  onClose: () => void
}

export function AddStreamDialog({ open, onClose }: Props) {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const addStream = useHlsStore((s) => s.addStream)
  const setAddStreamOpen = useAppStore((s) => s.setAddStreamOpen)

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
      const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
      document.addEventListener('keydown', handler)
      return () => document.removeEventListener('keydown', handler)
    }
  }, [open, onClose])

  if (!open) return null

  const handleAdd = () => {
    const trimmed = url.trim()
    if (!trimmed) return
    addStream(trimmed, title.trim() || trimmed)
    setUrl('')
    setTitle('')
    setAddStreamOpen(false)
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd()
    if (e.key === 'Escape') onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop — separate click target, sits under the modal */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Dialog — z-10 so it sits above the backdrop */}
      <div className="relative z-10 w-full max-w-lg mx-4 bg-zinc-900 border border-zinc-700/60 rounded-2xl shadow-2xl overflow-hidden">
        {/* Accent top bar */}
        <div className="h-px w-full bg-linear-to-r from-transparent via-blue-500/60 to-transparent" />

        <div className="p-6">
          <h2 className="text-white font-semibold text-lg mb-1">Add Stream</h2>
          <p className="text-zinc-500 text-sm mb-5">Paste any HLS (.m3u8) URL — H.264 or HEVC</p>

          <div className="flex flex-col gap-3">
            <div>
              <label className="text-zinc-400 text-xs mb-1.5 block">Stream URL</label>
              <input
                ref={inputRef}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="https://example.com/stream/master.m3u8"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition-colors font-mono"
              />
            </div>

            <div>
              <label className="text-zinc-400 text-xs mb-1.5 block">Label (optional)</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. Camera 01 — London"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Demo stream quick-picks */}
          <div className="mt-4">
            <p className="text-zinc-600 text-xs mb-2">Quick demo streams</p>
            <div className="flex flex-col gap-1.5">
              {DEMO_STREAMS.map((ds) => (
                <button
                  key={ds.url}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition-all text-left"
                  onClick={() => { setUrl(ds.url); setTitle(ds.label) }}
                >
                  <span className="text-zinc-300 text-xs font-medium">{ds.label}</span>
                  <span className="text-zinc-600 text-[10px] font-mono truncate max-w-50 ml-2">{ds.url.replace('https://', '')}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-zinc-700 text-zinc-400 text-sm hover:text-zinc-200 hover:border-zinc-600 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!url.trim()}
              className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white text-sm font-medium transition-all"
            >
              Add Stream
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
