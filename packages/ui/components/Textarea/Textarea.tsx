import * as React from "react"

import { cn } from "../../lib/utils"
import { textareaVariants } from "./Textarea.variants"
import type { TextareaProps } from "./Textarea.types"

/**
 * Multi-line text input with resize control, size variants, and error/success states.
 *
 * @example
 * ```tsx
 * <Textarea placeholder="Type your message here." rows={4} />
 * <Textarea inputSize="lg" error placeholder="This field is required" />
 * ```
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, inputSize, error, success, ...props }, ref) => {
    const state = error ? "error" : success ? "success" : "default"
    return (
      <textarea
        className={cn(textareaVariants({ inputSize, state }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea, textareaVariants }
