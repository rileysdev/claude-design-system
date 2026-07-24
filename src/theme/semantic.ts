import { generateRamp, formatOklch, parseSeed, type Ramp } from "./ramp";
import { ContrastChecker, pickForeground } from "./contrast";
import { generateChartPalette, type Mode } from "./chart-palette";
import {
  checkStatusSeparation,
  deriveStatusSeeds,
  type StatusDerivation,
  type StatusRole,
} from "./status";

export interface ThemeSeeds {
  /** The brand colour. Everything else keys off its hue. */
  primary: string;
  /**
   * Optional grey seed. When omitted, greys are derived from the primary hue so
   * surfaces feel related to the brand instead of dead neutral.
   */
  neutral?: string;
  destructive?: string;
  success?: string;
  warning?: string;
  info?: string;
}

export interface ThemeConfig {
  /** Machine name; becomes the CSS selector, e.g. `[data-theme="ocean"]`. */
  name: string;
  /** Human label for docs and the Storybook toolbar. */
  label?: string;
  description?: string;
  seeds: ThemeSeeds;
  /**
   * Peak chroma of the neutral ramp. 0 is dead grey; the default puts a faint
   * brand tint in every surface, which is most of what makes a palette read as
   * one system rather than a colour bolted onto Tailwind grey.
   */
  neutralChroma?: number;
  /**
   * How strongly status colours are pulled toward the brand hue, 0–1.
   *
   * 0 pins destructive/success/warning/info to their canonical hues, which is
   * the safest reading but makes them look bolted on. 1 pulls each to the edge
   * of the hue range where it still means what it says. Regardless of this
   * value, a status is pushed away from the brand hue when the two would be
   * confusable, and the build fails if they still are.
   */
  statusHarmony?: number;
}

export const SEMANTIC_TOKENS = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "success",
  "success-foreground",
  "warning",
  "warning-foreground",
  "info",
  "info-foreground",
  "border",
  "input",
  "ring",
  "overlay",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
] as const;

export type SemanticToken = (typeof SEMANTIC_TOKENS)[number];
export type SemanticTokens = Record<SemanticToken, string>;

export interface Ramps {
  primary: Ramp;
  neutral: Ramp;
  destructive: Ramp;
  success: Ramp;
  warning: Ramp;
  info: Ramp;
}

const WHITE = "oklch(1 0 0)";

export function buildRamps(config: ThemeConfig): Ramps {
  const { seeds } = config;
  const primaryHue = parseSeed(seeds.primary).h ?? 0;

  // Greys inherit the brand hue unless the author supplies their own.
  const neutralSeed =
    seeds.neutral ?? formatOklch({ mode: "oklch", l: 0.55, c: 0.02, h: primaryHue });

  // An explicit neutral seed back-solves its own chroma; a derived one gets a
  // deliberately tiny peak so greys read as grey, just warmed toward the brand.
  const neutralPeak = config.neutralChroma ?? (seeds.neutral ? undefined : 0.014);

  // Status colours are derived from the brand rather than fixed, so they move
  // with the theme. An explicit seed always wins — some brands have a mandated
  // error red — but then it is the author's job to keep it distinguishable.
  const status = deriveStatusSeeds(seeds.primary, { harmony: config.statusHarmony });

  return {
    primary: generateRamp(seeds.primary),
    neutral: generateRamp(neutralSeed, {
      curve: "neutral",
      peakChroma: neutralPeak,
    }),
    destructive: generateRamp(seeds.destructive ?? status.destructive.seed),
    success: generateRamp(seeds.success ?? status.success.seed),
    warning: generateRamp(seeds.warning ?? status.warning.seed),
    info: generateRamp(seeds.info ?? status.info.seed),
  };
}

/**
 * Map ramps onto the semantic roles components actually reference.
 *
 * Light and dark are *separate mappings*, not an inversion: dark mode lifts the
 * accent steps (a 600 that reads as confident on white turns muddy on black) and
 * leans on borders rather than shadow for elevation.
 */
