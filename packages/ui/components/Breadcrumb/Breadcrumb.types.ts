/**
 * Breadcrumb component type definitions
 * @module Breadcrumb
 */

import * as React from "react"

/**
 * Props for the Breadcrumb root component.
 * Wraps nav element with separator support.
 */
export interface BreadcrumbProps extends React.ComponentPropsWithoutRef<"nav"> {
  /**
   * Custom separator element between breadcrumb items.
   */
  separator?: React.ReactNode
}

/**
 * Props for the BreadcrumbList component.
 * Wraps ol element for breadcrumb items.
 */
export type BreadcrumbListProps = React.ComponentPropsWithoutRef<"ol">

/**
 * Props for the BreadcrumbItem component.
 * Wraps li element for individual breadcrumb items.
 */
export type BreadcrumbItemProps = React.ComponentPropsWithoutRef<"li">

/**
 * Props for the BreadcrumbLink component.
 * Wraps anchor element with optional asChild support.
 */
export interface BreadcrumbLinkProps extends React.ComponentPropsWithoutRef<"a"> {
  /**
   * When true, renders the child as the link element.
   * Useful for composing with other components like Link.
   * 
   * @default false
   */
  asChild?: boolean
}

/**
 * Props for the BreadcrumbPage component.
 * Represents the current page in the breadcrumb.
 */
export type BreadcrumbPageProps = React.ComponentPropsWithoutRef<"span">

/**
 * Props for the BreadcrumbSeparator component.
 * Separator element between breadcrumb items.
 */
export type BreadcrumbSeparatorProps = React.ComponentProps<"li">

/**
 * Props for the BreadcrumbEllipsis component.
 * Indicates truncated breadcrumb items.
 */
export type BreadcrumbEllipsisProps = React.ComponentProps<"span">