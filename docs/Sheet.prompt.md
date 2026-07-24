# Sheet

An edge-anchored panel. On phones this is the workhorse container — prefer it
over Dialog for pickers, filters, and any menu with more than a few options.

## Import

```tsx
import {
  Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle,
  SheetDescription, SheetFooter, SheetClose,
} from "claude-design-system";
```

## Props

- `SheetContent`: `side`: `"bottom" | "top" | "left" | "right"` — default `"bottom"`; `showClose?: boolean` (default `true`)
- `Sheet` takes the Radix Dialog root props: `open`, `defaultOpen`, `onOpenChange`, `modal`

The `bottom` side gets a drag handle and safe-area padding automatically.

## Usage

```tsx
<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">Filters</Button>
  </SheetTrigger>
  <SheetContent side="bottom">
    <SheetHeader>
      <SheetTitle>Filter results</SheetTitle>
      <SheetDescription>Narrow down what you see.</SheetDescription>
    </SheetHeader>

    <List>
      <ListItem title="Any date" navigable />
      <ListItem title="Price: low to high" navigable />
    </List>

    <SheetFooter>
      <Button fullWidth>Apply filters</Button>
      <SheetClose asChild>
        <Button fullWidth variant="ghost">Cancel</Button>
      </SheetClose>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

Side navigation:

```tsx
<Sheet>
  <SheetTrigger asChild>
    <Button size="icon" variant="ghost" aria-label="Menu"><MenuIcon /></Button>
  </SheetTrigger>
  <SheetContent side="left">
    <SheetHeader><SheetTitle>Menu</SheetTitle></SheetHeader>
    <List>{/* destinations */}</List>
  </SheetContent>
</Sheet>
```

## Rules

- Always include a `SheetTitle`, even if visually redundant — it names the dialog for screen readers.
- Use `bottom` on phones. Reserve `left`/`right` for navigation drawers.
- Primary action goes in `SheetFooter`, full width.
- For a short confirmation with two buttons, use Dialog instead.
