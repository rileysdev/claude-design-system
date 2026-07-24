import * as React from "react";

import { cn } from "../lib/utils";

export interface EmptyStateProps
  // `title` is a ReactNode here, not the HTML tooltip attribute.
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** A single icon, shown in a soft circle. Keep it simple and outline-style. */
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Primary action, and optionally a secondary one beside it. */
  action?: React.ReactNode;
}

/**
 * The state a screen shows before it has content — or after a filter clears it.
 * Worth treating as a first-class component: it is the screen a new user sees
 * most often, and it is the one most often left unstyled.
 */
export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  function EmptyState({ className, icon, title, description, action, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center gap-3 px-6 py-12 text-center",
          className,
        )}
        {...props}
      >
        {icon ? (
          <div
            aria-hidden="true"
            className="mb-1 flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground [&_svg]:size-6"
          >
            {icon}
          </div>
        ) : null}
        <h3 className="text-base font-semibold tracking-tight">{title}</h3>
        {description ? (
          <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
        ) : null}
        {action ? <div className="mt-2 flex items-center gap-2">{action}</div> : null}
      </div>
    );
  },
);
