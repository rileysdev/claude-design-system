import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRightIcon, PlusIcon, Trash2Icon } from "lucide-react";

import { Button } from "./button";
import { Section, Showcase, Swatch } from "../../.storybook/showcase";

const meta = {
  title: "Actions/Button",
  component: Button,
  args: {
    children: "Continue",
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <Showcase>
      <Section
        title="Variants"
        description="Each variant carries a different level of emphasis. Use one primary action per screen."
      >
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Delete</Button>
        <Button variant="link">Link</Button>
      </Section>

      <Section title="Sizes" description="Medium is 44px tall — the default touch target.">
        <Swatch label="sm · 36px">
          <Button size="sm">Small</Button>
        </Swatch>
        <Swatch label="md · 44px">
          <Button size="md">Medium</Button>
        </Swatch>
        <Swatch label="lg · 48px">
          <Button size="lg">Large</Button>
        </Swatch>
        <Swatch label="icon">
          <Button size="icon" aria-label="Add">
            <PlusIcon />
          </Button>
        </Swatch>
      </Section>

      <Section title="With icons">
        <Button>
          <PlusIcon />
          New item
        </Button>
        <Button variant="outline">
          Continue
          <ArrowRightIcon />
        </Button>
        <Button variant="destructive">
          <Trash2Icon />
          Delete
        </Button>
      </Section>

      <Section title="States">
        <Button disabled>Disabled</Button>
        <Button variant="secondary" disabled>
          Disabled
        </Button>
        <Button variant="outline" disabled>
          Disabled
        </Button>
      </Section>

      <Section title="Full width" className="flex w-full max-w-sm flex-col gap-3">
        <Button fullWidth>Primary action</Button>
        <Button fullWidth variant="outline">
          Secondary action
        </Button>
      </Section>
    </Showcase>
  ),
};

export const Playground: Story = {
  args: {
    variant: "primary",
    size: "md",
  },
};
