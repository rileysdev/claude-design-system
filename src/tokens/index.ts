/**
 * Token-only entry point — no React, no DOM.
 *
 * Deliberately free of anything web-specific so the same values can drive a
 * React Native theme later without a translation layer.
 */
export { primitives, typography, radius, space, size, motion, zIndex, shadow } from "../theme/primitives";
export { themeNames, themeMeta, colorTokens, type ThemeName } from "./generated";
export { SEMANTIC_TOKENS, type SemanticToken, type SemanticTokens } from "../theme/semantic";
export { RAMP_STEPS, type RampStep, type Ramp } from "../theme/ramp";
