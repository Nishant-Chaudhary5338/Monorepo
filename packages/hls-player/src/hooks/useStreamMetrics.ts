import { useHlsStore } from '../store/hlsStore.js'
import type { HlsStream } from '../types/index.js'

export function useStreamMetrics(streamId: string): HlsStream['metrics'] | null {
  return useHlsStore((s) => s.streams.find((st) => st.id === streamId)?.metrics ?? null)
}

export function useAllStreams(): HlsStream[] {
  return useHlsStore((s) => s.streams)
}

export function useStreamLogs(streamId?: string) {
  return useHlsStore((s) =>
    streamId ? s.logs.filter((l) => l.streamId === streamId) : s.logs
  )
}
