# Foundations — colour, type, space, motion

Every value in the system is a token. Reference tokens, never literals.

## Colour

Each theme is generated from a handful of seed colours. A seed expands into a
perceptually even OKLCH ramp (`50`–`950`), and the semantic tokens are mapped
onto those steps separately for light and dark — dark mode is a re-mapping, not
an inversion.

Use the semantic tokens in components:

```tsx
<div className="bg-card text-card-foreground border border-border">
  <p className="text-muted-foreground">Secondary copy</p>
  <Button className="bg-primary text-primary-foreground">Action</Button>
</div>
```

Ramp steps are available too (`bg-primary-600`, `text-neutral-500`), but reach
for a semantic token first — ramp steps do not carry meaning and will not adapt
between light and dark.

Every text pair is contrast-checked at build time against WCAG AA (4.5:1 for
body, 3:1 for focus rings). A theme whose seeds cannot produce a legible system
fails the build rather than shipping.

## Chart colours

`chart-1` … `chart-5` are a categorical palette derived from the primary hue.
They are assigned **in fixed order and never cycled**: series 1 takes
`chart-1`, series 2 takes `chart-2`, and colour follows the entity, not its
rank — a filter that changes the series count must not repaint the survivors.

Adjacent pairs are validated at build time for colour-vision-deficiency
separation and for contrast against the chart surface. For more than five
series, fold the tail into "Other" or use small multiples; do not generate
extra hues.

## Type

| Token | Size | Use |
|---|---|---|
| `text-2xs` | 0.6875rem | tab bar labels, dense metadata |
| `text-xs` | 0.75rem | badges, captions |
| `text-sm` | 0.875rem | secondary copy, list descriptions |
| `text-base` | 1rem | body, and every input |
| `text-lg`–`text-5xl` | | headings |

Headings tighten tracking and balance their line breaks automatically.

## Space, radius, elevation, motion

- Spacing: the Tailwind scale, driven through `Stack`'s `gap` in components.
- Radius: `rounded-md` controls, `rounded-lg` buttons and inputs, `rounded-xl` cards, `rounded-2xl` sheets.
- Elevation: `shadow-xs` through `shadow-xl`, with a separate tighter set in dark mode.
- Motion: `duration-[var(--duration-fast)]` (140ms) for state changes,
  `--duration-normal` (220ms) for movement, with `ease-standard` /
  `ease-enter` / `ease-exit`. All motion is disabled under
  `prefers-reduced-motion`.

## Safe areas

`--safe-top`, `--safe-bottom`, `--safe-left`, `--safe-right` mirror the device
insets, with `pt-safe`, `pb-safe`, `px-safe` and `min-h-screen-safe` as
utilities. `AppBar` and `TabBar` already apply them.
