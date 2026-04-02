# AI Layer

Everything about Ollama, the system prompts, model constraints, and the diff strategy.

---

## Ollama Setup

### One-time machine setup
```bash
brew install ollama
ollama pull llama3.2:3b       # ~2GB download
ollama serve                   # starts REST server at http://localhost:11434
```

### Verify it's running
```bash
curl http://localhost:11434/api/tags
# should list { "models": [{ "name": "llama3.2:3b", ... }] }
```

### Check Ollama is up in the app
```typescript
// ai/ollamaClient.ts
export async function isOllamaRunning(): Promise<boolean> {
  try {
    const res = await fetch('http://localhost:11434/api/tags')
    return res.ok
  } catch {
    return false
  }
}
```

---

## Client Setup

We use the `openai` npm package pointed at Ollama's OpenAI-compatible endpoint.

```typescript
// ai/ollamaClient.ts
import OpenAI from 'openai'

export const ollama = new OpenAI({
  baseURL: 'http://localhost:11434/v1',
  apiKey: 'ollama',             // required by SDK, value doesn't matter
  dangerouslyAllowBrowser: true // we're in a Vite app, no server
})

export const MODEL = 'llama3.2:3b'
```

---

## Model Constraints (llama3.2:3b on 8GB RAM)

| Constraint | Value | Implication |
|---|---|---|
| RAM footprint | ~2GB | Fine on 8GB; leave headroom for browser + Vite |
| Context window | 128k tokens | More than enough for our schemas |
| JSON reliability | Moderate | Must use `response_format: { type: "json_object" }` |
| Temperature for JSON | 0.1 | Low = more deterministic, fewer hallucinations |
| Max output tokens | 2048 | Prevents runaway generation; enough for 10-15 widget schema |
| Speed | ~15–25 tok/s | Streaming makes this feel responsive |
| Hallucination risk | Medium | Validate all output before rendering (see schema validation) |

---

## Generation Modes

### Mode 1: `create` — initial generation from prompt

```typescript
export async function generateSchema(
  prompt: string,
  onToken: (token: string) => void
): Promise<AIDashboardSchema | null>
```

**Request:**
```typescript
const stream = await ollama.chat.completions.create({
  model: MODEL,
  stream: true,
  temperature: 0.1,
  max_tokens: 2048,
  response_format: { type: 'json_object' },
  messages: [
    { role: 'system', content: SYSTEM_PROMPT_CREATE },
    { role: 'user', content: prompt }
  ]
})
```

**Streaming strategy:**
- Accumulate tokens into a buffer
- On each token, try `JSON.parse(buffer)` — if valid, emit partial schema
- Final: validate full schema via `validateSchema()`

---

### Mode 2: `diff` — follow-up prompt patches existing schema

```typescript
export async function generateDiff(
  prompt: string,
  currentSchema: AIDashboardSchema,
  onToken: (token: string) => void
): Promise<DiffPatchList | null>
```

**Request:**
```typescript
const stream = await ollama.chat.completions.create({
  model: MODEL,
  stream: true,
  temperature: 0.2,
  max_tokens: 1024,
  response_format: { type: 'json_object' },
  messages: [
    { role: 'system', content: SYSTEM_PROMPT_DIFF },
    {
      role: 'user',
      content: `
CURRENT SCHEMA:
${JSON.stringify(currentSchema, null, 2)}

USER REQUEST:
${prompt}

Return ONLY a JSON object with a "patches" array of DiffPatch operations.
`
    }
  ]
})
```

---

## System Prompts

### SYSTEM_PROMPT_CREATE

