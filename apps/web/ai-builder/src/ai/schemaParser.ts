// ─── Schema Parser ────────────────────────────────────────────────────────────
// Handles LLM output that may be wrapped in markdown code fences or have
// leading/trailing whitespace. Returns parsed value or throws.

/**
 * Strip markdown code fences (```json ... ``` or ``` ... ```) and parse JSON.
 * Falls back to direct parse if no fences found.
 */
export function extractJSON(raw: string): unknown {
  const trimmed = raw.trim()

  // Strip ```json ... ``` or ``` ... ```
  const fenceMatch = trimmed.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```\s*$/)
  const jsonStr = fenceMatch ? fenceMatch[1].trim() : trimmed

  return JSON.parse(jsonStr)
}

/**
 * Try to extract and parse JSON from a partial stream buffer.
 * Returns null if the buffer isn't valid JSON yet (still streaming).
 */
export function tryParsePartial(buffer: string): unknown | null {
  try {
    return extractJSON(buffer)
  } catch {
    return null
  }
}
