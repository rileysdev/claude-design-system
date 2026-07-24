import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";

const inputVariants = cva(
  [
    "flex w-full rounded-lg border bg-card text-foreground",
    "placeholder:text-muted-foreground",
    "transition-[border-color,box-shadow] duration-[var(--duration-fast)] ease-standard",
    "outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40",
    "disabled:cursor-not-allowed disabled:opacity-60",
    "file:border-0 file:bg-transparent file:text-sm file:font-medium",
    // 16px minimum: anything smaller makes iOS Safari zoom the viewport on focus.
    "text-base",
  ],
  {
    variants: {
      size: {
        sm: "h-9 px-3 py-1",
        md: "h-11 px-3 py-2",
        lg: "h-12 px-4 py-2",
      },
      invalid: {
        true: "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/40",
        false: "border-input",
      },
    },
    defaultVariants: {
      size: "md",
      invalid: false,
    },
  },
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, size, invalid, type = "text", ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      aria-invalid={invalid ? true : undefined}
      className={cn(inputVariants({ size, invalid }), className)}
      {...props}
    />
  );
});

export { inputVariants };
