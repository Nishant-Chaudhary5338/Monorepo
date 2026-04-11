const BASE = 'http://localhost:3001'

export interface CallResult {
  success: boolean
  result?: unknown
  error?: string
  duration: number
}

export interface ParallelCallInput {
  id: string
  server: string
  tool: string
  args: Record<string, unknown>
}

export interface ParallelResult {
  id: string
  success: boolean
  result?: unknown
  error?: string
  duration: number
}

export async function callTool(
  server: string,
  tool: string,
  args: Record<string, unknown> = {}
): Promise<CallResult> {
  const res = await fetch(`${BASE}/api/call`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ server, tool, args }),
  })
  return res.json()
}

export async function callParallel(calls: ParallelCallInput[]): Promise<ParallelResult[]> {
  const res = await fetch(`${BASE}/api/parallel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ calls }),
  })
  const data = await res.json()
  return data.results
}

export async function getTools() {
  const res = await fetch(`${BASE}/api/tools`)
  return res.json()
}
