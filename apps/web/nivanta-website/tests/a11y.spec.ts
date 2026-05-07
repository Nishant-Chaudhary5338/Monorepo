import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PAGES_TO_AUDIT = [
  { path: "/",        name: "Home" },
  { path: "/rooms",   name: "Rooms" },
  { path: "/contact", name: "Contact" },
  { path: "/about",   name: "About" },
  { path: "/blog",    name: "Blog" },
];

test.describe("Accessibility — axe-core critical violations", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  for (const { path, name } of PAGES_TO_AUDIT) {
    test(`${name} page has no critical axe violations`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa"])
        .analyze();

      const critical = results.violations.filter((v) => v.impact === "critical");

      if (critical.length > 0) {
        const summary = critical
          .map((v) => `[${v.id}] ${v.description} — ${v.nodes.length} node(s)`)
          .join("\n");
        throw new Error(`Critical a11y violations on ${name}:\n${summary}`);
      }

      expect(critical).toHaveLength(0);
    });
  }
});

test.describe("Accessibility — image alt text", () => {
  const ROUTES_TO_CHECK = ["/", "/rooms", "/about", "/gallery", "/blog"];

  for (const path of ROUTES_TO_CHECK) {
    test(`all <img> tags on ${path} have non-empty alt attributes`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");

      // Collect images missing alt or with empty alt that aren't decorative (no role=presentation or aria-hidden)
      const violations = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll("img"));
        return imgs
          .filter((img) => {
            const isDecorative =
              img.getAttribute("role") === "presentation" ||
              img.getAttribute("aria-hidden") === "true";
            const alt = img.getAttribute("alt");
            return !isDecorative && (alt === null || alt.trim() === "");
          })
          .map((img) => img.outerHTML.slice(0, 120));
      });

      if (violations.length > 0) {
        throw new Error(
          `Images missing meaningful alt text on ${path}:\n${violations.join("\n")}`
        );
      }
      expect(violations).toHaveLength(0);
    });
  }
});

test.describe("Accessibility — contact form labels", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("contact page form fields have visible label text nearby", async ({ page }) => {
    await page.goto("/contact");
    await page.waitForLoadState("networkidle");

    const form = page.locator("form[data-netlify='true']");
    await expect(form).toBeVisible();

    // Each required field has a label element visible in the form area
    const labels = form.locator("label");
    const labelCount = await labels.count();
    expect(labelCount).toBeGreaterThanOrEqual(4); // name, email, enquiryType, message
  });

  test("contact page has tel: links accessible", async ({ page }) => {
    await page.goto("/contact");
    await page.waitForLoadState("networkidle");

    const telLinks = page.locator("[href^='tel:']");
    const count = await telLinks.count();
    expect(count).toBeGreaterThanOrEqual(1);

    // All tel links must have non-empty visible text
    for (let i = 0; i < count; i++) {
      const text = await telLinks.nth(i).textContent();
      expect(text?.trim().length).toBeGreaterThan(0);
    }
  });
});

test.describe("Accessibility — skip link", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("skip-to-content link exists and targets #main-content", async ({ page }) => {
    await page.goto("/");

    const skipLink = page.locator("a.skip-link");
    await expect(skipLink).toHaveAttribute("href", "#main-content");

    const mainContent = page.locator("#main-content");
    await expect(mainContent).toBeAttached();
  });
});

test.describe("Accessibility — keyboard navigation", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("Tab key cycles through focusable nav elements", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await page.keyboard.press("Tab");
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    // First tab should land on skip link or first nav element
    expect(["A", "BUTTON"]).toContain(focused);
  });
});
