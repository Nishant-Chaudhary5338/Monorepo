// ============================================================================
// API MODULE GENERATOR
// ============================================================================

export function generateApiModule(): Record<string, string> {
  return {
    'index.ts': `// ============================================================================
// API MODULE - HTTP client, interceptors, and request handling
// ============================================================================

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  body?: unknown;
  timeout?: number;
  signal?: AbortSignal;
}

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export interface ApiError {
  status: number;
  message: string;
  data?: unknown;
}

export type RequestInterceptor = (config: RequestOptions & { url: string; method: HttpMethod }) => RequestOptions & { url: string; method: HttpMethod };
export type ResponseInterceptor = (response: ApiResponse) => ApiResponse;
export type ErrorInterceptor = (error: ApiError) => ApiError | Promise<never>;

/**
 * Builds a query string from an object
 * @param params - Parameter object
 * @returns Query string without leading ?
 * @example buildQueryString({ page: 1, limit: 10 }) // 'page=1&limit=10'
 */
export function buildQueryString(params: Record<string, string | number | boolean>): string {
  return Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => \`\${encodeURIComponent(k)}=\${encodeURIComponent(String(v))}\`)
    .join('&');
}

/**
 * Builds a full URL with query parameters
 * @param base - Base URL
 * @param path - Path to append
 * @param params - Optional query parameters
 * @returns Full URL string
 */
export function buildUrl(base: string, path: string, params?: Record<string, string | number | boolean>): string {
  const url = new URL(path, base);
  if (params) {
    const qs = buildQueryString(params);
    if (qs) url.search = qs;
  }
  return url.toString();
}

/**
 * Parses response headers from a Headers object
 * @param headers - Response headers
 * @returns Plain object of headers
 */
export function parseHeaders(headers: Headers): Record<string, string> {
  const result: Record<string, string> = {};
  headers.forEach((value, key) => {
    result[key.toLowerCase()] = value;
  });
  return result;
}

/**
 * Handles API response, throwing on error status
 * @param response - Fetch Response object
 * @returns Parsed API response
 */
export async function handleResponse<T = unknown>(response: Response): Promise<ApiResponse<T>> {
  const headers = parseHeaders(response.headers);
  let data: T;

  const contentType = headers['content-type'] || '';
  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = (await response.text()) as unknown as T;
  }

  if (!response.ok) {
    const error: ApiError = {
      status: response.status,
      message: response.statusText || 'Request failed',
      data,
    };
    throw error;
  }

  return {
    data,
    status: response.status,
    statusText: response.statusText,
    headers,
  };
}

/**
 * Retries a function with exponential backoff
 * @param fn - Async function to retry
 * @param options - Retry options
 * @returns Promise resolving to function result
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: { maxRetries?: number; baseDelay?: number; maxDelay?: number } = {}
): Promise<T> {
  const { maxRetries = 3, baseDelay = 1000, maxDelay = 10000 } = options;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error('Retry failed');
}

/**
 * Creates an API client with interceptors
 * @param baseUrl - Base URL for the API
 * @returns API client object
 */
export function createApiClient(baseUrl: string) {
  const requestInterceptors: RequestInterceptor[] = [];
  const responseInterceptors: ResponseInterceptor[] = [];
  const errorInterceptors: ErrorInterceptor[] = [];

  async function request<T = unknown>(method: HttpMethod, path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    let config = { ...options, url: buildUrl(baseUrl, path, options.params), method };

    for (const interceptor of requestInterceptors) {
      config = interceptor(config);
    }

    try {
      const response = await fetch(config.url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...config.headers,
        },
        body: config.body ? JSON.stringify(config.body) : undefined,
        signal: config.signal,
      });

      let apiResponse = await handleResponse<T>(response);

      for (const interceptor of responseInterceptors) {
        apiResponse = interceptor(apiResponse) as ApiResponse<T>;
      }

      return apiResponse;
    } catch (error) {
      for (const interceptor of errorInterceptors) {
        await interceptor(error as ApiError);
      }
      throw error;
    }
  }

  return {
    get: <T = unknown>(path: string, options?: RequestOptions) => request<T>('GET', path, options),
    post: <T = unknown>(path: string, body?: unknown, options?: RequestOptions) => request<T>('POST', path, { ...options, body }),
    put: <T = unknown>(path: string, body?: unknown, options?: RequestOptions) => request<T>('PUT', path, { ...options, body }),
    patch: <T = unknown>(path: string, body?: unknown, options?: RequestOptions) => request<T>('PATCH', path, { ...options, body }),
    delete: <T = unknown>(path: string, options?: RequestOptions) => request<T>('DELETE', path, options),
    addRequestInterceptor: (interceptor: RequestInterceptor) => requestInterceptors.push(interceptor),
    addResponseInterceptor: (interceptor: ResponseInterceptor) => responseInterceptors.push(interceptor),
    addErrorInterceptor: (interceptor: ErrorInterceptor) => errorInterceptors.push(interceptor),
  };
}
`,
    'api.test.ts': `import { describe, it, expect } from 'vitest'
import { buildQueryString, buildUrl, withRetry } from './index'

describe('API Module', () => {
  describe('buildQueryString', () => {
    it('builds query string from object', () => {
      expect(buildQueryString({ page: 1, limit: 10 })).toBe('page=1&limit=10')
    })

    it('filters undefined values', () => {
      expect(buildQueryString({ a: 1, b: undefined as any, c: 3 })).toBe('a=1&c=3')
    })

    it('encodes special characters', () => {
      expect(buildQueryString({ q: 'hello world' })).toBe('q=hello%20world')
    })

    it('returns empty string for empty object', () => {
      expect(buildQueryString({})).toBe('')
    })
  })

  describe('buildUrl', () => {
    it('builds URL with path', () => {
      expect(buildUrl('https://api.example.com', '/users')).toContain('/users')
    })

    it('builds URL with query params', () => {
      const url = buildUrl('https://api.example.com', '/users', { page: 1 })
      expect(url).toContain('page=1')
    })
  })

  describe('withRetry', () => {
    it('succeeds on first try', async () => {
      let calls = 0
      const result = await withRetry(async () => {
        calls++
        return 'success'
      })
      expect(result).toBe('success')
      expect(calls).toBe(1)
    })

    it('retries on failure', async () => {
      let calls = 0
      const result = await withRetry(
        async () => {
          calls++
          if (calls < 3) throw new Error('fail')
          return 'success'
        },
        { maxRetries: 3, baseDelay: 10 }
      )
      expect(result).toBe('success')
      expect(calls).toBe(3)
    })
  })
})
`,
  };
}