// ============================================
// Common API Types
// ============================================

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T = unknown> {
  data: T[];
  meta: PaginationMeta;
  message?: string;
  success: boolean;
}

export interface PaginationMeta {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  code: string;
  details?: unknown;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface SortParams {
  field: string;
  order: 'asc' | 'desc';
}

export interface FilterParams {
  [key: string]: string | number | boolean | string[] | number[] | null | undefined;
}

export interface SearchParams {
  query: string;
  fields?: string[];
}

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

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
}

export type Permission = string;

export interface Role {
  name: string;
  permissions: Permission[];
}

export type SortOrder = 'asc' | 'desc';

export interface KeyValuePair<T = unknown> {
  key: string;
  value: T;
}

export type { Nullable, Optional, Maybe } from './utility-types';

export interface SelectOption<T extends string | number = string> {
  label: string;
  value: T;
  disabled?: boolean;
}

export interface TreeNode<T = unknown> {
  id: string;
  data: T;
  children?: TreeNode<T>[];
  parent?: string;
}

export type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

export type VoidFn = () => void;

export type AnyFn = (...args: any[]) => any;
