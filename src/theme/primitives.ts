/**
 * Platform-agnostic design decisions that do not vary by colour theme.
 *
 * These are deliberately plain data (no CSS, no Tailwind) so the same source can
 * emit CSS custom properties today and a React Native / Uniwind theme later
 * without any of the values being restated.
 */

export const typography = {
  family: {
    sans: `ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
    mono: `ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace`,
  },
  /** Type ramp in rem. Mobile-first: body sits at 1rem so iOS never zooms inputs. */
  size: {
    "2xs": "0.6875rem",
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
  },
  lineHeight: {
    tight: "1.15",
    snug: "1.3",
    normal: "1.5",
    relaxed: "1.65",
  },
  weight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
  tracking: {
    tight: "-0.02em",
    normal: "0em",
    wide: "0.02em",
    wider: "0.06em",
  },
} as const;

export const radius = {
  none: "0px",
  sm: "0.25rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
  "2xl": "1.5rem",
  full: "9999px",
} as const;

export const space = {
  0: "0px",
  px: "1px",
  0.5: "0.125rem",
  1: "0.25rem",
  1.5: "0.375rem",
  2: "0.5rem",
  2.5: "0.625rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  16: "4rem",
} as const;

export const size = {
  /** Minimum comfortable touch target. Every interactive control honours this. */
  touch: "2.75rem",
  /** Standard mobile app bar height. */
  appBar: "3.5rem",
  /** Standard mobile bottom tab bar height, before safe-area inset. */
  tabBar: "3.5rem",
  /** Reading measure cap for body copy. */
  measure: "68ch",
} as const;

export const motion = {
  duration: {
    instant: "80ms",
    fast: "140ms",
    normal: "220ms",
    slow: "320ms",
  },
  easing: {
    /** Default for most UI state changes. */
    standard: "cubic-bezier(0.2, 0, 0, 1)",
    /** Elements entering the screen. */
    enter: "cubic-bezier(0.05, 0.7, 0.1, 1)",
    /** Elements leaving the screen. */
    exit: "cubic-bezier(0.3, 0, 0.8, 0.15)",
    /** Overshoot, used sparingly for sheets and toggles. */
    emphasis: "cubic-bezier(0.3, 1.4, 0.6, 1)",
  },
} as const;

export const zIndex = {
  base: "0",
  raised: "10",
  sticky: "20",
  appBar: "30",
  overlay: "40",
  modal: "50",
  toast: "60",
  tooltip: "70",
} as const;

/**
 * Shadows are defined per colour mode: the same blur reads as heavy on a dark
 * background, so the dark set is tighter and leans on borders instead.
 */
export const shadow = {
  light: {
    none: "none",
    xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    sm: "0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.06)",
    md: "0 4px 8px -2px rgb(0 0 0 / 0.09), 0 2px 4px -2px rgb(0 0 0 / 0.06)",
    lg: "0 12px 20px -4px rgb(0 0 0 / 0.1), 0 4px 8px -4px rgb(0 0 0 / 0.06)",
    xl: "0 24px 40px -8px rgb(0 0 0 / 0.14), 0 8px 16px -8px rgb(0 0 0 / 0.08)",
  },
  dark: {
    none: "none",
    xs: "0 1px 2px 0 rgb(0 0 0 / 0.4)",
    sm: "0 1px 3px 0 rgb(0 0 0 / 0.5), 0 1px 2px -1px rgb(0 0 0 / 0.4)",
    md: "0 4px 8px -2px rgb(0 0 0 / 0.55), 0 2px 4px -2px rgb(0 0 0 / 0.4)",
    lg: "0 12px 20px -4px rgb(0 0 0 / 0.6), 0 4px 8px -4px rgb(0 0 0 / 0.45)",
    xl: "0 24px 40px -8px rgb(0 0 0 / 0.7), 0 8px 16px -8px rgb(0 0 0 / 0.5)",
  },
} as const;

export const primitives = {
  typography,
  radius,
  space,
  size,
  motion,
  zIndex,
  shadow,
} as const;

export type Primitives = typeof primitives;
