import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { ChevronRightIcon } from "lucide-react";

import { cn } from "../lib/utils";

/**
 * The mobile equivalent of a table: a vertical stack of rows, each with an
 * optional leading visual, a title/description pair, and a trailing control.
 *
 * Rows are separated by inset hairlines rather than boxed, which keeps long
 * lists calm and matches platform convention on both iOS and Android.
 */

export interface ListProps extends React.HTMLAttributes<HTMLUListElement> {
  /** Wrap the list in a bordered card. Use for short, grouped settings lists. */
  inset?: boolean;
}

export const List = React.forwardRef<HTMLUListElement, ListProps>(function List(
  { className, inset = false, ...props },
  ref,
) {
  return (
    <ul
      ref={ref}
      className={cn(
        "flex w-full flex-col",
        "divide-y divide-border",
        inset && "overflow-hidden rounded-xl border border-border bg-card",
        className,
      )}
      {...props}
    />
  );
});

export interface ListItemProps
  // `title` is a ReactNode here, not the HTML tooltip attribute.
  extends Omit<React.LiHTMLAttributes<HTMLLIElement>, "title"> {
  leading?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Right-hand content: a value, switch, badge, or button. */
  trailing?: React.ReactNode;
  /** Show a chevron and hover treatment. Set when the row navigates. */
  navigable?: boolean;
  /**
   * Let the title and description wrap to two lines instead of truncating.
   * Use when the text is the content itself — a task, a message, a headline —
   * rather than a label whose meaning survives being cut short.
   */
  multiline?: boolean;
  /** Makes the whole row a button. Ignored when `asChild` is set. */
  onSelect?: () => void;
  /** Render the row's interactive surface as the child (e.g. a router link). */
  asChild?: boolean;
}

export const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(
  function ListItem(
    {
      className,
      leading,
      title,
      description,
      trailing,
      navigable = false,
      multiline = false,
      onSelect,
      asChild = false,
      children,
      ...props
    },
    ref,
  ) {
    const interactive = navigable || Boolean(onSelect) || asChild;
    const clamp = multiline ? "line-clamp-2" : "truncate";

    const rowStyles = cn(
      "relative flex w-full items-center gap-3 px-4 py-3 min-h-[var(--size-touch)]",
      interactive && [
        "transition-colors duration-[var(--duration-fast)] ease-standard",
        "hover:bg-accent active:bg-accent",
        "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-inset",
      ],
    );

    const text = (
      <>
        <span className={cn("text-sm font-medium text-foreground", clamp)}>{title}</span>
        {description ? (
          <span className={cn("text-sm text-muted-foreground", clamp)}>{description}</span>
        ) : null}
      </>
    );

    /*
     * When the row is interactive, only the text block is the button — its hit
     * area is then stretched over the whole row with an ::after overlay.
     *
     * The obvious implementation wraps everything in one <button>, but `leading`
     * and `trailing` routinely hold a Checkbox or Switch, which are themselves
     * buttons. Nesting them is invalid HTML and swallows their clicks, so the
     * controls stay siblings and sit above the overlay.
     */
    const textBlock = interactive ? (
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "flex min-w-0 flex-1 flex-col gap-0.5 text-left outline-none",
          "after:absolute after:inset-0 after:content-['']",
        )}
      >
        {text}
      </button>
    ) : (
      <span className="flex min-w-0 flex-1 flex-col gap-0.5 text-left">{text}</span>
    );

    const body = (
      <>
        {leading ? (
          <span className="relative z-10 flex shrink-0 items-center [&_svg]:size-5 [&_svg]:text-muted-foreground">
            {leading}
          </span>
        ) : null}
        {textBlock}
        {trailing ? (
          <span className="relative z-10 flex shrink-0 items-center gap-2 text-sm text-muted-foreground">
            {trailing}
          </span>
        ) : null}
        {navigable ? (
          <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
        ) : null}
      </>
    );

    if (asChild) {
      // The consumer supplies the anchor; stretch it the same way.
      return (
        <li ref={ref} className={cn("bg-card", className)} {...props}>
          <div className={rowStyles}>
            {leading ? (
              <span className="relative z-10 flex shrink-0 items-center [&_svg]:size-5 [&_svg]:text-muted-foreground">
                {leading}
              </span>
            ) : null}
            <Slot
              className={cn(
                "flex min-w-0 flex-1 flex-col gap-0.5 text-left outline-none",
                "after:absolute after:inset-0 after:content-['']",
              )}
            >
              {children}
            </Slot>
            {trailing ? (
              <span className="relative z-10 flex shrink-0 items-center gap-2 text-sm text-muted-foreground">
                {trailing}
              </span>
            ) : null}
            {navigable ? (
              <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
            ) : null}
          </div>
        </li>
      );
    }

    return (
      <li ref={ref} className={cn("bg-card", className)} {...props}>
        <div className={rowStyles}>{body}</div>
      </li>
    );
  },
);
