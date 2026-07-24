/**
 * Compiles the shipped themes into everything downstream consumes:
 *
 *   src/styles/tokens.css   Tailwind v4 @theme + per-theme custom properties
 *   src/tokens/generated.ts typed token objects (also the future RN source)
 *   tokens/*.json           DTCG token files, uploaded with the design bundle
 *
 * Every theme is contrast-checked and every chart palette is CVD-checked during
 * this step, so a theme that cannot meet its guarantees fails the build here.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { defineTheme, SEMANTIC_TOKENS, type BuiltTheme } from "../src/theme/semantic";
import { RAMP_STEPS } from "../src/theme/ramp";
import { primitives } from "../src/theme/primitives";
import { themes } from "../themes";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const built: BuiltTheme[] = themes.map((config) => defineTheme(config));
const base = built[0]!;

const RAMP_NAMES = ["primary", "neutral", "destructive", "success", "warning", "info"] as const;

/* ── CSS ──────────────────────────────────────────────────────────────────── */

function semanticBlock(theme: BuiltTheme, mode: "light" | "dark"): string {
  const tokens = theme[mode];
  const lines = SEMANTIC_TOKENS.map((name) => `  --${name}: ${tokens[name]};`);

  for (const rampName of RAMP_NAMES) {
    const ramp = theme.ramps[rampName];
    for (const step of RAMP_STEPS) {
      lines.push(`  --${rampName}-${step}: ${ramp[step]};`);
    }
  }

  // Emitted as --elevation-* and mapped to Tailwind's shadow-* below. Writing
  // them straight to --shadow-* would collide with Tailwind's own built-ins and
  // lose the per-mode values.
  const shadows = primitives.shadow[mode];
  for (const [key, value] of Object.entries(shadows)) {
    lines.push(`  --elevation-${key}: ${value};`);
  }

  return lines.join("\n");
}

function themeInlineMappings(): string {
  const lines: string[] = [];
  for (const name of SEMANTIC_TOKENS) {
    lines.push(`  --color-${name}: var(--${name});`);
  }
  for (const rampName of RAMP_NAMES) {
    for (const step of RAMP_STEPS) {
      lines.push(`  --color-${rampName}-${step}: var(--${rampName}-${step});`);
    }
  }
  for (const key of Object.keys(primitives.shadow.light)) {
    lines.push(`  --shadow-${key}: var(--elevation-${key});`);
  }
  return lines.join("\n");
}

/** CSS custom properties are kebab-case even where the TS keys are camelCase. */
const kebab = (key: string) => key.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

function staticTheme(): string {
  const { typography, radius, space, size, motion, zIndex } = primitives;
  const lines: string[] = [];

  lines.push(`  --font-sans: ${typography.family.sans};`);
  lines.push(`  --font-mono: ${typography.family.mono};`);
  for (const [key, value] of Object.entries(typography.size)) {
    lines.push(`  --text-${key}: ${value};`);
  }
  for (const [key, value] of Object.entries(typography.weight)) {
    lines.push(`  --font-weight-${key}: ${value};`);
  }
  for (const [key, value] of Object.entries(typography.lineHeight)) {
    lines.push(`  --leading-${key}: ${value};`);
  }
  for (const [key, value] of Object.entries(typography.tracking)) {
    lines.push(`  --tracking-${key}: ${value};`);
  }
  for (const [key, value] of Object.entries(radius)) {
    lines.push(`  --radius-${key}: ${value};`);
  }
  for (const [key, value] of Object.entries(size)) {
    lines.push(`  --size-${kebab(key)}: ${value};`);
  }
  for (const [key, value] of Object.entries(motion.duration)) {
    lines.push(`  --duration-${key}: ${value};`);
  }
  for (const [key, value] of Object.entries(motion.easing)) {
    lines.push(`  --ease-${key}: ${value};`);
  }
  for (const [key, value] of Object.entries(zIndex)) {
    lines.push(`  --z-${key}: ${value};`);
  }
  // Spacing steps that are not on Tailwind's default numeric scale.
  for (const [key, value] of Object.entries(space)) {
    if (key === "px") lines.push(`  --spacing-px: ${value};`);
  }
  return lines.join("\n");
}

const cssParts: string[] = [
  `/**`,
  ` * GENERATED FILE — do not edit.`,
  ` * Run \`pnpm tokens\` after changing themes/index.ts or src/theme/*.`,
  ` */`,
  ``,
  `@theme {`,
  staticTheme(),
  `}`,
  ``,
  `/* Semantic colours resolve through custom properties so a theme or colour`,
  `   mode can change without regenerating utilities. */`,
  `@theme inline {`,
  themeInlineMappings(),
  `}`,
  ``,
  `:root {`,
  semanticBlock(base, "light"),
  `}`,
  ``,
  `.dark {`,
  semanticBlock(base, "dark"),
  `}`,
];

