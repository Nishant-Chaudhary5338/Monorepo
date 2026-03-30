import * as React from "react"
import { type VariantProps } from "class-variance-authority"

export interface CheckboxProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children?: React.ReactNode
}

export type CheckboxVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
export type CheckboxSize = "default" | "sm" | "lg" | "icon"
