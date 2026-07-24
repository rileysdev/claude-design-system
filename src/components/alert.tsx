import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";

const alertVariants = cva(
  "relative flex w-full gap-3 rounded-lg border p-4 text-sm [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        neutral: "border-border bg-card text-card-foreground [&_svg]:text-muted-foreground",
        info: "border-info/30 bg-info/10 text-foreground [&_svg]:text-info",
        success: "border-success/30 bg-success/10 text-foreground [&_svg]:text-success",
        warning: "border-warning/40 bg-warning/10 text-foreground [&_svg]:text-warning",
        destructive:
          "border-destructive/30 bg-destructive/10 text-foreground [&_svg]:text-destructive",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  icon?: React.ReactNode;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { className, variant, icon, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      // Errors and warnings interrupt; informational alerts wait their turn.
      role={variant === "destructive" ? "alert" : "status"}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {icon}
      <div className="flex min-w-0 flex-1 flex-col gap-1">{children}</div>
    </div>
  );
});

export const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(function AlertTitle({ className, ...props }, ref) {
  return (
    <p ref={ref} className={cn("font-medium leading-snug", className)} {...props} />
  );
});

export const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(function AlertDescription({ className, ...props }, ref) {
  return (
    <p ref={ref} className={cn("text-muted-foreground", className)} {...props} />
  );
});

export { alertVariants };
