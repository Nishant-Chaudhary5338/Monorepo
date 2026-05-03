import { create } from 'zustand'
import type { HlsStream, SegmentEvent, StreamMetrics, StreamVariant, IssueKind, StreamStatus } from '../types/index.js'

const DEFAULT_METRICS: StreamMetrics = {
  bitrate: 0,
  bufferLength: 0,
  currentLevel: -1,
  latency: 0,
  droppedFrames: 0,
  loadTime: 0,
  codecTier: 'h264',
  codecString: 'unknown',
}

type HlsStore = {
  streams: HlsStream[]
  logs: SegmentEvent[]
  activeStreamId: string | null
  maxLogEntries: number

  addStream: (url: string, title?: string) => string
  removeStream: (id: string) => void
  updateStatus: (id: string, status: StreamStatus) => void
  updateMetrics: (id: string, metrics: Partial<StreamMetrics>) => void
  updateVariants: (id: string, variants: StreamVariant[]) => void
  addIssue: (id: string, issue: IssueKind) => void
  clearIssues: (id: string) => void
  toggleMute: (id: string) => void
  setActiveStream: (id: string | null) => void
  appendLog: (event: SegmentEvent) => void
  clearLogs: () => void
  exportLogs: (format: 'json' | 'csv') => void
}

function toCSV(logs: SegmentEvent[]): string {
  const headers = [
    'streamId', 'timestamp', 'segmentUri', 'sequenceNumber', 'duration',
    'pts', 'dts', 'ptsAudioVideoDeltaMs', 'codecString', 'bitrate',
    'loadTime', 'issue', 'severity', 'scte35Type', 'scte35Time',
  ]
  const rows = logs.map((l) =>
    [
      l.streamId, l.timestamp, `"${l.segmentUri}"`, l.sequenceNumber, l.duration,
      l.pts, l.dts, l.ptsAudioVideoDeltaMs, l.codecString, l.bitrate,
      l.loadTime, l.issue ?? '', l.severity, l.scte35?.type ?? '', l.scte35?.time ?? '',
    ].join(',')
  )
  return [headers.join(','), ...rows].join('\n')
}

function downloadBlob(content: string, filename: string, mime: string): void {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export const useHlsStore = create<HlsStore>((set, get) => ({
  streams: [],
  logs: [],
  activeStreamId: null,
  maxLogEntries: 5000,

  addStream: (url, title) => {
    const id = crypto.randomUUID()
    set((s) => ({
      streams: [
        ...s.streams,
        {
          id,
          url,
          title: title ?? url,
          status: 'idle',
          metrics: { ...DEFAULT_METRICS },
          variants: [],
          issues: [],
          muted: true,
        },
      ],
    }))
    return id
  },

  removeStream: (id) =>
    set((s) => ({ streams: s.streams.filter((st) => st.id !== id) })),

  updateStatus: (id, status) =>
    set((s) => ({
      streams: s.streams.map((st) => (st.id === id ? { ...st, status } : st)),
    })),

  updateMetrics: (id, metrics) =>
    set((s) => ({
      streams: s.streams.map((st) =>
        st.id === id ? { ...st, metrics: { ...st.metrics, ...metrics } } : st
      ),
    })),

  updateVariants: (id, variants) =>
    set((s) => ({
      streams: s.streams.map((st) => (st.id === id ? { ...st, variants } : st)),
    })),

  addIssue: (id, issue) =>
    set((s) => ({
      streams: s.streams.map((st) =>
        st.id === id && !st.issues.includes(issue)
          ? { ...st, issues: [...st.issues, issue] }
          : st
      ),
    })),

  clearIssues: (id) =>
    set((s) => ({
      streams: s.streams.map((st) => (st.id === id ? { ...st, issues: [] } : st)),
    })),

  toggleMute: (id) =>
    set((s) => ({
      streams: s.streams.map((st) => (st.id === id ? { ...st, muted: !st.muted } : st)),
    })),

  setActiveStream: (id) => set({ activeStreamId: id }),

  appendLog: (event) =>
    set((s) => {
      const next = [event, ...s.logs]
      return { logs: next.length > s.maxLogEntries ? next.slice(0, s.maxLogEntries) : next }
    }),

  clearLogs: () => set({ logs: [] }),

  exportLogs: (format) => {
    const { logs } = get()
    if (format === 'json') {
      downloadBlob(JSON.stringify(logs, null, 2), 'hls-logs.json', 'application/json')
    } else {
      downloadBlob(toCSV(logs), 'hls-logs.csv', 'text/csv')
    }
  },
}))
