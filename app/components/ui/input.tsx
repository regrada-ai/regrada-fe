import * as React from "react"

import { cn } from "@/app/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "w-full rounded-xl border border-[var(--border-color)] bg-[var(--surface-bg)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition-all",
        "placeholder:text-[var(--text-placeholder)]",
        "focus:ring-2 focus:ring-[var(--accent)]/20",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        className
      )}
      {...props}
    />
  )
}

export { Input }
