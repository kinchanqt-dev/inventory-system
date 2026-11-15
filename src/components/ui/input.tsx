"use client"

import * as React from "react"

import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function assignRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") {
    ref(value)
    return
  }
  if (ref) {
    ref.current = value
  }
}

function Input({
  className,
  type,
  onWheel,
  ref,
  ...props
}: React.ComponentProps<"input">) {
  const localRef = React.useRef<HTMLInputElement | null>(null)

  React.useEffect(() => {
    const element = localRef.current
    if (!element || type !== "number") {
      return
    }

    const blockWheelValueChange = (event: WheelEvent) => {
      event.preventDefault()
    }

    element.addEventListener("wheel", blockWheelValueChange, { passive: false })
    return () => {
      element.removeEventListener("wheel", blockWheelValueChange)
    }
  }, [type])

  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        type === "number" &&
          "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
        className,
      )}
      onWheel={onWheel}
      ref={(node) => {
        const input = node as HTMLInputElement | null
        localRef.current = input
        assignRef(ref, input)
      }}
      {...props}
    />
  )
}

export { Input }
