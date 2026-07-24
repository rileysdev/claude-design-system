# Dialog

A modal that interrupts to confirm something or ask one short question. On
phones, prefer `Sheet` for anything longer than a couple of lines.

## Import

```tsx
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter, DialogClose,
} from "claude-design-system";
```

## Props

- `Dialog`: `open`, `defaultOpen`, `onOpenChange`, `modal`
- `DialogContent`: `showClose?: boolean` (default `true`)

## Usage

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button variant="destructive">Delete files</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Delete 3 files?</DialogTitle>
      <DialogDescription>
        This cannot be undone. The files will be removed from every device.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
      <Button variant="destructive" onClick={confirm}>Delete files</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## Rules

- Always include `DialogTitle` — it names the dialog for assistive tech.
- The title should state the consequence ("Delete 3 files?"), not the mechanism ("Confirm").
- Destructive confirm buttons repeat the verb ("Delete files"), never "OK".
- `DialogFooter` stacks its buttons on phones and rows them from `sm` up; put the cancel action first in source order.
- Never open a Dialog from inside another Dialog.
