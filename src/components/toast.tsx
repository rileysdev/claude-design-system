import * as React from "react";
import { Toaster as SonnerToaster, toast } from "sonner";

import { cn } from "../lib/utils";

export interface ToasterProps
  extends React.ComponentPropsWithoutRef<typeof SonnerToaster> {}

/**
 * Mount once near the root of the app. Toasts are anchored to the bottom on
 * phones — the top edge is where the status bar and app bar live, and a toast
 * there is both easy to miss and hard to reach.
 */
export function Toaster({ className, ...props }: ToasterProps) {
  return (
    <SonnerToaster
      position="bottom-center"
      offset={16}
      toastOptions={{
        classNames: {
          toast: cn(
            "group flex w-full items-center gap-3 rounded-lg border border-border bg-popover p-4",
            "text-sm text-popover-foreground shadow-lg",
          ),
          title: "font-medium",
          description: "text-muted-foreground",
          actionButton: "rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground",
          cancelButton: "rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground",
          error: "border-destructive/30 [&_[data-icon]]:text-destructive",
          success: "border-success/30 [&_[data-icon]]:text-success",
          warning: "border-warning/40 [&_[data-icon]]:text-warning",
          info: "border-info/30 [&_[data-icon]]:text-info",
        },
      }}
      className={cn("toaster", className)}
      {...props}
    />
  );
}

export { toast };
