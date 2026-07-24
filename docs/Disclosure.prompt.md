# Tabs and Accordion

Two ways to fit more content into one screen.

- `Tabs` — sibling views the user switches between. One is always visible.
- `Accordion` — stacked sections the user expands. All can be collapsed.

## Import

```tsx
import {
  Tabs, TabsList, TabsTrigger, TabsContent,
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from "claude-design-system";
```

## Props

- `Tabs`: `value`, `defaultValue`, `onValueChange`
- `TabsList`: `variant`: `"segmented" | "underline"` — default `"segmented"`
- `TabsTrigger` / `TabsContent`: `value` (required, must match)
- `Accordion`: `type`: `"single" | "multiple"`; `collapsible` (single only); `value` / `defaultValue`

## Usage

```tsx
<Tabs defaultValue="overview">
  <TabsList variant="segmented">
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="activity">Activity</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">…</TabsContent>
  <TabsContent value="activity">…</TabsContent>
</Tabs>
```

```tsx
<Accordion type="single" collapsible defaultValue="delivery">
  <AccordionItem value="delivery">
    <AccordionTrigger>When will my order arrive?</AccordionTrigger>
    <AccordionContent>Two to four working days.</AccordionContent>
  </AccordionItem>
</Accordion>
```

## Rules

- `segmented` suits two to four short labels; `underline` scrolls horizontally and takes more.
- Tabs are not navigation between pages — use the TabBar for that.
- Accordion triggers are questions or section names, never "Click here".
- Give an accordion a sensible `defaultValue` so the screen does not open fully collapsed.
