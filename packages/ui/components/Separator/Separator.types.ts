import * as React from "react"
import { type VariantProps } from "class-variance-authority"

export interface SeparatorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children?: React.ReactNode
}

export type SeparatorVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
export type SeparatorSize = "default" | "sm" | "lg" | "icon"
