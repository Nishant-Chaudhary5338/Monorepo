import Hls, { Events } from 'hls.js'
import type { IssueKind } from '../types/index.js'

export type HealthEvent = {
  streamId: string
  issue: IssueKind
  detail?: string
  timestamp: number
}

type StreamHealthOptions = {
  streamId: string
  onIssue: (event: HealthEvent) => void
}

const STALE_MANIFEST_THRESHOLD_MS = 15_000
const MAX_SEQ_GAP = 3

export class StreamHealth {
  private streamId: string
  private onIssue: (event: HealthEvent) => void
  private lastManifestLoad = 0
  private lastSeqNum = -1
  private staleTimer: ReturnType<typeof setInterval> | null = null
  private discontinuitySeq = -1

  constructor(opts: StreamHealthOptions) {
    this.streamId = opts.streamId
    this.onIssue = opts.onIssue
  }

  attach(hls: Hls): void {
    hls.on(Events.LEVEL_LOADED, () => {
      this.lastManifestLoad = Date.now()
    })

    hls.on(Events.MANIFEST_LOADED, () => {
      this.lastManifestLoad = Date.now()
      this.startStaleManifestWatch()
    })

    hls.on(Events.FRAG_LOADED, (_, data) => {
      const seqNum = data.frag.sn as number
      const discSeq = data.frag.cc // continuity counter (increments on discontinuity)

      // Discontinuity detection
      if (this.discontinuitySeq >= 0 && discSeq > this.discontinuitySeq) {
        this.emit('DISCONTINUITY', `cc ${this.discontinuitySeq} → ${discSeq}`)
      }
      this.discontinuitySeq = discSeq

      // Sequence gap detection (larger than 1 missing segment)
      if (this.lastSeqNum >= 0 && seqNum > this.lastSeqNum + MAX_SEQ_GAP) {
        this.emit('GAP', `sn ${this.lastSeqNum} → ${seqNum}`)
      }
      this.lastSeqNum = seqNum
    })

    hls.on(Events.ERROR, (_, data) => {
      if (data.details === 'manifestLoadError' || data.details === 'manifestLoadTimeOut') {
        this.emit('STALE_MANIFEST', data.details)
      }
      if (data.details === 'fragLoadError' || data.details === 'fragLoadTimeOut') {
        this.emit('NETWORK_ERROR', data.details)
      }
    })
  }

  private startStaleManifestWatch(): void {
    if (this.staleTimer) clearInterval(this.staleTimer)

    this.staleTimer = setInterval(() => {
      const elapsed = Date.now() - this.lastManifestLoad
      if (elapsed > STALE_MANIFEST_THRESHOLD_MS) {
        this.emit('STALE_MANIFEST', `${Math.round(elapsed / 1000)}s since last update`)
      }
    }, 5000)
  }

  private emit(issue: IssueKind, detail?: string): void {
    this.onIssue({ streamId: this.streamId, issue, detail, timestamp: Date.now() })
  }

  destroy(): void {
    if (this.staleTimer) clearInterval(this.staleTimer)
    this.staleTimer = null
  }
}
