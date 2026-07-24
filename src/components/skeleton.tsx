import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";

const skeletonVariants = cva("animate-pulse bg-muted", {
  variants: {
    shape: {
      /** Matches a line of body text. */
      text: "h-4 rounded-md",
      /** Matches a block element such as a card or image. */
      block: "rounded-xl",
      circle: "rounded-full",
    },
  },
  defaultVariants: { shape: "text" },
});

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  function Skeleton({ className, shape, ...props }, ref) {
    return (
      <div
        ref={ref}
        // Loading placeholders are noise to a screen reader; the live region
        // that replaces them should do the announcing.
        aria-hidden="true"
        className={cn(skeletonVariants({ shape }), className)}
        {...props}
      />
    );
  },
);

export { skeletonVariants };
