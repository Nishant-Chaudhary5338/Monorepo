import * as React from "react"
import { type VariantProps } from "class-variance-authority"

export interface TabsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children?: React.ReactNode
}

export type TabsVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
export type TabsSize = "default" | "sm" | "lg" | "icon"
