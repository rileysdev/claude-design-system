import type { Meta, StoryObj } from "@storybook/react-vite";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { Section, Showcase } from "../../.storybook/showcase";

const meta = {
  title: "Navigation/Tabs",
  component: Tabs,
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <Showcase>
      <Section
        title="Segmented"
        description="A pill group on a muted track. Best for two to four short labels."
        className="w-full max-w-sm"
      >
        <Tabs defaultValue="overview" className="w-full">
          <TabsList variant="segmented">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <p className="text-sm text-muted-foreground">
              A summary of the project, its members and recent releases.
            </p>
          </TabsContent>
          <TabsContent value="activity">
            <p className="text-sm text-muted-foreground">Every change, newest first.</p>
          </TabsContent>
          <TabsContent value="settings">
            <p className="text-sm text-muted-foreground">Visibility, access and defaults.</p>
          </TabsContent>
        </Tabs>
      </Section>

      <Section
        title="Underline"
        description="Scrolls horizontally when the labels overflow, so it takes more of them."
        className="w-full max-w-sm"
      >
        <Tabs defaultValue="all" className="w-full">
          <TabsList variant="underline">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="mentions">Mentions</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
            <TabsTrigger value="spam">Spam</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <p className="text-sm text-muted-foreground">Everything in one list.</p>
          </TabsContent>
          <TabsContent value="unread">
            <p className="text-sm text-muted-foreground">12 unread conversations.</p>
          </TabsContent>
          <TabsContent value="mentions">
            <p className="text-sm text-muted-foreground">Only threads that mention you.</p>
          </TabsContent>
          <TabsContent value="archived">
            <p className="text-sm text-muted-foreground">Nothing archived yet.</p>
          </TabsContent>
          <TabsContent value="spam">
            <p className="text-sm text-muted-foreground">Cleared automatically after 30 days.</p>
          </TabsContent>
        </Tabs>
      </Section>

      <Section title="Disabled tab" className="w-full max-w-sm">
        <Tabs defaultValue="details" className="w-full">
          <TabsList variant="segmented">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="billing" disabled>
              Billing
            </TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <p className="text-sm text-muted-foreground">Billing unlocks on a paid plan.</p>
          </TabsContent>
        </Tabs>
      </Section>
    </Showcase>
  ),
};
