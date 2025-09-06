import * as React from "react"
import { cn } from "@/lib/utils"

type SeparatorProps = React.ComponentPropsWithoutRef<"div"> & {
  orientation?: "horizontal" | "vertical"
}

export function Separator({ orientation = "horizontal", className, ...props }: SeparatorProps) {
  const base = orientation === "horizontal" ? "h-px w-full" : "h-full w-px"
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn("bg-slate-200", base, className)}
      {...props}
    />
  )
}

