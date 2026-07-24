# AppBar and TabBar

The top and bottom chrome of a mobile screen. Both handle safe-area insets
themselves, so screens never restate notch or home-indicator padding.

## Import

```tsx
import { AppBar, TabBar, TabBarItem, Screen } from "claude-design-system";
```

## Props

`AppBar`
- `title`: `ReactNode`
- `leading`: `ReactNode` — back button or menu trigger
- `trailing`: `ReactNode` — one or two icon buttons
- `centerTitle`: `boolean` — iOS-style centred title, default `false`
- `variant`: `"solid" | "transparent" | "blurred"` — default `"solid"`

`TabBar`
- `blurred`: `boolean` — frost the bar so content shows through

`TabBarItem`
- `icon`: `ReactNode` (required), `label`: `ReactNode` (required)
- `active`: `boolean`, `badge`: `number`, `asChild`: `boolean`, `onClick`

## Usage

```tsx
<Screen>
  <AppBar
    title="Inbox"
    trailing={<Button variant="ghost" size="icon" aria-label="Search"><SearchIcon /></Button>}
  />

  <main className="flex-1 overflow-y-auto">
    {/* screen content */}
  </main>

  <TabBar>
    <TabBarItem icon={<HomeIcon />} label="Home" active />
    <TabBarItem icon={<CompassIcon />} label="Explore" />
    <TabBarItem icon={<HeartIcon />} label="Saved" badge={3} />
    <TabBarItem icon={<UserIcon />} label="Profile" />
  </TabBar>
</Screen>
```

A detail screen with a back button and a centred title:

```tsx
<AppBar
  centerTitle
  title="Settings"
  leading={<Button variant="ghost" size="icon" aria-label="Back"><ArrowLeftIcon /></Button>}
/>
```

Router links:

```tsx
<TabBarItem asChild icon={<HomeIcon />} label="Home" active>
  <a href="/" />
</TabBarItem>
```

## Rules

- Three to five tab bar destinations. More than five will not fit a thumb.
- Tab labels are always visible — icon-only tab bars are guesswork.
- Exactly one `active` item; it sets `aria-current="page"`.
- Put at most two actions in `trailing`; anything else belongs in a DropdownMenu.
- Use `Screen` as the outer container so the app bar and tab bar pin correctly while the middle scrolls.
