# List

A vertical stack of rows — the mobile equivalent of a table. Use it for
settings, conversations, search results, and key/value summaries.

## Import

```tsx
import { List, ListItem } from "claude-design-system";
```

## Props

`List`
- `inset`: `boolean` — wrap in a bordered card. Use for short, grouped lists.

`ListItem`
- `title`: `ReactNode` — required
- `description`: `ReactNode`
- `leading`: `ReactNode` — icon or avatar
- `trailing`: `ReactNode` — value, Switch, Badge, or Button
- `navigable`: `boolean` — chevron plus pressable treatment
- `onSelect`: `() => void` — makes the whole row a button
- `asChild`: `boolean` — render the row's interactive surface as the child (router links)

## Usage

Settings list:

```tsx
<List inset>
  <ListItem leading={<UserIcon />} title="Account" description="Ada Lovelace" navigable />
  <ListItem leading={<BellIcon />} title="Notifications" trailing={<Switch defaultChecked />} />
  <ListItem leading={<LockIcon />} title="Privacy" onSelect={() => open("privacy")} />
</List>
```

Key/value summary — no navigation:

```tsx
<List inset>
  <ListItem title="Plan" trailing="Standard" />
  <ListItem title="Renews" trailing="14 Aug 2026" />
  <ListItem title="Status" trailing={<Badge variant="success" dot>Active</Badge>} />
</List>
```

Router links:

```tsx
<ListItem asChild title="Account" navigable>
  <a href="/account">Account</a>
</ListItem>
```

## Rules

- Rows are at least 44px tall automatically. Do not shrink them.
- Use `navigable` only when the row actually navigates; a chevron that does nothing is a lie.
- A row with a Switch should not also be `navigable` — one target per row.
- Prefer `inset` inside a padded screen; use the plain List for full-bleed lists.
- Long lists: keep them full-bleed and let rows run edge to edge.
