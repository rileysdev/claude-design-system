import type { Meta, StoryObj } from "@storybook/react-vite";

import { Separator } from "./separator";
import { Section, Showcase } from "../../.storybook/showcase";

const meta = {
  title: "Layout/Separator",
  component: Separator,
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <Showcase>
      <Section
        title="Horizontal"
        description="Separators run one step stronger than the desktop convention so they survive a phone screen in daylight."
        className="flex w-full max-w-sm flex-col gap-3"
      >
        <p className="text-sm text-muted-foreground">Above</p>
        <Separator />
        <p className="text-sm text-muted-foreground">Below</p>
      </Section>

      <Section title="With a label" className="w-full max-w-sm">
        <Separator label="or" className="w-full" />
      </Section>

      <Section title="Vertical" className="flex h-10 items-center gap-4">
        <span className="text-sm">Profile</span>
        <Separator orientation="vertical" />
        <span className="text-sm">Billing</span>
        <Separator orientation="vertical" />
        <span className="text-sm">Team</span>
      </Section>
    </Showcase>
  ),
};
