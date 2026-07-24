import type { ThemeConfig } from "../src/theme/semantic";

/**
 * Shipped themes. Each is nothing more than a few seed colours — every surface,
 * border, text and chart token below them is generated and contrast-checked.
 *
 * To add your own: copy an entry, change the seeds, run `pnpm tokens`. If the
 * seeds cannot produce a legible system the build fails and tells you which pair
 * is at fault.
 */
export const themes: ThemeConfig[] = [
  {
    name: "default",
    label: "Default",
    description: "A calm indigo-blue system with faintly cool greys.",
    seeds: {
      primary: "oklch(0.55 0.2 264)",
    },
  },
  {
    name: "clay",
    label: "Clay",
    description: "Warm terracotta with sand-tinted greys; softer and more editorial.",
    seeds: {
      primary: "oklch(0.64 0.13 44)",
    },
    neutralChroma: 0.02,
  },
  {
    name: "forest",
    label: "Forest",
    description: "Deep green with neutral-cool greys for a utilitarian feel.",
    seeds: {
      primary: "oklch(0.55 0.13 158)",
    },
  },
];

export const defaultTheme = themes[0]!;
