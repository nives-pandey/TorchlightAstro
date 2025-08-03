import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "mobile-input flex min-h-[100px] w-full rounded-lg border border-purple-400/50 bg-black/20 backdrop-blur-sm px-4 py-3 text-white placeholder:text-purple-300/70 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-none",
        className
      )}
      ref={ref}
      style={{ fontSize: '16px' }} // Prevent iOS zoom
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
