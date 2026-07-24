# Button

Triggers an action. For navigation, render an anchor with `asChild`.

## Import

```tsx
import { Button } from "claude-design-system";
```

## Props

- `variant`: `"primary" | "secondary" | "outline" | "ghost" | "destructive" | "link"` — default `"primary"`
- `size`: `"sm" | "md" | "lg" | "icon"` — default `"md"` (44px, the touch target)
- `fullWidth`: `boolean` — default `false`
- `asChild`: `boolean` — render the child element instead of `<button>`
- plus every native `<button>` attribute

## Usage

```tsx
<Button>Save changes</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="destructive" size="lg">Delete account</Button>

// Icon before the label. Icons are sized automatically — do not add size classes.
<Button><PlusIcon />New item</Button>

// Icon-only buttons must carry an accessible name.
<Button size="icon" aria-label="Search"><SearchIcon /></Button>

// A link that looks like a button.
<Button asChild><a href="/pricing">See pricing</a></Button>

// Full-width is the norm for primary actions on a phone.
<Button fullWidth>Continue</Button>
```

## Rules

- One `primary` button per screen. Everything else is `secondary`, `outline` or `ghost`.
- `destructive` is for irreversible actions only, and should be confirmed in a Dialog.
- Never nest a Button inside another interactive element.
- Loading state: disable the button and put a `<Spinner size="sm" />` before the label.
- `type` defaults to `"button"`. Set `type="submit"` explicitly on form submit buttons.
