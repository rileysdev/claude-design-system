import { wcagContrast } from "culori";

export type ContrastLevel = "body" | "large" | "ui" | "boundary";

/**
 * Minimum WCAG 2.1 contrast ratios enforced at build time.
 *
 * `boundary` is below any WCAG threshold on purpose: borders and dividers are
 * decorative, but a border that cannot be seen at all still makes a theme feel
 * broken, so it gets a floor of its own.
 */
export const CONTRAST_MINIMUMS: Record<ContrastLevel, number> = {
  body: 4.5,
  large: 3,
  ui: 3,
  // Roughly the contrast of an iOS separator. Above the ~1.2:1 desktop
  // convention on purpose, because this system targets phone screens in daylight.
  boundary: 1.35,
};

export function contrast(foreground: string, background: string): number {
  return wcagContrast(foreground, background);
}

export interface ContrastViolation {
  pair: string;
  foreground: string;
  background: string;
  level: ContrastLevel;
  required: number;
  actual: number;
}

export class ContrastChecker {
  private readonly violations: ContrastViolation[] = [];

  check(
    pair: string,
    foreground: string,
    background: string,
    level: ContrastLevel,
  ): void {
    const required = CONTRAST_MINIMUMS[level];
    const actual = contrast(foreground, background);
    if (actual + 1e-6 < required) {
      this.violations.push({
        pair,
        foreground,
        background,
        level,
        required,
        actual,
      });
    }
  }

  get failures(): readonly ContrastViolation[] {
    return this.violations;
  }

  /** Throw a single actionable error listing every failing pair. */
  assert(themeName: string): void {
    if (this.violations.length === 0) return;
    const lines = this.violations.map(
      (v) =>
        `  ${v.pair}: ${v.actual.toFixed(2)}:1 (needs ${v.required}:1) — ` +
        `${v.foreground} on ${v.background}`,
    );
    throw new Error(
      `Theme "${themeName}" failed ${this.violations.length} contrast ` +
        `check(s):\n${lines.join("\n")}\n` +
        `Adjust the seed colours or the semantic step mapping and rebuild.`,
    );
  }
}

/**
 * Choose whichever candidate reads best on `background`. Used for every
 * `*-foreground` token so filled surfaces are legible regardless of how light
 * or dark the author's seed turns out to be.
 */
export function pickForeground(
  background: string,
  candidates: readonly string[],
): string {
  let best = candidates[0]!;
  let bestRatio = -1;
  for (const candidate of candidates) {
    const ratio = contrast(candidate, background);
    if (ratio > bestRatio) {
      bestRatio = ratio;
      best = candidate;
    }
  }
  return best;
}
