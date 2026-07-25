# design-sync notes — claude-design-system

Durable findings for future syncs. Read this before doing anything.

## Repo setup

- **[GENERAL] pnpm refuses to run any script until esbuild's build scripts are approved.**
  Symptom: `pnpm run build` exits 1 with `[ERR_PNPM_IGNORED_BUILDS] Ignored build
  scripts: @parcel/watcher, esbuild` even though `pnpm-workspace.yaml` already lists
  both under `onlyBuiltDependencies`. Root cause: pnpm 11's `runDepsStatusCheck`
  precheck fires before the script runs; the workspace-file allowlist isn't
  satisfying it here. Fix: the platform binaries (`@esbuild/linux-x64`) are installed
  and esbuild works, so the precheck is the only blocker — run builds with
  `pnpm --config.verify-deps-before-run=false run build`. That is what `cfg.buildCmd`
  is set to. Do NOT run `pnpm approve-builds` (interactive) or edit the repo's pnpm
  config to work around this.

- **[GENERAL] Chromium needs system libraries installed before any render check or
  compare run.** Symptom: `package-validate.mjs` exits 1 with `[RENDER_SKIPPED] …
  browserType.launch: Target page, context or browser has been closed`, and the
  browser binary itself fails with `error while loading shared libraries:
  libatk-1.0.so.0`. The playwright browser download is present and intact — only the
  OS-level deps are missing (`libatk`, `libatk-bridge`, `libXcomposite`, `libXdamage`,
  `libXfixes`, `libXrandr`, `libgbm`, `libxkbcommon`, `libasound`, `libatspi`). Fix:
  `cd .ds-sync && npx playwright install-deps chromium` (needs sudo; this codespace
  has passwordless sudo). `npx playwright install chromium` alone does NOT fix it —
  the binary is already downloaded. Re-run this after any container rebuild.

