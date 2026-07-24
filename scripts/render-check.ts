/**
 * Renders every story in headless Chromium and grades it.
 *
 * This mirrors the check `/design-sync` runs before uploading a bundle: a
 * component that renders wrong here renders wrong in every design built with
 * it, so it is worth catching locally rather than discovering in the pane.
 *
 * Grades:
 *   bad   — console error, page error, or nothing rendered
 *   thin  — renders, but too small or too empty to demonstrate the component
 *   ok    — renders with real content in both colour modes
 *
 * Usage: pnpm render-check   (expects `pnpm build-storybook` to have run)
 */
import { createReadStream, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join } from "node:path";
import { chromium } from "playwright";

const ROOT = process.cwd();
const STATIC_DIR = join(ROOT, "storybook-static");
const SHOT_DIR = join(ROOT, ".render-shots");
const PORT = 6199;

const MIN_HEIGHT = 48;
const MIN_TEXT = 12;

if (!existsSync(STATIC_DIR)) {
  throw new Error("storybook-static not found — run `pnpm build-storybook` first.");
}

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

interface StoryEntry {
  id: string;
  title: string;
  name: string;
  type?: string;
}

const index = JSON.parse(readFileSync(join(STATIC_DIR, "index.json"), "utf8")) as {
  entries: Record<string, StoryEntry>;
};

/**
 * Playground stories exist for twiddling controls, not for demonstrating the
 * component, so they are never turned into preview cards and are not graded.
 * Keep this in step with the bundle script.
 */
const stories = Object.values(index.entries).filter(
  (entry) => entry.type !== "docs" && entry.name !== "Playground",
);

mkdirSync(SHOT_DIR, { recursive: true });

const browser = await chromium.launch();
const results: {
  id: string;
  title: string;
  name: string;
  grade: "ok" | "thin" | "bad";
  notes: string[];
}[] = [];

for (const story of stories) {
  const notes: string[] = [];
  let grade: "ok" | "thin" | "bad" = "ok";

  for (const mode of ["light", "dark"] as const) {
    const page = await browser.newPage({ viewport: { width: 900, height: 900 } });
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(String(error)));

    const url =
      `http://localhost:${PORT}/iframe.html?id=${encodeURIComponent(story.id)}` +
      `&viewMode=story&globals=mode:${mode}`;

    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 30_000 });
      // Let entry/exit animations settle before measuring.
      await page.waitForTimeout(450);

      const measured = await page.evaluate(() => {
        const root = document.querySelector("#storybook-root");
        if (!root) return null;
        // Overlays portal outside #storybook-root, so their size AND their text
        // both have to be counted or every open menu grades as thin.
        const portals = Array.from(
          document.querySelectorAll(
            "[data-radix-popper-content-wrapper], [role=dialog], [role=listbox], [data-sonner-toaster]",
          ),
        ) as HTMLElement[];
        const portalHeight = portals.reduce(
          (total, node) => total + node.getBoundingClientRect().height,
          0,
        );
        const portalText = portals.map((node) => node.textContent ?? "").join(" ");
        const text = `${root.textContent ?? ""} ${portalText}`.replace(/\s+/g, " ").trim();

        // Nested interactive elements are invalid HTML and swallow the inner
        // control's clicks. React only warns about this in development, and the
        // static build runs production React — so check the DOM directly rather
        // than relying on a console message that will never appear here.
        const INTERACTIVE = "a[href], button, input, select, textarea, [role=button]";
        const nested = Array.from(document.querySelectorAll(INTERACTIVE))
          .filter((node) => node.parentElement?.closest(INTERACTIVE))
          .map((node) => {
            const outer = node.parentElement?.closest(INTERACTIVE);
            return `<${outer?.tagName.toLowerCase()}> > <${node.tagName.toLowerCase()}>`;
          });

        return {
          height: (root as HTMLElement).getBoundingClientRect().height + portalHeight,
          textLength: text.length,
          nested: Array.from(new Set(nested)),
        };
      });

      await page.screenshot({
        path: join(SHOT_DIR, `${story.id}--${mode}.png`),
        fullPage: true,
      });

      if (errors.length > 0) {
        grade = "bad";
        notes.push(`${mode}: ${errors.length} console error(s) — ${errors[0]!.slice(0, 160)}`);
      } else if (!measured) {
        grade = "bad";
        notes.push(`${mode}: nothing rendered`);
      } else if (measured.nested.length > 0) {
        grade = "bad";
        notes.push(
          `${mode}: nested interactive elements — ${measured.nested.join(", ")}`,
        );
      } else if (measured.height < MIN_HEIGHT || measured.textLength < MIN_TEXT) {
        if (grade !== "bad") grade = "thin";
        notes.push(
          `${mode}: thin — ${Math.round(measured.height)}px tall, ${measured.textLength} chars`,
        );
      }
    } catch (error) {
      grade = "bad";
      notes.push(`${mode}: ${String(error).slice(0, 160)}`);
    } finally {
      await page.close();
    }
  }

  results.push({ id: story.id, title: story.title, name: story.name, grade, notes });
}

await browser.close();
server.close();

const bad = results.filter((r) => r.grade === "bad");
const thin = results.filter((r) => r.grade === "thin");

writeFileSync(
  join(ROOT, ".render-check.json"),
  `${JSON.stringify(
    { total: results.length, bad: bad.length, thin: thin.length, results },
    null,
    2,
  )}\n`,
  "utf8",
);

for (const entry of [...bad, ...thin]) {
  process.stdout.write(`${entry.grade.toUpperCase()} ${entry.title} / ${entry.name}\n`);
  for (const note of entry.notes) process.stdout.write(`    ${note}\n`);
}

process.stdout.write(
  `\n${results.length} stories · ${bad.length} bad · ${thin.length} thin · ` +
    `${results.length - bad.length - thin.length} ok\n` +
    `Screenshots in .render-shots/\n`,
);

if (bad.length > 0) process.exitCode = 1;
