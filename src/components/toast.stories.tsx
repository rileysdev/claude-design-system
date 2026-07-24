import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./button";
import { Toaster, toast } from "./toast";
import { Section, Showcase } from "../../.storybook/showcase";

const meta = {
  title: "Feedback/Toast",
  component: Toaster,
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <div className="min-h-[420px]">
      <Showcase>
        <Section
          title="Kinds"
          description="Anchored to the bottom on phones — the top edge belongs to the status and app bars, and is out of thumb reach."
        >
          <Button variant="outline" onClick={() => toast("Draft saved")}>
            Default
          </Button>
          <Button variant="outline" onClick={() => toast.success("Payment received")}>
            Success
          </Button>
          <Button variant="outline" onClick={() => toast.warning("Card expires soon")}>
            Warning
          </Button>
          <Button variant="outline" onClick={() => toast.error("Upload failed")}>
            Error
          </Button>
          <Button variant="outline" onClick={() => toast.info("A new version is available")}>
            Info
          </Button>
        </Section>

        <Section title="With a description and an action">
          <Button
            variant="outline"
            onClick={() =>
              toast("Message archived", {
                description: "It has been moved out of your inbox.",
                action: { label: "Undo", onClick: () => toast("Restored") },
              })
            }
          >
            Show with undo
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast.promise(new Promise((resolve) => setTimeout(resolve, 1600)), {
                loading: "Uploading…",
                success: "Upload complete",
                error: "Upload failed",
              })
            }
          >
            Promise
          </Button>
        </Section>
      </Showcase>

      <Toaster />
    </div>
  ),
};
