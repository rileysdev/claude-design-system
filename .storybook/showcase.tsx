import * as React from "react";

/**
 * Layout helpers used only by stories.
 *
 * Preview cards are graded on whether they actually demonstrate the component,
 * so stories lay every variant out side by side under a label rather than
 * rendering one default instance.
 */

export function Showcase({ children }: { children: React.ReactNode }) {
  return <div className="flex max-w-3xl flex-col gap-8">{children}</div>;
}

export function Section({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-0.5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </h3>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className={className ?? "flex flex-wrap items-center gap-3"}>{children}</div>
    </section>
  );
}

export function Swatch({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-1.5">
      {children}
      <span className="text-2xs text-muted-foreground">{label}</span>
    </div>
  );
}

/** Frames a story in a phone-width column, for screen-level compositions. */
export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-[390px] overflow-hidden rounded-2xl border border-border bg-background shadow-lg">
      {children}
    </div>
  );
}
