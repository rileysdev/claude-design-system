import type { Meta, StoryObj } from "@storybook/react-vite";

import { motion, radius, size, space } from "../theme/primitives";
import { Section, Showcase } from "../../.storybook/showcase";

const meta = {
  title: "Foundations/Spacing, radius and elevation",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const ELEVATIONS = ["xs", "sm", "md", "lg", "xl"] as const;

export const Scales: Story = {
  render: () => (
    <Showcase>
      <Section title="Spacing" className="flex w-full flex-col gap-2">
        {Object.entries(space).map(([name, value]) => (
          <div key={name} className="flex items-center gap-3">
            <code className="w-12 shrink-0 font-mono text-2xs text-muted-foreground">
              {name}
            </code>
            <code className="w-20 shrink-0 font-mono text-2xs text-muted-foreground">
              {value}
            </code>
            <div className="h-3 bg-primary" style={{ width: value }} />
          </div>
        ))}
      </Section>

      <Section title="Radius" className="flex flex-wrap items-end gap-4">
        {Object.entries(radius).map(([name, value]) => (
          <div key={name} className="flex flex-col items-center gap-1.5">
            <div
              className="size-16 border border-border bg-muted"
              style={{ borderRadius: value }}
            />
            <code className="font-mono text-2xs text-muted-foreground">{name}</code>
          </div>
        ))}
      </Section>

      <Section
        title="Elevation"
        description="Dark mode uses a tighter, deeper set — the same blur reads as heavy on a dark background."
        className="flex flex-wrap items-end gap-5"
      >
        {ELEVATIONS.map((name) => (
          <div key={name} className="flex flex-col items-center gap-2">
            <div
              className="size-20 rounded-xl border border-border bg-card"
              style={{ boxShadow: `var(--elevation-${name})` }}
            />
            <code className="font-mono text-2xs text-muted-foreground">{name}</code>
          </div>
        ))}
      </Section>

      <Section title="Key sizes" className="flex w-full flex-col gap-2">
        {Object.entries(size).map(([name, value]) => (
          <div key={name} className="flex items-center gap-3">
            <code className="w-24 shrink-0 font-mono text-2xs text-muted-foreground">
              {name}
            </code>
            <code className="w-20 shrink-0 font-mono text-2xs text-muted-foreground">
              {value}
            </code>
          </div>
        ))}
      </Section>

      <Section
        title="Motion"
        description="Durations and easings are tokens too, so transitions stay consistent across components."
        className="flex w-full flex-col gap-2"
      >
        {Object.entries(motion.duration).map(([name, value]) => (
          <div key={name} className="flex items-center gap-3">
            <code className="w-20 shrink-0 font-mono text-2xs text-muted-foreground">
              {name}
            </code>
            <code className="font-mono text-2xs text-muted-foreground">{value}</code>
          </div>
        ))}
        {Object.entries(motion.easing).map(([name, value]) => (
          <div key={name} className="flex items-center gap-3">
            <code className="w-20 shrink-0 font-mono text-2xs text-muted-foreground">
              {name}
            </code>
            <code className="truncate font-mono text-2xs text-muted-foreground">{value}</code>
          </div>
        ))}
      </Section>
    </Showcase>
  ),
};
