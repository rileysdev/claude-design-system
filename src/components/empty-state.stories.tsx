import type { Meta, StoryObj } from "@storybook/react-vite";
import { InboxIcon, SearchXIcon, WifiOffIcon } from "lucide-react";

import { Button } from "./button";
import { Card } from "./card";
import { EmptyState } from "./empty-state";
import { Section, Showcase } from "../../.storybook/showcase";

const meta = {
  title: "Feedback/EmptyState",
  component: EmptyState,
  args: { title: "No messages yet" },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <Showcase>
      <Section
        title="First run"
        description="The screen a new user sees most often, and the one most often left unstyled."
        className="w-full max-w-md"
      >
        <Card className="w-full">
          <EmptyState
            icon={<InboxIcon />}
            title="No messages yet"
            description="When someone sends you a message, it will show up here."
            action={<Button>Start a conversation</Button>}
          />
        </Card>
      </Section>

      <Section title="No results" className="w-full max-w-md">
        <Card className="w-full">
          <EmptyState
            icon={<SearchXIcon />}
            title="No results for “quarterly”"
            description="Check the spelling, or try a broader term."
            action={
              <>
                <Button variant="outline">Clear filters</Button>
                <Button variant="ghost">Browse all</Button>
              </>
            }
          />
        </Card>
      </Section>

      <Section title="Error" className="w-full max-w-md">
        <Card className="w-full">
          <EmptyState
            icon={<WifiOffIcon />}
            title="You are offline"
            description="We will retry automatically as soon as you reconnect."
            action={<Button variant="outline">Retry now</Button>}
          />
        </Card>
      </Section>

      <Section title="Without an icon or action" className="w-full max-w-md">
        <Card className="w-full">
          <EmptyState title="Nothing archived" description="Archived items appear here." />
        </Card>
      </Section>
    </Showcase>
  ),
};
