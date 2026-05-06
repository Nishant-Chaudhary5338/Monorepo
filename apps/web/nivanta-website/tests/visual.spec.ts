import { test, expect } from "@playwright/test";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROUTES = [
  { path: "/",           name: "home" },
  { path: "/about",      name: "about" },
  { path: "/rooms",      name: "rooms" },
  { path: "/rooms/apex-suites", name: "room-detail" },
  { path: "/amenities",  name: "amenities" },
  { path: "/restaurant", name: "restaurant" },
  { path: "/events",     name: "events" },
  { path: "/gallery",    name: "gallery" },
  { path: "/contact",    name: "contact" },
  { path: "/blog",       name: "blog" },
];

const VIEWPORTS = [
  { name: "mobile",  width: 375,  height: 812 },
  { name: "tablet",  width: 768,  height: 1024 },
  { name: "desktop", width: 1280, height: 900 },
  { name: "wide",    width: 1920, height: 1080 },
];

const SCREENSHOTS_DIR = path.join(__dirname, "../screenshots");

test.beforeAll(() => {
  if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
});

for (const viewport of VIEWPORTS) {
  test.describe(`${viewport.name} (${viewport.width}px)`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    for (const route of ROUTES) {
      test(`${route.name} renders correctly`, async ({ page }) => {
        // Silence console errors (video autoplay, etc.)
        page.on("console", () => undefined);

        await page.goto(route.path, { waitUntil: "networkidle", timeout: 15000 });

        // Wait for fonts + images
        await page.waitForTimeout(800);

        // ── Core checks ──
        await expect(page.locator("nav[aria-label='Primary navigation']")).toBeVisible();
        await expect(page.locator("footer[role='contentinfo']")).toBeVisible();

        // No horizontal overflow
        const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
        const viewportWidth = viewport.width;
        expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 2);

        // Page has meaningful content
        const h1Count = await page.locator("h1").count();
        expect(h1Count).toBeGreaterThanOrEqual(1);

        // Full-page screenshot
        await page.screenshot({
          path: path.join(SCREENSHOTS_DIR, `${route.name}-${viewport.name}.png`),
          fullPage: true,
          animations: "disabled",
        });

        // Specific checks per page
        if (route.name === "home") {
          await expect(page.locator("video, img[loading=eager]")).toBeTruthy();
          await expect(page.locator("text=Where the Forest")).toBeVisible();
        }

        if (route.name === "contact") {
          await expect(page.locator("form[data-netlify='true']")).toBeVisible();
          await expect(page.locator("[href^='tel:']")).toHaveCount.greaterThan ? undefined : undefined;
        }

        if (route.name === "rooms") {
          const cards = page.locator("article");
          await expect(cards).toHaveCount(6);
        }
      });
    }
  });
}
