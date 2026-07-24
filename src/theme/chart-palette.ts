import { converter, clampChroma, formatHex, wcagContrast, type Oklch } from "culori";

/**
 * Generates the 5 categorical chart tokens from the theme's primary hue.
 *
 * A categorical palette is not free-form colour: it encodes *identity*, so two
 * adjacent series must stay distinguishable including under colour-vision
 * deficiency. Because this palette is derived from whatever seed the author
 * supplies, it cannot be hand-checked once and trusted forever — the checks run
 * on every build, and a seed that cannot produce a passing palette fails the
 * build rather than shipping series nobody can tell apart.
 *
 * Thresholds and the CVD simulation model below are the standard ones: ΔE is
 * Euclidean distance in OKLab x100, simulated with Machado-Oliveira-Fernandes
 * (2009) at severity 1.0. The thresholds are calibrated to that model, so the
 * model is part of the standard rather than an implementation detail.
 */

const toOklch = converter("oklch");
const toOklab = converter("oklab");
const toRgb = converter("rgb");

/** OKLCH lightness band per mode. Dark is a much narrower window than light. */
const BAND: Record<Mode, [number, number]> = {
  light: [0.43, 0.77],
  dark: [0.48, 0.67],
};
/** Below this a hue reads as grey and stops doing identity work. */
const CHROMA_FLOOR = 0.1;
/** min(protan, deutan) ΔE on adjacent pairs. */
const CVD_TARGET = 8;
const CVD_FLOOR = 6;
/** Unsimulated-vision floor on adjacent pairs. Hard gate. */
const NORMAL_FLOOR = 15;
/** WCAG contrast of a mark against the chart surface. */
const CONTRAST_MIN = 3;

export type Mode = "light" | "dark";

// Machado, Oliveira & Fernandes (2009) transforms at severity 1.0, linear RGB.
const MACHADO = {
  protan: [
    [0.152286, 1.052583, -0.204868],
    [0.114503, 0.786281, 0.099216],
    [-0.003882, -0.048116, 1.051998],
  ],
  deutan: [
    [0.367322, 0.860646, -0.227968],
    [0.280085, 0.672501, 0.047413],
    [-0.01182, 0.04294, 0.968881],
  ],
} as const;

type Deficiency = keyof typeof MACHADO;

const s2lin = (c: number) =>
  c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;

function linearRgb(hex: string): [number, number, number] {
  const rgb = toRgb(hex);
  if (!rgb) throw new Error(`Could not parse colour: ${hex}`);
  return [s2lin(rgb.r), s2lin(rgb.g), s2lin(rgb.b)];
}

function simulate(hex: string, kind: Deficiency): [number, number, number] {
  const [r, g, b] = linearRgb(hex);
  const m = MACHADO[kind];
  const clamp = (c: number) => Math.max(0, Math.min(1, c));
  return [
    clamp(m[0][0] * r + m[0][1] * g + m[0][2] * b),
    clamp(m[1][0] * r + m[1][1] * g + m[1][2] * b),
    clamp(m[2][0] * r + m[2][1] * g + m[2][2] * b),
  ];
}

function oklabOfLinear([r, g, b]: [number, number, number]) {
  const lab = toOklab({ mode: "lrgb", r, g, b });
  if (!lab) throw new Error("Could not convert linear RGB to OKLab");
  return lab;
}

/** Euclidean distance in OKLab x100. Omit `kind` for unsimulated vision. */
function deltaE(a: string, b: string, kind?: Deficiency): number {
  const first = oklabOfLinear(kind ? simulate(a, kind) : linearRgb(a));
  const second = oklabOfLinear(kind ? simulate(b, kind) : linearRgb(b));
  return (
    100 *
    Math.hypot(
      (first.l ?? 0) - (second.l ?? 0),
      (first.a ?? 0) - (second.a ?? 0),
      (first.b ?? 0) - (second.b ?? 0),
    )
  );
}

export interface PaletteAudit {
  worstCvd: number;
  worstCvdKind: Deficiency;
  worstNormal: number;
  minContrast: number;
  /** True when every mark clears 3:1 against the surface. */
  contrastClear: boolean;
}

interface Candidate {
  hexes: string[];
  audit: PaletteAudit;
}

function buildSwatch(hue: number, lightness: number, chroma: number): string {
  const clamped = clampChroma(
    { mode: "oklch", l: lightness, c: chroma, h: (hue + 360) % 360 },
    "oklch",
  ) as Oklch;
  return formatHex(clamped);
}

/**
 * Snap-to-passing for contrast: walk a swatch's lightness away from the surface
 * until it clears 3:1, staying inside the mode's band and holding its hue.
 *
 * Without this, light mode fails on arithmetic alone — the top of the light band
 * (L 0.77) simply cannot reach 3:1 against a near-white surface, so the search
 * would always come back needing a relief channel.
 */
function snapForContrast(
  hue: number,
  lightness: number,
  mode: Mode,
  surface: string,
): string {
  const [lo, hi] = BAND[mode];
  const direction = mode === "light" ? -1 : 1;
  let current = Math.min(hi, Math.max(lo, lightness));

  for (let i = 0; i < 40; i += 1) {
    const hex = buildSwatch(hue, current, TARGET_CHROMA);
    if (wcagContrast(hex, surface) >= CONTRAST_MIN) return hex;
    const next = current + direction * 0.01;
    if (next < lo || next > hi) break;
    current = next;
  }
  return buildSwatch(hue, current, TARGET_CHROMA);
}

