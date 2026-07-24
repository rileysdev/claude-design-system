import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./button";
import { List, ListItem } from "./list";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";
import { Section, Showcase } from "../../.storybook/showcase";

const meta = {
  title: "Overlays/Sheet",
  component: Sheet,
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <div className="min-h-[560px]">
      <Showcase>
        <Section
          title="Sides"
          description="Bottom is the mobile default: it is where the thumb already is, and it gets a drag handle and safe-area padding."
        >
          {(["bottom", "top", "left", "right"] as const).map((side) => (
            <Sheet key={side}>
              <SheetTrigger asChild>
                <Button variant="outline">{side}</Button>
              </SheetTrigger>
              <SheetContent side={side}>
                <SheetHeader>
                  <SheetTitle>Filter results</SheetTitle>
                  <SheetDescription>Opened from the {side} edge.</SheetDescription>
                </SheetHeader>
                <List>
                  <ListItem title="Any date" navigable />
                  <ListItem title="Price: low to high" navigable />
                  <ListItem title="Rating: 4+" navigable />
                </List>
                <SheetFooter>
                  <Button fullWidth>Apply filters</Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          ))}
        </Section>
      </Showcase>

      {/* Held open so the preview shows the panel itself, not just its trigger. */}
      <Sheet open modal={false}>
        <SheetContent
          side="bottom"
          showClose={false}
          onInteractOutside={(event) => event.preventDefault()}
          onEscapeKeyDown={(event) => event.preventDefault()}
        >
          <SheetHeader>
            <SheetTitle>Share this file</SheetTitle>
            <SheetDescription>Anyone with the link can view it.</SheetDescription>
          </SheetHeader>
          <List>
            <ListItem title="Copy link" navigable />
            <ListItem title="Send by email" navigable />
            <ListItem title="Add to shared folder" navigable />
          </List>
          <SheetFooter>
            <Button fullWidth variant="outline">
              Cancel
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  ),
};
