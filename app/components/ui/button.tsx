import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/app/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/20",
  {
    variants: {
      variant: {
        default: "border border-[var(--accent)] bg-[var(--accent-bg)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--button-hover-text)]",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20",
        outline:
          "border border-[var(--border-color)] bg-[var(--surface-bg)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)]",
        secondary:
          "border border-[var(--border-color)] bg-[var(--surface-bg)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)]",
        ghost:
          "hover:bg-[var(--accent-bg)] hover:text-[var(--accent)]",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-4 py-3",
        xs: "h-6 gap-1 rounded-xl px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 rounded-xl gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-12 rounded-xl px-6 has-[>svg]:px-4",
        icon: "size-11",
        "icon-xs": "size-6 rounded-xl [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-9",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