export function buildSemanticTokens(
  ramps: Ramps,
  mode: Mode,
  checker: ContrastChecker,
  status: Record<StatusRole, StatusDerivation>,
): SemanticTokens {
  const { primary, neutral } = ramps;
  const light = mode === "light";

  const background = light ? neutral[50] : neutral[950];
  const foreground = light ? neutral[950] : neutral[50];
  const surface = light ? WHITE : neutral[900];
  const surfaceForeground = foreground;

  // Filled accents: lighter steps in dark mode so they stay luminous.
  const primaryFill = light ? primary[600] : primary[400];

  // Status fills come from the role derivation rather than a ramp step: each
  // hue needs its own lightness to read correctly, and a single shared step
  // cannot serve red and amber at once.
  const destructiveFill = status.destructive.fill[mode];
  const successFill = status.success.fill[mode];
  const warningFill = status.warning.fill[mode];
  const infoFill = status.info.fill[mode];

  const onFill = [WHITE, neutral[950]] as const;

  const mutedSurface = light ? neutral[100] : neutral[800];
  const mutedText = light ? neutral[600] : neutral[400];
  const subtleSurface = light ? neutral[100] : neutral[800];
  const subtleText = light ? neutral[900] : neutral[50];

  const tokens: SemanticTokens = {
    background,
    foreground,
    card: surface,
    "card-foreground": surfaceForeground,
    popover: surface,
    "popover-foreground": surfaceForeground,

    primary: primaryFill,
    "primary-foreground": pickForeground(primaryFill, onFill),
    secondary: subtleSurface,
    "secondary-foreground": subtleText,
    muted: mutedSurface,
    "muted-foreground": mutedText,
    accent: subtleSurface,
    "accent-foreground": subtleText,

    destructive: destructiveFill,
    "destructive-foreground": pickForeground(destructiveFill, onFill),
    success: successFill,
    "success-foreground": pickForeground(successFill, onFill),
    warning: warningFill,
    "warning-foreground": pickForeground(warningFill, onFill),
    info: infoFill,
    "info-foreground": pickForeground(infoFill, onFill),

    // Separators run one step stronger than the desktop convention: this system
    // is mobile-first, and a 1.2:1 hairline vanishes on a phone screen outdoors.
    border: light ? neutral[300] : neutral[700],
    input: light ? neutral[400] : neutral[600],
    ring: light ? primary[500] : primary[500],
    // Scrim behind modals and sheets.
    overlay: light
      ? "oklch(0.21 0 0 / 0.45)"
      : "oklch(0.13 0 0 / 0.65)",

    "chart-1": "",
    "chart-2": "",
    "chart-3": "",
    "chart-4": "",
    "chart-5": "",
  };

  // Text must be legible on every surface it can land on.
  checker.check(`${mode}/foreground-on-background`, tokens.foreground, tokens.background, "body");
  checker.check(`${mode}/card-foreground-on-card`, tokens["card-foreground"], tokens.card, "body");
  checker.check(`${mode}/popover-foreground-on-popover`, tokens["popover-foreground"], tokens.popover, "body");
  checker.check(`${mode}/muted-foreground-on-background`, tokens["muted-foreground"], tokens.background, "body");
  checker.check(`${mode}/muted-foreground-on-card`, tokens["muted-foreground"], tokens.card, "body");
  checker.check(`${mode}/muted-foreground-on-muted`, tokens["muted-foreground"], tokens.muted, "body");
  checker.check(`${mode}/secondary-foreground-on-secondary`, tokens["secondary-foreground"], tokens.secondary, "body");
  checker.check(`${mode}/accent-foreground-on-accent`, tokens["accent-foreground"], tokens.accent, "body");

  // Labels on filled controls.
  checker.check(`${mode}/primary-foreground-on-primary`, tokens["primary-foreground"], tokens.primary, "body");
  checker.check(`${mode}/destructive-foreground-on-destructive`, tokens["destructive-foreground"], tokens.destructive, "body");
  checker.check(`${mode}/success-foreground-on-success`, tokens["success-foreground"], tokens.success, "body");
  checker.check(`${mode}/warning-foreground-on-warning`, tokens["warning-foreground"], tokens.warning, "body");
  checker.check(`${mode}/info-foreground-on-info`, tokens["info-foreground"], tokens.info, "body");

  // Focus ring is a non-text UI affordance; borders only need to be perceivable.
  checker.check(`${mode}/ring-on-background`, tokens.ring, tokens.background, "ui");
  checker.check(`${mode}/border-on-card`, tokens.border, tokens.card, "boundary");

  return tokens;
}

export interface BuiltTheme {
  config: ThemeConfig;
  ramps: Ramps;
  light: SemanticTokens;
  dark: SemanticTokens;
  chartAudit: Record<Mode, ReturnType<typeof generateChartPalette>["audit"]>;
  status: Record<StatusRole, StatusDerivation>;
}

/**
 * Turn a handful of seed colours into a complete, validated theme.
 *
 * Any contrast violation or unusable chart palette throws — a theme that cannot
 * meet its own guarantees fails the build rather than shipping.
 */
export function defineTheme(config: ThemeConfig): BuiltTheme {
  const ramps = buildRamps(config);
  const checker = new ContrastChecker();

  const status = deriveStatusSeeds(config.seeds.primary, {
    harmony: config.statusHarmony,
  });

  // A status colour that reads as the brand colour is worse than a mismatched
  // one: the badge stops carrying meaning. Only gate the roles we derived —
  // an explicitly supplied seed is the author's call.
  const derivedOnly = Object.fromEntries(
    (Object.keys(status) as StatusRole[])
      .filter((role) => !config.seeds[role])
      .map((role) => [role, status[role]]),
  ) as Record<StatusRole, StatusDerivation>;

  const separationFailures = checkStatusSeparation(config.seeds.primary, derivedOnly);
  if (separationFailures.length > 0) {
    const lines = separationFailures.map(
      (failure) =>
        `  ${failure.a} vs ${failure.b}: ${failure.degrees}° apart ` +
        `(needs ${failure.required}°)`,
    );
    throw new Error(
      `Theme "${config.name}" has status colours too close to be told apart:\n` +
        `${lines.join("\n")}\n` +
        `The brand hue sits inside a status colour's usable range. Shift the ` +
        `primary seed's hue, or supply an explicit seed for that status.`,
    );
  }

  const light = buildSemanticTokens(ramps, "light", checker, status);
  const dark = buildSemanticTokens(ramps, "dark", checker, status);

  const lightCharts = generateChartPalette(config.seeds.primary, "light", light.background);
  const darkCharts = generateChartPalette(config.seeds.primary, "dark", dark.background);

  lightCharts.colors.forEach((color, index) => {
    light[`chart-${index + 1}` as SemanticToken] = color;
  });
  darkCharts.colors.forEach((color, index) => {
    dark[`chart-${index + 1}` as SemanticToken] = color;
  });

  checker.assert(config.name);

  return {
    config,
    ramps,
    light,
    dark,
    chartAudit: { light: lightCharts.audit, dark: darkCharts.audit },
    status,
  };
}