```
You are an AI that generates UI dashboard schemas in JSON format.

You have access to these widget types:
- "kpi": A metric card. Props: value (number), label (string), format ("number"|"currency"|"percent"), previousValue (number, optional)
- "bar": Bar chart. Props: data (array of objects), xAxisKey (string), series (array of {key, color})
- "line": Line chart. Same props as bar.
- "area": Area chart. Same props as bar.
- "pie": Pie chart. Props: data (array of {name, value, color})
- "card": A content card. Props: title (string), description (string), content (string)
- "table": Data table. Props: columns (array of {key, header}), rows (array of objects)
- "stat": Stat row. Props: items (array of {label, value, trend: "up"|"down"|"neutral"})
- "alert": Alert box. Props: variant ("default"|"destructive"), title, description
- "progress-group": Multiple progress bars. Props: items (array of {label, value, max})
- "section": Container with title. Has children[].
- "row": Horizontal flex row. Has children[].
- "placeholder": Use for unknown types.

You must return a valid JSON object matching this structure:
{
  "title": string,
  "layout": "grid" | "flex",
  "columns": number (1-4, for grid),
  "gap": number (8-24),
  "widgets": [
    {
      "id": string (kebab-case, descriptive, unique),
      "type": WidgetType,
      "title": string (optional),
      "colSpan": number (1-3, optional),
      "draggable": true,
      "deletable": true,
      "props": { ...component-specific props },
      "settings": {
        "highlight": boolean,
        "highlightColor": string (hex, optional)
      }
    }
  ]
}

Rules:
- Widget IDs must be unique, kebab-case, descriptive (e.g. "revenue-kpi", "monthly-sales-bar")
- Use realistic sample data in props (numbers, labels — not placeholder text)
- Keep total widgets between 3 and 8 for clean layouts
- Respond ONLY with the JSON object. No explanation, no markdown, no code fences.
```

### SYSTEM_PROMPT_DIFF

```
You are an AI that modifies UI dashboard schemas by generating patch operations.

A DiffPatch has this shape:
{
  "nodeId": string,       // ID of the widget to operate on
  "op": "update" | "add" | "remove" | "move",
  "payload": object,      // for update/add: partial widget schema
  "parentId": string,     // for add/move: parent widget ID or "root"
  "index": number         // for add/move: position index
}

You will receive the current schema and a user request.
Return a JSON object with a "patches" array. Modify ONLY what the user asks for.
Do NOT regenerate the entire schema.
Respond ONLY with the JSON. No explanation.

Example response:
{
  "patches": [
    { "nodeId": "revenue-kpi", "op": "update", "payload": { "settings": { "highlightColor": "#ef4444" } } }
  ]
}
```

---

## Diff Patcher

```typescript
// ai/diffPatcher.ts

export function applyPatches(
  schema: AIDashboardSchema,
  patches: DiffPatchList
): AIDashboardSchema {
  // Deep clone to avoid mutation
  const next = structuredClone(schema)

  for (const patch of patches) {
    switch (patch.op) {
      case 'update': {
        const node = findNode(next.widgets, patch.nodeId)
        if (node) Object.assign(node, deepMerge(node, patch.payload ?? {}))
        break
      }
      case 'add': {
        const parent = patch.parentId === 'root'
          ? { children: next.widgets }
          : findNode(next.widgets, patch.parentId ?? '')
        if (parent && patch.payload) {
          const idx = patch.index ?? parent.children?.length ?? 0
          parent.children = parent.children ?? []
          parent.children.splice(idx, 0, patch.payload as AIWidgetSchema)
        }
        break
      }
      case 'remove': {
        removeNode(next.widgets, patch.nodeId)
        break
      }
      case 'move': {
        const node = extractNode(next.widgets, patch.nodeId)
        if (!node) break
        const parent = patch.parentId === 'root'
          ? { children: next.widgets }
          : findNode(next.widgets, patch.parentId ?? '')
        if (parent) {
          parent.children = parent.children ?? []
          parent.children.splice(patch.index ?? 0, 0, node)
        }
        break
      }
    }
  }

  return next
}

// Helpers: findNode, removeNode, extractNode, deepMerge
```

---

## Error Handling

| Error | Recovery |
|---|---|
| Ollama not running | Show "Start Ollama: `ollama serve`" banner |
| Invalid JSON from LLM | Retry once with stricter prompt; show raw output in JSON panel |
| Unknown widget type | `WidgetRenderer` renders `<PlaceholderWidget>` with type label |
| Diff patch fails | Apply valid patches, skip invalid ones, warn in console |
| Stream interrupted | Show partial schema if valid; show error toast |
