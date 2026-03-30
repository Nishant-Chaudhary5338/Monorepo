export interface BaseApiConfig {
  baseUrl: string;
  reducerPath?: string;
  tagTypes?: string[];
  prepareHeaders?: (headers: Headers, api: { getState: () => unknown }) => Headers;
  fetchFn?: typeof fetch;
}

export interface PaginatedEndpointConfig {
  query: (params: Record<string, unknown>) => { url: string; params?: Record<string, unknown> };
  providesTags?: string[];
}

export interface CrudEndpointConfig {
  entity: string;
  baseUrl: string;
  tagTypes?: string[];
}

export interface NormalizedApiError {
  message: string;
  status: number;
  code: string;
  details?: unknown;
}

export interface RetryConfig {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  retryCondition?: (error: { status: number }) => boolean;
}
