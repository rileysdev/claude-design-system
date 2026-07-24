import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";

export const Tabs = TabsPrimitive.Root;

const tabsListVariants = cva("inline-flex items-center", {
  variants: {
    variant: {
      /** Pill group on a muted track. Good for 2-4 short labels. */
      segmented: "h-11 w-full gap-1 rounded-lg bg-muted p-1",
      /** Underlined tabs that scroll horizontally when they overflow. */
      underline:
        "h-11 w-full gap-4 overflow-x-auto border-b border-border [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
    },
  },
  defaultVariants: { variant: "segmented" },
});

const TabsVariantContext = React.createContext<"segmented" | "underline">("segmented");

export interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {}

export const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(function TabsList({ className, variant = "segmented", ...props }, ref) {
  return (
    <TabsVariantContext.Provider value={variant ?? "segmented"}>
      <TabsPrimitive.List
        ref={ref}
        className={cn(tabsListVariants({ variant }), className)}
        {...props}
      />
    </TabsVariantContext.Provider>
  );
});

export const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(function TabsTrigger({ className, ...props }, ref) {
  const variant = React.useContext(TabsVariantContext);
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium",
        "transition-colors duration-[var(--duration-fast)] ease-standard",
        "outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-60",
        variant === "segmented"
          ? [
              "flex-1 rounded-md px-3 py-1.5 text-muted-foreground",
              "data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-xs",
            ]
          : [
              "-mb-px shrink-0 border-b-2 border-transparent px-1 pb-2.5 pt-2 text-muted-foreground",
              "data-[state=active]:border-primary data-[state=active]:text-foreground",
            ],
        className,
      )}
      {...props}
    />
  );
});

export const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(function TabsContent({ className, ...props }, ref) {
  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn("mt-4 outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}
      {...props}
    />
  );
});

export { tabsListVariants };
