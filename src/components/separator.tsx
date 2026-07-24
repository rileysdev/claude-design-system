import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "../lib/utils";

export interface SeparatorProps
  extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
  /** Optional centred label, e.g. "or". Forces horizontal orientation. */
  label?: React.ReactNode;
}

export const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(function Separator(
  { className, orientation = "horizontal", decorative = true, label, ...props },
  ref,
) {
  if (label) {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <SeparatorPrimitive.Root
          ref={ref}
          decorative={decorative}
          orientation="horizontal"
          className="h-px flex-1 bg-border"
          {...props}
        />
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <SeparatorPrimitive.Root
          decorative
          orientation="horizontal"
          className="h-px flex-1 bg-border"
        />
      </div>
    );
  }

  return (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className,
      )}
      {...props}
    />
  );
});
