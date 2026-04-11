// ─── Provider & Model Registry ───────────────────────────────────────────────

export type ProviderId = 'groq' | 'openrouter'

export interface ModelOption {
  id: string
  label: string
  description?: string
}

export interface ProviderConfig {
  id: ProviderId
  label: string
  baseURL: string
  apiKeyEnv: string   // VITE_ env var name
  models: ModelOption[]
  defaultModel: string
  defaultHeaders?: Record<string, string>
}

// ─── Groq ─────────────────────────────────────────────────────────────────────
// Free tier, very fast inference, OpenAI-compatible
// https://console.groq.com/keys

const GROQ: ProviderConfig = {
  id: 'groq',
  label: 'Groq',
  baseURL: 'https://api.groq.com/openai/v1',
  apiKeyEnv: 'VITE_GROQ_API_KEY',
  defaultModel: 'llama-3.3-70b-versatile',
  models: [
    {
      id: 'llama-3.3-70b-versatile',
      label: 'Llama 3.3 70B',
      description: 'Best quality, free tier',
    },
    {
      id: 'llama-3.1-70b-versatile',
      label: 'Llama 3.1 70B',
      description: 'Solid, reliable',
    },
    {
      id: 'llama-3.1-8b-instant',
      label: 'Llama 3.1 8B',
      description: 'Fastest, smaller',
    },
    {
      id: 'mixtral-8x7b-32768',
      label: 'Mixtral 8x7B',
      description: 'Long context (32k)',
    },
    {
      id: 'gemma2-9b-it',
      label: 'Gemma 2 9B',
      description: 'Google model',
    },
  ],
}

// ─── OpenRouter ───────────────────────────────────────────────────────────────
// Multi-model router, includes Claude/GPT/Gemini/Llama
// https://openrouter.ai/keys

const OPENROUTER: ProviderConfig = {
  id: 'openrouter',
  label: 'OpenRouter',
  baseURL: 'https://openrouter.ai/api/v1',
  apiKeyEnv: 'VITE_OPENROUTER_API_KEY',
  defaultModel: 'anthropic/claude-3.5-sonnet',
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:5174',
    'X-Title': 'AI Builder',
  },
  models: [
    {
      id: 'anthropic/claude-3.5-sonnet',
      label: 'Claude 3.5 Sonnet',
      description: 'Best JSON quality',
    },
    {
      id: 'anthropic/claude-3-haiku',
      label: 'Claude 3 Haiku',
      description: 'Fast + cheap',
    },
    {
      id: 'anthropic/claude-3.5-haiku',
      label: 'Claude 3.5 Haiku',
      description: 'Fast, improved',
    },
    {
      id: 'openai/gpt-4o-mini',
      label: 'GPT-4o mini',
      description: 'Fast, cheap',
    },
    {
      id: 'openai/gpt-4o',
      label: 'GPT-4o',
      description: 'OpenAI flagship',
    },
    {
      id: 'google/gemini-flash-1.5',
      label: 'Gemini Flash 1.5',
      description: 'Fast, free tier',
    },
    {
      id: 'meta-llama/llama-3.1-70b-instruct:free',
      label: 'Llama 3.1 70B (free)',
      description: 'OpenRouter free tier',
    },
    {
      id: 'mistralai/mistral-7b-instruct:free',
      label: 'Mistral 7B (free)',
      description: 'OpenRouter free tier',
    },
  ],
}

// ─── Registry ─────────────────────────────────────────────────────────────────

export const PROVIDERS: Record<ProviderId, ProviderConfig> = {
  groq: GROQ,
  openrouter: OPENROUTER,
}

export const DEFAULT_PROVIDER: ProviderId = 'groq'

export function getProvider(id: ProviderId): ProviderConfig {
  return PROVIDERS[id]
}

export function getApiKey(provider: ProviderConfig): string {
  return (import.meta.env[provider.apiKeyEnv] as string) ?? ''
}
