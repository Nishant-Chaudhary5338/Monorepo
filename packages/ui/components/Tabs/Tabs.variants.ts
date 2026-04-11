import { cva } from "class-variance-authority"

export const tabsListVariants = cva(
  "inline-flex items-center justify-center",
  {
    variants: {
      variant: {
        default: "h-10 rounded-md bg-muted p-1 text-muted-foreground",
        underline: "h-auto rounded-none bg-transparent p-0 border-b border-border w-full gap-0",
        pills: "gap-1 bg-transparent p-0 h-auto",
        boxed: "border border-border rounded-md bg-transparent p-0 gap-0 divide-x divide-border h-auto",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "rounded-sm px-3 py-1.5 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        underline:
          "rounded-none px-4 py-2.5 border-b-2 border-transparent -mb-px data-[state=active]:border-primary data-[state=active]:text-foreground text-muted-foreground",
        pills:
          "rounded-full px-4 py-1.5 text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
        boxed:
          "rounded-none px-4 py-2 text-muted-foreground data-[state=active]:bg-muted data-[state=active]:text-foreground first:rounded-l-md last:rounded-r-md",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)
