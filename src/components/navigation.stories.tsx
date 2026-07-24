import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ArrowLeftIcon,
  CompassIcon,
  HeartIcon,
  HomeIcon,
  SearchIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";

import { AppBar } from "./app-bar";
import { Button } from "./button";
import { List, ListItem } from "./list";
import { TabBar, TabBarItem } from "./tab-bar";
import { PhoneFrame, Section, Showcase } from "../../.storybook/showcase";

const meta = {
  title: "Navigation/App bar and tab bar",
  component: AppBar,
} satisfies Meta<typeof AppBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: function Render() {
    const [tab, setTab] = React.useState("home");

    return (
      <Showcase>
        <Section
          title="App bar variants"
          description="Handles the notch itself, so screens never restate safe-area padding."
          className="flex w-full flex-col gap-4"
        >
          <PhoneFrame>
            <AppBar
              variant="solid"
              title="Inbox"
              trailing={
                <Button variant="ghost" size="icon" aria-label="Search">
                  <SearchIcon />
                </Button>
              }
            />
            <div className="p-4 text-sm text-muted-foreground">Solid — the default.</div>
          </PhoneFrame>

          <PhoneFrame>
            <AppBar
              variant="solid"
              centerTitle
              title="Settings"
              leading={
                <Button variant="ghost" size="icon" aria-label="Back">
                  <ArrowLeftIcon />
                </Button>
              }
              trailing={
                <Button variant="ghost" size="sm">
                  Done
                </Button>
              }
            />
            <div className="p-4 text-sm text-muted-foreground">
              Centred title, iOS-style, with equal space reserved on both sides.
            </div>
          </PhoneFrame>

          <PhoneFrame>
            <AppBar variant="blurred" title="Discover" />
            <div className="p-4 text-sm text-muted-foreground">
              Blurred — for content that scrolls underneath.
            </div>
          </PhoneFrame>
        </Section>

        <Section
          title="Tab bar"
          description="Equal-width destinations, at least 44px tall including the home-indicator inset."
          className="w-full"
        >
          <PhoneFrame>
            <AppBar title="Home" />
            <div className="min-h-48">
              <List>
                <ListItem title="Recent" description="Updated 2 minutes ago" navigable />
                <ListItem title="Shared with me" description="4 new" navigable />
                <ListItem title="Favourites" navigable />
              </List>
            </div>
            <TabBar>
              <TabBarItem
                icon={<HomeIcon />}
                label="Home"
                active={tab === "home"}
                onClick={() => setTab("home")}
              />
              <TabBarItem
                icon={<CompassIcon />}
                label="Explore"
                active={tab === "explore"}
                onClick={() => setTab("explore")}
              />
              <TabBarItem
                icon={<HeartIcon />}
                label="Saved"
                badge={3}
                active={tab === "saved"}
                onClick={() => setTab("saved")}
              />
              <TabBarItem
                icon={<UserIcon />}
                label="Profile"
                active={tab === "profile"}
                onClick={() => setTab("profile")}
              />
            </TabBar>
          </PhoneFrame>
        </Section>

        <Section title="Tab bar with a badge overflow" className="w-full">
          <PhoneFrame>
            <TabBar blurred>
              <TabBarItem icon={<HomeIcon />} label="Home" active />
              <TabBarItem icon={<SearchIcon />} label="Search" />
              <TabBarItem icon={<HeartIcon />} label="Saved" badge={128} />
              <TabBarItem icon={<SettingsIcon />} label="Settings" />
            </TabBar>
          </PhoneFrame>
        </Section>
      </Showcase>
    );
  },
};
