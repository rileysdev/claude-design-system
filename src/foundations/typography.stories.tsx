import type { Meta, StoryObj } from "@storybook/react-vite";

import { typography } from "../theme/primitives";
import { Section, Showcase } from "../../.storybook/showcase";

const meta = {
  title: "Foundations/Typography",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const SIZES = Object.entries(typography.size) as [string, string][];
const WEIGHTS = Object.entries(typography.weight) as [string, string][];

export const Scale: Story = {
  render: () => (
    <Showcase>
      <Section
        title="Type scale"
        description="Body sits at 1rem so iOS never zooms a focused input. Everything else steps away from it."
        className="flex w-full flex-col gap-4"
      >
        {SIZES.map(([name, value]) => (
          <div key={name} className="flex items-baseline gap-4 border-b border-border pb-3">
            <code className="w-16 shrink-0 font-mono text-2xs text-muted-foreground">
              {name}
            </code>
            <code className="w-20 shrink-0 font-mono text-2xs text-muted-foreground">
              {value}
            </code>
            <span style={{ fontSize: value }} className="truncate">
              The quick brown fox
            </span>
          </div>
        ))}
      </Section>

      <Section title="Weights" className="flex w-full flex-col gap-3">
        {WEIGHTS.map(([name, value]) => (
          <div key={name} className="flex items-baseline gap-4">
            <code className="w-20 shrink-0 font-mono text-2xs text-muted-foreground">
              {name}
            </code>
            <span style={{ fontWeight: Number(value) }} className="text-lg">
              The quick brown fox jumps
            </span>
          </div>
        ))}
      </Section>

      <Section
        title="In use"
        description="Headings tighten their tracking and balance their line breaks; body copy stays at the relaxed measure."
        className="flex w-full max-w-prose flex-col gap-3"
      >
        <h1 className="text-3xl">Designing for the thumb</h1>
        <h2 className="text-xl">Why 44 pixels is not negotiable</h2>
        <p className="text-base text-muted-foreground">
          Every interactive control in this system clears a 44px touch target by
          default. It is the smallest area a thumb can hit reliably while walking,
          one-handed, on a moving train — which is the real environment most of
          these screens live in.
        </p>
        <p className="text-sm text-muted-foreground">
          Secondary copy steps down to 0.875rem, but never below it for anything a
          user has to read.
        </p>
      </Section>
    </Showcase>
  ),
};
