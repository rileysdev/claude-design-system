import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";

const spinnerVariants = cva(
  "inline-block shrink-0 animate-spin rounded-full border-current border-t-transparent",
  {
    variants: {
      size: {
        sm: "size-4 border-2",
        md: "size-5 border-2",
        lg: "size-8 border-[3px]",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof spinnerVariants> {
  /** Announced to assistive tech. Set to "" for a purely decorative spinner. */
  label?: string;
}

export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  function Spinner({ className, size, label = "Loading", ...props }, ref) {
    return (
      <span
        ref={ref}
        role={label ? "status" : undefined}
        aria-label={label || undefined}
        aria-hidden={label ? undefined : true}
        className={cn(spinnerVariants({ size }), className)}
        {...props}
      />
    );
  },
);

export { spinnerVariants };
