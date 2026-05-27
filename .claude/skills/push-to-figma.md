---
name: push-to-figma
description: Push a claude.ai/design handoff zip into a new Figma file using the figma-official MCP. Invoke when the user says "push to Figma", "send to Figma", "handoff to Figma", or shares a .zip path from a claude.ai/design export. Reads JSX source files to extract brand tokens and screen layouts, then builds editable Figma frames via the Plugin API. Never spin up a dev server — use the MCP directly.
---

You are activating the push-to-figma skill. Do not start a dev server or build a React app. Use `handoff-to-figma` MCP tools + `figma-official` MCP only.

## Step 1 — Find the handoff

If `$ARGUMENTS` is a file path, use it directly.

Otherwise call `list_handoffs` (no args) to find the most recent handoff zip in `~/Downloads`. Show the user the top result and confirm before proceeding.

## Step 2 — Parse the handoff

Call `parse_handoff` with the zip path (or extracted directory path).

This returns:
- `projectName` — used as the Figma file name
- `brand` — color token map, e.g. `{ clay: '#9f5031', beige: '#e8cfc4', ... }`
- `fonts` — font families detected, e.g. `['Antonio', 'Inter']`
- `pages` — array of pages, each with `name` and `screens[]` (component name + file + content)
- `assets` — absolute paths to logo/image files in `brand-assets/`
- `extractedPath` — path to the extracted `project/` directory

For any screen whose `content` is empty or too short (< 200 chars), call `read_screen_content` with its `file` and `name` to get the full component body before building.

## Step 3 — Authenticate + get plan key

Call `mcp__figma-official__whoami`. Extract `plans[0].key`.

If `whoami` returns no plans or an auth error, call `mcp__figma-official__authenticate` first, open the OAuth URL, then retry `whoami`.

## Step 4 — Create the Figma file

Call `mcp__figma-official__create_new_file`:
- `fileName`: `projectName` from parse result + " — Design"
- `planKey`: from whoami
- `editorType`: "design"

Save the returned `file_key` and `file_url`.

## Step 5 — Build each page in Figma

For each page returned by `parse_handoff`, call `mcp__figma-official__use_figma` once with Plugin API JavaScript.

### Font loading (always first — before any text node)

```javascript
await figma.loadFontAsync({ family: 'Antonio', style: 'Bold' });
await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
await figma.loadFontAsync({ family: 'Inter', style: 'Semi Bold' }); // NOTE: space required
await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });
// Load any additional families found in the brand tokens
```

### Clear the page before building

```javascript
for (const n of [...figma.currentPage.children]) n.remove();
```

### Shared helpers (include in every use_figma call)

```javascript
const solid = (hex, a = 1) => {
  const n = parseInt(hex.replace('#',''), 16);
  return { type: 'SOLID', color: { r: ((n>>16)&255)/255, g: ((n>>8)&255)/255, b: (n&255)/255 }, opacity: a };
};
const mkFrame = (w, h, opts = {}) => {
  const f = figma.createFrame();
  f.resize(w, h);
  if (opts.fill) f.fills = [solid(opts.fill)];
  if (opts.corner) f.cornerRadius = opts.corner;
  if (opts.name) f.name = opts.name;
  return f;
};
const mkRect = (w, h, fill, corner = 0) => {
  const r = figma.createRectangle();
  r.resize(w, h);
  r.fills = [solid(fill)];
  if (corner) r.cornerRadius = corner;
  return r;
};
const mkText = (chars, family, style, size, hex, opts = {}) => {
  const t = figma.createText();
  t.fontName = { family, style };
  t.characters = String(chars);
  t.fontSize = size;
  if (hex) t.fills = [solid(hex)];
  if (opts.align) t.textAlignHorizontal = opts.align;
  if (opts.width) t.resize(opts.width, t.height);
  if (opts.lineHeight) t.lineHeight = { value: opts.lineHeight, unit: 'PIXELS' };
  if (opts.opacity !== undefined) t.opacity = opts.opacity;
  return t;
};
const place = (node, x, y) => { node.x = x; node.y = y; return node; };
```

### Screen dimensions by page type

| Page | Frame width × height |
|---|---|
| Mobile | 390 × 844 |
| Web | 1440 × 900 |
| Guidelines | 1440 × auto (use tall frame, ~3000px) |
| Merch | 1440 × 900 per product spread |

### Layout

Place frames left-to-right with 60px gap between each. Set x positions as: `frame.x = frameIndex * (width + 60)`.

### Zoom at end of each call

```javascript
figma.viewport.scrollAndZoomIntoView([...figma.currentPage.children]);
```

### Multi-page strategy

Each page in the parse result maps to one `use_figma` call. Use `figma.currentPage.name = 'Mobile'` (or Web/Guidelines/Merch) to rename the page before building. For pages beyond the first, use:

```javascript
const newPage = figma.createPage();
newPage.name = 'Web'; // or Guidelines / Merch
figma.currentPage = newPage;
```

## Step 6 — Report

Reply with:
- Figma file URL (`file_url` from create_new_file)
- Pages created and frame count per page
- Any screens that were approximated (SVG-heavy or content missing)

## Key Reminders

- Load ALL fonts before creating any text node — missing font = silent failure or throw
- Inter "Semi Bold" requires a space — "SemiBold" will throw a font-not-found error
- Translate brand hex values from `parse_handoff` result — never hardcode Padel-specific colors
- One `use_figma` call per Figma page — don't try to build all pages in one call
- If a screen component body has complex SVG (merch products), describe the shape with rectangles and text labels rather than reproducing the SVG exactly
- `parse_handoff` content field may be truncated for large components — call `read_screen_content` to get full body when needed
