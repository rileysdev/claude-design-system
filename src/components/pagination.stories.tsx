import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Pagination } from "./pagination";
import { Section, Showcase } from "../../.storybook/showcase";

const meta = {
  title: "Navigation/Pagination",
  component: Pagination,
  args: { page: 1, pageCount: 9, onPageChange: () => {} },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: function Render() {
    const [page, setPage] = React.useState(4);
    return (
      <Showcase>
        <Section
          title="Interactive"
          description="Gaps appear once the page count outgrows the visible buttons."
          className="w-full"
        >
          <Pagination page={page} pageCount={12} onPageChange={setPage} />
        </Section>

        <Section title="First page" className="w-full">
          <Pagination page={1} pageCount={9} onPageChange={() => {}} />
        </Section>

        <Section title="Last page" className="w-full">
          <Pagination page={9} pageCount={9} onPageChange={() => {}} />
        </Section>

        <Section title="Few pages — no gaps" className="w-full">
          <Pagination page={2} pageCount={4} onPageChange={() => {}} />
        </Section>

        <Section
          title="Compact"
          description="Best on narrow screens, where a row of numbered targets does not fit."
          className="w-full"
        >
          <Pagination compact page={3} pageCount={24} onPageChange={() => {}} />
        </Section>
      </Showcase>
    );
  },
};
