# Badge

A small, non-interactive status or count label.

## Import

```tsx
import { Badge } from "claude-design-system";
```

## Props

- `variant`: `"neutral" | "primary" | "success" | "warning" | "destructive" | "info" | "outline"` — default `"neutral"`
- `size`: `"sm" | "md"` — default `"md"`
- `dot`: `boolean` — leading status dot in the current text colour

## Usage

```tsx
<Badge variant="success" dot>Live</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="destructive">Failed</Badge>
<Badge variant="neutral">Draft</Badge>
<Badge variant="primary" size="sm">3</Badge>
<Badge variant="success"><CheckIcon />Verified</Badge>
```

## Rules

- Status colours are reserved for status. Do not use `success`/`warning`/`destructive` to colour-code categories — use `neutral` or `outline` for those.
- Never rely on colour alone: the badge's text carries the meaning, the colour reinforces it.
- Badges are not buttons. If it needs to be tappable, use a Button.
- Keep to one or two words.
