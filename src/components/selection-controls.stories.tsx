import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Checkbox } from "./checkbox";
import { Label } from "./label";
import { List, ListItem } from "./list";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Switch } from "./switch";
import { Section, Showcase } from "../../.storybook/showcase";

/**
 * Checkbox, radio and switch share a story so their states can be compared
 * directly — they are easy to confuse and each answers a different question.
 */
const meta = {
  title: "Forms/Selection controls",
  component: Checkbox,
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: function Render() {
    const [plan, setPlan] = React.useState("standard");
    return (
      <Showcase>
        <Section
          title="Checkbox"
          description="Several independent choices. Changes usually need saving."
          className="flex flex-col gap-3"
        >
          <div className="flex items-center gap-2.5">
            <Checkbox id="cb-unchecked" />
            <Label htmlFor="cb-unchecked">Unchecked</Label>
          </div>
          <div className="flex items-center gap-2.5">
            <Checkbox id="cb-checked" defaultChecked />
            <Label htmlFor="cb-checked">Checked</Label>
          </div>
          <div className="flex items-center gap-2.5">
            <Checkbox id="cb-indeterminate" checked="indeterminate" />
            <Label htmlFor="cb-indeterminate">Indeterminate (some children selected)</Label>
          </div>
          <div className="flex items-center gap-2.5">
            <Checkbox id="cb-disabled" disabled />
            <Label htmlFor="cb-disabled">Disabled</Label>
          </div>
          <div className="flex items-center gap-2.5">
            <Checkbox id="cb-disabled-checked" disabled defaultChecked />
            <Label htmlFor="cb-disabled-checked">Disabled and checked</Label>
          </div>
        </Section>

        <Section
          title="Radio group"
          description="One choice from a small, visible set."
          className="flex flex-col gap-3"
        >
          <RadioGroup value={plan} onValueChange={setPlan}>
            {[
              { value: "free", label: "Free", hint: "1 project" },
              { value: "standard", label: "Standard", hint: "10 projects" },
              { value: "team", label: "Team", hint: "Unlimited projects" },
            ].map((option) => (
              <div key={option.value} className="flex items-start gap-2.5">
                <RadioGroupItem value={option.value} id={`plan-${option.value}`} />
                <div className="flex flex-col gap-0.5">
                  <Label htmlFor={`plan-${option.value}`}>{option.label}</Label>
                  <span className="text-sm text-muted-foreground">{option.hint}</span>
                </div>
              </div>
            ))}
          </RadioGroup>
        </Section>

        <Section
          title="Switch"
          description="Takes effect immediately. Never pair with a Save button."
          className="flex flex-col gap-3"
        >
          <div className="flex items-center gap-3">
            <Switch id="sw-off" />
            <Label htmlFor="sw-off">Off</Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch id="sw-on" defaultChecked />
            <Label htmlFor="sw-on">On</Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch id="sw-disabled" disabled />
            <Label htmlFor="sw-disabled">Disabled</Label>
          </div>
        </Section>

        <Section title="In a settings list" className="w-full max-w-sm">
          <List inset>
            <ListItem title="Push notifications" trailing={<Switch defaultChecked />} />
            <ListItem title="Email digest" description="Weekly" trailing={<Switch />} />
            <ListItem title="Sounds" trailing={<Switch defaultChecked />} />
          </List>
        </Section>
      </Showcase>
    );
  },
};
