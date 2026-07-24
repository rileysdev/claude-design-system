import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";

const progressVariants = cva("relative w-full overflow-hidden rounded-full bg-muted", {
  variants: {
    size: {
      sm: "h-1",
      md: "h-2",
      lg: "h-3",
    },
    tone: {
      primary: "[&>[data-slot=indicator]]:bg-primary",
      success: "[&>[data-slot=indicator]]:bg-success",
      warning: "[&>[data-slot=indicator]]:bg-warning",
      destructive: "[&>[data-slot=indicator]]:bg-destructive",
    },
  },
  defaultVariants: { size: "md", tone: "primary" },
});

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants> {
  /** 0-100. Pass `null` for an indeterminate bar. */
  value?: number | null;
}

export const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(function Progress({ className, value = 0, size, tone, ...props }, ref) {
  const indeterminate = value === null;
  return (
    <ProgressPrimitive.Root
      ref={ref}
      value={indeterminate ? undefined : value}
      className={cn(progressVariants({ size, tone }), className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="indicator"
        className={cn(
          "size-full flex-1 transition-transform duration-[var(--duration-slow)] ease-standard",
          indeterminate && "animate-pulse",
        )}
        style={{
          transform: indeterminate
            ? undefined
            : `translateX(-${100 - Math.min(100, Math.max(0, value ?? 0))}%)`,
        }}
      />
    </ProgressPrimitive.Root>
  );
});

export { progressVariants };
