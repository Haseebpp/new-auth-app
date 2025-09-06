import * as React from "react"
import { cn } from "@/lib/utils"

type ProgressProps = React.ComponentPropsWithoutRef<"div"> & {
  value?: number
}

export function Progress({ value = 0, className, ...props }: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-slate-200", className)}
      {...props}
    >
      <div
        className="h-full w-full bg-teal-600 transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(-${100 - clamped}%)` }}
      />
    </div>
  )
}

