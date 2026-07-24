import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
} from "./form-field";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Section, Showcase } from "../../.storybook/showcase";

const meta = {
  title: "Forms/FormField",
  component: FormField,
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <Showcase>
      <Section
        title="States"
        description="FormField wires id, aria-describedby and aria-invalid together so the label, hint and error always point at the right control."
        className="grid max-w-sm gap-5"
      >
        <FormField>
          <FormLabel required>Email</FormLabel>
          <FormControl>
            {(props) => <Input {...props} type="email" placeholder="you@example.com" />}
          </FormControl>
          <FormDescription>We only use this for receipts.</FormDescription>
        </FormField>

        <FormField invalid>
          <FormLabel required>Email</FormLabel>
          <FormControl>
            {(props) => <Input {...props} invalid defaultValue="not-an-email" />}
          </FormControl>
          <FormMessage>Enter a valid email address.</FormMessage>
        </FormField>

        <FormField>
          <FormLabel>Notes</FormLabel>
          <FormControl>
            {(props) => <Textarea {...props} placeholder="Anything we should know?" />}
          </FormControl>
          <FormDescription>Optional. Visible to your team only.</FormDescription>
        </FormField>
      </Section>

      <Section title="In a form" className="w-full max-w-sm">
        <form className="flex w-full flex-col gap-5">
          <FormField>
            <FormLabel required>Full name</FormLabel>
            <FormControl>{(props) => <Input {...props} placeholder="Ada Lovelace" />}</FormControl>
          </FormField>
          <FormField>
            <FormLabel required>Password</FormLabel>
            <FormControl>{(props) => <Input {...props} type="password" />}</FormControl>
            <FormDescription>At least 12 characters.</FormDescription>
          </FormField>
          <Button type="submit" fullWidth>
            Create account
          </Button>
        </form>
      </Section>
    </Showcase>
  ),
};
