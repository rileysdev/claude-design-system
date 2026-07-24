import type { Meta, StoryObj } from "@storybook/react-vite";

import { Textarea } from "./textarea";
import { Section, Showcase, Swatch } from "../../.storybook/showcase";

const meta = {
  title: "Forms/Textarea",
  component: Textarea,
  args: { placeholder: "Write a short summary…" },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <Showcase>
      <Section title="States" className="grid max-w-sm gap-4">
        <Swatch label="Default">
          <Textarea placeholder="Write a short summary…" />
        </Swatch>
        <Swatch label="Filled">
          <Textarea defaultValue={"Rewrote the onboarding flow.\nShipped behind a flag."} />
        </Swatch>
        <Swatch label="Invalid">
          <Textarea invalid defaultValue="Too short" />
        </Swatch>
        <Swatch label="Disabled">
          <Textarea disabled defaultValue="Locked while syncing" />
        </Swatch>
      </Section>
    </Showcase>
  ),
};

export const Playground: Story = {
  args: { invalid: false, rows: 4 },
};
