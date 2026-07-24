import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { XIcon } from "lucide-react";

import { cn } from "../lib/utils";

/**
 * An edge-anchored panel. On phones this is the workhorse container — the
 * `bottom` side is the native-feeling default for pickers, filters and
 * confirmations, which is why it carries a drag handle and safe-area padding.
 */

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;

const sheetVariants = cva(
  [
    "fixed z-50 flex flex-col gap-4 bg-popover text-popover-foreground shadow-xl",
    "duration-[var(--duration-normal)] data-[state=open]:animate-in data-[state=closed]:animate-out",
  ],
  {
    variants: {
      side: {
        bottom:
          "inset-x-0 bottom-0 max-h-[90dvh] rounded-t-2xl border-t border-border pb-[calc(var(--safe-bottom)+1rem)] data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        top: "inset-x-0 top-0 max-h-[90dvh] rounded-b-2xl border-b border-border pt-[calc(var(--safe-top)+1rem)] data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        left: "inset-y-0 left-0 h-full w-11/12 max-w-sm border-r border-border data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
        right:
          "inset-y-0 right-0 h-full w-11/12 max-w-sm border-l border-border data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
      },
    },
    defaultVariants: { side: "bottom" },
  },
);

export interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof sheetVariants> {
  showClose?: boolean;
  /**
   * Render into this element instead of `document.body`.
   *
   * The sheet and its scrim are `position: fixed`, so by default they cover the
   * viewport — which is what a real app wants. Pass a container to scope them to
   * a region instead (an embedded widget, or a device frame in a demo). The
   * container must establish a containing block for fixed positioning, e.g. via
   * `transform: translateZ(0)`.
   */
  container?: HTMLElement | null;
}

export const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(function SheetContent(
  { className, children, side = "bottom", showClose = true, container, ...props },
  ref,
) {
  return (
    <DialogPrimitive.Portal container={container ?? undefined}>
      <DialogPrimitive.Overlay
        className={cn(
          "fixed inset-0 z-50 bg-overlay",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
        )}
      />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(sheetVariants({ side }), "p-5", className)}
        {...props}
      >
        {side === "bottom" ? (
          <div
            aria-hidden="true"
            className="mx-auto -mt-2 mb-1 h-1 w-10 shrink-0 rounded-full bg-input"
          />
        ) : null}
        {children}
        {showClose ? (
          <DialogPrimitive.Close
            className={cn(
              "absolute right-3 top-3 flex size-9 items-center justify-center rounded-md text-muted-foreground",
              "transition-colors duration-[var(--duration-fast)] ease-standard hover:bg-accent hover:text-accent-foreground",
              "outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
          >
            <XIcon className="size-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
});

export function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1.5 pr-8", className)} {...props} />;
}

export function SheetFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-auto flex flex-col gap-2", className)} {...props} />;
}

export const SheetTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(function SheetTitle({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Title
      ref={ref}
      className={cn("text-lg font-semibold tracking-tight", className)}
      {...props}
    />
  );
});

export const SheetDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(function SheetDescription({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});

export { sheetVariants };
