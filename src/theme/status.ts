import { converter } from "culori";

import { formatOklch, parseSeed } from "./ramp";

/**
 * Derives the status colours (destructive / success / warning / info) from the
 * theme's primary seed.
 *
 * Hardcoded status colours are the usual approach and they fail twice over:
 * they never move between themes, so they read as bolted on, and nothing stops
 * one landing on top of the brand hue — a terracotta primary next to a fixed
 * red is the case that motivated this.
 *
 * Two forces are balanced here:
 *
 *   Cohesion — a status colour takes its chroma from the brand, so a muted
 *   palette gets muted statuses, and its hue is pulled toward the brand hue.
 *
 *   Distinguishability — the pull is bounded by a recognition band the hue may
 *   never leave (red stays red), and a status is pushed *away* from the brand
 *   hue if the pull would leave it confusable with primary.
 *
 * The second force is why "rotate everything toward the brand" is wrong on its
 * own: for a warm primary it would drag the danger colour straight into it.
 */

const toOklch = converter("oklch");

export type StatusRole = "destructive" | "success" | "warning" | "info";

interface RoleSpec {
  /** Canonical hue for the meaning, in OKLCH degrees. */
  anchor: number;
  /**
   * The hue may move anywhere inside this band and still read as its meaning.
   * Outside it the colour stops saying what it needs to say — a "red" at 45°
   * is an orange, and nobody reads orange as danger.
   */
  band: [number, number];
  /** Chroma floor: below this the colour reads as grey and loses urgency. */
  chromaFloor: number;
  /** Chroma ceiling: above this it shouts louder than the brand. */
  chromaCeil: number;
  /**
   * Lightness the filled treatment sits at, per colour mode.
   *
   * This is per-role rather than a shared ramp step because lightness is not
   * negotiable for some hues: amber only reads as amber while it is light, and
   * the same lightness that makes red look confident makes yellow look like
   * mud. A generic ramp cannot serve both — its chroma tapers exactly where
   * amber needs chroma most.
   */
  fillLightness: { light: number; dark: number };
}

/*
 * Chroma here is the ramp's *peak*, which the step curve then scales down —
 * the 600 step keeps it, but 500 multiplies by 0.87 and 400 by 0.67. So these
 * floors sit higher than the chroma you actually see. Set them too low and the
 * colour arrives at its display step drained: an amber at low chroma is brown,
 * and brown does not read as a warning.
 */
const ROLES: Record<StatusRole, RoleSpec> = {
  // Red. Below ~10 it turns crimson/magenta, above ~33 it becomes orange.
  destructive: {
    anchor: 27,
    band: [10, 33],
    chromaFloor: 0.19,
    chromaCeil: 0.25,
    fillLightness: { light: 0.55, dark: 0.7 },
  },
  // Green. Below ~132 it yellows, above ~165 it turns teal.
  success: {
    anchor: 150,
    band: [132, 165],
    chromaFloor: 0.15,
    chromaCeil: 0.21,
    fillLightness: { light: 0.56, dark: 0.72 },
  },
  // Amber. Below ~58 it reads orange-red, above ~92 it goes yellow-green.
  // Kept light in both modes — a dark amber is brown, and brown says nothing.
  warning: {
    anchor: 75,
    band: [58, 92],
    chromaFloor: 0.16,
    chromaCeil: 0.2,
    fillLightness: { light: 0.8, dark: 0.84 },
  },
  // Blue. Below ~228 it cyans, above ~268 it turns violet.
  info: {
    anchor: 248,
    band: [228, 268],
    chromaFloor: 0.15,
    chromaCeil: 0.22,
    fillLightness: { light: 0.56, dark: 0.72 },
  },
};

/**
 * Minimum hue separation, in degrees, between a status colour and the brand —
 * and between any two status colours. Closer than this and the two stop being
 * tellable apart at badge size.
 */
const MIN_HUE_SEPARATION = 25;

/**
 * Seeds are built at this lightness on purpose: it is the 600 step of the
 * chromatic ramp, where the chroma multiplier is exactly 1. That makes the peak
 * chroma the generator back-solves equal to the chroma set here, so these
 * numbers survive into the ramp instead of being rescaled.
 */
const SEED_LIGHTNESS = 0.546;

/** Signed shortest angular distance from `a` to `b`, in (-180, 180]. */
function signedDelta(a: number, b: number): number {
  return ((b - a + 540) % 360) - 180;
}

function circularDistance(a: number, b: number): number {
  return Math.abs(signedDelta(a, b));
}

function clampToBand(hue: number, [low, high]: [number, number]): number {
  return Math.min(high, Math.max(low, hue));
}

export interface StatusDerivation {
  role: StatusRole;
  hue: number;
  chroma: number;
  seed: string;
  /**
   * The filled treatment per mode — what a solid Badge, Alert icon or Toast
   * accent actually uses. Computed at the role's own lightness rather than
   * taken from a ramp step, so each hue lands where it reads correctly.
   */
  fill: { light: string; dark: string };
  /** Degrees the hue moved from its anchor, for reporting. */
  movedBy: number;
  /** True when the role was pushed away from the brand hue. */
  repelled: boolean;
}

export interface DeriveStatusOptions {
  /**
   * How strongly status hues are pulled toward the brand hue, 0–1.
   * 0 pins every status to its canonical anchor; 1 pulls to the band edge.
   * The default is deliberately modest — enough that themes feel related,
   * not so much that every palette's statuses look the same.
   */
  harmony?: number;
}

