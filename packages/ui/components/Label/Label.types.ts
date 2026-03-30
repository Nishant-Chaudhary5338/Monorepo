import * as React from "react"
import { type VariantProps } from "class-variance-authority"

export interface LabelProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children?: React.ReactNode
}

export type LabelVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
export type LabelSize = "default" | "sm" | "lg" | "icon"
