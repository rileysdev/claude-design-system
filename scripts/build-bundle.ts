/**
 * Assembles the design bundle uploaded to Claude Design.
 *
 * Preview cards are rendered live from this repo's own Storybook stories rather
 * than hand-written, so what the Design System pane shows is what the component
 * actually renders. Each card ships beside the component's real `.d.ts` and its
 * usage doc — those two are what the design agent codes against, so they are
 * deliverables, not documentation polish.
 *
 * Layout produced (matches what /design-sync expects):
 *   ds-bundle/
 *     styles.css                      root sheet; @imports the component CSS
 *     _ds_bundle.css                  compiled component CSS
 *     _ds_bundle.js                   compiled components
 *     tokens/*.json                   DTCG tokens
 *     guidelines/*.md
 *     components/<group>/<Name>/{index.html,index.d.ts,index.prompt.md}
 *
 * Usage: pnpm bundle   (expects `pnpm build` and `pnpm build-storybook` first)
 */
import {
  copyFileSync,
  createReadStream,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { createServer } from "node:http";
import { extname, join } from "node:path";
import { chromium } from "playwright";

const ROOT = process.cwd();
const STATIC_DIR = join(ROOT, "storybook-static");
const OUT = join(ROOT, "ds-bundle");
const PORT = 6198;

interface CardSpec {
  /** Component name — becomes the directory and the card title. */
  name: string;
  /** Section label in the Design System pane. */
  group: string;
  /** Storybook story id to render the preview from. */
  storyId: string;
  /** Usage doc in docs/, without the extension. */
  doc: string;
  /** Declaration files in dist/types to concatenate, without the extension. */
  types: string[];
  subtitle: string;
  viewport?: { width: number; height?: number };
}

const CARDS: CardSpec[] = [
  // Foundations
  { name: "Colors", group: "Colors", storyId: "foundations-colors--palette", doc: "Foundations", types: [], subtitle: "Ramps, semantic tokens, chart palette" },
  { name: "Typography", group: "Type", storyId: "foundations-typography--scale", doc: "Foundations", types: [], subtitle: "Type scale and weights" },
  { name: "SpacingAndElevation", group: "Spacing", storyId: "foundations-spacing-radius-and-elevation--scales", doc: "Foundations", types: [], subtitle: "Spacing, radius, elevation, motion" },

  // Actions
  { name: "Button", group: "Actions", storyId: "actions-button--variants", doc: "Button", types: ["components/button"], subtitle: "6 variants, 4 sizes, icon support" },

  // Forms
  { name: "Input", group: "Forms", storyId: "forms-input--variants", doc: "Input", types: ["components/input"], subtitle: "3 sizes, invalid and disabled states" },
  { name: "Textarea", group: "Forms", storyId: "forms-textarea--variants", doc: "Textarea", types: ["components/textarea"], subtitle: "Auto-growing, invalid and disabled" },
  { name: "FormField", group: "Forms", storyId: "forms-formfield--variants", doc: "FormField", types: ["components/form-field", "components/label"], subtitle: "Label, hint, error wiring" },
  { name: "SelectionControls", group: "Forms", storyId: "forms-selection-controls--variants", doc: "SelectionControls", types: ["components/checkbox", "components/radio-group", "components/switch"], subtitle: "Checkbox, radio group, switch" },
  { name: "Select", group: "Forms", storyId: "forms-select--variants", doc: "Select", types: ["components/select"], subtitle: "Grouped options, invalid, disabled" },

  // Layout
  { name: "Card", group: "Layout", storyId: "layout-card--variants", doc: "Card", types: ["components/card"], subtitle: "Outlined, elevated, plain" },
  { name: "Stack", group: "Layout", storyId: "layout-stack--variants", doc: "Layout", types: ["components/stack"], subtitle: "Direction, gap scale, alignment" },
  { name: "Separator", group: "Layout", storyId: "layout-separator--variants", doc: "Layout", types: ["components/separator"], subtitle: "Horizontal, vertical, labelled" },

  // Data display
  { name: "List", group: "Data display", storyId: "data-display-list--variants", doc: "List", types: ["components/list"], subtitle: "Settings, conversations, key/value rows" },
  { name: "Badge", group: "Data display", storyId: "data-display-badge--variants", doc: "Badge", types: ["components/badge"], subtitle: "7 variants, dot, 2 sizes" },
  { name: "Avatar", group: "Data display", storyId: "data-display-avatar--variants", doc: "Layout", types: ["components/avatar"], subtitle: "4 sizes, fallback, stacked" },
  { name: "Accordion", group: "Data display", storyId: "data-display-accordion--variants", doc: "Disclosure", types: ["components/accordion"], subtitle: "Single and multiple" },

  // Navigation
  { name: "AppBarAndTabBar", group: "Navigation", storyId: "navigation-app-bar-and-tab-bar--variants", doc: "Navigation", types: ["components/app-bar", "components/tab-bar"], subtitle: "3 app bar variants, tab bar with badges" },
  { name: "Tabs", group: "Navigation", storyId: "navigation-tabs--variants", doc: "Disclosure", types: ["components/tabs"], subtitle: "Segmented and underline" },
  { name: "Pagination", group: "Navigation", storyId: "navigation-pagination--variants", doc: "Layout", types: ["components/pagination"], subtitle: "Numbered and compact" },

  // Overlays
  { name: "Sheet", group: "Overlays", storyId: "overlays-sheet--variants", doc: "Sheet", types: ["components/sheet"], subtitle: "Bottom, top, left, right" },
  { name: "Dialog", group: "Overlays", storyId: "overlays-dialog--variants", doc: "Dialog", types: ["components/dialog"], subtitle: "Modal confirmation" },
  { name: "MenusAndPopovers", group: "Overlays", storyId: "overlays-menus-and-popovers--variants", doc: "Menus", types: ["components/dropdown-menu", "components/popover", "components/tooltip"], subtitle: "Dropdown, popover, tooltip" },

  // Whole-screen compositions. These teach the design agent how the pieces go
  // together, which isolated component cards cannot.
  { name: "TaskList", group: "Screens", storyId: "example-app-tasks--task-list", doc: "Screens", types: [], subtitle: "List screen: app bar, filter tabs, progress, list" },
  { name: "TaskDetail", group: "Screens", storyId: "example-app-tasks--task-detail", doc: "Screens", types: [], subtitle: "Detail screen: back, overflow menu, alert, accordion" },
  { name: "CreateForm", group: "Screens", storyId: "example-app-tasks--new-task", doc: "Screens", types: [], subtitle: "Form in a bottom sheet" },
  { name: "SettingsScreen", group: "Screens", storyId: "example-app-tasks--settings", doc: "Screens", types: [], subtitle: "Grouped settings lists, theme picker" },
  { name: "EmptyAndLoading", group: "Screens", storyId: "example-app-tasks--loading", doc: "Screens", types: [], subtitle: "Skeleton loading state" },

  // Feedback
  { name: "Alert", group: "Feedback", storyId: "feedback-alert--variants", doc: "Feedback", types: ["components/alert"], subtitle: "5 semantic variants" },
  { name: "Toast", group: "Feedback", storyId: "feedback-toast--variants", doc: "Feedback", types: ["components/toast"], subtitle: "Success, warning, error, undo" },
  { name: "EmptyState", group: "Feedback", storyId: "feedback-emptystate--variants", doc: "Feedback", types: ["components/empty-state"], subtitle: "First run, no results, error" },
  { name: "LoadingAndProgress", group: "Feedback", storyId: "feedback-loading-and-progress--variants", doc: "Feedback", types: ["components/skeleton", "components/spinner", "components/progress"], subtitle: "Skeleton, spinner, progress" },
];

if (!existsSync(STATIC_DIR)) throw new Error("Run `pnpm build-storybook` first.");
if (!existsSync(join(ROOT, "dist/styles.css"))) throw new Error("Run `pnpm build` first.");

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

/* ── static assets ────────────────────────────────────────────────────────── */

// The compiled component CSS. Rendered designs receive only styles.css's
// transitive @import closure, so styles.css must pull this in.
copyFileSync(join(ROOT, "dist/styles.css"), join(OUT, "_ds_bundle.css"));
copyFileSync(join(ROOT, "dist/index.js"), join(OUT, "_ds_bundle.js"));
writeFileSync(
  join(OUT, "styles.css"),
  `/* Root stylesheet for the bundle. Everything a rendered design needs must be\n` +
    `   reachable from here. */\n@import "./_ds_bundle.css";\n`,
  "utf8",
);

mkdirSync(join(OUT, "tokens"), { recursive: true });
for (const file of readdirSync(join(ROOT, "tokens"))) {
  copyFileSync(join(ROOT, "tokens", file), join(OUT, "tokens", file));
}

mkdirSync(join(OUT, "guidelines"), { recursive: true });
copyFileSync(join(ROOT, "docs/guidelines.md"), join(OUT, "guidelines/guidelines.md"));

/* ── serve storybook so previews can be rendered ──────────────────────────── */

const MIME: Record<string, string> = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
};

