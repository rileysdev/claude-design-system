import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckIcon, ClockIcon } from "lucide-react";

import { Badge } from "./badge";
import { Section, Showcase } from "../../.storybook/showcase";

const meta = {
  title: "Data display/Badge",
  component: Badge,
  args: { children: "Badge" },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <Showcase>
      <Section
        title="Semantic variants"
        description="Status colours are reserved for status. Do not use them for categories."
      >
        <Badge variant="neutral">Neutral</Badge>
        <Badge variant="primary">Primary</Badge>
        <Badge variant="success">Paid</Badge>
        <Badge variant="warning">Pending</Badge>
        <Badge variant="destructive">Failed</Badge>
        <Badge variant="info">Info</Badge>
        <Badge variant="outline">Outline</Badge>
      </Section>

      <Section title="With a status dot">
        <Badge variant="success" dot>
          Live
        </Badge>
        <Badge variant="warning" dot>
          Degraded
        </Badge>
        <Badge variant="destructive" dot>
          Offline
        </Badge>
        <Badge variant="neutral" dot>
          Draft
        </Badge>
      </Section>

      <Section title="With icons">
        <Badge variant="success">
          <CheckIcon />
          Verified
        </Badge>
        <Badge variant="warning">
          <ClockIcon />
          Awaiting review
        </Badge>
      </Section>

      <Section title="Sizes">
        <Badge size="sm">Small</Badge>
        <Badge size="md">Medium</Badge>
      </Section>
    </Showcase>
  ),
};

export const Playground: Story = {
  args: { variant: "neutral", size: "md" },
};
