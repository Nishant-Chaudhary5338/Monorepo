import OpenAI from 'openai'
import type { AIDashboardSchema, DiffPatchList } from '../types/schema'
import { getProvider, getApiKey, DEFAULT_PROVIDER } from './providers'
import type { ProviderId } from './providers'
import { SYSTEM_PROMPT_CREATE, SYSTEM_PROMPT_DIFF } from './prompts'
import { extractJSON } from './schemaParser'
import { validateSchema } from '../lib/validateSchema'

// ─── Client factory ───────────────────────────────────────────────────────────

function makeClient(providerId: ProviderId): OpenAI {
  const provider = getProvider(providerId)
  const apiKey = getApiKey(provider)

  return new OpenAI({
    baseURL: provider.baseURL,
    apiKey: apiKey || 'no-key',
    defaultHeaders: provider.defaultHeaders,
    dangerouslyAllowBrowser: true,
  })
}

// ─── Generate schema (create mode) ───────────────────────────────────────────

export async function generateSchema(
  prompt: string,
  model: string,
  providerId: ProviderId = DEFAULT_PROVIDER,
  onToken: (token: string) => void = () => {}
): Promise<AIDashboardSchema | null> {
  const client = makeClient(providerId)

  let buffer = ''

  try {
    const stream = await client.chat.completions.create({
      model,
      stream: true,
      temperature: 0.2,
      max_tokens: 3000,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT_CREATE },
        { role: 'user', content: prompt },
      ],
    })

    for await (const chunk of stream) {
      const token = chunk.choices[0]?.delta?.content ?? ''
      if (token) {
        buffer += token
        onToken(token)
      }
    }
  } catch (err) {
    // Some providers (OpenRouter with certain models) don't support json_object format.
    // Retry without it.
    console.warn('[aiClient] json_object format failed, retrying without it:', err)
    buffer = ''

    const stream = await client.chat.completions.create({
      model,
      stream: true,
      temperature: 0.2,
      max_tokens: 3000,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT_CREATE },
        { role: 'user', content: prompt },
      ],
    })

    for await (const chunk of stream) {
      const token = chunk.choices[0]?.delta?.content ?? ''
      if (token) {
        buffer += token
        onToken(token)
      }
    }
  }

  try {
    const parsed = extractJSON(buffer)
    const schema = validateSchema(parsed)
    if (!schema) throw new Error('Schema validation failed')
    return schema
  } catch (err) {
    console.error('[aiClient] Failed to parse schema:', err)
    console.error('[aiClient] Raw output:', buffer)
    return null
  }
}

// ─── Generate diff (update mode) ─────────────────────────────────────────────

export async function generateDiff(
  prompt: string,
  currentSchema: AIDashboardSchema,
  model: string,
  providerId: ProviderId = DEFAULT_PROVIDER,
  onToken: (token: string) => void = () => {}
): Promise<DiffPatchList | null> {
  const client = makeClient(providerId)

  const userContent = `CURRENT SCHEMA:
${JSON.stringify(currentSchema, null, 2)}

USER REQUEST:
${prompt}

Return ONLY a JSON object with a "patches" array of DiffPatch operations.`

  let buffer = ''

  try {
    const stream = await client.chat.completions.create({
      model,
      stream: true,
      temperature: 0.1,
      max_tokens: 1500,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT_DIFF },
        { role: 'user', content: userContent },
      ],
    })

    for await (const chunk of stream) {
      const token = chunk.choices[0]?.delta?.content ?? ''
      if (token) {
        buffer += token
        onToken(token)
      }
    }
  } catch {
    buffer = ''

    const stream = await client.chat.completions.create({
      model,
      stream: true,
      temperature: 0.1,
      max_tokens: 1500,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT_DIFF },
        { role: 'user', content: userContent },
      ],
    })

    for await (const chunk of stream) {
      const token = chunk.choices[0]?.delta?.content ?? ''
      if (token) {
        buffer += token
        onToken(token)
      }
    }
  }

  try {
    const parsed = extractJSON(buffer) as { patches?: unknown }
    if (!Array.isArray(parsed?.patches)) throw new Error('No patches array')
    return parsed.patches as DiffPatchList
  } catch (err) {
    console.error('[aiClient] Failed to parse diff:', err)
    console.error('[aiClient] Raw output:', buffer)
    return null
  }
}

// ─── API key check ────────────────────────────────────────────────────────────

export function hasApiKey(providerId: ProviderId): boolean {
  const provider = getProvider(providerId)
  return Boolean(getApiKey(provider))
}
