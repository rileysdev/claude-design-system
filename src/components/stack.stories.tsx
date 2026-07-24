import type { Meta, StoryObj } from "@storybook/react-vite";

import { Card } from "./card";
import { Stack } from "./stack";
import { Section, Showcase, Swatch } from "../../.storybook/showcase";

const meta = {
  title: "Layout/Stack",
  component: Stack,
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

function Box({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-10 min-w-16 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground">
      {children}
    </div>
  );
}

export const Variants: Story = {
  render: () => (
    <Showcase>
      <Section
        title="Direction"
        description="Spacing comes from the token scale, which is what keeps generated screens from drifting."
        className="flex flex-col gap-6"
      >
        <Swatch label="horizontal">
          <Stack direction="horizontal" gap={2}>
            <Box>One</Box>
            <Box>Two</Box>
            <Box>Three</Box>
          </Stack>
        </Swatch>
        <Swatch label="vertical">
          <Stack direction="vertical" gap={2} className="w-40">
            <Box>One</Box>
            <Box>Two</Box>
          </Stack>
        </Swatch>
      </Section>

      <Section title="Gap scale" className="flex flex-col gap-4">
        {([1, 2, 3, 4, 6, 8] as const).map((gap) => (
          <Swatch key={gap} label={`gap={${gap}}`}>
            <Stack direction="horizontal" gap={gap}>
              <Box>A</Box>
              <Box>B</Box>
              <Box>C</Box>
            </Stack>
          </Swatch>
        ))}
      </Section>

      <Section title="Alignment" className="flex flex-col gap-4">
        <Swatch label="justify=between">
          <Stack direction="horizontal" justify="between" className="w-72">
            <Box>Left</Box>
            <Box>Right</Box>
          </Stack>
        </Swatch>
        <Swatch label="align=center">
          <Stack direction="horizontal" align="center" gap={3}>
            <div className="flex h-16 items-center rounded-md bg-muted px-3 text-sm">Tall</div>
            <Box>Centred</Box>
          </Stack>
        </Swatch>
      </Section>

      <Section title="Composed" className="w-full max-w-sm">
        <Card padded className="w-full">
          <Stack gap={3}>
            <Stack direction="horizontal" justify="between" align="center">
              <span className="text-sm font-medium">Total</span>
              <span className="text-sm font-semibold">£48.00</span>
            </Stack>
            <Stack direction="horizontal" justify="between" align="center">
              <span className="text-sm text-muted-foreground">Delivery</span>
              <span className="text-sm text-muted-foreground">Free</span>
            </Stack>
          </Stack>
        </Card>
      </Section>
    </Showcase>
  ),
};
