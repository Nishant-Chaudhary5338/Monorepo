import * as React from "react"
import { type VariantProps } from "class-variance-authority"

export interface InputProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children?: React.ReactNode
}

export type InputVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
export type InputSize = "default" | "sm" | "lg" | "icon"
