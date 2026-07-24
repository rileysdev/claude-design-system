import * as React from "react";

import { cn } from "../lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Paint the error treatment and set `aria-invalid`. */
  invalid?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, invalid, rows = 4, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        rows={rows}
        aria-invalid={invalid ? true : undefined}
        className={cn(
          "flex w-full rounded-lg border bg-card px-3 py-2 text-base text-foreground",
          "placeholder:text-muted-foreground",
          "transition-[border-color,box-shadow] duration-[var(--duration-fast)] ease-standard",
          "outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40",
          "disabled:cursor-not-allowed disabled:opacity-60",
          "field-sizing-content min-h-20 resize-y",
          invalid
            ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/40"
            : "border-input",
          className,
        )}
        {...props}
      />
    );
  },
);
