import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  InfoIcon,
  XCircleIcon,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "./alert";
import { Section, Showcase } from "../../.storybook/showcase";

const meta = {
  title: "Feedback/Alert",
  component: Alert,
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <Showcase>
      <Section
        title="Variants"
        description="Status is never colour alone — every variant pairs its tint with an icon and a written label."
        className="flex flex-col gap-3"
      >
        <Alert variant="neutral" icon={<InfoIcon />}>
          <AlertTitle>Scheduled maintenance</AlertTitle>
          <AlertDescription>
            The service will be read-only on Sunday between 02:00 and 04:00 UTC.
          </AlertDescription>
        </Alert>

        <Alert variant="info" icon={<InfoIcon />}>
          <AlertTitle>New version available</AlertTitle>
          <AlertDescription>Reload to pick up the latest release.</AlertDescription>
        </Alert>

        <Alert variant="success" icon={<CheckCircle2Icon />}>
          <AlertTitle>Payment received</AlertTitle>
          <AlertDescription>Your receipt has been emailed to you.</AlertDescription>
        </Alert>

        <Alert variant="warning" icon={<AlertTriangleIcon />}>
          <AlertTitle>Card expires soon</AlertTitle>
          <AlertDescription>
            Update your payment method before 30 September to avoid interruption.
          </AlertDescription>
        </Alert>

        <Alert variant="destructive" icon={<XCircleIcon />}>
          <AlertTitle>Upload failed</AlertTitle>
          <AlertDescription>
            The file exceeds the 25 MB limit. Try compressing it first.
          </AlertDescription>
        </Alert>
      </Section>

      <Section title="Title only" className="flex flex-col gap-3">
        <Alert variant="success" icon={<CheckCircle2Icon />}>
          <AlertTitle>Changes saved</AlertTitle>
        </Alert>
      </Section>
    </Showcase>
  ),
};
