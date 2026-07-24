import type { Meta, StoryObj } from "@storybook/react-vite";
import { MoreVerticalIcon, PencilIcon, ShareIcon, Trash2Icon } from "lucide-react";

import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";
import { Section, Showcase } from "../../.storybook/showcase";

const meta = {
  title: "Overlays/Menus and popovers",
  component: DropdownMenu,
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <div className="min-h-[420px]">
      <Showcase>
        <Section
          title="Dropdown menu"
          description="A list of actions. Destructive items are tinted and sit last."
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label="More actions">
                <MoreVerticalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Document</DropdownMenuLabel>
              <DropdownMenuItem>
                <PencilIcon />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ShareIcon />
                Share
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>Show comments</DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem destructive>
                <Trash2Icon />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Open popover</Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium">Keyboard shortcuts</p>
                <p className="text-sm text-muted-foreground">
                  Press <kbd className="rounded bg-muted px-1 font-mono text-xs">?</kbd> anywhere
                  to see the full list.
                </p>
              </div>
            </PopoverContent>
          </Popover>

          <TooltipProvider>
            <Tooltip open>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Share">
                  <ShareIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Share this document</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Section>

        <Section
          title="Tooltips are pointer-only"
          description="They never open on touch. Anything a touch user needs belongs in the label or a popover."
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Hover me</Button>
              </TooltipTrigger>
              <TooltipContent>Appears on hover and keyboard focus</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Section>
      </Showcase>

      {/* Held open so the menu surface itself appears in the preview. */}
      <div className="mt-6">
        <DropdownMenu open modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Actions</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            onInteractOutside={(event) => event.preventDefault()}
            onEscapeKeyDown={(event) => event.preventDefault()}
          >
            <DropdownMenuLabel>Document</DropdownMenuLabel>
            <DropdownMenuItem>
              <PencilIcon />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ShareIcon />
              Share
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive>
              <Trash2Icon />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  ),
};