/**
 * Resolve one status role against the brand hue.
 *
 * Pull toward the brand first (cohesion), clamp into the recognition band
 * (meaning), then repel from the brand if still too close (distinguishability).
 * Repulsion runs last because it is the constraint that must not be traded away.
 */
function deriveRole(
  role: StatusRole,
  primaryHue: number,
  primaryPeakChroma: number,
  harmony: number,
): StatusDerivation {
  const spec = ROLES[role];

  const pulled = spec.anchor + signedDelta(spec.anchor, primaryHue) * harmony;
  let hue = clampToBand(pulled, spec.band);

  let repelled = false;
  if (circularDistance(hue, primaryHue) < MIN_HUE_SEPARATION) {
    // Try both directions and keep whichever stays inside the band. When both
    // work, prefer the one requiring the smaller move.
    const candidates = [primaryHue - MIN_HUE_SEPARATION, primaryHue + MIN_HUE_SEPARATION]
      .map((candidate) => ((candidate % 360) + 360) % 360)
      .filter(
        (candidate) => candidate >= spec.band[0] && candidate <= spec.band[1],
      )
      .sort((a, b) => Math.abs(a - hue) - Math.abs(b - hue));

    if (candidates.length > 0) {
      hue = candidates[0]!;
    } else {
      // The brand sits so close to this role's band that no in-band hue clears
      // the separation. Take the band edge furthest from the brand and let the
      // build-time gate decide whether the result is still acceptable.
      const [low, high] = spec.band;
      hue =
        circularDistance(low, primaryHue) >= circularDistance(high, primaryHue) ? low : high;
    }
    repelled = true;
  }

  // Some of the brand's saturation carries across, so a muted palette gets
  // muted statuses — but never below the floor that keeps the hue legible.
  const chroma = Math.min(
    spec.chromaCeil,
    Math.max(spec.chromaFloor, primaryPeakChroma),
  );

  // formatOklch gamut-clamps, so asking for more chroma than sRGB can hold at
  // this lightness simply yields the most saturated colour available there.
  const fillAt = (lightness: number) =>
    formatOklch({ mode: "oklch", l: lightness, c: chroma, h: hue });

  return {
    role,
    hue,
    chroma,
    seed: formatOklch({ mode: "oklch", l: SEED_LIGHTNESS, c: chroma, h: hue }),
    fill: {
      light: fillAt(spec.fillLightness.light),
      dark: fillAt(spec.fillLightness.dark),
    },
    movedBy: Math.round(signedDelta(spec.anchor, hue)),
    repelled,
  };
}

/**
 * Back-solve the primary ramp's peak chroma so status colours can inherit the
 * brand's saturation level rather than a fixed one.
 */
export function primaryPeakChroma(primarySeed: string): number {
  const seed = parseSeed(primarySeed);
  // Mirrors the chromatic curve in ramp.ts: find the step whose lightness the
  // seed sits nearest, then undo that step's chroma multiplier.
  const STEP_LIGHTNESS = [0.97, 0.932, 0.882, 0.809, 0.707, 0.623, 0.546, 0.488, 0.424, 0.379, 0.282];
  const STEP_CHROMA = [0.057, 0.131, 0.241, 0.429, 0.673, 0.873, 1.0, 0.992, 0.812, 0.596, 0.371];
  let best = 0;
  let bestDelta = Infinity;
  STEP_LIGHTNESS.forEach((lightness, index) => {
    const delta = Math.abs(lightness - seed.l);
    if (delta < bestDelta) {
      bestDelta = delta;
      best = index;
    }
  });
  return Math.min(0.37, seed.c / STEP_CHROMA[best]!);
}

export function deriveStatusSeeds(
  primarySeed: string,
  options: DeriveStatusOptions = {},
): Record<StatusRole, StatusDerivation> {
  const harmony = Math.min(1, Math.max(0, options.harmony ?? 0.3));
  const primary = parseSeed(primarySeed);
  const hue = primary.h ?? 0;
  const peak = primaryPeakChroma(primarySeed);

  const derived = {} as Record<StatusRole, StatusDerivation>;
  for (const role of Object.keys(ROLES) as StatusRole[]) {
    derived[role] = deriveRole(role, hue, peak, harmony);
  }
  return derived;
}

export interface SeparationFailure {
  a: string;
  b: string;
  degrees: number;
  required: number;
}

/**
 * Check that every status stays tellable apart from the brand and from the
 * other statuses. Returns the failures rather than throwing so the caller can
 * report them alongside the contrast failures.
 */
export function checkStatusSeparation(
  primarySeed: string,
  derived: Record<StatusRole, StatusDerivation>,
): SeparationFailure[] {
  const failures: SeparationFailure[] = [];
  const primaryHue = parseSeed(primarySeed).h ?? 0;
  const entries = Object.values(derived);

  for (const entry of entries) {
    const degrees = circularDistance(entry.hue, primaryHue);
    if (degrees < MIN_HUE_SEPARATION) {
      failures.push({
        a: "primary",
        b: entry.role,
        degrees: Math.round(degrees),
        required: MIN_HUE_SEPARATION,
      });
    }
  }

  for (let i = 0; i < entries.length; i += 1) {
    for (let j = i + 1; j < entries.length; j += 1) {
      const first = entries[i]!;
      const second = entries[j]!;
      const degrees = circularDistance(first.hue, second.hue);
      if (degrees < MIN_HUE_SEPARATION) {
        failures.push({
          a: first.role,
          b: second.role,
          degrees: Math.round(degrees),
          required: MIN_HUE_SEPARATION,
        });
      }
    }
  }

  return failures;
}

export { MIN_HUE_SEPARATION, ROLES };
export type { RoleSpec };
