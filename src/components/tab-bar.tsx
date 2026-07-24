import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "../lib/utils";

/**
 * Bottom navigation for an installed/mobile app.
 *
 * Items are equal-width and at least 44px tall including the home-indicator
 * inset, so the last row of an app is never something a thumb has to aim for.
 */

export interface TabBarProps extends React.HTMLAttributes<HTMLElement> {
  /** Frost the bar so content scrolls visibly beneath it. */
  blurred?: boolean;
}

export const TabBar = React.forwardRef<HTMLElement, TabBarProps>(function TabBar(
  { className, blurred = false, children, ...props },
  ref,
) {
  return (
    <nav
      ref={ref}
      className={cn(
        "sticky bottom-0 z-30 w-full border-t border-border pb-[var(--safe-bottom)]",
        blurred ? "bg-card/85 backdrop-blur-md" : "bg-card",
        className,
      )}
      {...props}
    >
      <ul className="flex h-[var(--size-tab-bar)] items-stretch">{children}</ul>
    </nav>
  );
});

export interface TabBarItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: React.ReactNode;
  active?: boolean;
  /** Small count shown on the icon. Values over 99 render as "99+". */
  badge?: number;
  /** Render as the child element — use for router links. */
  asChild?: boolean;
}

export const TabBarItem = React.forwardRef<HTMLButtonElement, TabBarItemProps>(
  function TabBarItem(
    { className, icon, label, active = false, badge, asChild = false, ...props },
    ref,
  ) {
    const Comp = asChild ? Slot : "button";
    return (
      <li className="flex-1">
        <Comp
          ref={ref}
          type={asChild ? undefined : "button"}
          aria-current={active ? "page" : undefined}
          className={cn(
            "flex size-full flex-col items-center justify-center gap-0.5 px-1 py-1.5",
            "transition-colors duration-[var(--duration-fast)] ease-standard",
            "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
            active ? "text-primary" : "text-muted-foreground hover:text-foreground",
            "[&_svg]:size-6 [&_svg]:shrink-0",
            className,
          )}
          {...props}
        >
          <span className="relative flex items-center justify-center">
            {icon}
            {badge !== undefined && badge > 0 ? (
              <span
                className={cn(
                  // Anchored from the icon's midpoint so a wide count ("99+")
                  // extends outward instead of covering the icon.
                  "absolute -top-1.5 left-1/2 flex h-4 min-w-4 items-center justify-center rounded-full px-1",
                  "bg-destructive text-2xs font-semibold text-destructive-foreground",
                )}
              >
                {badge > 99 ? "99+" : badge}
              </span>
            ) : null}
          </span>
          <span className="text-2xs font-medium leading-none">{label}</span>
        </Comp>
      </li>
    );
  },
);
