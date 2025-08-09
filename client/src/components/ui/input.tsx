import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "mobile-input flex h-12 w-full rounded-lg border border-yellow-500/50 bg-black/20 backdrop-blur-sm px-4 py-3 text-white placeholder:text-purple-300/70 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
          className
        )}
        ref={ref}
        style={{ fontSize: '16px' }} // Prevent iOS zoom
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
