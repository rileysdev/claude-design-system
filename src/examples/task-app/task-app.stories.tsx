import type { Meta, StoryObj } from "@storybook/react-vite";

import { TaskApp } from "./task-app";
import { PhoneFrame } from "../../../.storybook/showcase";

/**
 * A complete app assembled only from this design system.
 *
 * The component stories prove each piece works in isolation; this proves they
 * work together — with real state, navigation between screens, validation that
 * can fail, and content long enough to wrap.
 */
const meta = {
  title: "Example app/Tasks",
  component: TaskApp,
  parameters: { layout: "fullscreen" },
  render: (args) => (
    <div className="flex justify-center">
      <PhoneFrame>
        <TaskApp {...args} />
      </PhoneFrame>
    </div>
  ),
} satisfies Meta<typeof TaskApp>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Fully interactive. Tick tasks off, open one, add a new one, switch tabs.
 * Use the Theme and Mode toolbar controls to see it re-theme.
 */
export const Interactive: Story = {
  args: {},
};

export const TaskList: Story = {
  name: "Screen · Task list",
  args: { initialTab: "today" },
};

export const TaskDetail: Story = {
  name: "Screen · Task detail",
  args: { initialTaskId: "t1" },
};

export const NewTask: Story = {
  name: "Screen · New task sheet",
  args: { initialSheetOpen: true },
};

export const Search: Story = {
  name: "Screen · Search",
  args: { initialTab: "search" },
};

export const Settings: Story = {
  name: "Screen · Settings",
  args: { initialTab: "settings" },
};

export const Loading: Story = {
  name: "Screen · Loading",
  args: { loading: true },
};