for (const theme of built.slice(1)) {
  const { name } = theme.config;
  cssParts.push(
    ``,
    `[data-theme="${name}"] {`,
    semanticBlock(theme, "light"),
    `}`,
    ``,
    `[data-theme="${name}"].dark,`,
    `.dark [data-theme="${name}"] {`,
    semanticBlock(theme, "dark"),
    `}`,
  );
}

mkdirSync(join(root, "src/styles"), { recursive: true });
writeFileSync(join(root, "src/styles/tokens.css"), `${cssParts.join("\n")}\n`, "utf8");

/* ── typed tokens ─────────────────────────────────────────────────────────── */

const generated = `/**
 * GENERATED FILE — do not edit. Run \`pnpm tokens\`.
 *
 * Colour values are plain strings so this module stays platform-neutral: the
 * same object can feed CSS custom properties today and a React Native theme
 * later without restating a single decision.
 */

export const themeNames = ${JSON.stringify(built.map((t) => t.config.name))} as const;

export type ThemeName = (typeof themeNames)[number];

export const themeMeta = ${JSON.stringify(
  Object.fromEntries(
    built.map((t) => [
      t.config.name,
      { label: t.config.label ?? t.config.name, description: t.config.description ?? "" },
    ]),
  ),
  null,
  2,
)} as const;

export const colorTokens = ${JSON.stringify(
  Object.fromEntries(
    built.map((t) => [t.config.name, { light: t.light, dark: t.dark, ramps: t.ramps }]),
  ),
  null,
  2,
)} as const;
`;

mkdirSync(join(root, "src/tokens"), { recursive: true });
writeFileSync(join(root, "src/tokens/generated.ts"), generated, "utf8");

/* ── DTCG token files ─────────────────────────────────────────────────────── */

function dtcgColorGroup(values: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, { $type: "color", $value: value }]),
  );
}

mkdirSync(join(root, "tokens"), { recursive: true });

const dtcgPrimitives = {
  $description: "Platform-agnostic decisions shared by every theme.",
  radius: Object.fromEntries(
    Object.entries(primitives.radius).map(([k, v]) => [k, { $type: "dimension", $value: v }]),
  ),
  space: Object.fromEntries(
    Object.entries(primitives.space).map(([k, v]) => [k, { $type: "dimension", $value: v }]),
  ),
  size: Object.fromEntries(
    Object.entries(primitives.size).map(([k, v]) => [k, { $type: "dimension", $value: v }]),
  ),
  fontSize: Object.fromEntries(
    Object.entries(primitives.typography.size).map(([k, v]) => [k, { $type: "dimension", $value: v }]),
  ),
  fontWeight: Object.fromEntries(
    Object.entries(primitives.typography.weight).map(([k, v]) => [k, { $type: "fontWeight", $value: Number(v) }]),
  ),
  duration: Object.fromEntries(
    Object.entries(primitives.motion.duration).map(([k, v]) => [k, { $type: "duration", $value: v }]),
  ),
};

writeFileSync(
  join(root, "tokens/primitives.json"),
  `${JSON.stringify(dtcgPrimitives, null, 2)}\n`,
  "utf8",
);

for (const theme of built) {
  const doc = {
    $description:
      `${theme.config.label ?? theme.config.name} — generated from seed colours; ` +
      `every pair contrast-checked at build time.`,
    seeds: dtcgColorGroup(theme.config.seeds as unknown as Record<string, string>),
    ramp: Object.fromEntries(
      RAMP_NAMES.map((name) => [name, dtcgColorGroup(theme.ramps[name] as unknown as Record<string, string>)]),
    ),
    light: dtcgColorGroup(theme.light),
    dark: dtcgColorGroup(theme.dark),
  };
  writeFileSync(
    join(root, `tokens/theme-${theme.config.name}.json`),
    `${JSON.stringify(doc, null, 2)}\n`,
    "utf8",
  );
}

const summary = built
  .map((t) => {
    const l = t.chartAudit.light;
    const d = t.chartAudit.dark;
    return (
      `  ${t.config.name.padEnd(8)} charts: CVD ΔE ${l.worstCvd.toFixed(1)}/${d.worstCvd.toFixed(1)} ` +
      `normal ΔE ${l.worstNormal.toFixed(1)}/${d.worstNormal.toFixed(1)} ` +
      `contrast ${l.minContrast.toFixed(2)}/${d.minContrast.toFixed(2)}`
    );
  })
  .join("\n");

process.stdout.write(
  `Generated ${built.length} theme(s), all contrast gates passed.\n${summary}\n`,
);
