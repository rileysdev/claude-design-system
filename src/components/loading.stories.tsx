import type { Meta, StoryObj } from "@storybook/react-vite";

import { Card } from "./card";
import { Progress } from "./progress";
import { Skeleton } from "./skeleton";
import { Spinner } from "./spinner";
import { Section, Showcase, Swatch } from "../../.storybook/showcase";

/**
 * Loading and progress indicators together, because choosing between them is
 * the actual decision: a skeleton for content that is arriving, a spinner for a
 * short wait, a progress bar only when there is a real percentage.
 */
const meta = {
  title: "Feedback/Loading and progress",
  component: Spinner,
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <Showcase>
      <Section title="Spinner sizes">
        <Swatch label="sm">
          <Spinner size="sm" />
        </Swatch>
        <Swatch label="md">
          <Spinner size="md" />
        </Swatch>
        <Swatch label="lg">
          <Spinner size="lg" />
        </Swatch>
        <Swatch label="On a surface">
          <div className="flex size-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Spinner size="md" />
          </div>
        </Swatch>
      </Section>

      <Section
        title="Progress"
        description="Use only when the percentage is real. Otherwise use a spinner."
        className="grid max-w-sm gap-4"
      >
        <Swatch label="25% · primary">
          <Progress value={25} className="w-64" />
        </Swatch>
        <Swatch label="70% · success">
          <Progress value={70} tone="success" className="w-64" />
        </Swatch>
        <Swatch label="90% · warning">
          <Progress value={90} tone="warning" className="w-64" />
        </Swatch>
        <Swatch label="Indeterminate">
          <Progress value={null} className="w-64" />
        </Swatch>
        <Swatch label="Sizes">
          <div className="flex w-64 flex-col gap-2">
            <Progress value={45} size="sm" />
            <Progress value={45} size="md" />
            <Progress value={45} size="lg" />
          </div>
        </Swatch>
      </Section>

      <Section
        title="Skeleton"
        description="Mirror the shape of the content that will replace it."
        className="grid gap-4 sm:grid-cols-2"
      >
        <Card padded className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Skeleton shape="circle" className="size-10" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <Skeleton shape="block" className="h-24 w-full" />
          <Skeleton className="w-full" />
          <Skeleton className="w-3/5" />
        </Card>

        <div className="flex flex-col gap-3">
          <Skeleton className="w-full" />
          <Skeleton className="w-5/6" />
          <Skeleton className="w-4/6" />
          <Skeleton shape="block" className="h-20 w-full" />
        </div>
      </Section>
    </Showcase>
  ),
};
