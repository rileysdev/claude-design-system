# Checkbox, RadioGroup and Switch

Three controls that answer different questions. Choosing correctly matters more
than styling them.

| Control | Use when | Applies |
|---|---|---|
| `Checkbox` | several independent yes/no choices | on save |
| `RadioGroup` | exactly one from a small visible set | on save |
| `Switch` | a single setting toggles on/off | immediately |

## Import

```tsx
import { Checkbox, RadioGroup, RadioGroupItem, Switch, Label } from "claude-design-system";
```

## Props

- `Checkbox`: `checked` (`boolean | "indeterminate"`), `defaultChecked`, `onCheckedChange`, `disabled`
- `RadioGroup`: `value`, `defaultValue`, `onValueChange`, `disabled`
- `RadioGroupItem`: `value` (required), `disabled`
- `Switch`: `checked`, `defaultChecked`, `onCheckedChange`, `disabled`

## Usage

```tsx
<div className="flex items-center gap-2.5">
  <Checkbox id="terms" />
  <Label htmlFor="terms">I accept the terms</Label>
</div>

// Parent of a partially-selected group
<Checkbox checked="indeterminate" />

<RadioGroup value={plan} onValueChange={setPlan}>
  <div className="flex items-start gap-2.5">
    <RadioGroupItem value="standard" id="plan-standard" />
    <div className="flex flex-col gap-0.5">
      <Label htmlFor="plan-standard">Standard</Label>
      <span className="text-sm text-muted-foreground">10 projects</span>
    </div>
  </div>
</RadioGroup>

// In a settings list, where it takes effect immediately
<List inset>
  <ListItem title="Push notifications" trailing={<Switch defaultChecked />} />
</List>
```

## Rules

- Every control needs a `Label` with a matching `htmlFor`, or an `aria-label`.
- Never put a Switch behind a Save button — a switch means the change already happened.
- More than about six radio options: use a `Select` instead.
- Do not use a Switch for a yes/no answer in a form; that is a Checkbox.
