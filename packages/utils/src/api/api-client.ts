import { handleApiError } from './error-handler';
import type { RetryConfig } from './types';

export interface ApiClientConfig {
  baseUrl: string;
  headers?: Record<string, string>;
  retry?: RetryConfig;
  timeout?: number;
}

export interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string | number | boolean | null | undefined>;
  signal?: AbortSignal;
}

export function createApiClient(config: ApiClientConfig) {
  const { baseUrl, headers = {}, retry, timeout = 30000 } = config;

  async function request<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', headers: reqHeaders, body, params, signal } = options;

    const url = new URL(path, baseUrl);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== null && value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    if (signal) {
      signal.addEventListener('abort', () => controller.abort());
    }

    try {
      const response = await fetch(url.toString(), {
        method,
        headers: { 'Content-Type': 'application/json', ...headers, ...reqHeaders },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw Object.assign(new Error(errorData.message ?? response.statusText), {
          status: response.status,
          data: errorData,
        });
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw handleApiError(error);
    }
  }

  return {
    get: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
      request<T>(path, { ...options, method: 'GET' }),
    post: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
      request<T>(path, { ...options, method: 'POST', body }),
    put: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
      request<T>(path, { ...options, method: 'PUT', body }),
    patch: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
      request<T>(path, { ...options, method: 'PATCH', body }),
    delete: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
      request<T>(path, { ...options, method: 'DELETE' }),
  };
}
