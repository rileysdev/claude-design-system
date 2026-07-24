import type { Meta, StoryObj } from "@storybook/react-vite";

import { SEMANTIC_TOKENS } from "../theme/semantic";
import { RAMP_STEPS } from "../theme/ramp";
import { Section, Showcase } from "../../.storybook/showcase";

const meta = {
  title: "Foundations/Colors",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const RAMPS = ["primary", "neutral", "destructive", "success", "warning", "info"] as const;

function Ramp({ name }: { name: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium capitalize">{name}</span>
      <div className="flex overflow-hidden rounded-lg border border-border">
        {RAMP_STEPS.map((step) => (
          <div key={step} className="flex-1">
            <div
              className="h-12"
              style={{ backgroundColor: `var(--${name}-${step})` }}
              title={`--${name}-${step}`}
            />
            <div className="bg-card py-1 text-center text-2xs text-muted-foreground">
              {step}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TokenSwatch({ token }: { token: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="size-9 shrink-0 rounded-md border border-border"
        style={{ backgroundColor: `var(--${token})` }}
      />
      <code className="truncate font-mono text-2xs text-muted-foreground">--{token}</code>
    </div>
  );
}

export const Palette: Story = {
  render: () => (
    <Showcase>
      <Section
        title="Ramps"
        description="Every step is generated from a single seed colour per ramp. Greys carry a whisper of the brand hue, which is most of what makes a palette read as one system."
        className="flex w-full flex-col gap-5"
      >
        {RAMPS.map((name) => (
          <Ramp key={name} name={name} />
        ))}
      </Section>

      <Section
        title="Semantic tokens"
        description="What components actually reference. Every text pair is contrast-checked at build time; a theme that fails does not ship."
        className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3"
      >
        {SEMANTIC_TOKENS.filter((token) => !token.startsWith("chart-")).map((token) => (
          <TokenSwatch key={token} token={token} />
        ))}
      </Section>

      <Section
        title="Chart palette"
        description="Categorical colours, assigned in fixed order and never cycled. Adjacent pairs are checked for colour-vision-deficiency separation at build time."
        className="flex w-full flex-col gap-3"
      >
        <div className="flex overflow-hidden rounded-lg border border-border">
          {[1, 2, 3, 4, 5].map((index) => (
            <div key={index} className="flex-1">
              <div className="h-16" style={{ backgroundColor: `var(--chart-${index})` }} />
              <div className="bg-card py-1 text-center text-2xs text-muted-foreground">
                chart-{index}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Surfaces in context"
        description="Background, card and popover are three distinct planes."
        className="flex w-full flex-col gap-3"
      >
        <div className="rounded-xl bg-background p-4">
          <span className="text-xs text-muted-foreground">background</span>
          <div className="mt-2 rounded-lg border border-border bg-card p-4">
            <span className="text-xs text-muted-foreground">card</span>
            <div className="mt-2 rounded-lg border border-border bg-popover p-4 shadow-md">
              <span className="text-xs text-muted-foreground">popover</span>
            </div>
          </div>
        </div>
      </Section>
    </Showcase>
  ),
};
