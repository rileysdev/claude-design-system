import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";

/**
 * The top bar of a mobile screen. Handles the notch itself so screens never
 * restate safe-area padding, and keeps the title optically centred by reserving
 * equal space on both sides.
 */

const appBarVariants = cva(
  "sticky top-0 z-30 flex w-full flex-col pt-[var(--safe-top)]",
  {
    variants: {
      variant: {
        /** Solid, with a hairline under it. The default. */
        solid: "border-b border-border bg-card",
        /** Blends into the page until content scrolls under it. */
        transparent: "bg-background",
        /** Frosted; use over scrolling media. */
        blurred: "border-b border-border/60 bg-card/80 backdrop-blur-md",
      },
    },
    defaultVariants: { variant: "solid" },
  },
);

export interface AppBarProps
  // `title` is a ReactNode here, not the HTML tooltip attribute.
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    VariantProps<typeof appBarVariants> {
  /** Usually a back button or menu trigger. */
  leading?: React.ReactNode;
  /** Usually one or two icon buttons. */
  trailing?: React.ReactNode;
  title?: React.ReactNode;
  /** Centre the title, iOS-style. Left-aligned when false. */
  centerTitle?: boolean;
}

export const AppBar = React.forwardRef<HTMLElement, AppBarProps>(function AppBar(
  { className, variant, leading, trailing, title, centerTitle = false, children, ...props },
  ref,
) {
  return (
    <header ref={ref} className={cn(appBarVariants({ variant }), className)} {...props}>
      <div className="flex h-[var(--size-app-bar)] items-center gap-1 px-2">
        <div
          className={cn(
            "flex shrink-0 items-center gap-1",
            // Reserve matching width on both sides so a centred title stays
            // centred even when only one side has controls.
            centerTitle && "min-w-11 flex-1 justify-start",
          )}
        >
          {leading}
        </div>

        {title ? (
          <h1
            className={cn(
              "truncate text-base font-semibold tracking-tight",
              centerTitle ? "flex-none text-center" : "flex-1 px-2 text-left",
            )}
          >
            {title}
          </h1>
        ) : null}

        <div
          className={cn(
            "flex shrink-0 items-center gap-1",
            centerTitle && "min-w-11 flex-1 justify-end",
            !centerTitle && !title && "ml-auto",
          )}
        >
          {trailing}
        </div>
      </div>
      {children}
    </header>
  );
});

export { appBarVariants };
