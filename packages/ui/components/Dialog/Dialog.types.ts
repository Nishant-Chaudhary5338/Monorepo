import * as React from "react"
import { type VariantProps } from "class-variance-authority"

export interface DialogProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children?: React.ReactNode
}

export type DialogVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
export type DialogSize = "default" | "sm" | "lg" | "icon"
