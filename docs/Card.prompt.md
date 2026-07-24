# Card

A surface that groups related content.

## Import

```tsx
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
} from "claude-design-system";
```

## Props

`Card`
- `variant`: `"outlined" | "elevated" | "plain"` — default `"outlined"`
- `padded`: `boolean` — adds `p-4`. Omit when using the subcomponents, which bring their own padding.

`CardTitle`
- `as`: `"h2" | "h3" | "h4"` — default `"h3"`. Pick the level that fits the page outline, not the size.

## Usage

```tsx
<Card>
  <CardHeader>
    <CardTitle>Monthly plan</CardTitle>
    <CardDescription>Renews on 14 August 2026.</CardDescription>
  </CardHeader>
  <CardContent>
    <p className="text-2xl font-semibold">£12<span className="text-sm font-normal text-muted-foreground"> / month</span></p>
  </CardContent>
  <CardFooter>
    <Button size="sm">Manage</Button>
    <Button size="sm" variant="ghost">Cancel</Button>
  </CardFooter>
</Card>
```

Simple bordered box:

```tsx
<Card padded>
  <p className="text-sm">Anything at all.</p>
</Card>
```

## Rules

- `outlined` is the default and the right choice inside a list of cards — repeated shadows get noisy.
- `elevated` is for a card that stands alone or floats above content.
- Do not nest cards. Use a Separator or a List inside one card instead.
- A card is not a button. For a tappable row, use `ListItem`.
