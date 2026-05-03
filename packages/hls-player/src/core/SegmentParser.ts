import Hls, { Events } from 'hls.js'
import type { SegmentEvent, IssueSeverity } from '../types/index.js'

type SegmentParserOptions = {
  streamId: string
  onSegment: (event: SegmentEvent) => void
}

export class SegmentParser {
  private streamId: string
  private onSegment: (event: SegmentEvent) => void
  private lastSequenceNumber = -1
  private lastPts = -1

  constructor(opts: SegmentParserOptions) {
    this.streamId = opts.streamId
    this.onSegment = opts.onSegment
  }

  attach(hls: Hls): void {
    hls.on(Events.FRAG_LOADED, (_, data) => {
      const frag = data.frag
      const stats = frag.stats

      const seqNum = frag.sn as number
      const pts = frag.start ?? 0
      const dts = frag.rawProgramDateTime ? new Date(frag.rawProgramDateTime).getTime() / 1000 : pts
      const loadTime = stats.loading.end - stats.loading.start
      const bitrate = (data.frag.stats.total * 8) / (frag.duration || 1)

      let issue: SegmentEvent['issue'] | undefined
      let severity: IssueSeverity = 'info'

      // Gap detection
      if (this.lastSequenceNumber >= 0 && seqNum !== this.lastSequenceNumber + 1) {
        issue = 'GAP'
        severity = 'warn'
      }

      // Late segment (load time > 2× segment duration)
      if (loadTime > frag.duration * 2000) {
        issue = 'LATE_SEGMENT'
        severity = 'warn'
      }

      // Network error (load time very high)
      if (loadTime > 10000) {
        issue = 'NETWORK_ERROR'
        severity = 'error'
      }

      const event: SegmentEvent = {
        streamId: this.streamId,
        timestamp: Date.now(),
        segmentUri: frag.relurl ?? frag.url,
        sequenceNumber: seqNum,
        duration: frag.duration,
        pts,
        dts,
        ptsAudioVideoDeltaMs: 0, // updated by audio worker
        codecString: (hls.levels?.[hls.currentLevel]?.codecSet) ?? 'unknown',
        bitrate,
        loadTime,
        issue,
        severity,
      }

      this.lastSequenceNumber = seqNum
      this.lastPts = pts
      this.onSegment(event)
    })

    hls.on(Events.FRAG_PARSING_METADATA, (_, data) => {
      // ID3 metadata events — used by ScteParser if SCTE-35 is in ID3
      void data
    })

    hls.on(Events.ERROR, (_, data) => {
      if (data.details === 'fragLoadError' || data.details === 'fragLoadTimeOut') {
        const event: SegmentEvent = {
          streamId: this.streamId,
          timestamp: Date.now(),
          segmentUri: data.frag?.relurl ?? '',
          sequenceNumber: (data.frag?.sn as number) ?? -1,
          duration: data.frag?.duration ?? 0,
          pts: 0,
          dts: 0,
          ptsAudioVideoDeltaMs: 0,
          codecString: 'unknown',
          bitrate: 0,
          loadTime: 0,
          issue: 'NETWORK_ERROR',
          severity: 'error',
        }
        this.onSegment(event)
      }
    })
  }

  reset(): void {
    this.lastSequenceNumber = -1
    this.lastPts = -1
  }
}
