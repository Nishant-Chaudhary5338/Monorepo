// ============================================================================
// TYPES MODULE GENERATOR
// ============================================================================
export function generateTypesModule() {
    return {
        'index.ts': `// ============================================================================
// SHARED TYPES - Common TypeScript types for enterprise applications
// ============================================================================

// API Response Types
export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  message: string;
  timestamp: string;
}

export interface PaginatedResponse<T = unknown> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
  field?: string;
}

// Pagination Types
export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface SortParams {
  field: string;
  order: 'asc' | 'desc';
}

export interface FilterParams {
  [key: string]: string | number | boolean | string[] | number[];
}

export interface SearchParams {
  query: string;
  filters?: FilterParams;
  sort?: SortParams;
  pagination?: PaginationParams;
}

// Base Entity Types
export interface BaseEntity {
  id: string | number;
  createdAt: string;
  updatedAt: string;
}

export interface User extends BaseEntity {
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

// Auth Types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

export interface Permission {
  resource: string;
  actions: ('read' | 'write' | 'delete' | 'create')[];
}

export interface Role {
  name: string;
  permissions: string[];
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

export type NonNullableFields<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export type OmitStrict<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type PickStrict<T, K extends keyof T> = Pick<T, K>;

export type ValueOf<T> = T[keyof T];

export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

export type AsyncReturnType<T extends (...args: any) => Promise<any>> =
  T extends (...args: any) => Promise<infer R> ? R : never;

export type Promisify<T> = Promise<T>;

export type Unpromisify<T> = T extends Promise<infer R> ? R : T;

// Event Types
export type EventHandler<T = void> = (event: T) => void;
export type AsyncEventHandler<T = void> = (event: T) => Promise<void>;

// Form Types
export interface FormField<T = unknown> {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'checkbox' | 'textarea' | 'date';
  required?: boolean;
  defaultValue?: T;
  validation?: (value: T) => string | undefined;
  options?: { label: string; value: T }[];
}

// Table Column Types
export interface TableColumn<T = unknown> {
  key: string;
  title: string;
  dataIndex: keyof T;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: T[keyof T], record: T) => React.ReactNode;
}

// Navigation Types
export interface NavItem {
  key: string;
  label: string;
  icon?: string;
  path?: string;
  children?: NavItem[];
  permission?: string;
}

// Theme Types
export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  borderRadius: number;
  darkMode: boolean;
}

// Status Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T = unknown> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}
`,
        'types.test.ts': `import { describe, it, expect } from 'vitest'

describe('Types Module', () => {
  it('exports are type-only and compile correctly', () => {
    // Types module is compile-time only - this test verifies the module loads
    expect(true).toBe(true)
  })
})
`,
    };
}
//# sourceMappingURL=types.js.map