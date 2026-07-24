# DropdownMenu, Popover and Tooltip

Three overlays with different jobs.

| Component | Contains | Opens on touch |
|---|---|---|
| `DropdownMenu` | a list of actions | yes |
| `Popover` | arbitrary content, rich or interactive | yes |
| `Tooltip` | a short label for an icon control | **no** |

## Import

```tsx
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuSub,
  DropdownMenuSubTrigger, DropdownMenuSubContent,
  Popover, PopoverTrigger, PopoverContent,
  TooltipProvider, Tooltip, TooltipTrigger, TooltipContent,
} from "claude-design-system";
```

## Props

- `DropdownMenuItem`: `destructive?: boolean`, plus `onSelect`, `disabled`
- `DropdownMenuContent` / `PopoverContent`: `align`, `side`, `sideOffset`
- `TooltipContent`: `side`, `sideOffset`

## Usage

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon" aria-label="More actions"><MoreVerticalIcon /></Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuLabel>Document</DropdownMenuLabel>
    <DropdownMenuItem><PencilIcon />Rename</DropdownMenuItem>
    <DropdownMenuItem><ShareIcon />Share</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem destructive><Trash2Icon />Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

Tooltips must be wrapped in a provider once, near the app root:

```tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="ghost" size="icon" aria-label="Share"><ShareIcon /></Button>
    </TooltipTrigger>
    <TooltipContent>Share this document</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

## Rules

- **Never put information only in a Tooltip.** They do not open on touch. The icon still needs an `aria-label`, and anything a user must know belongs on screen or in a Popover.
- Destructive menu items go last, after a separator.
- More than about eight menu items on a phone: use a `Sheet` instead.
- Menu items are actions. For choosing a value, use `Select` or radio items.
