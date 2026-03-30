import * as React from "react"

// This file mirrors the ButtonProps type for type-only imports.
// Prefer importing ButtonProps directly from ./Button.
export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string
  children?: React.ReactNode
  asChild?: boolean
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

export type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
export type ButtonSize = "default" | "sm" | "lg" | "icon"
