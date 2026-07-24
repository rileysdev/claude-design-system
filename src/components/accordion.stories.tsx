import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";
import { Section, Showcase } from "../../.storybook/showcase";

const meta = {
  title: "Data display/Accordion",
  component: Accordion,
  args: { type: "single", collapsible: true },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <Showcase>
      <Section
        title="Single"
        description="One panel open at a time. The first is open here so the expanded state is visible."
        className="w-full max-w-md"
      >
        <Accordion type="single" collapsible defaultValue="delivery" className="w-full">
          <AccordionItem value="delivery">
            <AccordionTrigger>When will my order arrive?</AccordionTrigger>
            <AccordionContent>
              Standard delivery takes two to four working days. You will get a
              tracking link as soon as the parcel leaves the warehouse.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="returns">
            <AccordionTrigger>How do returns work?</AccordionTrigger>
            <AccordionContent>
              Send anything back within 30 days for a full refund, in its original
              packaging.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="support">
            <AccordionTrigger>How do I contact support?</AccordionTrigger>
            <AccordionContent>
              Reply to any order email and a person will pick it up within a day.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Section>

      <Section
        title="Multiple"
        description="Any number of panels can be open at once."
        className="w-full max-w-md"
      >
        <Accordion type="multiple" defaultValue={["size", "care"]} className="w-full">
          <AccordionItem value="size">
            <AccordionTrigger>Size guide</AccordionTrigger>
            <AccordionContent>Runs true to size. Between sizes, size down.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="care">
            <AccordionTrigger>Care</AccordionTrigger>
            <AccordionContent>Machine wash cold. Do not tumble dry.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="materials">
            <AccordionTrigger>Materials</AccordionTrigger>
            <AccordionContent>80% merino wool, 20% recycled polyamide.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </Section>
    </Showcase>
  ),
};
