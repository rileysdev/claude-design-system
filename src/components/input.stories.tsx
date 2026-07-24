import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchIcon } from "lucide-react";

import { Input } from "./input";
import { Label } from "./label";
import { Section, Showcase, Swatch } from "../../.storybook/showcase";

const meta = {
  title: "Forms/Input",
  component: Input,
  args: { placeholder: "you@example.com" },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <Showcase>
      <Section
        title="Sizes"
        description="Text is 16px at every size — anything smaller makes iOS Safari zoom on focus."
        className="grid max-w-sm gap-3"
      >
        <Swatch label="sm">
          <Input size="sm" placeholder="Small" />
        </Swatch>
        <Swatch label="md · default">
          <Input size="md" placeholder="Medium" />
        </Swatch>
        <Swatch label="lg">
          <Input size="lg" placeholder="Large" />
        </Swatch>
      </Section>

      <Section title="States" className="grid max-w-sm gap-3">
        <Swatch label="Default">
          <Input placeholder="Empty" />
        </Swatch>
        <Swatch label="Filled">
          <Input defaultValue="ada@example.com" />
        </Swatch>
        <Swatch label="Invalid">
          <Input invalid defaultValue="not-an-email" />
        </Swatch>
        <Swatch label="Disabled">
          <Input disabled defaultValue="Locked" />
        </Swatch>
        <Swatch label="Read only">
          <Input readOnly defaultValue="Read only" />
        </Swatch>
      </Section>

      <Section title="Types" className="grid max-w-sm gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="story-email">Email</Label>
          <Input id="story-email" type="email" placeholder="you@example.com" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="story-password">Password</Label>
          <Input id="story-password" type="password" defaultValue="hunter2" />
        </div>
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search" className="pl-9" />
        </div>
      </Section>
    </Showcase>
  ),
};

export const Playground: Story = {
  args: { size: "md", invalid: false },
};
