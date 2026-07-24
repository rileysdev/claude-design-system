import * as React from "react";

import { cn } from "../lib/utils";
import { Label } from "./label";

/**
 * Wires a label, control, description and error message together with the right
 * `id` / `aria-describedby` / `aria-invalid` relationships.
 *
 * This exists so accessible forms are the path of least resistance: compose
 * FormField and the wiring is correct by construction, rather than something
 * each screen has to remember to hand-write.
 */

interface FormFieldContextValue {
  id: string;
  descriptionId: string;
  errorId: string;
  invalid: boolean;
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null);

function useFormField(): FormFieldContextValue {
  const context = React.useContext(FormFieldContext);
  if (!context) {
    throw new Error("FormField subcomponents must be used inside <FormField>.");
  }
  return context;
}

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Base id for the control. Generated when omitted. */
  id?: string;
  /** Marks the control invalid and switches the description for the error. */
  invalid?: boolean;
}

export const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  function FormField({ className, id, invalid = false, ...props }, ref) {
    const generatedId = React.useId();
    const fieldId = id ?? generatedId;

    const value = React.useMemo<FormFieldContextValue>(
      () => ({
        id: fieldId,
        descriptionId: `${fieldId}-description`,
        errorId: `${fieldId}-error`,
        invalid,
      }),
      [fieldId, invalid],
    );

    return (
      <FormFieldContext.Provider value={value}>
        <div ref={ref} className={cn("flex flex-col gap-1.5", className)} {...props} />
      </FormFieldContext.Provider>
    );
  },
);

export const FormLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label>
>(function FormLabel(props, ref) {
  const { id } = useFormField();
  return <Label ref={ref} htmlFor={id} {...props} />;
});

/**
 * Passes the wired-up props to a single control child. Use `render` so the
 * control stays whatever component the screen needs.
 */
export interface FormControlProps {
  children: (props: {
    id: string;
    "aria-describedby": string;
    "aria-invalid": boolean | undefined;
  }) => React.ReactNode;
}

export function FormControl({ children }: FormControlProps) {
  const { id, descriptionId, errorId, invalid } = useFormField();
  return (
    <>
      {children({
        id,
        "aria-describedby": invalid ? errorId : descriptionId,
        "aria-invalid": invalid || undefined,
      })}
    </>
  );
}

export const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(function FormDescription({ className, ...props }, ref) {
  const { descriptionId } = useFormField();
  return (
    <p
      ref={ref}
      id={descriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});

export const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(function FormMessage({ className, children, ...props }, ref) {
  const { errorId } = useFormField();
  if (!children) return null;
  return (
    <p
      ref={ref}
      id={errorId}
      // Announced when validation fails without stealing focus.
      role="alert"
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {children}
    </p>
  );
});
