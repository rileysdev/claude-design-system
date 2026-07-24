# Screen patterns

How whole screens are assembled from the system. These come from the example
app in `src/examples/task-app/`, which is built only from these components.

## The shell

Every screen uses the same three-part shell. `AppBar` and `TabBar` pin
themselves and handle safe-area insets; the middle scrolls.

```tsx
<Screen>
  <AppBar title="Tasks" trailing={<Avatar size="sm"><AvatarFallback>RS</AvatarFallback></Avatar>} />
  <main className="flex-1 overflow-y-auto">
    <Stack gap={4} className="p-4">{/* content */}</Stack>
  </main>
  <TabBar>{/* 3–5 destinations */}</TabBar>
</Screen>
```

`AppBar` accepts children, which render beneath the title row — the place for
filter tabs:

```tsx
<AppBar title="Tasks">
  <div className="px-4 pb-3">
    <Tabs value={bucket} onValueChange={setBucket}>
      <TabsList variant="segmented">
        <TabsTrigger value="today">Today</TabsTrigger>
        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
      </TabsList>
    </Tabs>
  </div>
</AppBar>
```

## List screen

A summary card, then the list, then the primary action. Use `multiline` on rows
whose title is the content rather than a label.

```tsx
<Card padded>
  <Stack gap={2}>
    <div className="flex items-baseline justify-between">
      <span className="text-sm font-medium">Today's progress</span>
      <span className="text-sm text-muted-foreground">2 of 5</span>
    </div>
    <Progress value={40} />
  </Stack>
</Card>

<List inset>
  <ListItem
    leading={<Checkbox checked={done} onCheckedChange={toggle} aria-label={`Mark "${title}" as done`} />}
    title={title}
    description={`${project} · ${due}`}
    trailing={<Badge variant="destructive" size="sm">High</Badge>}
    multiline
    navigable
    onSelect={open}
  />
</List>

<Button fullWidth size="lg" onClick={openSheet}>New task</Button>
```

Swap the list for an `EmptyState` when it is empty, and for `Skeleton` rows
while it loads. Both are screens users see often — do not leave them unstyled.

## Detail screen

Back button on the left, overflow menu on the right, centred title.

```tsx
<AppBar
  centerTitle
  title="Task"
  leading={<Button variant="ghost" size="icon" aria-label="Back" onClick={back}><ArrowLeftIcon /></Button>}
  trailing={
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Task actions"><MoreVerticalIcon /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem><PencilIcon />Edit</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem destructive><Trash2Icon />Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  }
/>
```

Lead with an `Alert` if the record needs attention, then a `Card` for the
content, then an `Accordion` for secondary detail. Metadata reads well as a row
of `outline` badges.

## Create/edit

A form in a bottom `Sheet`, not a separate route. Validation is real: mark the
field invalid and say what is wrong.

```tsx
<SheetContent side="bottom" className="max-h-[92dvh] overflow-y-auto">
  <SheetHeader><SheetTitle>New task</SheetTitle></SheetHeader>
  <form className="flex flex-col gap-5" onSubmit={submit}>
    <FormField invalid={invalid}>
      <FormLabel required>Title</FormLabel>
      <FormControl>{(props) => <Input {...props} invalid={invalid} />}</FormControl>
      {invalid ? <FormMessage>Give the task a title.</FormMessage> : null}
    </FormField>
    <SheetFooter>
      <Button type="submit" fullWidth>Add task</Button>
      <Button type="button" variant="ghost" fullWidth onClick={close}>Cancel</Button>
    </SheetFooter>
  </form>
</SheetContent>
```

Confirm with a `toast` after the sheet closes.

## Settings

Grouped `List inset` blocks under small uppercase headings. Switches take effect
immediately; destructive actions confirm in a `Dialog`.

## Scoping overlays

`Sheet` and `Dialog` are `position: fixed` and cover the viewport by default,
which is what a full-screen app wants. To scope them to a region — an embedded
widget, or a device frame — pass `container`, and give that element
`transform: translateZ(0)` so it becomes the containing block.

```tsx
<SheetContent container={appRoot} />
```
