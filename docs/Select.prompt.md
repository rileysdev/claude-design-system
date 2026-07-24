# Select

Choose one value from a list. For fewer than about six visible options, prefer
a `RadioGroup`; for very long lists on a phone, prefer a `Sheet`.

## Import

```tsx
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
  SelectGroup, SelectLabel, SelectSeparator,
} from "claude-design-system";
```

## Props

- `Select`: `value`, `defaultValue`, `onValueChange`, `disabled`, `name`
- `SelectTrigger`: `invalid?: boolean`
- `SelectItem`: `value` (required), `disabled`

## Usage

```tsx
<FormField>
  <FormLabel>Time zone</FormLabel>
  <FormControl>
    {(props) => (
      <Select defaultValue="london">
        <SelectTrigger {...props} className="w-full"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Europe</SelectLabel>
            <SelectItem value="london">London</SelectItem>
            <SelectItem value="berlin">Berlin</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Americas</SelectLabel>
            <SelectItem value="new-york">New York</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    )}
  </FormControl>
</FormField>
```

Placeholder when nothing is chosen yet:

```tsx
<SelectTrigger><SelectValue placeholder="Choose a country" /></SelectTrigger>
```

## Rules

- `SelectValue` must be inside `SelectTrigger`, and every `SelectItem` needs a unique `value`.
- Give the trigger a label via `FormField`, or an `aria-label`.
- Do not use a Select for two options — that is a Switch or a RadioGroup.
