/**
 * Smoke-check the generator: build every shipped theme and print the result.
 * Run with `pnpm tsx scripts/inspect-theme.ts`.
 */
import { defineTheme } from "../src/theme/semantic";
import { themes } from "../themes";
import { contrast } from "../src/theme/contrast";

for (const config of themes) {
  process.stdout.write(`\n=== ${config.name} ===\n`);
  const theme = defineTheme(config);

  for (const mode of ["light", "dark"] as const) {
    const tokens = theme[mode];
    const audit = theme.chartAudit[mode];
    process.stdout.write(
      `${mode}: bg ${tokens.background} fg ${tokens.foreground} primary ${tokens.primary}\n` +
        `  fg/bg ${contrast(tokens.foreground, tokens.background).toFixed(2)}:1` +
        `  muted-fg/bg ${contrast(tokens["muted-foreground"], tokens.background).toFixed(2)}:1` +
        `  primary-fg/primary ${contrast(tokens["primary-foreground"], tokens.primary).toFixed(2)}:1` +
        `  ring/bg ${contrast(tokens.ring, tokens.background).toFixed(2)}:1` +
        `  border/card ${contrast(tokens.border, tokens.card).toFixed(2)}:1\n` +
        `  charts ${[1, 2, 3, 4, 5].map((n) => tokens[`chart-${n}` as "chart-1"]).join(" ")}\n` +
        `  chart CVD ΔE ${audit.worstCvd.toFixed(1)} (${audit.worstCvdKind})` +
        `  normal ΔE ${audit.worstNormal.toFixed(1)}` +
        `  min contrast ${audit.minContrast.toFixed(2)}:1` +
        `${audit.contrastClear ? "" : "  [relief required]"}\n`,
    );
  }
}
