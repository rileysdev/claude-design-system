import { converter, clampChroma, type Oklch } from "culori";

const toOklch = converter("oklch");

export const RAMP_STEPS = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
] as const;

export type RampStep = (typeof RAMP_STEPS)[number];
export type Ramp = Record<RampStep, string>;

/**
 * Target OKLCH lightness per step. OKLCH lightness is perceptually uniform, so
 * an evenly-spaced curve here produces a ramp whose steps *look* evenly spaced —
 * this is the whole reason the generator works in OKLCH rather than HSL.
 *
 * Chromatic and neutral ramps get different curves on purpose. Greys have to run
 * darker through the middle and bottom so that text steps clear their contrast
 * gates against light surfaces, while accent steps stay luminous enough to read
 * as brand colour. Collapsing these into one curve makes either the greys too
 * pale for body text or the accents too muddy to look like the seed.
 */
const CHROMATIC_LIGHTNESS: Record<RampStep, number> = {
  50: 0.97,
  100: 0.932,
  200: 0.882,
  300: 0.809,
  400: 0.707,
  500: 0.623,
  600: 0.546,
  700: 0.488,
  800: 0.424,
  900: 0.379,
  950: 0.282,
};

const NEUTRAL_LIGHTNESS: Record<RampStep, number> = {
  50: 0.985,
  100: 0.967,
  200: 0.928,
  300: 0.872,
  400: 0.707,
  500: 0.551,
  600: 0.446,
  700: 0.373,
  800: 0.278,
  900: 0.21,
  950: 0.13,
};

/**
 * Chroma multipliers relative to the ramp's peak chroma. Colour cannot be held
 * near white or near black, so chroma tapers at both ends and peaks in the
 * 500-700 range where the accent steps live.
 */
const CHROMATIC_CHROMA: Record<RampStep, number> = {
  50: 0.057,
  100: 0.131,
  200: 0.241,
  300: 0.429,
  400: 0.673,
  500: 0.873,
  600: 1.0,
  700: 0.992,
  800: 0.812,
  900: 0.596,
  950: 0.371,
};

/** Greys carry a whisper of the brand hue; the curve barely moves. */
const NEUTRAL_CHROMA: Record<RampStep, number> = {
  50: 0.06,
  100: 0.1,
  200: 0.18,
  300: 0.3,
  400: 0.65,
  500: 0.8,
  600: 0.9,
  700: 1.0,
  800: 0.97,
  900: 1.0,
  950: 0.82,
};

/** Above this, a seed is treated as a real hue rather than a grey. */
const GREY_CHROMA_THRESHOLD = 0.012;
/** No sRGB colour exceeds this in OKLCH; guards against absurd back-solved peaks. */
const MAX_CHROMA = 0.37;

export interface RampOptions {
  /**
   * Override the peak chroma instead of back-solving it from the seed. Used for
   * neutral ramps, where a deliberately tiny value tints greys toward the brand
   * hue without reading as coloured.
   */
  peakChroma?: number;
  /** Degrees of hue rotation applied across the ramp, dark end warmest. */
  hueShift?: number;
  /**
   * Which lightness/chroma curve pair to use. Neutral ramps run darker through
   * the middle so grey text clears contrast against light surfaces.
   */
  curve?: "chromatic" | "neutral";
}

export function parseSeed(seed: string): Oklch {
  const parsed = toOklch(seed);
  if (!parsed) {
    throw new Error(`Could not parse colour seed: ${JSON.stringify(seed)}`);
  }
  return parsed;
}

/** Round-trip an OKLCH colour into a compact, gamut-safe CSS value. */
export function formatOklch(color: Oklch): string {
  const safe = clampChroma({ ...color, mode: "oklch" }, "oklch") as Oklch;
  const l = Number(safe.l.toFixed(4));
  const c = Number(safe.c.toFixed(4));
  const h = Number((safe.h ?? 0).toFixed(2));
  return `oklch(${l} ${c} ${h})`;
}

/**
 * Expand a single seed colour into a full 50-950 ramp.
 *
 * The seed is treated as *a step within its own ramp* rather than as the 500
 * step: we find whichever step's lightness the seed sits closest to, then
 * back-solve the peak chroma from that position. This means a pale seed and a
 * deep seed of the same hue produce the same ramp, which is what makes
 * "hand it a brand colour" behave predictably.
 */
export function generateRamp(seed: string, options: RampOptions = {}): Ramp {
  const base = parseSeed(seed);
  const hue = base.h ?? 0;
  const neutral = options.curve === "neutral";
  const lightnessCurve = neutral ? NEUTRAL_LIGHTNESS : CHROMATIC_LIGHTNESS;
  const chromaCurve = neutral ? NEUTRAL_CHROMA : CHROMATIC_CHROMA;

  let peak: number;
  if (options.peakChroma !== undefined) {
    peak = options.peakChroma;
  } else if (base.c < GREY_CHROMA_THRESHOLD) {
    // A grey seed stays grey — do not invent saturation the author didn't ask for.
    peak = base.c;
  } else {
    const anchor = nearestStep(base.l, lightnessCurve);
    peak = Math.min(base.c / chromaCurve[anchor], MAX_CHROMA);
  }

  const ramp = {} as Ramp;
  for (const step of RAMP_STEPS) {
    const shift = options.hueShift
      ? options.hueShift * (1 - lightnessCurve[step])
      : 0;
    ramp[step] = formatOklch({
      mode: "oklch",
      l: lightnessCurve[step],
      c: peak * chromaCurve[step],
      h: (hue + shift + 360) % 360,
    });
  }
  return ramp;
}

function nearestStep(
  lightness: number,
  curve: Record<RampStep, number>,
): RampStep {
  let best: RampStep = 500;
  let bestDelta = Infinity;
  for (const step of RAMP_STEPS) {
    const delta = Math.abs(curve[step] - lightness);
    if (delta < bestDelta) {
      bestDelta = delta;
      best = step;
    }
  }
  return best;
}
