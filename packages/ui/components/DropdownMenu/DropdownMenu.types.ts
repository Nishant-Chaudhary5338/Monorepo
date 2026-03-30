import * as React from "react"

export interface DropdownMenuProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children?: React.ReactNode
}

export type DropdownMenuVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
export type DropdownMenuSize = "default" | "sm" | "lg" | "icon"