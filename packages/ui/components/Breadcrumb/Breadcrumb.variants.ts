import { cva } from "class-variance-authority"

export const breadcrumbListVariants = cva(
  "flex flex-wrap items-center break-words text-muted-foreground",
  {
    variants: {
      size: {
        sm: "gap-1 text-xs sm:gap-1.5",
        default: "gap-1.5 text-sm sm:gap-2.5",
        lg: "gap-2 text-base sm:gap-3",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)
