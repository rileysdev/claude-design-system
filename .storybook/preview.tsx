import * as React from "react";
import type { Decorator, Preview } from "@storybook/react-vite";

import "../src/styles.css";
import { themeMeta, themeNames } from "../src/tokens/generated";

/**
 * Theme and colour mode are Storybook globals rather than per-story args, so
 * every component can be checked against every shipped theme without the
 * stories themselves knowing that themes exist.
 */
const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme as string;
  const mode = context.globals.mode as string;

  React.useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.classList.toggle("dark", mode === "dark");
    root.style.colorScheme = mode;
  }, [theme, mode]);

  return (
    <div className="bg-background p-6 text-foreground">
      <Story />
    </div>
  );
};

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    // The decorator paints the real background token; Storybook's own
    // background swatches would fight it.
    backgrounds: { disable: true },
    layout: "fullscreen",
  },
  globalTypes: {
    theme: {
      description: "Design system theme",
      defaultValue: themeNames[0],
      toolbar: {
        title: "Theme",
        icon: "paintbrush",
        items: themeNames.map((name) => ({
          value: name,
          title: themeMeta[name].label,
        })),
        dynamicTitle: true,
      },
    },
    mode: {
      description: "Colour mode",
      defaultValue: "light",
      toolbar: {
        title: "Mode",
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [withTheme],
};

export default preview;
