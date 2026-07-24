import type { Meta, StoryObj } from "@storybook/react-vite";
import { BellIcon, CreditCardIcon, LockIcon, UserIcon } from "lucide-react";

import { Avatar, AvatarFallback } from "./avatar";
import { Badge } from "./badge";
import { List, ListItem } from "./list";
import { Switch } from "./switch";
import { Section, Showcase } from "../../.storybook/showcase";

const meta = {
  title: "Data display/List",
  component: List,
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <Showcase>
      <Section
        title="Settings list"
        description="Inset rows in a card. The mobile equivalent of a table."
        className="w-full max-w-sm"
      >
        <List inset>
          <ListItem leading={<UserIcon />} title="Account" description="Ada Lovelace" navigable />
          <ListItem leading={<LockIcon />} title="Privacy and security" navigable />
          <ListItem
            leading={<BellIcon />}
            title="Notifications"
            trailing={<Switch defaultChecked />}
          />
          <ListItem
            leading={<CreditCardIcon />}
            title="Payment methods"
            description="Visa ending 4242"
            navigable
          />
        </List>
      </Section>

      <Section
        title="Full-bleed list"
        description="No outer border — for lists that fill the screen."
        className="w-full max-w-sm"
      >
        <List>
          <ListItem
            leading={
              <Avatar size="sm">
                <AvatarFallback>RS</AvatarFallback>
              </Avatar>
            }
            title="Riley Scheid"
            description="Sounds good — shipping it today"
            trailing={<span className="text-2xs">2m</span>}
            navigable
          />
          <ListItem
            leading={
              <Avatar size="sm">
                <AvatarFallback>MK</AvatarFallback>
              </Avatar>
            }
            title="Mika Kovač"
            description="Can you take a look at the migration?"
            trailing={<Badge variant="primary" size="sm">3</Badge>}
            navigable
          />
          <ListItem
            leading={
              <Avatar size="sm">
                <AvatarFallback>JP</AvatarFallback>
              </Avatar>
            }
            title="Jordan Park"
            description="Thanks!"
            trailing={<span className="text-2xs">1h</span>}
            navigable
          />
        </List>
      </Section>

      <Section title="Values, not navigation" className="w-full max-w-sm">
        <List inset>
          <ListItem title="Plan" trailing="Standard" />
          <ListItem title="Renews" trailing="14 Aug 2026" />
          <ListItem title="Seats" trailing="4 of 10" />
          <ListItem title="Status" trailing={<Badge variant="success" dot>Active</Badge>} />
        </List>
      </Section>
    </Showcase>
  ),
};