function auditPalette(hexes: string[], surface: string): PaletteAudit {
  let worstCvd = Infinity;
  let worstCvdKind: Deficiency = "protan";
  let worstNormal = Infinity;

  // Adjacent pairs: series are assigned in fixed order, so only neighbours touch.
  for (let i = 0; i < hexes.length - 1; i += 1) {
    const a = hexes[i]!;
    const b = hexes[i + 1]!;
    for (const kind of ["protan", "deutan"] as const) {
      const d = deltaE(a, b, kind);
      if (d < worstCvd) {
        worstCvd = d;
        worstCvdKind = kind;
      }
    }
    worstNormal = Math.min(worstNormal, deltaE(a, b));
  }

  const contrasts = hexes.map((hex) => wcagContrast(hex, surface));
  const minContrast = Math.min(...contrasts);

  return {
    worstCvd,
    worstCvdKind,
    worstNormal,
    minContrast,
    contrastClear: minContrast >= CONTRAST_MIN,
  };
}

function withinGates(hexes: string[], mode: Mode, audit: PaletteAudit): boolean {
  const [lo, hi] = BAND[mode];
  for (const hex of hexes) {
    const c = toOklch(hex);
    if (!c) return false;
    if (c.l < lo || c.l > hi) return false;
    if (c.c < CHROMA_FLOOR) return false;
  }
  return audit.worstCvd >= CVD_FLOOR && audit.worstNormal >= NORMAL_FLOOR;
}

/**
 * Hue spreads tried in order. Slot 1 always holds the seed hue so the first
 * series matches the brand; the rest spread around the wheel. Several spreads
 * are offered because a seed sitting near a gamut edge can make one spread
 * unusable while another passes.
 */
const HUE_SPREADS: number[][] = [
  [0, 138, 62, 250, 196],
  [0, 152, 74, 262, 208],
  [0, 128, 54, 238, 184],
  [0, 165, 88, 275, 220],
  [0, 115, 200, 45, 285],
  [0, 145, 68, 210, 258],
];

/**
 * Lightness patterns across the band, expressed as fractions of it. Dichromats
 * lose hue separation but keep lightness, so alternating light and dark slots is
 * what actually carries the CVD gate — a flat-lightness palette rarely passes.
 */
const LIGHTNESS_PATTERNS: number[][] = [
  [0.5, 0.86, 0.24, 0.72, 0.1],
  [0.28, 0.78, 0.44, 0.95, 0.14],
  [0.62, 0.16, 0.88, 0.36, 0.74],
  [0.42, 0.92, 0.18, 0.66, 0.02],
  [0.55, 0.05, 0.8, 0.3, 0.98],
];

const TARGET_CHROMA = 0.19;

/**
 * Derive the categorical chart palette for one mode.
 *
 * Searches hue spreads x lightness patterns, keeps every candidate that clears
 * the hard gates, and returns the one with the widest worst-case CVD separation.
 * Throws if nothing passes, which means the seed needs adjusting.
 */
export function generateChartPalette(
  primarySeed: string,
  mode: Mode,
  surface: string,
): { colors: string[]; audit: PaletteAudit } {
  const seed = toOklch(primarySeed);
  if (!seed) {
    throw new Error(`Could not parse primary seed: ${primarySeed}`);
  }
  const baseHue = seed.h ?? 0;
  const [lo, hi] = BAND[mode];

  let best: Candidate | null = null;

  for (const spread of HUE_SPREADS) {
    for (const pattern of LIGHTNESS_PATTERNS) {
      const hexes = spread.map((offset, index) => {
        const fraction = pattern[index]!;
        const lightness = lo + (hi - lo) * fraction;
        return snapForContrast(baseHue + offset, lightness, mode, surface);
      });
      const audit = auditPalette(hexes, surface);
      if (!withinGates(hexes, mode, audit)) continue;
      // Prefer clearing the contrast relief band, then maximise CVD headroom.
      const score = audit.worstCvd + (audit.contrastClear ? 100 : 0);
      const bestScore = best
        ? best.audit.worstCvd + (best.audit.contrastClear ? 100 : 0)
        : -Infinity;
      if (score > bestScore) best = { hexes, audit };
    }
  }

  if (!best) {
    throw new Error(
      `Could not derive a chart palette from primary seed "${primarySeed}" in ` +
        `${mode} mode that clears the categorical gates ` +
        `(CVD ΔE >= ${CVD_FLOOR}, normal-vision ΔE >= ${NORMAL_FLOOR}, ` +
        `chroma >= ${CHROMA_FLOOR}, lightness ${lo}-${hi}). ` +
        `Pick a primary seed with more chroma, or supply chart colours explicitly.`,
    );
  }

  return {
    // Ship exactly what was validated: the gates ran on these sRGB values.
    colors: best.hexes,
    audit: best.audit,
  };
}

export const CHART_THRESHOLDS = {
  BAND,
  CHROMA_FLOOR,
  CVD_TARGET,
  CVD_FLOOR,
  NORMAL_FLOOR,
  CONTRAST_MIN,
} as const;
