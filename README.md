# claude-design-system

A mobile-first React design system based on shadcn/ui, built to be imported by
[Claude Design](https://claude.ai/design) via `/design-sync`.

Hand it a few seed colours and it generates a complete, contrast-verified theme:
perceptually even OKLCH ramps, semantic tokens for light and dark, and a
categorical chart palette that is checked for colour-vision-deficiency
separation. A theme whose seeds cannot produce a legible system **fails the
build** rather than shipping.

## Quick start

```bash
pnpm install
pnpm build          # tokens → JS → types → CSS
pnpm storybook      # browse the system
```

In an app:

```tsx
import "claude-design-system/styles.css";
import { ThemeProvider, Button, Screen, AppBar } from "claude-design-system";

export function App() {
  return (
    <ThemeProvider defaultTheme="default" defaultMode="system">
      <Screen>
        <AppBar title="Inbox" />
        <main className="flex-1 overflow-y-auto p-4">
          <Button fullWidth>Continue</Button>
        </main>
      </Screen>
    </ThemeProvider>
  );
}
```

## Defining a theme

A theme is a handful of seeds. Everything else is derived:

```ts
// themes/index.ts
export const themes: ThemeConfig[] = [
  {
    name: "clay",
    label: "Clay",
    seeds: { primary: "oklch(0.64 0.13 44)" },
    neutralChroma: 0.02, // how much brand hue bleeds into the greys
  },
];
```

Then `pnpm tokens`. The generator:

1. Expands each seed into a 50–950 OKLCH ramp. Chromatic and neutral ramps use
   different lightness curves — greys must run darker through the middle so grey
   text clears contrast, while accents stay luminous.
2. Maps ramps onto semantic tokens separately for light and dark. Dark mode is a
   re-mapping, not an inversion: it lifts the accent steps and leans on borders
   rather than shadow.
3. Derives the status colours from the brand hue instead of hardcoding them.
   Each of destructive/success/warning/info is pulled toward the primary for
   cohesion, bounded by a hue band that keeps its meaning, then pushed away
   again if it would be confusable with the brand — the case a warm primary
   otherwise walks straight into. Fills use a per-role lightness, because amber
   only reads as amber while it is light.
4. Enforces contrast — 4.5:1 for text, 3:1 for focus rings, and a separator
   floor above the desktop convention because a 1.2:1 hairline vanishes on a
   phone outdoors — plus a 25° minimum hue separation between statuses and the
   brand.
5. Derives the 5 chart colours by searching hue spreads × lightness patterns for
   the palette with the widest colour-vision-deficiency separation, then snaps
   each swatch's lightness until it clears 3:1 against the surface.

Any violation throws with the offending pair named.

## Scripts

| Command | Does |
|---|---|
| `pnpm tokens` | Generate tokens, CSS custom properties, DTCG JSON. Runs every gate. |
| `pnpm build` | Full library build into `dist/` |
| `pnpm storybook` | Storybook dev server |
| `pnpm build-storybook` | Static Storybook — the source previews are rendered from |
| `pnpm render-check` | Render every story in headless Chromium, grade `bad`/`thin`, screenshot both modes |
| `pnpm bundle` | Assemble `ds-bundle/` for Claude Design |
| `pnpm verify-bundle` | Open every bundled card standalone and confirm it renders styled |
| `pnpm typecheck` | `tsc --noEmit` |

## Syncing to Claude Design

```bash
pnpm build && pnpm build-storybook && pnpm bundle && pnpm verify-bundle
```

Then `/design-sync` in Claude Code, or push `ds-bundle/` with the DesignSync
tool. The bundle contains, per component:

- `index.html` — a preview card carrying a `@dsCard` marker, **rendered from the
  component's own Storybook story** so the preview cannot drift from the code
- `index.d.ts` — the real exported prop types
- `index.prompt.md` — how to compose the component

Those last two are what the design agent codes against, which is why they are
treated as shipping deliverables rather than documentation.

## What's in it

**Actions** Button · **Forms** Input, Textarea, FormField, Label, Checkbox,
RadioGroup, Switch, Select · **Layout** Card, Stack, Screen, Separator ·
**Data display** List, Badge, Avatar, Accordion · **Navigation** AppBar, TabBar,
Tabs, Pagination · **Overlays** Sheet, Dialog, Popover, DropdownMenu, Tooltip ·
**Feedback** Alert, Toast, EmptyState, Skeleton, Spinner, Progress

Mobile-first throughout: 44px touch targets by default, 16px input text so iOS
never zooms on focus, safe-area insets handled by `AppBar`/`TabBar`, and
bottom-anchored sheets and toasts because that is where the thumb is.

## Adding React Native later

Nothing web-specific lives in the token layer. `src/theme/primitives.ts` and the
generated `src/tokens/` are plain data, and the generator emits Tailwind v4
`@theme` CSS from them rather than the other way around — so a native target
(Uniwind, which supports Tailwind v4 and the same `@theme` blocks) can consume
the same source without a single decision being restated.

Claude Design renders React DOM, so the syncable surface stays web.
