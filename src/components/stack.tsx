import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";

/**
 * Layout primitives. These exist so spacing decisions come from the token scale
 * rather than from whatever number was nearest to hand — the single biggest
 * source of drift in a generated screen.
 */

const stackVariants = cva("flex", {
  variants: {
    direction: {
      vertical: "flex-col",
      horizontal: "flex-row",
    },
    gap: {
      0: "gap-0",
      1: "gap-1",
      2: "gap-2",
      3: "gap-3",
      4: "gap-4",
      6: "gap-6",
      8: "gap-8",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
      baseline: "items-baseline",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
    },
    wrap: {
      true: "flex-wrap",
      false: "flex-nowrap",
    },
  },
  defaultVariants: {
    direction: "vertical",
    gap: 4,
    align: "stretch",
    justify: "start",
    wrap: false,
  },
});

export interface StackProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stackVariants> {
  asChild?: boolean;
}

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(function Stack(
  { className, direction, gap, align, justify, wrap, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(stackVariants({ direction, gap, align, justify, wrap }), className)}
      {...props}
    />
  );
});

export interface ScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Apply the standard horizontal gutter. */
  padded?: boolean;
}

/**
 * A full-height mobile screen container: fills the viewport minus safe areas and
 * scrolls its own content, so app bars and tab bars can stay pinned.
 */
export const Screen = React.forwardRef<HTMLDivElement, ScreenProps>(function Screen(
  { className, padded = false, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        "flex min-h-dvh w-full flex-col bg-background text-foreground",
        padded && "px-4",
        className,
      )}
      {...props}
    />
  );
});

export { stackVariants };
