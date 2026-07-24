# Textarea

A multi-line text field. Grows with its content.

## Import

```tsx
import { Textarea } from "claude-design-system";
```

## Props

- `invalid`: `boolean` — error treatment plus `aria-invalid`
- `rows`: `number` — default `4`
- plus every native `<textarea>` attribute

Text renders at 16px so iOS Safari does not zoom on focus. The field uses
`field-sizing-content`, so it grows as the user types and can still be dragged.

## Usage

```tsx
<FormField>
  <FormLabel>Notes</FormLabel>
  <FormControl>
    {(props) => <Textarea {...props} placeholder="Anything we should know?" />}
  </FormControl>
  <FormDescription>Optional. Visible to your team only.</FormDescription>
</FormField>
```

## Rules

- Use for genuinely multi-line input. One-line answers belong in an `Input`.
- Set `rows` to the shortest useful height and let it grow.
- Pair `invalid` with a `FormMessage` that says what is wrong.
