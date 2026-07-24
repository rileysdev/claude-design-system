/**
 * Opens every bundled preview card as a standalone page and grades it the way
 * the Design System pane will see it — no Storybook, just the HTML plus the
 * bundle's own styles.css import closure.
 *
 * This is the check that catches a card whose CSS never made it into the
 * bundle: inside Storybook everything looks fine, and the card renders unstyled.
 */
import { createReadStream, existsSync, readdirSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, relative } from "node:path";
import { chromium } from "playwright";

const ROOT = process.cwd();
const OUT = join(ROOT, "ds-bundle");
const PORT = 6197;

const MIME: Record<string, string> = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
};

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const cards = walk(join(OUT, "components")).filter((path) => path.endsWith("index.html"));

const server = createServer((req, res) => {
  const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);
  const path = join(OUT, decodeURIComponent(url.pathname));
  if (!existsSync(path) || statSync(path).isDirectory()) {
    res.writeHead(404);
    res.end("not found");
    return;
  }
  res.writeHead(200, { "content-type": MIME[extname(path)] ?? "application/octet-stream" });
  createReadStream(path).pipe(res);
});
await new Promise<void>((resolve) => server.listen(PORT, resolve));

const browser = await chromium.launch();
let failures = 0;

for (const card of cards) {
  const rel = relative(OUT, card).split("\\").join("/");
  const page = await browser.newPage({ viewport: { width: 900, height: 900 } });
  const missing: string[] = [];
  page.on("requestfailed", (request) => missing.push(request.url()));
  page.on("response", (response) => {
    if (response.status() >= 400) missing.push(`${response.status()} ${response.url()}`);
  });

  await page.goto(`http://localhost:${PORT}/${rel}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(200);

  const check = await page.evaluate(() => {
    const body = document.body;
    const styles = getComputedStyle(body);
    return {
      // If the stylesheet resolved, the body carries the themed background
      // rather than the browser default.
      background: styles.backgroundColor,
      sheets: document.styleSheets.length,
      height: body.getBoundingClientRect().height,
      text: (body.textContent ?? "").replace(/\s+/g, " ").trim().length,
    };
  });

  await page.close();

  const unstyled =
    check.sheets === 0 ||
    check.background === "rgba(0, 0, 0, 0)" ||
    check.background === "rgb(255, 255, 255)";
  const problems: string[] = [];
  if (missing.length) problems.push(`${missing.length} failed request(s): ${missing[0]}`);
  if (unstyled) problems.push(`unstyled — body background ${check.background}, ${check.sheets} sheet(s)`);
  if (check.height < 80 || check.text < 20) {
    problems.push(`thin — ${Math.round(check.height)}px, ${check.text} chars`);
  }

  if (problems.length) {
    failures += 1;
    process.stdout.write(`FAIL ${rel}\n${problems.map((p) => `    ${p}\n`).join("")}`);
  }
}

await browser.close();
server.close();

process.stdout.write(
  `\n${cards.length} preview cards checked standalone · ${failures} failing\n`,
);
if (failures > 0) process.exitCode = 1;
