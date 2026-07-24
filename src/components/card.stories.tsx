import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge } from "./badge";
import { Button } from "./button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import { Section, Showcase } from "../../.storybook/showcase";

const meta = {
  title: "Layout/Card",
  component: Card,
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <Showcase>
      <Section
        title="Variants"
        description="Outlined is the default. Reserve elevated for a card that stands alone."
        className="grid gap-4 sm:grid-cols-3"
      >
        <Card variant="outlined" padded>
          <p className="text-sm font-medium">Outlined</p>
          <p className="text-sm text-muted-foreground">Hairline border, no shadow.</p>
        </Card>
        <Card variant="elevated" padded>
          <p className="text-sm font-medium">Elevated</p>
          <p className="text-sm text-muted-foreground">Lifted off the background.</p>
        </Card>
        <Card variant="plain" padded>
          <p className="text-sm font-medium">Plain</p>
          <p className="text-sm text-muted-foreground">Grouping only.</p>
        </Card>
      </Section>

      <Section title="Composed" className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <CardTitle>Monthly plan</CardTitle>
              <Badge variant="success">Active</Badge>
            </div>
            <CardDescription>Renews on 14 August 2026.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tracking-tight">
              £12
              <span className="text-sm font-normal text-muted-foreground"> / month</span>
            </p>
          </CardContent>
          <CardFooter>
            <Button size="sm">Manage</Button>
            <Button size="sm" variant="ghost">
              Cancel
            </Button>
          </CardFooter>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Storage almost full</CardTitle>
            <CardDescription>
              You have used 92% of your 20 GB. Free up space or upgrade.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button size="sm" variant="outline">
              Upgrade
            </Button>
          </CardFooter>
        </Card>
      </Section>
    </Showcase>
  ),
};
