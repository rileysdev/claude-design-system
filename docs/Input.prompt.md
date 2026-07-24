# Input

A single-line text field. Pair it with `FormField` so it gets a label and
description wired correctly.

## Import

```tsx
import { Input } from "claude-design-system";
```

## Props

- `size`: `"sm" | "md" | "lg"` — default `"md"` (44px)
- `invalid`: `boolean` — error treatment plus `aria-invalid`
- plus every native `<input>` attribute

Text renders at 16px at every size, because anything smaller makes iOS Safari
zoom the viewport when the field is focused. Do not override it downward.

## Usage

```tsx
<FormField>
  <FormLabel required>Email</FormLabel>
  <FormControl>
    {(props) => <Input {...props} type="email" inputMode="email" autoComplete="email" />}
  </FormControl>
</FormField>
```

With a leading icon:

```tsx
<div className="relative">
  <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
  <Input placeholder="Search" className="pl-9" />
</div>
```

## Rules

- Always set `type`, `inputMode` and `autoComplete` — they decide which keyboard a phone shows.
- Use placeholders for examples, never as a substitute for a label.
- `invalid` on its own only paints the field; pair it with `FormMessage` so the reason is stated.
