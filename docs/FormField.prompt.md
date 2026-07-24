# FormField

Wires a label, control, hint and error together with the correct `id`,
`aria-describedby` and `aria-invalid` relationships. Use it for every form
control — it is what makes the form accessible without hand-written wiring.

## Import

```tsx
import {
  FormField, FormLabel, FormControl, FormDescription, FormMessage,
} from "claude-design-system";
```

## Props

- `FormField`: `id?: string` (generated when omitted), `invalid?: boolean`
- `FormLabel`: everything `Label` takes, including `required?: boolean`
- `FormControl`: takes a render function and passes it `{ id, "aria-describedby", "aria-invalid" }`
- `FormDescription`: the hint. Hidden from the control's description once `invalid` is set.
- `FormMessage`: the error. Renders nothing when it has no children.

## Usage

```tsx
<FormField>
  <FormLabel required>Email</FormLabel>
  <FormControl>
    {(props) => <Input {...props} type="email" placeholder="you@example.com" />}
  </FormControl>
  <FormDescription>We only use this for receipts.</FormDescription>
</FormField>
```

Error state — set `invalid` on both the field and the control:

```tsx
<FormField invalid>
  <FormLabel required>Email</FormLabel>
  <FormControl>{(props) => <Input {...props} invalid />}</FormControl>
  <FormMessage>Enter a valid email address.</FormMessage>
</FormField>
```

Works with any control that accepts the spread props:

```tsx
<FormField>
  <FormLabel>Notes</FormLabel>
  <FormControl>{(props) => <Textarea {...props} />}</FormControl>
</FormField>
```

## Rules

- Always spread the props from `FormControl` onto the control. Skipping them breaks the label association.
- Mark required fields with `required` on the label rather than marking optional ones.
- `FormMessage` carries `role="alert"`, so render it only when there is a real error.
- Stack fields with `gap-5` in a `flex flex-col` form.
