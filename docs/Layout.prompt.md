# Stack, Screen, Separator and Pagination

Layout primitives. Using them is what keeps spacing on the token scale instead
of drifting to whatever number was nearest to hand.

## Import

```tsx
import { Stack, Screen, Separator, Pagination, Avatar, AvatarImage, AvatarFallback } from "claude-design-system";
```

## Props

`Stack`
- `direction`: `"vertical" | "horizontal"` — default `"vertical"`
- `gap`: `0 | 1 | 2 | 3 | 4 | 6 | 8` — default `4`
- `align`: `"start" | "center" | "end" | "stretch" | "baseline"`
- `justify`: `"start" | "center" | "end" | "between"`
- `wrap`: `boolean`

`Screen` — full-height mobile container; `padded?: boolean` adds the standard gutter.

`Separator` — `orientation`, `label?: ReactNode` (renders a centred label, e.g. "or").

`Pagination` — `page`, `pageCount`, `onPageChange` (all required); `siblingCount`, `compact`.

`Avatar` — `size`: `"sm" | "md" | "lg" | "xl"`. Always include `AvatarFallback`.

## Usage

```tsx
<Screen>
  <AppBar title="Order" />
  <main className="flex-1 overflow-y-auto p-4">
    <Stack gap={3}>
      <Stack direction="horizontal" justify="between" align="center">
        <span className="text-sm font-medium">Total</span>
        <span className="text-sm font-semibold">£48.00</span>
      </Stack>
      <Separator />
      <Pagination page={page} pageCount={12} onPageChange={setPage} />
    </Stack>
  </main>
</Screen>
```

```tsx
<Avatar size="md">
  <AvatarImage src={user.avatarUrl} alt="" />
  <AvatarFallback>{initials}</AvatarFallback>
</Avatar>
```

## Rules

- Reach for `Stack` before writing a one-off flex container.
- Use `Pagination compact` on narrow screens — a row of numbered targets does not fit a phone.
- `AvatarImage` takes `alt=""` when the name is already beside it; otherwise give it the person's name.
- Avatar fallbacks are initials, one or two characters.
