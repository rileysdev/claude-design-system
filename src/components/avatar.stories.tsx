import type { Meta, StoryObj } from "@storybook/react-vite";

import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Section, Showcase, Swatch } from "../../.storybook/showcase";

const meta = {
  title: "Data display/Avatar",
  component: Avatar,
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

const PORTRAIT =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
      <rect width="96" height="96" fill="#4377f0"/>
      <circle cx="48" cy="38" r="17" fill="#ffffff" opacity="0.92"/>
      <path d="M16 96c0-17.7 14.3-30 32-30s32 12.3 32 30z" fill="#ffffff" opacity="0.92"/>
    </svg>`,
  );

export const Variants: Story = {
  render: () => (
    <Showcase>
      <Section title="Sizes">
        <Swatch label="sm · 32px">
          <Avatar size="sm">
            <AvatarImage src={PORTRAIT} alt="" />
            <AvatarFallback>AL</AvatarFallback>
          </Avatar>
        </Swatch>
        <Swatch label="md · 40px">
          <Avatar size="md">
            <AvatarImage src={PORTRAIT} alt="" />
            <AvatarFallback>AL</AvatarFallback>
          </Avatar>
        </Swatch>
        <Swatch label="lg · 48px">
          <Avatar size="lg">
            <AvatarImage src={PORTRAIT} alt="" />
            <AvatarFallback>AL</AvatarFallback>
          </Avatar>
        </Swatch>
        <Swatch label="xl · 64px">
          <Avatar size="xl">
            <AvatarImage src={PORTRAIT} alt="" />
            <AvatarFallback>AL</AvatarFallback>
          </Avatar>
        </Swatch>
      </Section>

      <Section
        title="Fallback"
        description="Shown while the image loads and whenever it fails. Always provide one."
      >
        <Avatar size="lg">
          <AvatarFallback>AL</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarFallback>RS</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarFallback>MK</AvatarFallback>
        </Avatar>
      </Section>

      <Section title="Stacked" description="Overlap with a ring so edges stay legible.">
        <div className="flex -space-x-2">
          {["AL", "RS", "MK", "JP"].map((initials) => (
            <Avatar key={initials} size="md" className="ring-2 ring-background">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          ))}
          <Avatar size="md" className="ring-2 ring-background">
            <AvatarFallback className="bg-primary text-primary-foreground">+3</AvatarFallback>
          </Avatar>
        </div>
      </Section>
    </Showcase>
  ),
};
