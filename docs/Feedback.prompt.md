# Alert, Toast, EmptyState and loading

How the system tells the user what happened, or that nothing is there yet.

| Component | Use for |
|---|---|
| `Alert` | a persistent message tied to a region of the page |
| `Toast` | a transient confirmation of something the user just did |
| `EmptyState` | a screen or list with nothing in it |
| `Skeleton` | content that is arriving and has a known shape |
| `Spinner` | a short wait with no measurable progress |
| `Progress` | a wait with a real percentage |

## Import

```tsx
import {
  Alert, AlertTitle, AlertDescription,
  Toaster, toast,
  EmptyState, Skeleton, Spinner, Progress,
} from "claude-design-system";
```

## Props

- `Alert`: `variant`: `"neutral" | "info" | "success" | "warning" | "destructive"`; `icon`: `ReactNode`
- `EmptyState`: `title` (required), `description`, `icon`, `action`
- `Skeleton`: `shape`: `"text" | "block" | "circle"`
- `Spinner`: `size`: `"sm" | "md" | "lg"`; `label` (announced; pass `""` for decorative)
- `Progress`: `value`: `number | null` (`null` is indeterminate); `size`; `tone`

## Usage

```tsx
<Alert variant="destructive" icon={<XCircleIcon />}>
  <AlertTitle>Upload failed</AlertTitle>
  <AlertDescription>The file exceeds the 25 MB limit.</AlertDescription>
</Alert>
```

Toasts need `<Toaster />` mounted once at the app root:

```tsx
toast.success("Payment received");
toast("Message archived", {
  description: "It has been moved out of your inbox.",
  action: { label: "Undo", onClick: restore },
});
```

```tsx
<EmptyState
  icon={<InboxIcon />}
  title="No messages yet"
  description="When someone sends you a message, it will show up here."
  action={<Button>Start a conversation</Button>}
/>
```

```tsx
// Mirror the shape of what will replace it.
<div className="flex items-center gap-3">
  <Skeleton shape="circle" className="size-10" />
  <div className="flex flex-1 flex-col gap-2">
    <Skeleton className="w-24" />
    <Skeleton className="h-3 w-16" />
  </div>
</div>
```

## Rules

- Never signal state with colour alone: every status variant pairs its tint with an icon and written text.
- Toasts are for confirmations, not errors that need a decision — those are Alerts or Dialogs.
- An empty state should say what will appear there and offer the action that fills it.
- Use `Progress` only when the percentage is real; otherwise a Spinner is honest.
- Skeletons are `aria-hidden`; announce the loaded content instead.
