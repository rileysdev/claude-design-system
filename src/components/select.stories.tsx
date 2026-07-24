import type { Meta, StoryObj } from "@storybook/react-vite";

import { Label } from "./label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Section, Showcase, Swatch } from "../../.storybook/showcase";

const meta = {
  title: "Forms/Select",
  component: SelectTrigger,
} satisfies Meta<typeof SelectTrigger>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <Showcase>
      <Section title="States" className="grid max-w-sm gap-3">
        <Swatch label="Placeholder">
          <Select>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Choose a country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gb">United Kingdom</SelectItem>
              <SelectItem value="ie">Ireland</SelectItem>
              <SelectItem value="fr">France</SelectItem>
            </SelectContent>
          </Select>
        </Swatch>

        <Swatch label="Selected">
          <Select defaultValue="gb">
            <SelectTrigger className="w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gb">United Kingdom</SelectItem>
              <SelectItem value="ie">Ireland</SelectItem>
            </SelectContent>
          </Select>
        </Swatch>

        <Swatch label="Invalid">
          <Select>
            <SelectTrigger invalid className="w-56">
              <SelectValue placeholder="Required" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gb">United Kingdom</SelectItem>
            </SelectContent>
          </Select>
        </Swatch>

        <Swatch label="Disabled">
          <Select disabled defaultValue="gb">
            <SelectTrigger className="w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gb">United Kingdom</SelectItem>
            </SelectContent>
          </Select>
        </Swatch>
      </Section>

      <Section title="Grouped options" className="max-w-sm">
        <div className="flex w-full flex-col gap-1.5">
          <Label htmlFor="story-timezone">Time zone</Label>
          <Select defaultValue="london">
            <SelectTrigger id="story-timezone" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Europe</SelectLabel>
                <SelectItem value="london">London</SelectItem>
                <SelectItem value="berlin">Berlin</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Americas</SelectLabel>
                <SelectItem value="new-york">New York</SelectItem>
                <SelectItem value="sao-paulo">São Paulo</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </Section>
    </Showcase>
  ),
};

/** Rendered open so the menu surface, hover and check indicator are all visible. */
export const Open: Story = {
  render: () => (
    <div className="flex h-96 items-start">
      <Select defaultValue="berlin" open>
        <SelectTrigger className="w-56">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Europe</SelectLabel>
            <SelectItem value="london">London</SelectItem>
            <SelectItem value="berlin">Berlin</SelectItem>
            <SelectItem value="madrid">Madrid</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
};
