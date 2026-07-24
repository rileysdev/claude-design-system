import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { cn } from "../lib/utils";
import { Button } from "./button";

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  /** 1-based. */
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  /** How many numbered buttons to show. Phones fit about five. */
  siblingCount?: number;
  /** Hide the numbers and show "Page 2 of 9" instead. Best on narrow screens. */
  compact?: boolean;
}

/** Page numbers around the current page, with gaps marked as ellipses. */
function pageRange(page: number, pageCount: number, siblings: number): (number | "gap")[] {
  const total = siblings * 2 + 5;
  if (pageCount <= total) {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  const left = Math.max(page - siblings, 1);
  const right = Math.min(page + siblings, pageCount);
  const showLeftGap = left > 2;
  const showRightGap = right < pageCount - 1;

  const pages: (number | "gap")[] = [1];
  if (showLeftGap) pages.push("gap");
  for (let i = Math.max(left, 2); i <= Math.min(right, pageCount - 1); i += 1) {
    pages.push(i);
  }
  if (showRightGap) pages.push("gap");
  pages.push(pageCount);
  return pages;
}

export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  function Pagination(
    { className, page, pageCount, onPageChange, siblingCount = 1, compact = false, ...props },
    ref,
  ) {
    const canPrevious = page > 1;
    const canNext = page < pageCount;

    return (
      <nav
        ref={ref}
        aria-label="Pagination"
        className={cn("flex items-center justify-center gap-1", className)}
        {...props}
      >
        <Button
          variant="ghost"
          size="icon"
          aria-label="Previous page"
          disabled={!canPrevious}
          onClick={() => canPrevious && onPageChange(page - 1)}
        >
          <ChevronLeftIcon />
        </Button>

        {compact ? (
          <span className="px-3 text-sm text-muted-foreground" aria-live="polite">
            Page {page} of {pageCount}
          </span>
        ) : (
          pageRange(page, pageCount, siblingCount).map((entry, index) =>
            entry === "gap" ? (
              <span
                key={`gap-${index}`}
                aria-hidden="true"
                className="px-1 text-sm text-muted-foreground"
              >
                &hellip;
              </span>
            ) : (
              <Button
                key={entry}
                variant={entry === page ? "primary" : "ghost"}
                size="icon"
                aria-label={`Page ${entry}`}
                aria-current={entry === page ? "page" : undefined}
                onClick={() => onPageChange(entry)}
              >
                {entry}
              </Button>
            ),
          )
        )}

        <Button
          variant="ghost"
          size="icon"
          aria-label="Next page"
          disabled={!canNext}
          onClick={() => canNext && onPageChange(page + 1)}
        >
          <ChevronRightIcon />
        </Button>
      </nav>
    );
  },
);