const server = createServer((req, res) => {
  const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);
  let path = join(STATIC_DIR, decodeURIComponent(url.pathname));
  if (url.pathname === "/" || url.pathname.endsWith("/")) path = join(path, "index.html");
  if (!existsSync(path)) {
    res.writeHead(404);
    res.end("not found");
    return;
  }
  res.writeHead(200, { "content-type": MIME[extname(path)] ?? "application/octet-stream" });
  createReadStream(path).pipe(res);
});
await new Promise<void>((resolve) => server.listen(PORT, resolve));

const browser = await chromium.launch();
const written: string[] = [];

for (const card of CARDS) {
  const page = await browser.newPage({
    viewport: { width: card.viewport?.width ?? 900, height: card.viewport?.height ?? 900 },
  });

  const url =
    `http://localhost:${PORT}/iframe.html?id=${encodeURIComponent(card.storyId)}` +
    `&viewMode=story&globals=mode:light`;
  await page.goto(url, { waitUntil: "networkidle", timeout: 30_000 });
  await page.waitForTimeout(450);

  const markup = await page.evaluate(() => {
    const root = document.querySelector("#storybook-root");
    if (!root) return "";
    // Overlays portal to <body>; without them an open sheet or menu would be
    // missing from its own preview.
    const portals = Array.from(
      document.querySelectorAll(
        "body > [data-radix-popper-content-wrapper], body > [role=dialog], body > [data-sonner-toaster]",
      ),
    )
      .map((node) => (node as HTMLElement).outerHTML)
      .join("\n");
    return `${root.innerHTML}\n${portals}`;
  });

  await page.close();

  if (!markup.trim()) {
    throw new Error(`Story "${card.storyId}" rendered nothing — check the id in CARDS.`);
  }

  // Directory names are slugged; the human-readable group label lives in the
  // @dsCard marker. Spaces in paths make the plan's glob patterns fragile.
  const groupDir = card.group.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const dir = join(OUT, "components", groupDir, card.name);
  mkdirSync(dir, { recursive: true });

  const html =
    `<!-- @dsCard group="${card.group}" name="${card.name}" subtitle="${card.subtitle}" -->\n` +
    `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n` +
    `<meta name="viewport" content="width=device-width, initial-scale=1">\n` +
    `<title>${card.name}</title>\n` +
    `<link rel="stylesheet" href="../../../styles.css">\n</head>\n` +
    `<body class="bg-background text-foreground">\n<div class="p-6">\n${markup}\n</div>\n</body>\n</html>\n`;

  writeFileSync(join(dir, "index.html"), html, "utf8");

  const types = card.types
    .map((relative) => {
      const path = join(ROOT, "dist/types", `${relative}.d.ts`);
      return existsSync(path) ? readFileSync(path, "utf8") : "";
    })
    .filter(Boolean)
    .join("\n");
  writeFileSync(
    join(dir, "index.d.ts"),
    types || `// ${card.name} is a token/foundation card and exposes no component API.\n`,
    "utf8",
  );

  copyFileSync(join(ROOT, "docs", `${card.doc}.prompt.md`), join(dir, "index.prompt.md"));
  written.push(`components/${groupDir}/${card.name}`);
}

await browser.close();
server.close();

writeFileSync(
  join(OUT, "_ds_sync.json"),
  `${JSON.stringify({ generatedFrom: "storybook", cards: written.length, paths: written }, null, 2)}\n`,
  "utf8",
);

process.stdout.write(`Bundle written to ds-bundle/ — ${written.length} cards.\n`);
