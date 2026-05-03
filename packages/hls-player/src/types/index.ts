export type CodecTier = 'native-hevc' | 'wasm-hevc' | 'h264'

export type StreamStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error' | 'stalled'

export type IssueSeverity = 'info' | 'warn' | 'error'

export type IssueKind =
  | 'GAP'
  | 'STALE_MANIFEST'
  | 'LATE_SEGMENT'
  | 'NETWORK_ERROR'
  | 'DISCONTINUITY'
  | 'BLACK_SCREEN'
  | 'FREEZE'
  | 'AUDIO_SILENCE'
  | 'SYNC_DRIFT'

export type Scte35Marker = {
  type: 'CUE_IN' | 'CUE_OUT'
  time: number
  duration?: number
  rawBase64?: string
}

export type SegmentEvent = {
  streamId: string
  timestamp: number
  segmentUri: string
  sequenceNumber: number
  duration: number
  pts: number
  dts: number
  ptsAudioVideoDeltaMs: number
  codecString: string
  bitrate: number
  loadTime: number
  scte35?: Scte35Marker
  issue?: IssueKind
  severity: IssueSeverity
}

export type StreamVariant = {
  bandwidth: number
  resolution?: string
  codecs?: string
  uri: string
  level: number
}

export type StreamMetrics = {
  bitrate: number
  bufferLength: number
  currentLevel: number
  latency: number
  droppedFrames: number
  loadTime: number
  codecTier: CodecTier
  codecString: string
}

export type HlsStream = {
  id: string
  url: string
  title: string
  status: StreamStatus
  metrics: StreamMetrics
  variants: StreamVariant[]
  issues: IssueKind[]
  muted: boolean
}

export type QualityIssueEvent = {
  streamId: string
  kind: IssueKind
  timestamp: number
  detail?: string
}
