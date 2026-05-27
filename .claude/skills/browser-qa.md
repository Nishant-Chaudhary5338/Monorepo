---
name: browser-qa
description: Browser QA and automation for the turborepo. Routes tasks to the right browser tool: Playwright MCP for localhost dev, Claude in Chrome for auth'd/preview URLs, Chrome DevTools MCP for performance and network debugging.
---

You are activating the browser-qa skill for Nishant's turborepo.

## Tool Selection

Choose the right tool for the job:

| Situation | Tool to use |
|---|---|
| Testing localhost apps during dev | `playwright` MCP (headed) |
| CI or scripted flows (no display) | `playwright-headless` MCP |
| Netlify/Vercel preview URLs | Claude in Chrome extension (`/chrome`) |
| Anything behind a login (Figma, GitHub, Linear, dashboards) | Claude in Chrome extension |
| Network waterfall, performance trace, Core Web Vitals | `chrome-devtools` MCP — first run `pnpm chrome:debug` |
| Console errors with source-mapped stack traces | `chrome-devtools` MCP |
| Visual regression / screenshot comparison | `playwright` MCP |

## App Port Map

When testing localhost, use these ports directly — no need to ask:

| App | Port |
|---|---|
| web-app-1, web-app-2, web-app-3, nishant-portfolio, award-winning-website, briar-frontend, safex-calendar, safex-lms | 5173 |
| ai-builder | 5174 |
| mcp-demo | 5175 |
| hls-monitor | 5176 |
| nidhi-portfolio | 5180 |
| Storybook (@repo/ui) | 6006 |
| mcp-demo-server | 3001 |

## Workflow Patterns

**Build → test → fix loop:**
1. Start the dev server (`pnpm --filter <app> dev`)
2. Use Playwright MCP to navigate and interact
3. Read console errors and DOM state inline
4. Jump back to the source file and fix — no copy-paste

**Auth'd session testing (Claude in Chrome):**
1. Run `/chrome` to connect the extension
2. Navigate directly — Claude shares your logged-in browser
3. Works on Netlify previews, Figma, GitHub PRs, Linear tickets

**Performance debugging (Chrome DevTools MCP):**
1. `pnpm chrome:debug` — opens Chrome on port 9222 with a clean profile
2. Navigate to the page you want to profile
3. The `chrome-devtools` MCP server connects automatically
4. Ask for network waterfall, console errors, or performance traces

**Saving browser session state (Playwright MCP):**
The `playwright` and `playwright-headless` servers share `.playwright-session.json` — authenticate once in headed mode, reuse in headless.

## Explicit Trigger

Always begin by announcing which tool you're using and why. Example:
"Using Playwright MCP (headed) because this is a localhost:5173 dev build."
"Using Claude in Chrome because the Netlify URL requires your existing login."

## Key Reminders

- Say "use Playwright MCP" explicitly — without it Claude may default to writing a bash Playwright script
- Run `/compact` at 50% context usage — browser sessions fill context fast
- Do not enable Claude in Chrome "by default" for coding-heavy sessions — it adds token overhead
- Pin version `@playwright/mcp@0.0.29` is already set in `.mcp.json` — do not change to `@latest`
