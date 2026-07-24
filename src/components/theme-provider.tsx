import * as React from "react";

import { themeNames, type ThemeName } from "../tokens/generated";

export type ColorMode = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  mode: ColorMode;
  setMode: (mode: ColorMode) => void;
  /** The mode actually in effect once "system" is resolved. */
  resolvedMode: "light" | "dark";
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeName;
  defaultMode?: ColorMode;
  /** Element the theme attributes are written to. Defaults to <html>. */
  target?: HTMLElement | null;
  /** localStorage key. Pass null to disable persistence. */
  storageKey?: string | null;
}

/**
 * Applies a theme and colour mode by setting `data-theme` and the `dark` class.
 *
 * Themes themselves are generated at build time — this only chooses between the
 * ones already compiled into the stylesheet, so switching costs nothing at
 * runtime and no colour maths happens in the browser.
 */
export function ThemeProvider({
  children,
  defaultTheme = themeNames[0],
  defaultMode = "system",
  target,
  storageKey = "cds-theme",
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<ThemeName>(defaultTheme);
  const [mode, setModeState] = React.useState<ColorMode>(defaultMode);
  const [systemMode, setSystemMode] = React.useState<"light" | "dark">("light");

  // Read persisted preferences after mount so server and client markup agree.
  React.useEffect(() => {
    if (!storageKey || typeof window === "undefined") return;
    const storedTheme = window.localStorage.getItem(`${storageKey}-name`);
    const storedMode = window.localStorage.getItem(`${storageKey}-mode`);
    if (storedTheme && (themeNames as readonly string[]).includes(storedTheme)) {
      setThemeState(storedTheme as ThemeName);
    }
    if (storedMode === "light" || storedMode === "dark" || storedMode === "system") {
      setModeState(storedMode);
    }
  }, [storageKey]);

  React.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => setSystemMode(query.matches ? "dark" : "light");
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const resolvedMode = mode === "system" ? systemMode : mode;

  React.useEffect(() => {
    const element =
      target ?? (typeof document !== "undefined" ? document.documentElement : null);
    if (!element) return;
    element.dataset.theme = theme;
    element.classList.toggle("dark", resolvedMode === "dark");
    element.style.colorScheme = resolvedMode;
  }, [theme, resolvedMode, target]);

  const setTheme = React.useCallback(
    (next: ThemeName) => {
      setThemeState(next);
      if (storageKey && typeof window !== "undefined") {
        window.localStorage.setItem(`${storageKey}-name`, next);
      }
    },
    [storageKey],
  );

  const setMode = React.useCallback(
    (next: ColorMode) => {
      setModeState(next);
      if (storageKey && typeof window !== "undefined") {
        window.localStorage.setItem(`${storageKey}-mode`, next);
      }
    },
    [storageKey],
  );

  const value = React.useMemo<ThemeContextValue>(
    () => ({ theme, setTheme, mode, setMode, resolvedMode }),
    [theme, setTheme, mode, setMode, resolvedMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside <ThemeProvider>.");
  }
  return context;
}