- **[GENERAL] `--node-modules` must be the REPO ROOT `./node_modules`, never
  `.ds-sync/node_modules`.** The latter holds only the sync tooling's own deps
  (esbuild, playwright, ts-morph) and has no `react` to vendor, so
  `package-build.mjs` / `resync.mjs` die at `vendorReact` with
  `Error: react not found under --node-modules`. Note the asymmetry that makes this
  easy to get wrong: `preview-rebuild.mjs` and `compare.mjs` succeed with EITHER path
  (they don't vendor React), so a targeted loop can pass while the full build fails.
  **A failed build wipes `ds-bundle/` before it fails** — components, `_vendor`,
  `_ds_bundle.js` and `_ds_sync.json` all disappear. Grades in
  `.design-sync/.cache/compare/` are unaffected, so recovery is just a correct rebuild.

- Node 24 / pnpm 11 (via corepack). No `.nvmrc`.

## Converter config decisions

- **Storybook titles are grouped, not per-component**, so 9 titles didn't match an
  export (`[TITLE_UNMAPPED]`). `cfg.titleMap` maps each grouped title to its primary
  export; the story still renders every component in the group, the card is just
  named after the primary one:
  | Storybook title | Mapped export | Also shown in that story |
  |---|---|---|
  | Feedback/Loading and progress | `Spinner` | Skeleton, Progress |
  | Overlays/Menus and popovers | `DropdownMenu` | Popover, Tooltip |
  | Navigation/App bar and tab bar | `AppBar` | TabBar, TabBarItem |
  | Forms/Selection controls | `Checkbox` | RadioGroup, Switch |
  | Feedback/Toast | `Toaster` | the `toast()` function |

  `Toast` maps to `Toaster` because the package exports `Toaster` (the sonner
  mount point) plus a lowercase `toast()` function — there is no `Toast` export.
  Both sides render the full group identically; this is NOT wrong content.

- **`docs/*.prompt.md` needed an explicit `cfg.docsMap`.** Doc discovery slugs the
  basename minus the extension, so `Button.prompt.md` slugs to `buttonprompt` and
  never matches `Button` — 0/18 matched on the first run. Every component is pinned
  explicitly in `cfg.docsMap`. Several docs cover more than one component
  (`Disclosure` → Tabs + Accordion, `Feedback` → Alert/EmptyState/Toaster/Spinner,
  `Layout` → Stack/Separator/Pagination, `Menus` → DropdownMenu), so those files are
  mapped to several components on purpose.
  `[DOCS_UNMAPPED] Avatar` is expected — the repo ships no Avatar doc.

- **`cfg.provider` is set to `ThemeProvider`, and it has to be.** Auto-bundling the
  `.storybook/preview.tsx` decorators fails with
  `! preview decorator bundle failed: Could not resolve "tailwindcss"` — the decorator
  module imports `../src/styles.css`, whose `@import "tailwindcss"` the decorator
  esbuild pass has no loader for. `cfg.provider` skips decorator bundling entirely and
  is also what the README/`.prompt.md` wrap guidance is generated from, so it is the
  right answer rather than a workaround.

- **Theming needs no provider to look right.** `src/styles/tokens.css` puts the default
  theme on `:root` and dark on `.dark`; only the `clay`/`forest` themes are behind
  `[data-theme=…]`. So an unwrapped component still renders in the default light theme.
  `ThemeProvider` is only needed for *switching* theme/mode at runtime.

- **`cfg.overrides.<Name>.cardMode: "single"` is set for Select, DropdownMenu and
  Sheet**, each with `primaryStory: "Variants"`. See the portal section below.

## Capture framing — three non-defects that look like bugs

All three were independently rediscovered by multiple grading batches. **None is a
fidelity delta; none is gradeable.** Do not fork a preview, pad a story, or chase a
CSS/token bug for any of them.

- **[GENERAL] Preview panels are captured at a fixed 900x700 viewport; storybook panels
  are captured full-page or element-sized.** `compare.mjs` shoots module previews with
  `dsPage.screenshot({fullPage:false})` at the capture viewport, while the storybook
  side grows to the story root (EmptyState sb 900x1298, Stack 900x1181, AppBar 900x992,
  Input 900x1026, List 858px tall). Consequence: **any story taller than 700px looks
  truncated in the right-hand panel**, and short ones look bottom-heavy with whitespace.
  Judge only the overlapping band. To verify a tall story's tail before grading it
  `mismatch`, check it out-of-band: serve `ds-bundle/` and screenshot
  `components/<group>/<Name>/<Name>.html?story=<Export>` at a taller viewport. Doing
  exactly that for List confirmed Plan/Renews/Seats/Status + the Active badge were all
  present and pixel-identical.

- **[GENERAL] For tall OVERLAY stories the asymmetry inverts — storybook is the shorter
  one** (Sheet sb 900x612 vs ds 900x690; DropdownMenu sb 900x468 vs ds 900x690), because
  the storybook canvas sizes to the story root. So storybook *crops content the preview
  correctly shows* (Sheet's Cancel footer, DropdownMenu's Delete item). A preview that
  renders MORE than the reference here is not `close` — it is right.

- **[GENERAL] Backdrop colour differs, and NOTES.md was previously wrong about why.**
  The storybook decorator wraps stories in `<div className="bg-background p-6
  text-foreground">` (grey canvas + padding). The generated preview card page emits
  `body{margin:0;padding:24px;background:#fff}` — **hard-coded in the app-contract
  emitter**. The earlier claim that "`body` already paints `var(--background)` from
  `@layer base`" does NOT hold for the generated card pages. Visible effect: Card's
  borderless "Plain" variant reads as a white tile on the storybook canvas and is
  invisible on the preview panel. Framing only; the rubric ignores it.

## Portal overlays and `cardMode`

- **[GENERAL] `.ds-cell{transform:translateZ(0)}` does NOT contain Radix portal content.**
  Radix portals to `document.body`, so the fixed surface is a SIBLING of `.ds-grid` and
  never a descendant of the cell — the transform containing-block trick and the cell's
  `overflow:hidden` both miss it entirely. Portal overlays in grid-mode cards are not
  clipped; they paint OVER the card chrome.
  **This is invisible to the compare images** (grading isolates each story via
  `?story=`), so it can only be caught by rendering the built card html directly.
  Always do that for a new portal component rather than assuming.
- Whether it actually looks wrong depends on the overlay's anchor:
  | Component | Needs `cardMode: "single"` | Why |
  |---|---|---|
  | Sheet | **yes** (applied) | Bottom sheet paints x=0..900 / y=379..700; cell is x=24..876 / y=24..632 — overdraws the border and the 24px body padding |
  | Select | **yes** (applied) | `[GRID_OVERFLOW]` at validate |
  | DropdownMenu | **yes** (applied) | `[GRID_OVERFLOW]` at validate |
  | Dialog | no — verified | Centered content lands x=194..706 / y=262..438, fully inside its cell |
  | Toaster | no — verified | Mounted `<Toaster />` renders zero fixed elements at rest |
  Rule of thumb: centered overlays self-contain in a one-story grid card; only
  viewport-EDGE-anchored ones escape.
- **[GENERAL] Held-open overlay stories reproduce perfectly.** The `open modal={false}`
  + `onInteractOutside`/`onEscapeKeyDown` preventDefault pattern survives intact because
  the whole story module is compiled. No per-component workaround is needed for any
  Radix-portal component in this DS. Never "fix" overlay bleed by neutralizing a story's
  open state in a `.tsx` — that destroys the fidelity being verified.

## Grading outcome (this sync)

- **23/23 components graded `match`. Zero owned previews were authored** — the generated
  `.design-sync/.cache/previews/<Name>.tsx` wrappers already mirror their story sources.
  `.design-sync/previews/` is intentionally EMPTY. Do not add a file there speculatively:
  nothing ever machine-deletes it, so an unnecessary owned preview permanently shadows
  the corrected generated one on every future build.
- No `sb-error`, `unpaired`, `error`, `[RENDER_BLANK]` or `[ASSETS_BLOCKED]` anywhere in
  the roster. No story needed `cfg.overrides.<Name>.skip`.
- **The `[ASSETS_BLOCKED]` canary cleared honestly, not by luck.** Avatar's portrait
  renders on both panels because `src/components/avatar.stories.tsx` builds `PORTRAIT`
  as an inline `data:image/svg+xml;utf8,…` URI at module scope. There is no remote host
  anywhere in the story set, so a network-sandboxed shell cannot silently blank an image
  and produce a matching-fallback false pass.
- Disclosure open states were verified explicitly, not just collapsed rows: Accordion's
  expanded panel bodies + chevron directions, and Tabs' active pill / active underline /
  disabled tab plus each selected panel body.
- Spinner's skeleton shimmer bars differ marginally in brightness between panels — that
  is the animation phase of the motion-stabilized capture, not a mismatch.

## Deliberately not synced

- `Foundations/Colors`, `Foundations/Typography`, `Foundations/Spacing, radius and
  elevation` and `Example app/Tasks` are excluded via `cfg.titleMap: null`. They are
  storybook-only showcases, not package exports, so they cannot become components
  without duplicating the whole library into the bundle from `src/` (a second React
  component identity alongside the `dist/` copy). Their content still reaches the
  design agent: tokens ship under `tokens/`, and `guidelines/Foundations.prompt.md`
  and `guidelines/Screens.prompt.md` ship the written guidance.

## Re-sync risks

What to watch on the next sync. Fixes above record what was done; this records what
could silently go stale or was never verified in the first place.

- **Toaster's toast surfaces are UNVERIFIED.** Every toast in `Variants` is click-driven
  (`onClick={() => toast(...)}`), so neither panel ever paints a toast. The `match` is
  honest but covers only the seven trigger buttons — the toast visuals themselves (kinds,
  description+action, promise states) have never been compared against storybook. A
  regression in toast rendering would pass this sync silently. Closing the gap needs a
  story that renders a toast at mount, i.e. a **story-source change**, which is out of
  scope for a preview fix. Treat any toast styling change in `src/` as unguarded.

- **Every component has exactly one `Variants` story** (a few also have `Playground`;
  Select also has `Open`). Grading breadth is therefore bounded by what those showcase
  stories happen to include. A variant added to the library but not to its `Variants`
  story is invisible to this pipeline — it will never be captured, graded, or shipped as
  a preview.

- **The three `cardMode: "single"` components ship only their `Variants` story on the
  product card.** Select's `Open` story is graded but is not what the card renders. If
  someone later changes which story best represents Select/DropdownMenu/Sheet, the
  `primaryStory` key must move with it.

- **Chromium OS deps are container state, not repo state.** They are not captured by any
  lockfile. A fresh container silently loses them and the next run fails at
  `[RENDER_SKIPPED]` — see the Repo setup bullet for the fix.

- **Grades are anchored in the UPLOADED `_ds_sync.json`, not in git.**
  `.design-sync/.cache/` is gitignored, so a clone with no access to the uploaded project
  re-verifies the whole roster from scratch. That is expected, not a fault.

- **The backdrop hard-coding is upstream, not ours.** `body{background:#fff}` comes from
  the app-contract emitter in `.ds-sync/`, which is staged tooling regenerated per run.
  If a future toolchain version starts honouring `var(--background)`, the Card "Plain"
  observation above becomes stale — recheck rather than trusting this note.
