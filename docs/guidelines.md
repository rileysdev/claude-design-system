# Using this design system

A mobile-first React component library. Every colour, space and radius comes
from a token; nothing is hard-coded.

## The rules that matter most

1. **Never hard-code a colour.** Use the semantic tokens — `bg-background`,
   `text-foreground`, `bg-card`, `text-muted-foreground`, `bg-primary`,
   `border-border`. They switch with the theme and with light/dark
   automatically. A literal hex or a Tailwind palette class (`bg-blue-500`)
   breaks both.
2. **44px minimum touch target.** Every interactive control in this system
   already meets it. Do not shrink buttons, rows or tab items below it.
3. **Body text is 16px.** Inputs never go below it, or iOS zooms the viewport
   on focus. `text-sm` is the floor for secondary copy.
4. **Status is never colour alone.** Every success/warning/error pairs its
   colour with an icon and written text.
5. **Compose, do not restyle.** If a component nearly fits, pass `className`
   for layout (width, margin, grid placement). Do not override its colours.

## Semantic colour tokens

| Token | Use for |
|---|---|
| `background` / `foreground` | the page and its default text |
| `card` / `card-foreground` | raised surfaces, list rows |
| `popover` / `popover-foreground` | menus, dialogs, sheets, toasts |
| `primary` / `primary-foreground` | the main action |
| `secondary` / `secondary-foreground` | a quieter filled control |
| `muted` / `muted-foreground` | subdued surfaces and secondary text |
| `accent` / `accent-foreground` | hover and pressed surfaces |
| `destructive`, `success`, `warning`, `info` (+ `-foreground`) | status |
| `border` / `input` / `ring` | hairlines, control outlines, focus rings |
| `chart-1` … `chart-5` | data series, assigned in order and never cycled |

## Screen structure

```tsx
<Screen>
  <AppBar title="Inbox" />
  <main className="flex-1 overflow-y-auto p-4">{/* content */}</main>
  <TabBar>{/* destinations */}</TabBar>
</Screen>
```

`AppBar` and `TabBar` handle safe-area insets themselves. Do not add notch or
home-indicator padding yourself. For custom chrome, the utilities `pt-safe`,
`pb-safe` and `px-safe` are available.

## Theming

Themes are generated at build time from a handful of seed colours. Set them by
putting `data-theme` and the `dark` class on the root element — or use
`ThemeProvider`, which persists the choice and follows the system setting:

```tsx
<ThemeProvider defaultTheme="default" defaultMode="system">
  <App />
</ThemeProvider>
```

Shipped themes: `default` (indigo-blue), `clay` (warm terracotta), `forest`
(deep green). Adding one means adding seeds to `themes/index.ts` and running
`pnpm tokens`; every derived colour is contrast-checked and the build fails if
a pair is illegible.

## Choosing a container

| Need | Use |
|---|---|
| group related content in place | `Card` |
| rows of settings, messages, results | `List` + `ListItem` |
| a panel from the screen edge | `Sheet` (`bottom` on phones) |
| a short confirmation | `Dialog` |
| a list of actions from a control | `DropdownMenu` |
| nothing to show yet | `EmptyState` |

## Accessibility floor

- Icon-only controls need `aria-label`.
- Every form control goes through `FormField`, or carries a `Label` with `htmlFor`.
- Tooltips never open on touch — never put required information in one.
- Focus rings are automatic; do not remove them.
- All text pairs in every shipped theme meet WCAG AA, enforced at build time.
