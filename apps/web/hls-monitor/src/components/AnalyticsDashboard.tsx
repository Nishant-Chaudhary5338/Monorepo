import { useMemo } from 'react'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { useHlsStore, useStreamLogs } from '@repo/hls-player'
import type { SegmentEvent } from '@repo/hls-player'

type Props = {
  streamId?: string
}

function formatMs(ms: number): string {
  return `${ms.toFixed(0)}ms`
}

function formatMbps(bps: number): string {
  return `${(bps / 1_000_000).toFixed(2)}`
}

function toChartData(logs: SegmentEvent[]) {
  return logs
    .slice()
    .reverse()
    .slice(-60) // last 60 segments
    .map((l, i) => ({
      index: i,
      time: new Date(l.timestamp).toLocaleTimeString(),
      bitrateMbps: parseFloat(formatMbps(l.bitrate)),
      loadTimeMs: Math.round(l.loadTime),
      duration: parseFloat(l.duration.toFixed(2)),
      pts: parseFloat(l.pts.toFixed(2)),
      syncDelta: Math.abs(l.ptsAudioVideoDeltaMs),
    }))
}

function IssueBreakdown({ logs }: { logs: SegmentEvent[] }) {
  const counts = useMemo(() => {
    const map: Record<string, number> = {}
    for (const l of logs) {
      if (l.issue) map[l.issue] = (map[l.issue] ?? 0) + 1
    }
    return Object.entries(map).map(([name, value]) => ({ name: name.replace(/_/g, ' '), value }))
  }, [logs])

  if (counts.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-600 text-xs">
        No issues detected
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={counts} layout="vertical" margin={{ left: 8, right: 12 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
        <XAxis type="number" tick={{ fill: '#71717a', fontSize: 10 }} />
        <YAxis type="category" dataKey="name" tick={{ fill: '#a1a1aa', fontSize: 10 }} width={90} />
        <Tooltip
          contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: 8 }}
          labelStyle={{ color: '#a1a1aa' }}
          itemStyle={{ color: '#f87171' }}
        />
        <Bar dataKey="value" fill="#ef4444" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function AnalyticsDashboard({ streamId }: Props) {
  const logs = useStreamLogs(streamId)
  const streams = useHlsStore((s) => s.streams)
  const chartData = useMemo(() => toChartData(logs), [logs])

  const activeStream = streamId
    ? streams.find((s) => s.id === streamId)
    : streams[0]

  const avgBitrate = logs.length
    ? logs.reduce((acc, l) => acc + l.bitrate, 0) / logs.length
    : 0

  const avgLoad = logs.length
    ? logs.reduce((acc, l) => acc + l.loadTime, 0) / logs.length
    : 0

  const errorRate = logs.length
    ? ((logs.filter((l) => l.severity === 'error').length / logs.length) * 100).toFixed(1)
    : '0.0'

  const tooltipStyle = {
    contentStyle: { background: '#18181b', border: '1px solid #3f3f46', borderRadius: 8, fontSize: 11 },
    labelStyle: { color: '#71717a' },
  }

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto px-1">
      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-3">
        <KPICard label="Avg Bitrate" value={`${formatMbps(avgBitrate)} Mbps`} color="text-blue-400" />
        <KPICard label="Avg Load" value={formatMs(avgLoad)} color="text-yellow-400" />
        <KPICard label="Error Rate" value={`${errorRate}%`} color="text-red-400" />
        <KPICard label="Segments" value={logs.length.toString()} color="text-emerald-400" />
      </div>

      {/* Bitrate over time */}
      <ChartCard title="Bitrate (Mbps)">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ left: 0, right: 8, top: 4 }}>
            <defs>
              <linearGradient id="bitrateGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="time" tick={{ fill: '#52525b', fontSize: 9 }} />
            <YAxis tick={{ fill: '#52525b', fontSize: 9 }} />
            <Tooltip {...tooltipStyle} />
            <Area type="monotone" dataKey="bitrateMbps" stroke="#3b82f6" fill="url(#bitrateGrad)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Load time */}
      <ChartCard title="Segment Load Time (ms)">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ left: 0, right: 8, top: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="time" tick={{ fill: '#52525b', fontSize: 9 }} />
            <YAxis tick={{ fill: '#52525b', fontSize: 9 }} />
            <Tooltip {...tooltipStyle} />
            <Line type="monotone" dataKey="loadTimeMs" stroke="#f59e0b" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* A/V sync */}
      {activeStream && (
        <ChartCard title="A/V Sync Delta (ms)">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ left: 0, right: 8, top: 4 }}>
              <defs>
                <linearGradient id="syncGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="time" tick={{ fill: '#52525b', fontSize: 9 }} />
              <YAxis tick={{ fill: '#52525b', fontSize: 9 }} />
              <Tooltip {...tooltipStyle} />
              <Area type="monotone" dataKey="syncDelta" stroke="#a855f7" fill="url(#syncGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {/* Issue breakdown */}
      <ChartCard title="Issue Breakdown">
        <IssueBreakdown logs={logs} />
      </ChartCard>
    </div>
  )
}

function KPICard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <p className="text-zinc-500 text-xs mb-1">{label}</p>
      <p className={`text-xl font-bold font-mono ${color}`}>{value}</p>
    </div>
  )
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4" style={{ height: 180 }}>
      <p className="text-zinc-400 text-xs font-medium mb-3">{title}</p>
      <div className="h-[130px]">{children}</div>
    </div>
  )
}
