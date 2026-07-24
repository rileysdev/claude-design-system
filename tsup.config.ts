import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "tokens/index": "src/tokens/index.ts",
  },
  format: ["esm"],
  // Declarations come from `tsc --emitDeclarationOnly` instead: tsup's dts
  // plugin does not support TypeScript 7, and per-file .d.ts maps directly onto
  // the per-component .d.ts files the design bundle ships.
  dts: false,
  sourcemap: true,
  clean: false,
  treeshake: true,
  splitting: false,
  target: "es2022",
  external: ["react", "react-dom"],
  // design-sync esbuild-bundles dist/, so keep output plain ESM with no
  // bundler-specific syntax and no CSS imports inside the JS graph.
  esbuildOptions(options) {
    options.jsx = "automatic";
  },
});
